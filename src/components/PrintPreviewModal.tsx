// PrintPreviewModal — confirmation dialog before triggering window.print()
// Prevents accidental large-report prints. Shows what will be printed and
// gives the user a chance to cancel or proceed.
//
// Usage:
//   const [printOpen, setPrintOpen] = useState(false)
//   <button onClick={() => setPrintOpen(true)}>Print</button>
//   <PrintPreviewModal
//     open={printOpen}
//     reportTitle="Revenue Report"
//     description="12 days · 2026-05-06 to 2026-05-17 · 89 transactions"
//     onConfirm={() => { setPrintOpen(false); window.print() }}
//     onCancel={() => setPrintOpen(false)}
//   />

import { Printer, X } from '@phosphor-icons/react'

interface PrintPreviewModalProps {
  open: boolean
  /** Report name shown in the modal header, e.g. "Revenue Report" */
  reportTitle: string
  /** One-line summary of what will be printed, e.g. "47 products · Low Stock filter" */
  description: string
  /** Called when the user clicks Print — caller should close modal then call window.print() */
  onConfirm: () => void
  /** Called when the user cancels */
  onCancel: () => void
}

export function PrintPreviewModal({
  open,
  reportTitle,
  description,
  onConfirm,
  onCancel,
}: PrintPreviewModalProps) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        aria-hidden="true"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-preview-title"
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-0 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Printer size={18} weight="duotone" className="text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="print-preview-title"
                  className="text-sm font-semibold text-gray-900"
                >
                  Print {reportTitle}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <p className="text-xs text-gray-500">
              Your browser print dialog will open. Make sure your printer is connected and the correct paper size is selected.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 px-5 pb-5">
            <button
              onClick={onCancel}
              className="btn btn-ghost text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="btn btn-primary text-sm gap-1.5"
            >
              <Printer size={14} aria-hidden="true" />
              Print
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrintPreviewModal
