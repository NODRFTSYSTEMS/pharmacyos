import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Package, Warning } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { Placeholder } from '@/components/Placeholder'
import { SAMPLE_STOCK, SAMPLE_PRESCRIPTIONS } from '@/data/sample'

const TODAY = new Date('2026-05-08')
const SOON = new Date('2026-08-07')

export function DrugDetailPage() {
  const { id } = useParams<{ id: string }>()
  // Match by stock id OR DIN — useful from Catalog (DIN-keyed) or Stock (id-keyed) pages.
  const drug = SAMPLE_STOCK.find((s) => s.id === id || s.din === id)
  if (!drug) return <Placeholder title="Drug not found" />

  const expiry = new Date(drug.expiryDate)
  const isExpired = expiry < TODAY
  const isExpiringSoon = !isExpired && expiry < SOON
  const isCritical = drug.qtyOnHand < drug.reorderPoint * 0.5
  const isLow = !isCritical && drug.qtyOnHand <= drug.reorderPoint

  // Find prescriptions referencing this drug name fragment (best-effort match).
  const drugBase = drug.drug.split(' ')[0] ?? ''
  const recentRx = SAMPLE_PRESCRIPTIONS.filter((r) => r.drugs.some((d) => d.includes(drugBase))).slice(0, 5)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={drug.drug}
        subtitle={`DIN ${drug.din} · Lot ${drug.lot}`}
        cta={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md">Adjust Stock</Button>
            <Button variant="primary" size="md">
              <Package size={16} weight="bold" />
              Receive
            </Button>
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        <Link
          to="/inventory"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to inventory
        </Link>

        {/* Tags strip */}
        <div className="flex items-center gap-2 flex-wrap">
          {drug.isSchedule && <StatusPill variant="schedule">SCHEDULED</StatusPill>}
          {isCritical && <StatusPill variant="error">Critical Low</StatusPill>}
          {!isCritical && isLow && <StatusPill variant="warning">Below Reorder</StatusPill>}
          {isExpired && <StatusPill variant="error">Expired</StatusPill>}
          {isExpiringSoon && <StatusPill variant="warning">Expiring Within 90 Days</StatusPill>}
          {!isCritical && !isLow && !isExpired && !isExpiringSoon && <StatusPill variant="success">Stock Healthy</StatusPill>}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Metric label="On Hand" value={drug.qtyOnHand.toString()} />
          <Metric label="Reorder Point" value={drug.reorderPoint.toString()} />
          <Metric label="Unit Cost" value={`JMD ${drug.unitCostJmd.toLocaleString()}`} />
          <Metric label="Expiry" value={drug.expiryDate} flag={isExpired || isExpiringSoon} />
        </div>

        {/* Lot details */}
        <div className="bg-bg-surface rounded-card shadow-card p-6">
          <p className="type-caption text-text-secondary mb-4">Lot Details</p>
          <dl className="grid grid-cols-3 gap-4 text-sm">
            <Detail label="Lot Number" value={drug.lot} mono />
            <Detail label="Supplier" value={drug.supplier} />
            <Detail label="Schedule Drug" value={drug.isSchedule ? 'Yes' : 'No'} />
          </dl>
        </div>

        {/* Recent prescriptions referencing this drug */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="type-caption text-text-secondary">Recent Prescriptions ({recentRx.length})</p>
          </div>
          {recentRx.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-text-secondary">No recent prescriptions reference this drug.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Rx #</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Patient</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Received</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRx.map((rx) => (
                  <tr key={rx.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                    <td className="px-4">
                      <Link to={`/prescriptions/${rx.id}`} className="type-mono-data text-primary hover:text-primary-hover">
                        {rx.rxNumber}
                      </Link>
                    </td>
                    <td className="px-4 text-[13px] text-text-primary">{rx.patient}</td>
                    <td className="px-4 type-mono-data text-text-secondary">{rx.received}</td>
                    <td className="px-4">
                      <StatusPill variant={rx.status.toLowerCase() as 'received' | 'verified' | 'filled' | 'dispensed'}>
                        {rx.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, flag = false }: { label: string; value: string; flag?: boolean }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <div className="flex items-center justify-between">
        <p className="type-caption text-text-secondary">{label}</p>
        {flag && <Warning size={14} className="text-warning" />}
      </div>
      <p className="type-mono-metric text-text-primary mt-2 leading-none">{value}</p>
    </div>
  )
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="type-label text-text-secondary mb-1">{label}</dt>
      <dd className={`${mono ? 'type-mono-data' : 'text-sm'} text-text-primary`}>{value}</dd>
    </div>
  )
}

export default DrugDetailPage
