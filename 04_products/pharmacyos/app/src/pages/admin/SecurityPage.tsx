import { ShieldCheck, ShieldWarning, Desktop } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_STAFF, SAMPLE_ACTIVITY, SAMPLE_SESSIONS } from '@/data/sample'

export function SecurityPage() {
  const without2fa = SAMPLE_STAFF.filter((u) => !u.twoFa && u.status === 'Active')

  // Failed-login simulation: pick a few entries that look auth-related
  const securityEvents = SAMPLE_ACTIVITY
    .filter((a) => /login|2fa|password|locked/i.test(a.action) || /sign/i.test(a.action))
    .slice(0, 6)

  // Active sessions — sourced from SAMPLE_SESSIONS (stub; integration pending: Supabase)
  const activeSessions = SAMPLE_SESSIONS

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Security" subtitle="Two-factor enforcement Â· active sessions Â· auth events" />
      <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        {/* Posture summary */}
        <div className="grid grid-cols-3 gap-4">
          <PostureCard
            icon={<ShieldCheck size={20} className="text-rx-filled-fg" />}
            title="2FA Coverage"
            value={`${SAMPLE_STAFF.filter((u) => u.twoFa).length} / ${SAMPLE_STAFF.length}`}
            note={`${without2fa.length} active users without 2FA`}
            tone={without2fa.length === 0 ? 'good' : 'warn'}
          />
          <PostureCard
            icon={<Desktop size={20} className="text-rx-received-fg" />}
            title="Active Sessions"
            value={activeSessions.length.toString()}
            note="across managed devices · stub data"
            tone="good"
          />
          <PostureCard
            icon={<ShieldWarning size={20} className="text-rx-verified-fg" />}
            title="Failed Logins (24h)"
            value="0"
            note="no lockouts triggered"
            tone="good"
          />
        </div>

        {/* Users without 2FA */}
        {without2fa.length > 0 && (
          <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-rx-verified-bg/40 flex items-center gap-2">
              <ShieldWarning size={16} className="text-rx-verified-fg" />
              <p className="text-xs font-medium text-rx-verified-fg">
                {without2fa.length} active users have not enrolled in 2FA â€” required by policy
              </p>
            </div>
            <table className="w-full">
            <caption className="sr-only">Staff two-factor authentication status</caption>
              <thead>
                <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">User</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Role</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Last Login</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {without2fa.map((u) => (
                  <tr key={u.id} className="h-11 border-b border-border-subtle">
                    <td className="px-4 type-body-sm text-text-primary">{u.name}</td>
                    <td className="px-4 type-body-xs text-text-secondary">{u.role}</td>
                    <td className="px-4 type-mono-data text-text-secondary">{u.lastLogin}</td>
                    <td className="px-4 text-right">
                      <Button variant="secondary" size="sm">Force Enrollment</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Active sessions */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="type-caption text-text-secondary">Active Sessions</h2>
            <span className="type-tiny text-text-disabled">Integration Pending: Supabase auth</span>
          </div>
          <table className="w-full">
            <caption className="sr-only">Active user sessions</caption>
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">User</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Role</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Device</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">IP</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Last Activity</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary"></th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map((s) => (
                <tr key={s.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                  <td className="px-4 type-body-sm text-text-primary">
                    {s.user}
                    {s.current && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded type-tiny font-medium bg-primary/10 text-primary">you</span>
                    )}
                  </td>
                  <td className="px-4 type-body-xs text-text-secondary">{s.role}</td>
                  <td className="px-4 type-body-xs text-text-secondary">{s.device}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{s.ip}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{s.lastActivity}</td>
                  <td className="px-4 text-right">
                    {s.current ? (
                      <span className="type-tiny text-text-disabled">current</span>
                    ) : (
                      <Button variant="tertiary" size="sm">Revoke</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent auth events */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="type-caption text-text-secondary">Recent Authentication Events</h2>
          </div>
          {securityEvents.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-text-secondary">No authentication events in the last 24 hours.</p>
          ) : (
            <table className="w-full">
            <caption className="sr-only">Recent authentication events</caption>
              <thead>
                <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Time</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">User</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Action</th>
                  <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Result</th>
                </tr>
              </thead>
              <tbody>
                {securityEvents.map((e) => (
                  <tr key={e.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                    <td className="px-4 type-mono-data text-text-secondary">{e.timestamp}</td>
                    <td className="px-4 type-body-sm text-text-primary">{e.user}</td>
                    <td className="px-4 type-body-sm text-text-primary">{e.action}</td>
                    <td className="px-4">
                      <StatusPill variant="success">Success</StatusPill>
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

function PostureCard({ icon, title, value, note, tone }: { icon: React.ReactNode; title: string; value: string; note: string; tone: 'good' | 'warn' }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="type-caption text-text-secondary">{title}</p>
      </div>
      <p className={`type-mono-metric leading-none ${tone === 'good' ? 'text-text-primary' : 'text-rx-verified-fg'}`}>{value}</p>
      <p className="type-label text-text-secondary mt-2">{note}</p>
    </div>
  )
}

export default SecurityPage
