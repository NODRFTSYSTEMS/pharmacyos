import { DownloadSimple } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_TRANSACTIONS, type PaymentMethod } from '@/data/sample'

const METHOD_VARIANT: Record<PaymentMethod, 'success' | 'info' | 'neutral'> = {
  Cash: 'success',
  Card: 'info',
  Lynk: 'neutral',
}

export function POSReportsPage() {
  const total = SAMPLE_TRANSACTIONS.reduce((s, t) => s + t.totalJmd, 0)
  const itemsSold = SAMPLE_TRANSACTIONS.reduce((s, t) => s + t.items, 0)
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="POS Reports"
        subtitle={`${SAMPLE_TRANSACTIONS.length} transactions · ${itemsSold} items · JMD ${total.toLocaleString()} gross`}
        cta={
          <Button variant="secondary" size="md">
            <DownloadSimple size={16} weight="bold" />
            Export Day
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Transaction #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Time</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Cashier</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Items</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Total (JMD)</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Method</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Patient</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_TRANSACTIONS.map((t) => (
                <tr key={t.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 type-mono-data text-text-primary font-medium">{t.txNumber}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{t.time}</td>
                  <td className="px-4 type-body-sm text-text-primary">{t.cashier}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{t.items}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{t.totalJmd.toLocaleString()}</td>
                  <td className="px-4">
                    <StatusPill variant={METHOD_VARIANT[t.method]}>{t.method}</StatusPill>
                  </td>
                  <td className="px-4 type-body-xs text-text-secondary">{t.patient ?? <span className="text-text-disabled">Walk-in</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default POSReportsPage
