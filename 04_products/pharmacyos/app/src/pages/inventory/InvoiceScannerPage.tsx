import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { AIReviewPanel } from '@/components/AIReviewPanel'
import { UploadSimple, FileText } from '@phosphor-icons/react'

const DEMO_FIELDS = [
  { label: 'Supplier', value: 'PharmSource Ltd', confidence: 99 },
  { label: 'Invoice #', value: 'INV-2026-0441', confidence: 98, mono: true },
  { label: 'Invoice Date', value: '2026-05-07', confidence: 97 },
  { label: 'Drug', value: 'Amoxicillin 500mg (250ct)', confidence: 94 },
  { label: 'DIN', value: '02177846', confidence: 99, mono: true },
  { label: 'Lot #', value: 'LOT-25-3341', confidence: 96, mono: true },
  { label: 'Quantity', value: '250', confidence: 88, mono: true },
  { label: 'Unit Cost', value: '2100.00', confidence: 72, mono: true },
  { label: 'Expiry', value: '2026-08-31', confidence: 65, mono: true },
]

export function InvoiceScannerPage() {
  const [uploaded, setUploaded] = useState(false)

  if (!uploaded) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <PageHeader title="AI Invoice Scanner" />

        <button
          type="button"
          onClick={() => setUploaded(true)}
          className="w-full h-80 rounded-card border-2 border-dashed border-border bg-bg-surface flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary-50 transition-colors"
        >
          <UploadSimple size={40} className="text-text-disabled" />
          <p className="type-card-title text-text-primary">Drag invoice or click to upload</p>
          <p className="type-body-xs text-text-secondary">PDF, PNG, JPG — max 10MB</p>
        </button>

        <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <FileText size={18} className="text-text-secondary" />
            <h2 className="type-card-title text-text-primary">Recent Scans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">Recent invoice scans</caption>
              <thead>
                <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Job ID</th>
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Invoice</th>
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Status</th>
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Confidence</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-mono-data text-text-secondary">JOB-2026-0019</td>
                  <td className="px-4 py-2 type-body-sm text-text-primary">PharmSource INV-2026-0441</td>
                  <td className="px-4 py-2 type-body-xs text-rx-filled-fg font-medium">Completed</td>
                  <td className="px-4 py-2 type-mono-data text-text-primary">99%</td>
                </tr>
                <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-mono-data text-text-secondary">JOB-2026-0016</td>
                  <td className="px-4 py-2 type-body-sm text-text-primary">Caribbean Drug INV-2026-0318</td>
                  <td className="px-4 py-2 type-body-xs text-tag-schedule-fg font-medium">Failed</td>
                  <td className="px-4 py-2 type-mono-data text-text-secondary">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AIReviewPanel
      title="Invoice — PharmSource Ltd"
      fields={DEMO_FIELDS}
      onConfirm={() => setUploaded(false)}
      onReject={() => setUploaded(false)}
    />
  )
}

export default InvoiceScannerPage
