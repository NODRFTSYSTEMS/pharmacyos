import { PageHeader } from '@/components/PageHeader'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_LOYALTY } from '@/data/sample'
import { Users, Coin, TrendUp, Trophy } from '@phosphor-icons/react'

export function LoyaltyDashboardPage() {
  const totalMembers = SAMPLE_LOYALTY.length
  const totalPoints = SAMPLE_LOYALTY.reduce((s, m) => s + m.points, 0)
  const topSpenders = [...SAMPLE_LOYALTY].sort((a, b) => b.points - a.points).slice(0, 5)

  return (
    <div className="flex-1 p-6 space-y-6">
      <PageHeader title="Loyalty Dashboard" />

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-primary/10 text-primary flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Enrolled</p>
            <p className="type-mono-metric text-text-primary">{totalMembers}</p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-warning/10 text-warning flex items-center justify-center">
            <Coin size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Points Liability</p>
            <p className="type-mono-metric text-text-primary">{totalPoints.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-accent/10 text-accent flex items-center justify-center">
            <TrendUp size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Redemption Rate</p>
            <p className="type-mono-metric text-text-primary">42%</p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-card shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-rx-filled-bg text-rx-filled-fg flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="type-label text-text-secondary">Avg. Points</p>
            <p className="type-mono-metric text-text-primary">{Math.round(totalPoints / totalMembers).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Trophy size={18} className="text-warning" />
          <h2 className="type-card-title text-text-primary">Top Spenders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Top loyalty spenders by points balance</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Rank</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Member</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Tier</th>
                <th className="px-4 py-2 text-right type-caption text-text-secondary">Points</th>
                <th className="px-4 py-2 text-left type-caption text-text-secondary">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {topSpenders.map((m, i) => (
                <tr key={m.id} className="border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 py-2 type-mono-data text-text-secondary">#{i + 1}</td>
                  <td className="px-4 py-2 type-body-sm font-medium text-text-primary">{m.name}</td>
                  <td className="px-4 py-2">
                    <StatusPill
                      variant={
                        m.tier === 'Platinum' ? 'success' :
                        m.tier === 'Gold' ? 'warning' :
                        m.tier === 'Silver' ? 'info' : 'neutral'
                      }
                    >
                      {m.tier}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-2 type-mono-data text-right text-text-primary">{m.points.toLocaleString()}</td>
                  <td className="px-4 py-2 type-body-xs text-text-secondary">{m.lastEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyDashboardPage
