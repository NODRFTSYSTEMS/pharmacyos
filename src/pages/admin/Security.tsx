import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ShieldWarning,
  UserCircleGear,
  LockSimple,
  ArrowClockwise,
  Warning,
  CheckCircle,
  Clock,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { toJamaicaBounds, todayJamaica } from '../../lib/date'
import { PageHeader, MetricCard, Pill as StatusPill, EmptyRow } from '../../components/Shell'
import { StaffAvatar } from '../../components/StaffAvatar'
import { AUDIT_ACTIONS } from '../../constants/audit-actions'

// ── Types ─────────────────────────────────────────────────────────────────────

interface StaffProfile {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  avatar_url: string | null
  // avatar_alt and avatar_source_status intentionally omitted (AU-06 — migration 028 unapplied)
  created_at: string
  updated_at: string
}

interface AuditEntry {
  id: string
  actor_id: string | null
  actor_name: string | null
  action: string
  details: unknown
  created_at: string
}

interface StaffLastActivity {
  actor_id: string
  last_seen: string
}

interface ActiveSession {
  actor_id: string
  actor_name: string | null
  last_seen: string
}

const ACTIVE_CUTOFF_MS = 30 * 60 * 1_000  // 30 minutes

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-JM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function rolePill(role: string): 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'gray' {
  const map: Record<string, 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'gray'> = {
    PHARMACIST: 'green',
    CASHIER:    'blue',
    TECHNICIAN: 'purple',
    MANAGER:    'yellow',
    ADMIN:      'red',
    AUDITOR:    'gray',
  }
  return map[role] ?? 'gray'
}

function extractDenialPath(details: unknown): string {
  if (details && typeof details === 'object' && 'attempted_path' in details) {
    return String((details as Record<string, unknown>).attempted_path)
  }
  return '—'
}

function extractDenialRole(details: unknown): string {
  if (details && typeof details === 'object' && 'role' in details) {
    return String((details as Record<string, unknown>).role)
  }
  return '—'
}

// ── Data hooks ────────────────────────────────────────────────────────────────

function useStaffProfiles() {
  return useQuery<StaffProfile[]>({
    queryKey: ['security-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_profiles')
        // AU-06: avatar_alt and avatar_source_status excluded — migration 028 not applied to production.
        // Selecting missing columns returns 400/42703, breaking the entire staff list.
        // Restore after migration 028 is applied: add avatar_alt, avatar_source_status
        .select('id, email, full_name, role, is_active, avatar_url, created_at, updated_at')
        .order('full_name')
      if (error) throw error
      return (data ?? []) as StaffProfile[]
    },
    staleTime: 60_000,
  })
}

function useLastActivity() {
  return useQuery<StaffLastActivity[]>({
    queryKey: ['security-last-activity'],
    queryFn: async () => {
      // Get the most recent audit_log entry per actor_id
      // We select and then collapse client-side because Supabase REST doesn't
      // support GROUP BY directly, and a DISTINCT ON equivalent needs an RPC.
      const { data, error } = await supabase
        .from('audit_log')
        .select('actor_id, created_at')
        .not('actor_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(500)
      if (error) throw error

      const seen = new Map<string, string>()
      for (const row of (data ?? [])) {
        if (row.actor_id && !seen.has(row.actor_id)) {
          seen.set(row.actor_id, row.created_at)
        }
      }
      return Array.from(seen.entries()).map(([actor_id, last_seen]) => ({ actor_id, last_seen }))
    },
    staleTime: 60_000,
  })
}

function useActiveSessions() {
  return useQuery<ActiveSession[]>({
    queryKey: ['security-active-sessions'],
    queryFn: async () => {
      const cutoff = new Date(Date.now() - ACTIVE_CUTOFF_MS).toISOString()
      const { data, error } = await supabase
        .from('audit_log')
        .select('actor_id, actor_name, created_at')
        .not('actor_id', 'is', null)
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false })
        .limit(200)
      if (error) throw error
      // Deduplicate — keep most recent entry per actor
      const seen = new Set<string>()
      return (data ?? []).filter(row => {
        if (!row.actor_id || seen.has(row.actor_id)) return false
        seen.add(row.actor_id)
        return true
      }).map(row => ({ actor_id: row.actor_id as string, actor_name: row.actor_name, last_seen: row.created_at }))
    },
    refetchInterval: 60_000,   // refresh every minute
    staleTime: 30_000,
  })
}

function useRecentDenials() {
  return useQuery<AuditEntry[]>({
    queryKey: ['security-access-denials'],
    queryFn: async () => {
      // Last 7 days of access denial events
      const today = todayJamaica()
      const bounds = toJamaicaBounds(
        new Date(new Date(today).setDate(new Date(today).getDate() - 6)).toISOString().slice(0, 10),
        today,
      )
      const { data, error } = await supabase
        .from('audit_log')
        .select('id, actor_id, actor_name, action, details, created_at')
        .eq('action', AUDIT_ACTIONS.ACCESS_DENIED)
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return (data ?? []) as AuditEntry[]
    },
    staleTime: 60_000,
  })
}

// ── Panels ────────────────────────────────────────────────────────────────────

function StaffSecurityTable() {
  const staffQ       = useStaffProfiles()
  const activityQ    = useLastActivity()
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const activityMap = new Map<string, string>(
    (activityQ.data ?? []).map(r => [r.actor_id, r.last_seen])
  )

  const staff = (staffQ.data ?? []).filter(s => {
    if (filter === 'active')   return s.is_active
    if (filter === 'inactive') return !s.is_active
    return true
  })

  const loading = staffQ.isLoading || activityQ.isLoading

  return (
    <section aria-labelledby="staff-security-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="staff-security-heading" className="text-sm font-semibold text-gray-800">
          Staff Security Status
        </h2>
        <div className="flex gap-1">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/6 text-gray-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm" role="table" aria-label="Staff security status">
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Name</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Role</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Account</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Last Activity</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">MFA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                  Loading staff…
                </td>
              </tr>
            )}
            {!loading && staff.length === 0 && (
              <EmptyRow colSpan={5} message="No staff members match this filter." />
            )}
            {!loading && staff.map(s => {
              const lastSeen = activityMap.get(s.id)
              return (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <StaffAvatar
                        name={s.full_name}
                        email={s.email}
                        role={s.role}
                        avatarUrl={s.avatar_url}
                        avatarAlt={null}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 truncate">{s.full_name}</div>
                        <div className="text-xs text-gray-400 truncate">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill variant={rolePill(s.role)} label={s.role} />
                  </td>
                  <td className="px-4 py-3">
                    {s.is_active
                      ? <StatusPill variant="green" label="Active" />
                      : <StatusPill variant="red"   label="Deactivated" />
                    }
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">
                    {lastSeen ? (
                      <span title={fmtDateTime(lastSeen)}>{fmtRelative(lastSeen)}</span>
                    ) : (
                      <span className="text-gray-500">No activity</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {/* MFA enrollment status is managed in Supabase Auth — not queryable
                        from the client without a service-role Edge Function.
                        The profile/security page allows self-service TOTP enrollment. */}
                    <span className="text-xs text-gray-500 italic">Self-managed</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        MFA enrollment is self-managed via <span className="text-blue-600">Profile → Security</span>. Admins can enforce enrollment by deactivating accounts until staff complete setup.
      </p>
    </section>
  )
}

function AccessDenialsPanel() {
  const denialsQ = useRecentDenials()
  const denials  = denialsQ.data ?? []

  return (
    <section aria-labelledby="access-denials-heading">
      <h2 id="access-denials-heading" className="text-sm font-semibold text-gray-800 mb-3">
        Access Denials — Last 7 Days
      </h2>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm" role="table" aria-label="Recent access denials">
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Staff Member</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Role</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Attempted Path</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {denialsQ.isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                  Loading…
                </td>
              </tr>
            )}
            {!denialsQ.isLoading && denials.length === 0 && (
              <EmptyRow colSpan={4} message="No access denial events in the last 7 days." />
            )}
            {!denialsQ.isLoading && denials.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700 text-xs font-medium">
                  {entry.actor_name ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {extractDenialRole(entry.details)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-amber-600">
                  {extractDenialPath(entry.details)}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400" title={fmtDateTime(entry.created_at)}>
                  {fmtRelative(entry.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SecurityRecommendations({ staffData }: { staffData: StaffProfile[] }) {
  const recommendations: { ok: boolean; label: string; detail: string }[] = [
    {
      ok: staffData.filter(s => !s.is_active).length === 0
        || staffData.filter(s => !s.is_active).length < staffData.length * 0.3,
      label: 'Deactivated accounts within normal range',
      detail: `${staffData.filter(s => !s.is_active).length} deactivated of ${staffData.length} total accounts.`,
    },
    {
      ok: staffData.filter(s => s.role === 'ADMIN').length <= 2,
      label: 'ADMIN role is appropriately restricted',
      detail: `${staffData.filter(s => s.role === 'ADMIN').length} ADMIN account(s) — recommend ≤2.`,
    },
    {
      ok: true,
      label: 'MFA enrollment self-service is available',
      detail: 'Staff can enroll TOTP at Profile → Security. Enforcement requires Supabase MFA policy configuration.',
    },
    {
      ok: true,
      label: 'RBAC enforced via database-level RLS',
      detail: 'All data access is controlled by PostgreSQL RLS policies. get_my_role() checks is_active on every request.',
    },
  ]

  return (
    <section aria-labelledby="security-recs-heading">
      <h2 id="security-recs-heading" className="text-sm font-semibold text-gray-800 mb-3">
        Security Posture
      </h2>
      <div className="space-y-2">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              rec.ok
                ? 'bg-green-50 border-green-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            {rec.ok
              ? <CheckCircle size={16} weight="fill" className="text-emerald-600 mt-0.5 shrink-0" />
              : <Warning size={16} weight="fill" className="text-amber-500 mt-0.5 shrink-0" />
            }
            <div>
              <p className={`text-sm font-medium ${rec.ok ? 'text-green-800' : 'text-amber-800'}`}>
                {rec.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{rec.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActiveSessionsPanel() {
  const { data: sessions = [], isLoading } = useActiveSessions()

  return (
    <section aria-labelledby="active-sessions-heading">
      <h2 id="active-sessions-heading" className="text-sm font-semibold text-gray-800 mb-3">
        Currently Active — Last 30 Minutes
      </h2>
      <div className="card p-4">
        {isLoading && (
          <p className="text-sm text-gray-500">Loading active sessions…</p>
        )}
        {!isLoading && sessions.length === 0 && (
          <p className="text-sm text-gray-500">No active sessions in the last 30 minutes.</p>
        )}
        {!isLoading && sessions.length > 0 && (
          <div className="space-y-2">
            {sessions.map(s => {
              const minutesAgo = Math.floor((Date.now() - new Date(s.last_seen).getTime()) / 60_000)
              const isOnline   = minutesAgo < 10
              return (
                <div key={s.actor_id} className="flex items-center gap-3 text-sm">
                  {/* Green dot ≤10 min, amber dot 10–30 min */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-emerald-500' : 'bg-amber-400'}`}
                    aria-label={isOnline ? 'Active now' : 'Recently active'}
                  />
                  <span className="font-medium text-gray-800">
                    {s.actor_name ?? 'Unknown staff'}
                  </span>
                  <span className="text-gray-500 ml-auto tabular-nums">
                    {minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`}
                  </span>
                </div>
              )
            })}
          </div>
        )}
        <p className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
          Activity derived from audit log. Refreshes every 60 seconds.
          Deactivate accounts via Admin → Users to revoke access immediately.
        </p>
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function SecurityAdmin() {
  const staffQ    = useStaffProfiles()
  const denialsQ  = useRecentDenials()

  const staff     = staffQ.data ?? []
  const denials   = denialsQ.data ?? []

  const activeCount     = staff.filter(s => s.is_active).length
  const inactiveCount   = staff.filter(s => !s.is_active).length
  const denialCount7d   = denials.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Security"
          subtitle="Staff account status, access controls, and security events"
        />
        <button
          onClick={() => { staffQ.refetch(); denialsQ.refetch() }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label="Refresh security data"
        >
          <ArrowClockwise size={14} />
          Refresh
        </button>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={UserCircleGear}
          label="Active Accounts"
          value={String(activeCount)}
          sub="staff accounts with system access"
        />
        <MetricCard
          icon={LockSimple}
          label="Deactivated Accounts"
          value={String(inactiveCount)}
          sub="accounts blocked from login"
        />
        <MetricCard
          icon={ShieldWarning}
          label="Access Denials"
          value={String(denialCount7d)}
          sub="unauthorized route attempts (7 days)"
        />
      </div>

      {/* Currently active sessions — 30-min activity window (JDPA access monitoring) */}
      <ActiveSessionsPanel />

      {/* Staff security status table */}
      <StaffSecurityTable />

      {/* Access denials log */}
      <AccessDenialsPanel />

      {/* Security posture recommendations */}
      {staff.length > 0 && <SecurityRecommendations staffData={staff} />}

      {/* Admin note about MFA */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Clock size={16} className="text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Session management</p>
          <p className="text-xs text-gray-500 mt-1">
            Active sessions are managed by Supabase Auth and expire based on the JWT lifetime configured in
            your Supabase project settings. Deactivating a staff account via Admin → Users sets
            <code className="mx-1 px-1 bg-gray-100 rounded text-blue-600">is_active = false</code>
            in <code className="px-1 bg-gray-100 rounded text-blue-600">staff_profiles</code>, which causes
            <code className="mx-1 px-1 bg-gray-100 rounded text-blue-600">get_my_role()</code>
            to return NULL on their next request — all RLS policies will then deny access.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecurityAdmin
