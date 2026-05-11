// Supabase Edge Function — Document Extraction Agent
// Triggered by: supabase.functions.invoke('extract-document', { body: { queue_entry_id } })
// Uses Claude Haiku for prescription extraction, Sonnet for complex/low-confidence docs
// All output routes to extraction_queue for pharmacist review before use

import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RX_SYSTEM_PROMPT = `You are a pharmacy document extraction agent for Winchester Global Pharmacy, Kingston, Jamaica.
Your task is to extract structured information from prescription images.

Extract EXACTLY what is visible in the image. Do NOT infer or hallucinate missing fields.
For any field that is not clearly legible or not present, return null.

Return a JSON object with these fields:
{
  "patient_name": string | null,
  "patient_dob": string | null,          // YYYY-MM-DD if visible
  "prescriber_name": string | null,
  "prescriber_registration": string | null,
  "prescriber_address": string | null,
  "drug_name": string | null,
  "strength": string | null,             // e.g. "500mg"
  "form": string | null,                 // e.g. "tablets", "capsules", "syrup"
  "quantity": string | null,             // e.g. "30 tablets"
  "dosage_instructions": string | null,  // e.g. "1 tablet twice daily"
  "issue_date": string | null,           // YYYY-MM-DD if visible
  "expiry_date": string | null,          // YYYY-MM-DD if visible
  "refills": string | null,
  "is_schedule_drug": boolean,           // true if controlled substance visible
  "schedule_class": string | null,       // e.g. "II", "III", "IV"
  "nhf_eligible": boolean,              // true if NHF stamp or marking visible
  "notes": string | null,
  "confidence": number,                  // 0.0 to 1.0 — your confidence in the extraction
  "legibility_issues": string[]          // list any fields that were hard to read
}`

const INVOICE_SYSTEM_PROMPT = `You are a pharmacy inventory document extraction agent for Winchester Global Pharmacy, Kingston, Jamaica.
Your task is to extract structured information from supplier invoice images.

Extract EXACTLY what is visible in the image. Do NOT infer or hallucinate missing fields.
For any field not clearly legible, return null.

Return a JSON object with these fields:
{
  "supplier_name": string | null,
  "supplier_address": string | null,
  "invoice_number": string | null,
  "invoice_date": string | null,        // YYYY-MM-DD
  "due_date": string | null,
  "subtotal": number | null,
  "tax": number | null,
  "total": number | null,
  "currency": string | null,           // e.g. "JMD", "USD"
  "line_items": [
    {
      "description": string,
      "quantity": number | null,
      "unit": string | null,
      "unit_price": number | null,
      "line_total": number | null
    }
  ],
  "payment_terms": string | null,
  "notes": string | null,
  "confidence": number,                // 0.0 to 1.0
  "legibility_issues": string[]
}`

interface RequestBody {
  queue_entry_id: string
}

// Deno / Supabase Edge Function runtime
// @ts-ignore — Deno globals in Edge Function context
const supabaseUrl  = Deno.env.get('SUPABASE_URL')!
// @ts-ignore
const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
// @ts-ignore
const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!

async function getSupabaseClient() {
  const { createClient } = await import('npm:@supabase/supabase-js')
  return createClient(supabaseUrl, serviceKey)
}

// @ts-ignore — Deno serve
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { queue_entry_id }: RequestBody = await req.json()
    if (!queue_entry_id) {
      return new Response(JSON.stringify({ error: 'queue_entry_id is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const db = await getSupabaseClient()

    // 1. Fetch the queue entry
    const { data: entry, error: fetchErr } = await db
      .from('extraction_queue')
      .select('*')
      .eq('id', queue_entry_id)
      .single()

    if (fetchErr || !entry) {
      return new Response(JSON.stringify({ error: 'Queue entry not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (entry.extraction_status === 'ACCEPTED' || entry.extraction_status === 'REJECTED') {
      return new Response(JSON.stringify({ error: 'Entry is already finalised' }), {
        status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Mark as PROCESSING
    await db.from('extraction_queue').update({ extraction_status: 'PROCESSING', updated_at: new Date().toISOString() })
      .eq('id', queue_entry_id)

    // 3. Download the file from Supabase Storage
    const { data: fileData, error: downloadErr } = await db.storage
      .from('documents')
      .download(entry.storage_path)

    if (downloadErr || !fileData) {
      await db.from('extraction_queue').update({
        extraction_status: 'REVIEW_REQUIRED',
        review_notes: `Storage download failed: ${downloadErr?.message}`,
        updated_at: new Date().toISOString(),
      }).eq('id', queue_entry_id)
      return new Response(JSON.stringify({ error: 'File download failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Convert to base64 for Claude Vision
    const arrayBuffer = await fileData.arrayBuffer()
    const uint8 = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i])
    const base64 = btoa(binary)

    // Determine media type
    const mimeType = entry.mime_type ?? 'image/jpeg'
    const isValidImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(mimeType)
    const isPdf = mimeType === 'application/pdf'

    if (!isValidImage && !isPdf) {
      await db.from('extraction_queue').update({
        extraction_status: 'REVIEW_REQUIRED',
        review_notes: `Unsupported file type for AI extraction: ${mimeType}`,
        updated_at: new Date().toISOString(),
      }).eq('id', queue_entry_id)
      return new Response(JSON.stringify({ error: 'Unsupported file type' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 5. Call Claude API
    const isRx = entry.document_type === 'PRESCRIPTION'
    const systemPrompt = isRx ? RX_SYSTEM_PROMPT : INVOICE_SYSTEM_PROMPT
    const anthropic = new Anthropic({ apiKey: anthropicKey })

    // Use Haiku first; if confidence < 0.7, escalate to Sonnet
    const runExtraction = async (model: string) => {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: isValidImage ? (mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp') : 'image/jpeg',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Please extract all information from this ${isRx ? 'prescription' : 'invoice'} and return the structured JSON. Be precise and only report what you can clearly see.`,
            },
          ],
        }],
      })
      const content = response.content[0]
      if (content.type !== 'text') throw new Error('Unexpected response type from Claude')
      return content.text
    }

    let rawText: string
    let usedModel = 'claude-haiku-4-5'
    try {
      rawText = await runExtraction('claude-haiku-4-5')
    } catch (e) {
      rawText = await runExtraction('claude-sonnet-4-6')
      usedModel = 'claude-sonnet-4-6'
    }

    // 6. Parse the JSON from Claude response
    let extractedFields: Record<string, unknown>
    let parseErr: string | null = null
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in response')
      extractedFields = JSON.parse(jsonMatch[0]) as Record<string, unknown>
    } catch (e) {
      parseErr = String((e as Error).message)
      extractedFields = { raw_text: rawText, parse_error: parseErr }
    }

    const confidence: number = typeof extractedFields.confidence === 'number' ? extractedFields.confidence : 0.5
    const needsReview = parseErr !== null || confidence < 0.7

    // 7. Build update payload with extracted fields mapped to columns
    type UpdatePayload = {
      extraction_status: 'REVIEW_REQUIRED' | 'ACCEPTED'
      raw_extraction: Record<string, unknown>
      extracted_fields: Record<string, unknown>
      confidence_score: number
      updated_at: string
      patient_name?: string | null
      prescriber_name?: string | null
      prescriber_reg?: string | null
      drug_name?: string | null
      dosage?: string | null
      quantity?: string | null
      issue_date?: string | null
      supplier_name?: string | null
      invoice_number?: string | null
      invoice_date?: string | null
      invoice_total?: number | null
      review_notes?: string
    }

    const update: UpdatePayload = {
      extraction_status: needsReview ? 'REVIEW_REQUIRED' : 'ACCEPTED',
      raw_extraction: { model: usedModel, response: rawText },
      extracted_fields: extractedFields,
      confidence_score: confidence,
      updated_at: new Date().toISOString(),
    }

    if (isRx) {
      update.patient_name   = (extractedFields.patient_name   as string | null) ?? null
      update.prescriber_name = (extractedFields.prescriber_name as string | null) ?? null
      update.prescriber_reg = (extractedFields.prescriber_registration as string | null) ?? null
      update.drug_name      = (extractedFields.drug_name      as string | null) ?? null
      update.dosage         = (extractedFields.dosage_instructions as string | null) ?? null
      update.quantity       = (extractedFields.quantity       as string | null) ?? null
      update.issue_date     = (extractedFields.issue_date     as string | null) ?? null
    } else {
      update.supplier_name  = (extractedFields.supplier_name  as string | null) ?? null
      update.invoice_number = (extractedFields.invoice_number as string | null) ?? null
      update.invoice_date   = (extractedFields.invoice_date   as string | null) ?? null
      update.invoice_total  = typeof extractedFields.total === 'number' ? extractedFields.total : null
    }

    if (needsReview) {
      update.review_notes = parseErr
        ? `JSON parse error — manual review required. Model: ${usedModel}`
        : `Low confidence (${(confidence * 100).toFixed(0)}%) — pharmacist review required. Model: ${usedModel}`
    }

    await db.from('extraction_queue').update(update).eq('id', queue_entry_id)

    return new Response(JSON.stringify({
      success: true,
      queue_entry_id,
      extraction_status: update.extraction_status,
      confidence_score: confidence,
      model_used: usedModel,
      needs_review: needsReview,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('extract-document error:', err)
    return new Response(JSON.stringify({ error: String((err as Error).message) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
