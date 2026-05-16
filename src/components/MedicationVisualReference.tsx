import { ImageSquare, Pill as PillIcon, Warning } from '@phosphor-icons/react'
import type { MedicationVisualReference } from '../types/database'

interface MedicationReferenceProps {
  drugName: string
  reference?: MedicationVisualReference
}

interface ProductImageThumbProps {
  productName: string
  imageUrl?: string | null
  imageAlt?: string | null
  fallbackReference?: MedicationVisualReference
}

type VerifiedMedicationVisualReference = MedicationVisualReference & {
  image_url: string
  verification_status: 'VERIFIED'
}

function isVerified(reference?: MedicationVisualReference): reference is VerifiedMedicationVisualReference {
  return !!reference && reference.verification_status === 'VERIFIED' && !!reference.image_url
}

function isDemo(reference?: MedicationVisualReference): reference is MedicationVisualReference {
  return !!reference && reference.verification_status === 'DEMO_ONLY'
}

export function MedicationReferenceThumb({ drugName, reference }: MedicationReferenceProps) {
  if (isVerified(reference)) {
    return (
      <img
        src={reference.image_url}
        alt={reference.image_alt ?? `Verified visual reference for ${drugName}`}
        className="h-9 w-12 rounded border border-gray-200 object-cover bg-white"
        loading="lazy"
      />
    )
  }

  if (isDemo(reference)) {
    return (
      <div
        className="h-9 w-12 rounded border border-blue-200 bg-blue-50 flex items-center justify-center relative overflow-hidden"
        title="Demo visual placeholder - replace before launch"
        aria-label={`Demo visual placeholder for ${drugName}`}
      >
        <DemoMedicationArtwork reference={reference} size="thumb" />
      </div>
    )
  }

  return (
    <div
      className="h-9 w-12 rounded border border-amber-200 bg-amber-50 flex items-center justify-center"
      title="Verified visual reference not on file"
      aria-label={`Verified visual reference not on file for ${drugName}`}
    >
      <PillIcon size={17} weight="duotone" className="text-amber-600" aria-hidden="true" />
    </div>
  )
}

export function ProductImageThumb({
  productName,
  imageUrl,
  imageAlt,
  fallbackReference,
}: ProductImageThumbProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={imageAlt?.trim() || `Product image for ${productName}`}
        className="h-9 w-12 rounded border border-gray-200 object-cover bg-white"
        loading="lazy"
      />
    )
  }

  return (
    <MedicationReferenceThumb
      drugName={productName}
      reference={fallbackReference}
    />
  )
}

export function MedicationReferenceCard({ drugName, reference }: MedicationReferenceProps) {
  const verified = isVerified(reference)
  const demo = isDemo(reference)
  const referenceNote = reference?.verification_notes ?? null

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Medication Visual Reference
          </h2>
          <p className="text-sm font-semibold text-gray-900 mt-1">{reference?.display_name ?? drugName}</p>
        </div>
        <span
          className={`pill ${verified ? 'pill-green' : demo ? 'pill-blue' : 'pill-yellow'} shrink-0`}
        >
          {verified ? 'Verified' : demo ? 'Demo Only' : 'Needs Source'}
        </span>
      </div>

      <div className="p-4">
        {verified ? (
          <div className="grid grid-cols-[96px_1fr] gap-4">
            <img
              src={reference.image_url}
              alt={reference.image_alt ?? `Verified visual reference for ${drugName}`}
              className="h-24 w-24 rounded border border-gray-200 object-cover bg-white"
            />
            <div className="space-y-2 text-xs text-gray-600">
              <ReferenceLine label="Source" value={reference.source_name} />
              <ReferenceLine label="Manufacturer" value={reference.manufacturer} />
              <ReferenceLine label="Imprint" value={reference.imprint} />
              <ReferenceLine label="Color / Shape" value={[reference.color, reference.shape].filter(Boolean).join(' / ') || null} />
              <ReferenceLine label="Verified" value={reference.verified_at ? new Date(reference.verified_at).toLocaleDateString('en-JM') : null} />
            </div>
          </div>
        ) : demo && reference ? (
          <div className="grid grid-cols-[96px_1fr] gap-4">
            <div className="h-24 w-24 rounded border border-blue-200 bg-blue-50 flex items-center justify-center relative overflow-hidden">
              <DemoMedicationArtwork reference={reference} size="card" />
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-blue-900">
                <p className="font-semibold">Demo placeholder</p>
                <p className="mt-1">
                  Replace with verified stock, supplier, or manufacturer imagery before launch.
                </p>
              </div>
              <ReferenceLine label="Form" value={reference.dosage_form} />
              <ReferenceLine label="Demo color / shape" value={[reference.color, reference.shape].filter(Boolean).join(' / ') || null} />
              <ReferenceLine label="Launch requirement" value="Verify source image, imprint, barcode, manufacturer, and batch." />
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded border border-amber-200 bg-amber-50 px-3 py-3">
            <Warning size={18} weight="duotone" className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Verified image not on file</p>
              <p className="text-xs text-amber-800 mt-1">
                Confirm the stocked product by manufacturer, strength, imprint, barcode, and batch before using a visual reference.
              </p>
              {referenceNote && (
                <p className="text-xs text-amber-700 mt-2">{referenceNote}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DemoMedicationArtwork({
  reference,
  size,
}: {
  reference: MedicationVisualReference
  size: 'thumb' | 'card'
}) {
  const color = demoColor(reference.color)
  const form = (reference.dosage_form ?? '').toLowerCase()
  const shape = (reference.shape ?? '').toLowerCase()
  const large = size === 'card'

  if (form.includes('inhaler')) {
    return (
      <div className={large ? 'relative h-16 w-12' : 'relative h-7 w-5'} aria-hidden="true">
        <div className="absolute inset-x-1 top-0 h-3 rounded-sm bg-gray-300" />
        <div className="absolute inset-x-0 top-2 bottom-1 rounded-md" style={{ backgroundColor: color }} />
        <div className="absolute inset-x-1 bottom-0 h-2 rounded-sm bg-gray-700" />
      </div>
    )
  }

  if (form.includes('syrup') || form.includes('lotion') || form.includes('spray') || form.includes('cream')) {
    return (
      <div className={large ? 'relative h-16 w-9' : 'relative h-7 w-4'} aria-hidden="true">
        <div className="absolute inset-x-1 top-0 h-2 rounded-sm bg-gray-300" />
        <div className="absolute inset-x-0 top-2 bottom-0 rounded-sm" style={{ backgroundColor: color }} />
      </div>
    )
  }

  const isCapsule = form.includes('capsule') || form.includes('softgel') || shape.includes('capsule') || shape.includes('oval')
  const pillClass = isCapsule
    ? large ? 'h-8 w-16 rounded-full' : 'h-4 w-8 rounded-full'
    : large ? 'h-12 w-12 rounded-full' : 'h-5 w-5 rounded-full'

  return (
    <div className={`${pillClass} border border-black/10 shadow-sm relative`} style={{ backgroundColor: color }} aria-hidden="true">
      <div className="absolute inset-y-1/2 left-1 right-1 h-px bg-white/50" />
      {large && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-blue-700 uppercase tracking-wide">
          Demo
        </span>
      )}
    </div>
  )
}

function demoColor(color: string | null): string {
  switch ((color ?? '').toLowerCase()) {
    case 'blue': return '#93C5FD'
    case 'green': return '#86EFAC'
    case 'yellow': return '#FDE68A'
    case 'orange': return '#FDBA74'
    case 'pink': return '#F9A8D4'
    case 'red': return '#FCA5A5'
    case 'purple': return '#C4B5FD'
    case 'brown': return '#C4A484'
    case 'clear': return '#DBEAFE'
    default: return '#F9FAFB'
  }
}

function ReferenceLine({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-1.5 last:border-0 last:pb-0">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value || 'Not recorded'}</span>
    </div>
  )
}

export function MedicationReferenceMissingInline({ drugName }: { drugName: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-700">
      <ImageSquare size={13} weight="duotone" aria-hidden="true" />
      <span>Reference needed for {drugName}</span>
    </span>
  )
}
