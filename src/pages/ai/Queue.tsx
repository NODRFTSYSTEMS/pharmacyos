import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Robot, Eye, CheckCircle, XCircle, ArrowClockwise,
  FileImage, FilePdf, Warning, MagnifyingGlass, Sparkle, CloudArrowUp,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill as StatusPill, MetricCard } from '../../components/Shell'
import type { ExtractionQueueEntry, ExtractionStatus } from '../../types/database'

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-JM', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function confidenceColor(score: number | null) {
  if (score === null) return 'text-gray-400'
  if (score >= 0.85) return 'text-emerald-600'
  if (score >= 0.70) return 'text-amber-600'
  return 'text-red-500'
}

function ExtractionStatusPill({ status }: { status: ExtractionStatus }) {
  const map: Record<ExtractionStatus, { label: string; variant: 'gray' | 'yellow' | 'blue' | 'green' | 'red' }> = {
    PENDING:         { label: 'Pending',       variant: 'gray' },
    PROCESSING:      { label: 'Processing…',   variant: 'blue' },
    REVIEW_REQUIRED: { label: 'Review Needed', variant: 'yellow' },
    ACCEPTED:        { label: 'Accepted',      variant: 'green' },
    REJECTED:        { label: 'Rejected',      variant: 'red' },
  }
  const s = map[status] ?? { label: status, variant: 'gray' }
  return <StatusPill label={s.label} variant={s.variant} />
}

interface ReviewDrawerProps {
  entry: ExtractionQueueEntry
  onClose: () => void
}

function ReviewDrawer({ entry, onClose }: ReviewDrawerProps) {
  const qc = useQueryClient()
  const [editedFields, setEditedFields] = useState<Partial<ExtractionQueueEntry>>({
    patient_name:   entry.patient_name   ?? '',
    prescriber_name: entry.prescriber_name ?? '',
    prescriber_reg: entry.prescriber_reg ?? '',
    drug_name:      entry.drug_name      ?? '',
    dosage:         entry.dosage         ?? '',
    quantity:       entry.quantity       ?? '',
    issue_date:     entry.issue_date     ?? '',
    supplier_name:  entry.supplier_name  ?? '',
    invoice_number: entry.invoice_number ?? '',
    invoice_date:   entry.invoice_date   ?? '',
  })
  const [reviewNotes, setReviewNotes] = useState(entry.review_notes ?? '')
  // Confidence gate: track whether the pharmacist has manually edited any field.
  // If confidence < 0.85 and no field has been edited, the accept button is blocked.
  const [hasEdited, setHasEdited] = useState(false)

  // Only the string-typed editable fields exposed in the review form
  type EditableStringKey =
    | 'patient_name' | 'prescriber_name' | 'prescriber_reg'
    | 'drug_name' | 'dosage' | 'quantity' | 'issue_date'
    | 'supplier_name' | 'invoice_number' | 'invoice_date'

  function updateField(key: EditableStringKey, value: string) {
    setEditedFields(p => ({ ...p, [key]: value } as Partial<ExtractionQueueEntry>))
    if (!hasEdited) setHasEdited(true)
  }

  const lowConfidence = entry.confidence_score !== null && entry.confidence_score < 0.85
  const requiresFieldReview = lowConfidence && !hasEdited

  const [docUrl, setDocUrl] = useState<string | null>(null)
  const [urlLoading, setUrlLoading] = useState(false)

  async function loadDocUrl() {
    if (docUrl) return
    setUrlLoading(true)
    const { data } = await supabase.storage.from('documents').createSignedUrl(entry.storage_path, 300)
    setDocUrl(data?.signedUrl ?? null)
    setUrlLoading(false)
  }

  const accept = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      let linkedPrescriptionId: string | null = null

      // For prescriptions: create the prescription record first, then link it
      if (isRx) {
        const issueDate = editedFields.issue_date?.trim()
          || new Date().toLocaleDateString('en-CA', { timeZone: 'America/Jamaica' })

        const { data: rx, error: rxErr } = await supabase
          .from('prescriptions')
          .insert({
            patient_name:        editedFields.patient_name?.trim()    || 'Unknown',
            prescriber_name:     editedFields.prescriber_name?.trim() || 'Unknown',
            prescriber_reg:      editedFields.prescriber_reg?.trim()  || null,
            drug_name:           editedFields.drug_name?.trim()       || 'Unknown',
            dosage:              editedFields.dosage?.trim()          || null,
            quantity:            Math.max(1, parseInt(editedFields.quantity ?? '1', 10) || 1),
            issue_date:          issueDate,
            status:              'RECEIVED' as const,
            extraction_queue_id: entry.id,
          })
          .select('id')
          .single()

        if (rxErr) throw rxErr
        linkedPrescriptionId = rx.id
      }

      const { error } = await supabase.from('extraction_queue').update({
        ...editedFields,
        extraction_status: 'ACCEPTED',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
        updated_at: new Date().toISOString(),
        ...(linkedPrescriptionId ? { linked_prescription_id: linkedPrescriptionId } : {}),
      }).eq('id', entry.id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['extraction-queue'] })
      qc.invalidateQueries({ queryKey: ['prescriptions'] })
      onClose()
    },
  })

  const reject = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('extraction_queue').update({
        extraction_status: 'REJECTED',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || 'Rejected by pharmacist',
        updated_at: new Date().toISOString(),
      }).eq('id', entry.id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['extraction-queue'] })
      onClose()
    },
  })

  const isRx = entry.document_type === 'PRESCRIPTION'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-800">{entry.file_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <ExtractionStatusPill status={entry.extraction_status} />
              {entry.confidence_score !== null && (
                <span className={`text-xs font-mono font-medium ${confidenceColor(entry.confidence_score)}`}>
                  {(entry.confidence_score * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost h-8 w-8 p-0">
            <XCircle size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Document preview */}
          <div className="border border-gray-200 rounded bg-gray-50">
            {!docUrl ? (
              <button
                onClick={loadDocUrl}
                disabled={urlLoading}
                className="w-full py-6 flex flex-col items-center gap-2 text-sm text-gray-400 hover:text-gray-600"
              >
                <Eye size={24} />
                {urlLoading ? 'Loading preview…' : 'Click to view document'}
              </button>
            ) : entry.mime_type === 'application/pdf' ? (
              <iframe src={docUrl} className="w-full h-64 rounded" title="Document preview" />
            ) : (
              <img src={docUrl} alt="Document" className="w-full max-h-64 object-contain rounded" />
            )}
          </div>

          {/* Low confidence warning */}
          {entry.confidence_score !== null && entry.confidence_score < 0.7 && (
            <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2.5 flex items-start gap-2 text-sm text-amber-800">
              <Warning size={16} className="shrink-0 mt-0.5" />
              <span>
                AI confidence is low ({(entry.confidence_score * 100).toFixed(0)}%). Verify all fields against the original document before accepting.
              </span>
            </div>
          )}

          {/* Extracted fields — editable */}
          <div>
            <h3 className="section-title mb-3 flex items-center gap-1.5">
              <Sparkle size={13} />
              AI-Extracted Fields — Edit as Needed
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {isRx ? (
                <>
                  <Field label="Patient Name"   value={editedFields.patient_name ?? ''} onChange={v => updateField('patient_name', v)} />
                  <Field label="Drug Name"       value={editedFields.drug_name ?? ''} onChange={v => updateField('drug_name', v)} />
                  <Field label="Prescriber Name" value={editedFields.prescriber_name ?? ''} onChange={v => updateField('prescriber_name', v)} />
                  <Field label="Prescriber Reg." value={editedFields.prescriber_reg ?? ''} onChange={v => updateField('prescriber_reg', v)} />
                  <Field label="Dosage / Instructions" value={editedFields.dosage ?? ''} onChange={v => updateField('dosage', v)} />
                  <Field label="Quantity"        value={editedFields.quantity ?? ''} onChange={v => updateField('quantity', v)} />
                  <Field label="Issue Date"      value={editedFields.issue_date ?? ''} onChange={v => updateField('issue_date', v)} type="date" />
                </>
              ) : (
                <>
                  <Field label="Supplier Name"   value={editedFields.supplier_name ?? ''} onChange={v => updateField('supplier_name', v)} />
                  <Field label="Invoice Number"  value={editedFields.invoice_number ?? ''} onChange={v => updateField('invoice_number', v)} />
                  <Field label="Invoice Date"    value={editedFields.invoice_date ?? ''} onChange={v => updateField('invoice_date', v)} type="date" />
                </>
              )}
            </div>
          </div>

          {/* Review notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Review Notes (optional)
            </label>
            <textarea
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              rows={2}
              className="input h-auto py-2 text-sm"
              placeholder="Any discrepancies, notes for the prescription workflow…"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-200">
          {requiresFieldReview && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3 text-xs text-amber-800">
              <Warning size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                AI confidence is below 85%. Edit at least one field to confirm you have reviewed the extraction before accepting.
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => { if (!requiresFieldReview) accept.mutate() }}
              disabled={accept.isPending || reject.isPending || requiresFieldReview}
              aria-disabled={requiresFieldReview}
              title={requiresFieldReview ? 'Edit at least one field before accepting a low-confidence extraction.' : undefined}
              className={`btn btn-success btn-lg flex-1 gap-2 ${requiresFieldReview ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CheckCircle size={16} />
              {accept.isPending
                ? 'Accepting…'
                : isRx
                  ? 'Accept & Create Prescription Record'
                  : 'Accept & Post to Inventory'}
            </button>
            <button
              onClick={() => reject.mutate()}
              disabled={accept.isPending || reject.isPending}
              className="btn btn-danger btn-lg flex-1 gap-2"
            >
              <XCircle size={16} />
              {reject.isPending ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input text-sm"
      />
    </div>
  )
}

export default function AiQueue() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ExtractionStatus | 'ALL'>('ALL')
  const [reviewing, setReviewing] = useState<ExtractionQueueEntry | null>(null)
  const qc = useQueryClient()

  // ── Upload state ────────────────────────────────────────────────────────────
  const [uploadOpen, setUploadOpen]         = useState(false)
  const [uploadDocType, setUploadDocType]   = useState<'PRESCRIPTION' | 'INVOICE'>('PRESCRIPTION')
  const [uploadFile, setUploadFile]         = useState<File | null>(null)
  const [uploadDragging, setUploadDragging] = useState(false)

  function closeUpload() {
    setUploadOpen(false)
    setUploadFile(null)
    setUploadDragging(false)
  }

  const upload = useMutation({
    mutationFn: async () => {
      if (!uploadFile) throw new Error('No file selected')
      const now      = new Date()
      const y        = now.getFullYear()
      const m        = String(now.getMonth() + 1).padStart(2, '0')
      const safeName = uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `${y}/${m}/${Date.now()}_${safeName}`

      // 1. Upload file to storage
      const { error: storErr } = await supabase.storage
        .from('documents')
        .upload(storagePath, uploadFile, { contentType: uploadFile.type, upsert: false })
      if (storErr) throw new Error(`Upload failed: ${storErr.message}`)

      // 2. Create extraction_queue row — status PENDING, ref_number auto-generated
      const refNum = `${uploadDocType === 'PRESCRIPTION' ? 'RX' : 'INV'}-${Date.now()}`
      const { data: entry, error: insertErr } = await supabase
        .from('extraction_queue')
        .insert({
          ref_number:         refNum,
          document_type:      uploadDocType,
          file_name:          uploadFile.name,
          storage_path:       storagePath,
          mime_type:          uploadFile.type,
          extraction_status:  'PENDING' as const,
          updated_at:         new Date().toISOString(),
        })
        .select('id')
        .single()
      if (insertErr) throw new Error(`Queue insert failed: ${insertErr.message}`)
      return entry.id as string
    },
    onSuccess: (entryId) => {
      qc.invalidateQueries({ queryKey: ['extraction-queue'] })
      closeUpload()
      // Auto-trigger AI extraction immediately after successful upload
      triggerExtraction.mutate(entryId)
    },
  })

  const { data: entries, isLoading, isError, refetch } = useQuery({
    queryKey: ['extraction-queue', statusFilter],
    queryFn: async () => {
      let q = supabase
        .from('extraction_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      if (statusFilter !== 'ALL') q = q.eq('extraction_status', statusFilter)
      const { data, error } = await q
      if (error) throw error
      return (data ?? []) as ExtractionQueueEntry[]
    },
    refetchInterval: 20_000,
  })

  const triggerExtraction = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('extraction_queue').update({
        extraction_status: 'PENDING',
        updated_at: new Date().toISOString(),
      }).eq('id', id)
      const { error } = await supabase.functions.invoke('extract-document', {
        body: { queue_entry_id: id },
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['extraction-queue'] }),
  })

  const filtered = (entries ?? []).filter(e => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      e.ref_number.toLowerCase().includes(q) ||
      (e.patient_name ?? '').toLowerCase().includes(q) ||
      (e.drug_name ?? '').toLowerCase().includes(q) ||
      (e.supplier_name ?? '').toLowerCase().includes(q) ||
      e.file_name.toLowerCase().includes(q)
    )
  })

  const counts = {
    pending:   (entries ?? []).filter(e => e.extraction_status === 'PENDING').length,
    review:    (entries ?? []).filter(e => e.extraction_status === 'REVIEW_REQUIRED').length,
    processing: (entries ?? []).filter(e => e.extraction_status === 'PROCESSING').length,
    accepted:  (entries ?? []).filter(e => e.extraction_status === 'ACCEPTED').length,
  }

  return (
    <div>
      <PageHeader
        title="Document Extraction Queue"
        subtitle="AI-assisted prescription and invoice data extraction — pharmacist review required before use"
        breadcrumb={['AI Queue']}
        cta={
          <div className="flex items-center gap-2">
            <button onClick={() => setUploadOpen(true)} className="btn btn-primary gap-1.5">
              <CloudArrowUp size={14} />
              Upload Document
            </button>
            <button onClick={() => refetch()} className="btn btn-ghost gap-1.5">
              <ArrowClockwise size={14} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        }
      />

      {/* Status metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Pending Extraction" value={String(counts.pending)} icon={Robot} accent="blue" />
        <MetricCard label="Processing"         value={String(counts.processing)} icon={Sparkle} accent="yellow" />
        <MetricCard
          label="Needs Review"
          value={String(counts.review)}
          icon={Warning}
          accent={counts.review > 0 ? 'red' : 'gray' as 'red'}
        />
        <MetricCard label="Accepted Today"     value={String(counts.accepted)} icon={CheckCircle} accent="green" />
      </div>

      {/* Filters */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient, drug, file…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-7 w-56 text-xs"
          />
        </div>
        <div className="flex gap-1">
          {(['ALL', 'PENDING', 'PROCESSING', 'REVIEW_REQUIRED', 'ACCEPTED', 'REJECTED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`btn btn-ghost text-xs h-8 px-2 ${statusFilter === f ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            >
              {f === 'REVIEW_REQUIRED' ? 'REVIEW' : f}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} entries</span>
      </div>

      {/* Table */}
      {isError && (
        <div className="card p-4 text-sm text-red-600 bg-red-50">Failed to load extraction queue.</div>
      )}

      {!isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-compact text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Ref</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">File</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Extracted</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Confidence</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Uploaded</th>
                  <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                      Loading queue…
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                      No documents in queue.
                    </td>
                  </tr>
                )}
                {filtered.map(e => {
                  const isRx = e.document_type === 'PRESCRIPTION'
                  const extractedSummary = isRx
                    ? [e.drug_name, e.patient_name].filter(Boolean).join(' — ')
                    : [e.supplier_name, e.invoice_number].filter(Boolean).join(' #')

                  return (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 font-mono text-xs text-gray-600">{e.ref_number}</td>
                      <td className="px-4">
                        <StatusPill label={isRx ? 'Rx' : 'Invoice'} variant={isRx ? 'purple' : 'blue'} />
                      </td>
                      <td className="px-4 text-xs text-gray-600 max-w-40">
                        <div className="flex items-center gap-1.5">
                          {e.mime_type === 'application/pdf'
                            ? <FilePdf size={13} className="text-red-400 shrink-0" />
                            : <FileImage size={13} className="text-blue-400 shrink-0" />
                          }
                          <span className="truncate">{e.file_name}</span>
                        </div>
                      </td>
                      <td className="px-4 text-xs text-gray-700 max-w-48">
                        {extractedSummary || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4">
                        {e.confidence_score !== null ? (
                          <span className={`font-mono text-xs font-medium ${confidenceColor(e.confidence_score)}`}>
                            {(e.confidence_score * 100).toFixed(0)}%
                          </span>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-4"><ExtractionStatusPill status={e.extraction_status} /></td>
                      <td className="px-4 font-mono text-xs text-gray-400">{fmtDateTime(e.created_at)}</td>
                      <td className="px-4">
                        <div className="flex gap-1">
                          {(e.extraction_status === 'REVIEW_REQUIRED' || e.extraction_status === 'ACCEPTED') && (
                            <button
                              onClick={() => setReviewing(e)}
                              className="btn btn-ghost h-7 px-2 text-xs gap-1"
                            >
                              <Eye size={12} />
                              Review
                            </button>
                          )}
                          {e.extraction_status === 'PENDING' && (
                            <button
                              onClick={() => triggerExtraction.mutate(e.id)}
                              disabled={triggerExtraction.isPending}
                              className="btn btn-primary h-7 px-2 text-xs gap-1"
                            >
                              <Robot size={12} />
                              Extract
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reviewing && (
        <ReviewDrawer entry={reviewing} onClose={() => setReviewing(null)} />
      )}

      {/* ── Upload Document Modal ─────────────────────────────────────────── */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeUpload} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-6 space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">Upload Document</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  AI extracts fields — pharmacist reviews before use
                </p>
              </div>
              <button onClick={closeUpload} className="btn btn-ghost h-8 w-8 p-0">
                <XCircle size={18} />
              </button>
            </div>

            {/* Document type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Document Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['PRESCRIPTION', 'INVOICE'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setUploadDocType(t)}
                    className={`py-2 px-3 rounded border text-sm font-medium transition-colors ${
                      uploadDocType === t
                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t === 'PRESCRIPTION' ? 'Prescription (Rx)' : 'Supplier Invoice'}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div
              role="button"
              aria-label="File drop zone — click or drag to select a document"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('doc-file-input')?.click() }}
              onDragOver={e  => { e.preventDefault(); setUploadDragging(true) }}
              onDragLeave={() => setUploadDragging(false)}
              onDrop={e => {
                e.preventDefault()
                setUploadDragging(false)
                const f = e.dataTransfer.files[0]
                if (f) setUploadFile(f)
              }}
              onClick={() => document.getElementById('doc-file-input')?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer select-none ${
                uploadDragging
                  ? 'border-blue-400 bg-blue-50'
                  : uploadFile
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                id="doc-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setUploadFile(f) }}
              />
              {uploadFile ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                  {uploadFile.type === 'application/pdf'
                    ? <FilePdf  size={20} className="text-red-400 shrink-0" />
                    : <FileImage size={20} className="text-blue-400 shrink-0" />
                  }
                  <span className="font-medium truncate max-w-64">{uploadFile.name}</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <CloudArrowUp size={28} className="text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600 font-medium">Drop file here or click to browse</p>
                  <p className="text-xs text-gray-400">JPEG · PNG · GIF · WebP · PDF &nbsp;·&nbsp; Max 10 MB</p>
                </div>
              )}
            </div>

            {/* Error */}
            {upload.error && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
                {String((upload.error as Error).message)}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={() => upload.mutate()}
              disabled={!uploadFile || upload.isPending}
              className="btn btn-primary btn-lg w-full gap-2"
            >
              <CloudArrowUp size={16} />
              {upload.isPending ? 'Uploading & Starting Extraction…' : 'Upload & Start AI Extraction'}
            </button>

          </div>
        </div>
      )}
    </div>
  )
}
