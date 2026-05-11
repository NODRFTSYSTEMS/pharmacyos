import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Check, Pill, User, Stethoscope, Clock,
  Warning, Spinner, Repeat, ShieldWarning, ListChecks,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { Placeholder } from '@/components/Placeholder'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useToast } from '@/components/Toast'
import { usePrescriptionStore } from '@/stores/prescriptions'
import { usePermissionsStore } from '@/stores/permissions'
import { SAMPLE_PATIENTS, SAMPLE_STAFF, type RxStatus, type UserRole } from '@/data/sample'
import { useOpenFDAInteractions } from '@/hooks/useOpenFDAInteractions'

/** Prescriptions older than 6 months that haven't been dispensed are flagged expired. */
const TODAY = new Date('2026-05-11')
function isRxExpired(receivedStr: string, status: RxStatus): boolean {
  if (status === 'Dispensed') return false
  const received = new Date(receivedStr.split(' ')[0])
  const cutoff = new Date(received)
  cutoff.setMonth(cutoff.getMonth() + 6)
  return TODAY > cutoff
}

const STAGE_ORDER: RxStatus[] = ['Received', 'Verified', 'Filled', 'Dispensed']

const NEXT_ACTION: Record<RxStatus, { label: string; description: string } | null> = {
  Received:  { label: 'Verify',   description: 'Pharmacist confirms dosage, drug, and patient match' },
  Verified:  { label: 'Fill',     description: 'Pull lot, count, and label the prescription' },
  Filled:    { label: 'Dispense', description: 'Patient pickup + final pharmacist sign-off' },
  Dispensed: null,
}

/** Map auth Role (snake_case) to sample data UserRole (display string) */
const ROLE_DISPLAY: Record<string, UserRole> = {
  pharmacist:         'Pharmacist',
  pharmacy_technician: 'Technician',
  front_desk_cashier:  'Front Desk',
  manager:            'Manager',
  admin:              'Admin',
}

/** Check if any drug name string contains a patient allergy. Rough text match for demo. */
function detectAllergyConflict(drugs: string[], allergies: string[]): string[] {
  const conflicts: string[] = []
  for (const allergy of allergies) {
    for (const drug of drugs) {
      if (drug.toLowerCase().includes(allergy.toLowerCase())) {
        conflicts.push(`${drug} — possible ${allergy} allergy conflict`)
      }
    }
  }
  return conflicts
}

export function PrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const toast = useToast()
  const actingRole = usePermissionsStore((s) => s.actingRole)
  const { getById, advance } = usePrescriptionStore()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const rx = getById(id ?? '')
  // Hook must be called before any early return (Rules of Hooks)
  const interactionResults = useOpenFDAInteractions(rx?.drugs ?? [])

  if (!rx) return <Placeholder title="Prescription not found" />

  const patient = SAMPLE_PATIENTS.find((p) => p.id === rx.patientId)
  const currentIdx = STAGE_ORDER.indexOf(rx.status)
  const nextAction = NEXT_ACTION[rx.status]
  const expired = isRxExpired(rx.received, rx.status)
  const allergyConflicts = patient ? detectAllergyConflict(rx.drugs, patient.allergies) : []

  // Derive actor name from SAMPLE_STAFF matching actingRole, fallback to role label
  const actorStaff = SAMPLE_STAFF.find(
    (s) => s.role === ROLE_DISPLAY[actingRole] && s.status === 'Active',
  )
  const actorName = actorStaff?.name ?? ROLE_DISPLAY[actingRole] ?? actingRole

  function handleAdvance() {
    const userRole: UserRole = ROLE_DISPLAY[actingRole] ?? 'Admin'
    advance(rx!.id, actorName, userRole)
    setConfirmOpen(false)
    toast.show(`${nextAction?.label ?? 'Action'} recorded for ${rx!.rxNumber}`, { variant: 'success' })
  }

  const confirmBody = allergyConflicts.length > 0
    ? `Warning: ${allergyConflicts[0]}. Do you still want to proceed with ${nextAction?.label?.toLowerCase() ?? 'this action'}?`
    : `${nextAction?.description ?? ''} — confirm for ${rx.rxNumber} (${rx.patient}).`

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={rx.rxNumber}
        subtitle={`${rx.patient} · ${rx.prescriber}`}
        breadcrumb={[
          { label: 'Prescriptions', to: '/prescriptions' },
          { label: rx.rxNumber },
        ]}
        cta={
          nextAction ? (
            <div className="flex items-center gap-2">
              {allergyConflicts.length > 0 && (
                <span className="inline-flex items-center gap-1 type-tiny text-warning font-medium">
                  <ShieldWarning size={14} weight="bold" />
                  Allergy conflict — review required
                </span>
              )}
              <Button
                variant={allergyConflicts.length > 0 ? 'secondary' : 'primary'}
                size="md"
                onClick={() => setConfirmOpen(true)}
              >
                <Check size={16} weight="bold" />
                {nextAction.label}
              </Button>
            </div>
          ) : (
            <StatusPill variant="dispensed">Completed</StatusPill>
          )
        }
      />

      <ConfirmDialog
        open={confirmOpen}
        title={`${nextAction?.label ?? 'Confirm'} ${rx.rxNumber}?`}
        body={confirmBody}
        confirmLabel={nextAction?.label ?? 'Confirm'}
        variant={allergyConflicts.length > 0 ? 'warning' : 'default'}
        onConfirm={handleAdvance}
        onCancel={() => setConfirmOpen(false)}
      />

      <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        <Link
          to="/prescriptions"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to queue
        </Link>

        {/* Allergy conflict banner */}
        {allergyConflicts.length > 0 && (
          <div className="flex items-start gap-2 px-4 py-3 bg-tag-schedule-bg/50 border border-tag-schedule-fg/30 rounded-card text-sm">
            <ShieldWarning size={16} className="text-tag-schedule-fg shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-tag-schedule-fg">Allergy conflict detected</p>
              {allergyConflicts.map((c, i) => (
                <p key={i} className="text-xs text-text-secondary mt-0.5">{c}</p>
              ))}
            </div>
          </div>
        )}

        {/* Expired prescription warning */}
        {expired && (
          <div className="flex items-start gap-2 px-4 py-3 bg-tag-schedule-bg/50 border border-tag-schedule-fg/30 rounded-card text-sm">
            <Warning size={16} className="text-tag-schedule-fg shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-text-secondary">
              <span className="font-medium text-tag-schedule-fg">Prescription may be expired.</span>{' '}
              This prescription was received more than 6 months ago and has not been dispensed.
              Verify validity with the prescriber before filling.
            </p>
          </div>
        )}

        {/* Stage progression */}
        <div className="bg-bg-surface rounded-card shadow-card p-6">
          <p className="type-caption text-text-secondary mb-4">Workflow</p>
          <div className="flex items-center justify-between gap-2">
            {STAGE_ORDER.map((stage, i) => {
              const done = i < currentIdx
              const current = i === currentIdx
              return (
                <div key={stage} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={[
                        'w-8 h-8 rounded-pill flex items-center justify-center text-xs font-semibold',
                        done ? 'bg-rx-filled-bg text-rx-filled-fg' :
                        current ? 'bg-primary text-white ring-[3px] ring-primary/20' :
                        'bg-bg-subtle text-text-disabled border border-border',
                      ].join(' ')}
                    >
                      {done ? <Check size={14} weight="bold" /> : i + 1}
                    </div>
                    <p className={`type-label ${current ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{stage}</p>
                  </div>
                  {i < STAGE_ORDER.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${done ? 'bg-rx-filled-fg' : 'bg-border'}`} />
                  )}
                </div>
              )
            })}
          </div>
          {nextAction && (
            <p className="text-xs text-text-secondary mt-4 text-center">{nextAction.description}</p>
          )}
        </div>

        {/* Patient + Prescriber + Tags + Refills */}
        <div className="grid grid-cols-4 gap-4">
          <Card icon={<User size={16} className="text-text-secondary" />} label="Patient">
            {patient ? (
              <Link to={`/patients/${patient.id}`} className="text-sm font-medium text-primary hover:text-primary-hover">
                {patient.name}
              </Link>
            ) : (
              <span className="text-sm text-text-primary">{rx.patient}</span>
            )}
            <p className="type-label text-text-secondary mt-0.5">ID {rx.patientId}</p>
            {patient && patient.allergies.length > 0 && (
              <p className="type-label text-warning mt-1">
                Allergies: {patient.allergies.join(', ')}
              </p>
            )}
          </Card>
          <Card icon={<Stethoscope size={16} className="text-text-secondary" />} label="Prescriber">
            <p className="text-sm font-medium text-text-primary">{rx.prescriber}</p>
          </Card>
          <Card icon={<Clock size={16} className="text-text-secondary" />} label="Received">
            <p className="type-mono-data text-text-primary">{rx.received}</p>
            <div className="flex gap-1.5 mt-1">
              {rx.isSchedule && <StatusPill variant="schedule">SCHED</StatusPill>}
              {rx.isNhf && <StatusPill variant="nhf">NHF</StatusPill>}
            </div>
          </Card>
          <Card icon={<Repeat size={16} className="text-text-secondary" />} label="Refills">
            {rx.refills !== undefined ? (
              <>
                <p className="type-mono-data text-text-primary">
                  {rx.refillsRemaining ?? rx.refills} of {rx.refills} remaining
                </p>
                {(rx.refillsRemaining ?? rx.refills) === 0 && (
                  <p className="type-label text-warning mt-0.5">No refills left</p>
                )}
              </>
            ) : (
              <p className="type-label text-text-disabled">Not specified</p>
            )}
          </Card>
        </div>

        {/* Drug list */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Pill size={16} className="text-text-secondary" />
            <p className="type-caption text-text-secondary">Drugs ({rx.drugs.length})</p>
          </div>
          <ul className="divide-y divide-border-subtle">
            {rx.drugs.map((d, i) => (
              <li key={i} className="px-4 py-3 flex items-center justify-between hover:bg-bg-subtle">
                <span className="text-sm text-text-primary">{d}</span>
                <span className="type-mono-data text-xs text-text-secondary">Line {i + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Drug interactions — sourced from OpenFDA label API */}
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill size={16} className="text-text-secondary" />
              <p className="type-caption text-text-secondary">Drug Interactions (OpenFDA)</p>
            </div>
            <span className="type-label text-text-disabled">FDA label data — not a substitute for clinical review</span>
          </div>
          <ul className="divide-y divide-border-subtle">
            {interactionResults.map((r, i) => (
              <li key={i} className="px-4 py-4">
                <p className="type-body-sm font-medium text-text-primary mb-1">{r.drug}</p>
                {r.loading ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                    <Spinner size={12} className="animate-spin" aria-hidden="true" />
                    Loading FDA label&hellip;
                  </span>
                ) : r.error ? (
                  <p className="text-xs text-text-disabled">Unable to retrieve FDA data.</p>
                ) : r.interactions ? (
                  <p className="text-xs text-text-secondary leading-relaxed">{r.interactions}</p>
                ) : (
                  <p className="text-xs text-text-disabled italic">No interaction data found in FDA label database.</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Audit trail */}
        {rx.auditTrail && rx.auditTrail.length > 0 && (
          <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <ListChecks size={16} className="text-text-secondary" />
              <p className="type-caption text-text-secondary">Transaction Log</p>
              <span className="ml-auto type-tiny text-text-disabled">Regulated evidence trail</span>
            </div>
            <table className="w-full">
              <caption className="sr-only">Prescription workflow audit trail</caption>
              <thead>
                <tr className="bg-bg-subtle border-b border-border">
                  <th scope="col" className="h-8 px-4 text-left type-caption text-text-secondary">Timestamp</th>
                  <th scope="col" className="h-8 px-4 text-left type-caption text-text-secondary">Actor</th>
                  <th scope="col" className="h-8 px-4 text-left type-caption text-text-secondary">Role</th>
                  <th scope="col" className="h-8 px-4 text-left type-caption text-text-secondary">Transition</th>
                  <th scope="col" className="h-8 px-4 text-left type-caption text-text-secondary">Note</th>
                </tr>
              </thead>
              <tbody>
                {rx.auditTrail.map((entry, i) => (
                  <tr key={i} className="h-10 border-b border-border-subtle hover:bg-bg-subtle">
                    <td className="px-4 type-mono-data text-text-secondary whitespace-nowrap">{entry.timestamp}</td>
                    <td className="px-4 type-body-sm text-text-primary">{entry.actor}</td>
                    <td className="px-4 type-body-xs text-text-secondary">{entry.role}</td>
                    <td className="px-4">
                      <span className="inline-flex items-center gap-1 type-body-xs">
                        <StatusPill variant={entry.from.toLowerCase() as Lowercase<RxStatus>}>{entry.from}</StatusPill>
                        <span className="text-text-disabled">→</span>
                        <StatusPill variant={entry.to.toLowerCase() as Lowercase<RxStatus>}>{entry.to}</StatusPill>
                      </span>
                    </td>
                    <td className="px-4 type-body-xs text-text-secondary">{entry.note ?? <span className="text-text-disabled">&mdash;</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function Card({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="type-caption text-text-secondary">{label}</p>
      </div>
      {children}
    </div>
  )
}

export default PrescriptionDetailPage
