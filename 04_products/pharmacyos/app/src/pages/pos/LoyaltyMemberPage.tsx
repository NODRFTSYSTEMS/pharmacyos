import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { SAMPLE_LOYALTY } from '@/data/sample'
import { Crown, Coin, ShoppingCart } from '@phosphor-icons/react'

export function LoyaltyMemberPage() {
  const { id } = useParams<{ id: string }>()
  const member = SAMPLE_LOYALTY.find((m) => m.id === id)

  if (!member) {
    return (
      <div className="flex-1 p-6">
        <PageHeader title="Member not found" />
        <p className="text-text-secondary mt-4">No loyalty member matches ID {id}.</p>
      </div>
    )
  }

  const tierIcon = member.tier === 'Platinum' ? <Crown size={20} /> : null
  const tierColor =
    member.tier === 'Platinum' ? 'text-warning' :
    member.tier === 'Gold' ? 'text-warning' :
    member.tier === 'Silver' ? 'text-text-secondary' : 'text-text-tertiary'

  return (
    <div className="flex-1 p-6 space-y-6">
      <PageHeader
        title={member.name}
        breadcrumb={[{ label: 'Loyalty', to: '/pos/loyalty' }, { label: member.name }]}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-primary/10 text-primary flex items-center justify-center">
            <Coin size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Points Balance</p>
            <p className="type-mono-metric text-text-primary">{member.points.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-warning/10 text-warning flex items-center justify-center">
            {tierIcon ?? <Crown size={24} />}
          </div>
          <div>
            <p className="type-label text-text-secondary">Tier</p>
            <p className={`type-card-title ${tierColor}`}>{member.tier}</p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-accent/10 text-accent flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Lifetime Spend</p>
            <p className="type-mono-metric text-text-primary">JMD {(member.points * 2.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>

      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="type-card-title text-text-primary">Points History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Points transaction history</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Date</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Type</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Delta</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Balance</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                <td className="px-4 py-2 type-body-xs text-text-secondary">2026-05-06</td>
                <td className="px-4 py-2 type-body-sm text-text-primary">Earn</td>
                <td className="px-4 py-2 type-mono-data text-right text-rx-filled-fg font-medium">+120</td>
                <td className="px-4 py-2 type-mono-data text-right text-text-primary">{member.points.toLocaleString()}</td>
                <td className="px-4 py-2 type-mono-data text-text-secondary">POS-2026-0310</td>
              </tr>
              <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                <td className="px-4 py-2 type-body-xs text-text-secondary">2026-05-04</td>
                <td className="px-4 py-2 type-body-sm text-text-primary">Redeem</td>
                <td className="px-4 py-2 type-mono-data text-right text-tag-schedule-fg font-medium">-500</td>
                <td className="px-4 py-2 type-mono-data text-right text-text-primary">{(member.points - 120).toLocaleString()}</td>
                <td className="px-4 py-2 type-mono-data text-text-secondary">POS-2026-0298</td>
              </tr>
              <tr className="border-b border-border-subtle hover:bg-bg-subtle">
                <td className="px-4 py-2 type-body-xs text-text-secondary">2026-05-03</td>
                <td className="px-4 py-2 type-body-sm text-text-primary">Earn</td>
                <td className="px-4 py-2 type-mono-data text-right text-rx-filled-fg font-medium">+200</td>
                <td className="px-4 py-2 type-mono-data text-right text-text-primary">{(member.points - 120 + 500).toLocaleString()}</td>
                <td className="px-4 py-2 type-mono-data text-text-secondary">POS-2026-0287</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyMemberPage
