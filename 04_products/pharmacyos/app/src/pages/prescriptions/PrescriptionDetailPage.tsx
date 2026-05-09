import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Pill, User, Stethoscope, Clock } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { Placeholder } from '@/components/Placeholder'
import { SAMPLE_PRESCRIPTIONS, SAMPLE_PATIENTS, type RxStatus } from '@/data/sample'

const STAGE_ORDER: RxStatus[] = ['Received', 'Verified', 'Filled', 'Dispensed']

const NEXT_ACTION: Record<RxStatus, { label: string; description: string } | null> = {
  Received:  { label: 'Verify',   description: 'Pharmacist confirms dosage, drug, and patient match' },
  Verified:  { label: 'Fill',     description: 'Pull lot, count, label' },
  Filled:    { label: 'Dispense', description: 'Patient pickup + final pharmacist sign-off' },
  Dispensed: null,
}

export function PrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const rx = SAMPLE_PRESCRIPTIONS.find((r) => r.id === id || r.rxNumber === id)
  if (!rx) return <Placeholder title="Prescription not found" />

  const patient = SAMPLE_PATIENTS.find((p) => p.id === rx.patientId)
  const currentIdx = STAGE_ORDER.indexOf(rx.status)
  const nextAction = NEXT_ACTION[rx.status]

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={rx.rxNumber}
        subtitle={`${rx.patient} · ${rx.prescriber}`}
        cta={
          nextAction ? (
            <Button variant="primary" size="md">
              <Check size={16} weight="bold" />
              {nextAction.label}
            </Button>
          ) : (
            <StatusPill variant="dispensed">Completed</StatusPill>
          )
        }
      />
      <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        <Link
          to="/prescriptions"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to queue
        </Link>

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

        {/* Patient + Prescriber + Tags */}
        <div className="grid grid-cols-3 gap-4">
          <Card icon={<User size={16} className="text-text-secondary" />} label="Patient">
            {patient ? (
              <Link to={`/patients/${patient.id}`} className="text-sm font-medium text-primary hover:text-primary-hover">
                {patient.name}
              </Link>
            ) : (
              <span className="text-sm text-text-primary">{rx.patient}</span>
            )}
            <p className="type-label text-text-secondary mt-0.5">ID {rx.patientId}</p>
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
