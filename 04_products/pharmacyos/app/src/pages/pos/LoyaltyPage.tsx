import { Plus, Crown } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_LOYALTY, type LoyaltyMember } from '@/data/sample'

const TIER_VARIANT: Record<LoyaltyMember['tier'], 'neutral' | 'info' | 'success' | 'warning'> = {
  Bronze: 'neutral',
  Silver: 'info',
  Gold: 'warning',
  Platinum: 'success',
}

export function LoyaltyPage() {
  const totalPoints = SAMPLE_LOYALTY.reduce((sum, m) => sum + m.points, 0)
  const platinum = SAMPLE_LOYALTY.filter((m) => m.tier === 'Platinum').length
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Loyalty Members"
        subtitle={`${SAMPLE_LOYALTY.length} enrolled · ${totalPoints.toLocaleString()} total points · ${platinum} Platinum`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            Enroll Member
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Member</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Patient #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Tier</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Points</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Last Earned</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_LOYALTY.map((m) => (
                <tr key={m.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors cursor-pointer">
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-pill bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0">
                        {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <p className="text-[13px] font-medium text-text-primary">{m.name}</p>
                    </div>
                  </td>
                  <td className="px-4 type-mono-data text-text-secondary">{m.patientId}</td>
                  <td className="px-4">
                    <span className="inline-flex items-center gap-1.5">
                      {m.tier === 'Platinum' && <Crown size={14} className="text-rx-filled-fg" />}
                      <StatusPill variant={TIER_VARIANT[m.tier]}>{m.tier}</StatusPill>
                    </span>
                  </td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{m.points.toLocaleString()}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{m.lastEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default LoyaltyPage
