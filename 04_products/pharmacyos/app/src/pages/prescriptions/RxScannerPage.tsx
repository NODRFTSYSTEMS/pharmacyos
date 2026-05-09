import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { AIReviewPanel } from '@/components/AIReviewPanel'
import { UploadSimple, FileText } from '@phosphor-icons/react'

const DEMO_FIELDS = [
  { label: 'Prescriber', value: 'Dr. K. Patterson', confidence: 96 },
  { label: 'Prescriber Reg #', value: 'JM-MD-44821', confidence: 92, mono: true },
  { label: 'Patient', value: 'Marcus Reid', confidence: 98 },
  { label: 'Drug', value: 'Metformin 500mg', confidence: 89 },
  { label: 'Dosage', value: '1 tablet twice daily', confidence: 71 },
  { label: 'Quantity', value: '60', confidence: 95, mono: true },
  { label: 'Refills', value: '2', confidence: 88, mono: true },
  { label: 'Date Issued', value: '2026-05-07', confidence: 97 },
]

export function RxScannerPage() {
  const [uploaded, setUploaded] = useState(false)

  if (!uploaded) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <PageHeader title="AI Prescription Scanner" />

        <button
          type="button"
          onClick={() => setUploaded(true)}
          className="w-full h-80 rounded-card border-2 border-dashed border-border bg-bg-surface flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary-50 transition-colors"
        >
          <UploadSimple size={40} className="text-text-disabled" />
          <p className="type-card-title text-text-primary">Upload prescription image</p>
          <p className="type-body-xs text-text-secondary">PNG, JPG — max 10MB</p>
        </button>

        <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <FileText size={18} className="text-text-secondary" />
            <h2 className="type-card-title text-text-primary">Recent Scans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">Recent prescription scans</caption>
              <thead>
                <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Job ID</th>
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Rx / Patient</th>
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Status</th>
                  <th className="px-4 py-2 text-left type-caption text-text-secondary">Confidence</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-mono-data text-text-secondary">JOB-2026-0021</td>
                  <td className="px-4 py-2 type-body-sm text-text-primary">RX-2026-0847 · Marcus Reid</td>
                  <td className="px-4 py-2 type-body-xs text-rx-filled-fg font-medium">Completed</td>
                  <td className="px-4 py-2 type-mono-data text-text-primary">98%</td>
                </tr>
                <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-mono-data text-text-secondary">JOB-2026-0020</td>
                  <td className="px-4 py-2 type-body-sm text-text-primary">RX-2026-0843 · Trevor Thompson</td>
                  <td className="px-4 py-2 type-body-xs text-rx-verified-fg font-medium">Review Required</td>
                  <td className="px-4 py-2 type-mono-data text-text-primary">71%</td>
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
      title="Prescription — Marcus Reid"
      fields={DEMO_FIELDS}
      onConfirm={() => setUploaded(false)}
      onReject={() => setUploaded(false)}
    />
  )
}

export default RxScannerPage
