import { useMemo, useState } from 'react'
import { ArrowCounterClockwise, Lock, ShieldCheck } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { useToast } from '@/components/Toast'
import { ROLES, type Role } from '@/types/auth'
import { ROUTE_PERMISSIONS, type RoutePermissionKey } from '@/config/route-permissions'
import { usePermissionsStore } from '@/stores/permissions'

/**
 * PermissionsPage — admin matrix for editing role-to-route permissions.
 * Authority: BAP — admin module; ADR Decision 7 — three-layer enforcement.
 *
 * Edits are stored in the permissions Zustand store (persisted to localStorage
 * for demo). When Supabase wires, edits POST to `route_permissions` table and
 * RLS enforces server-side.
 */

type RouteGroup = {
  label: string
  description: string
  routes: RoutePermissionKey[]
}

const ROUTE_GROUPS: RouteGroup[] = [
  {
    label: 'Dashboard & Profile',
    description: 'Landing surfaces; should be open to all signed-in staff',
    routes: ['/dashboard', '/profile'],
  },
  {
    label: 'Inventory',
    description: 'Stock, catalog, receive, scanner, alerts, suppliers',
    routes: [
      '/inventory',
      '/inventory/catalog',
      '/inventory/catalog/:id',
      '/inventory/receive',
      '/inventory/scanner',
      '/inventory/alerts',
      '/inventory/suppliers',
    ],
  },
  {
    label: 'Prescriptions',
    description: 'Queue, new, detail, AI scanner, schedule drug log (regulated)',
    routes: [
      '/prescriptions',
      '/prescriptions/new',
      '/prescriptions/:id',
      '/prescriptions/scanner',
      '/prescriptions/schedule-log',
    ],
  },
  {
    label: 'Patients',
    description: 'Patient records — JDPA-regulated',
    routes: ['/patients', '/patients/new', '/patients/:id', '/patients/:id/insurance', '/patients/:id/jdpa'],
  },
  {
    label: 'Reports',
    description: 'Operational + regulatory reporting',
    routes: ['/reports', '/reports/inventory', '/reports/dispensing', '/reports/schedule-log', '/reports/revenue'],
  },
  {
    label: 'AI',
    description: 'Claude Vision job queue',
    routes: ['/ai/queue'],
  },
  {
    label: 'Retail POS',
    description: 'Point-of-sale, products, loyalty',
    routes: [
      '/pos',
      '/pos/products',
      '/pos/products/:id',
      '/pos/inventory',
      '/pos/suppliers',
      '/pos/reports',
      '/pos/loyalty',
      '/pos/loyalty/new',
      '/pos/loyalty/:id',
      '/pos/loyalty/dashboard',
    ],
  },
  {
    label: 'Admin',
    description: 'System-level control (users, audit, settings, security, permissions)',
    routes: ['/admin/users', '/admin/audit', '/admin/settings', '/admin/security'],
  },
]

const ROLE_LABELS: Record<Role, string> = {
  pharmacist: 'Pharmacist',
  pharmacy_technician: 'Tech',
  front_desk_cashier: 'Cashier',
  manager: 'Manager',
  admin: 'Admin',
}

export function PermissionsPage() {
  const toast = useToast()
  const { overrides, effectiveRoles, setOverride, resetOverride, resetAll } = usePermissionsStore()

  // Local "draft" edits applied on Save; canceling restores effective state.
  const initial = useMemo(() => {
    const map: Record<string, readonly Role[]> = {}
    for (const group of ROUTE_GROUPS) {
      for (const key of group.routes) {
        map[key] = effectiveRoles(key)
      }
    }
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [draft, setDraft] = useState<Record<string, readonly Role[]>>(initial)
  // Default open group — Inventory is the highest-traffic module for most roles.
  const [openGroup, setOpenGroup] = useState<string | null>('Inventory')

  function toggleCell(key: RoutePermissionKey, role: Role) {
    setDraft((prev) => {
      const current = prev[key] ?? effectiveRoles(key)
      const has = current.includes(role)
      const next = has ? current.filter((r) => r !== role) : [...current, role]
      return { ...prev, [key]: next }
    })
  }

  function isDirty(key: RoutePermissionKey): boolean {
    const draftRoles = draft[key]
    if (!draftRoles) return false
    const eff = effectiveRoles(key)
    if (draftRoles.length !== eff.length) return true
    return draftRoles.some((r) => !eff.includes(r))
  }

  const dirtyCount = Object.keys(draft).filter((k) => isDirty(k as RoutePermissionKey)).length
  const overrideCount = Object.keys(overrides).length

  function handleSave() {
    let saved = 0
    for (const key of Object.keys(draft) as RoutePermissionKey[]) {
      if (!isDirty(key)) continue
      const draftRoles = draft[key]
      if (!draftRoles) continue
      const staticRoles = ROUTE_PERMISSIONS[key].roles as readonly Role[]
      // If the draft equals the static default, clear the override; otherwise set it.
      const equalsStatic =
        draftRoles.length === staticRoles.length &&
        draftRoles.every((r) => staticRoles.includes(r))
      if (equalsStatic) {
        resetOverride(key)
      } else {
        setOverride(key, draftRoles)
      }
      saved++
    }
    toast.show(`${saved} permission change${saved === 1 ? '' : 's'} saved`, { variant: 'success' })
  }

  function handleResetAll() {
    resetAll()
    setDraft(() => {
      const map: Record<string, readonly Role[]> = {}
      for (const group of ROUTE_GROUPS) {
        for (const key of group.routes) {
          map[key] = ROUTE_PERMISSIONS[key].roles
        }
      }
      return map
    })
    toast.show('All overrides cleared — back to defaults', { variant: 'info' })
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Permissions"
        subtitle={`Role-to-route access matrix · ${ROLES.length} roles · ${ROUTE_GROUPS.reduce((s, g) => s + g.routes.length, 0)} routes${overrideCount > 0 ? ` · ${overrideCount} override${overrideCount === 1 ? '' : 's'} active` : ''}`}
        cta={
          <div className="flex items-center gap-2">
            <Button variant="tertiary" size="md" onClick={handleResetAll} disabled={overrideCount === 0}>
              <ArrowCounterClockwise size={16} weight="bold" />
              Reset All
            </Button>
            <Button variant="primary" size="md" onClick={handleSave} disabled={dirtyCount === 0}>
              <ShieldCheck size={16} weight="bold" />
              {dirtyCount === 0 ? 'No Changes' : `Save ${dirtyCount} Change${dirtyCount === 1 ? '' : 's'}`}
            </Button>
          </div>
        }
      />

      <section className="flex-1 p-6 overflow-y-auto space-y-4">
        {/* Banner explaining the security model */}
        <div className="bg-tag-nhf-bg/50 border border-tag-nhf-fg/20 rounded-card p-4 flex items-start gap-3">
          <Lock size={18} className="text-tag-nhf-fg shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="type-body-sm text-text-primary">
              These checks are <strong>UI guards</strong> — they hide routes from the wrong role.
              The actual security boundary is Row-Level Security (RLS) at the database. When Supabase
              wires, every change here also POSTs to the backend, and RLS enforces server-side.
            </p>
            <p className="type-body-xs text-text-secondary mt-2">
              Authority: ADR Decision 7 — three-layer enforcement (RLS → Edge Function → UI guard).
            </p>
            <p className="type-body-xs text-text-secondary mt-1">
              Default permissions are set by role and match the matrix below. Overrides apply to this
              pharmacy instance only and persist locally until Supabase wires. Clearing overrides
              returns all routes to their role defaults.
            </p>
          </div>
        </div>

        {/* Per-group accordion of route × role matrix */}
        {ROUTE_GROUPS.map((group) => {
          const isOpen = openGroup === group.label
          const groupOverrides = group.routes.filter((k) => overrides[k]).length
          return (
            <article key={group.label} className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group.label)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-bg-subtle transition-colors text-left"
                aria-expanded={isOpen}
              >
                <div>
                  <h3 className="type-card-title text-text-primary flex items-center gap-2">
                    {group.label}
                    {groupOverrides > 0 && (
                      <StatusPill variant="warning">{groupOverrides} override{groupOverrides === 1 ? '' : 's'}</StatusPill>
                    )}
                  </h3>
                  <p className="type-body-xs text-text-secondary mt-0.5">{group.description}</p>
                </div>
                <span className="type-mono-data text-text-secondary type-tiny shrink-0 ml-4">
                  {group.routes.length} route{group.routes.length === 1 ? '' : 's'}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-border overflow-x-auto">
                  <table className="w-full">
                    <caption className="sr-only">Route permissions for {group.label}</caption>
                    <thead>
                      <tr className="bg-bg-subtle border-b border-border">
                        <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary min-w-[260px]">Route</th>
                        {ROLES.map((r) => (
                          <th key={r} scope="col" className="h-9 px-3 text-center type-caption text-text-secondary">
                            {ROLE_LABELS[r]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {group.routes.map((key) => {
                        const draftRoles = draft[key] ?? effectiveRoles(key)
                        const dirty = isDirty(key)
                        const overridden = !!overrides[key]
                        return (
                          <tr key={key} className={`h-11 border-b border-border-subtle ${dirty ? 'bg-rx-verified-bg/30' : ''}`}>
                            <td className="px-4">
                              <div className="flex items-center gap-2">
                                <span className="type-mono-data text-text-primary">{key}</span>
                                {overridden && !dirty && <StatusPill variant="warning">override</StatusPill>}
                                {dirty && <StatusPill variant="info">unsaved</StatusPill>}
                              </div>
                            </td>
                            {ROLES.map((r) => {
                              const checked = draftRoles.includes(r)
                              return (
                                <td key={r} className="px-3 text-center">
                                  <label className="inline-flex items-center justify-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleCell(key, r)}
                                      aria-label={`${ROLE_LABELS[r]} access to ${key}`}
                                      className="appearance-none w-4 h-4 rounded-[3px] border border-border bg-bg-surface checked:bg-primary checked:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20 transition-colors cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:type-tiny checked:after:font-bold"
                                    />
                                  </label>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default PermissionsPage
