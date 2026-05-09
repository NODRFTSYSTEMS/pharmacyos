import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, DownloadSimple, Trash } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { Tabs } from '@/components/Tabs'
import { Placeholder } from '@/components/Placeholder'
import { SAMPLE_PATIENTS, SAMPLE_PRESCRIPTIONS } from '@/data/sample'

const TODAY = new Date('2026-05-08')

function ageOf(dob: string) {
  const b = new Date(dob)
  let a = TODAY.getFullYear() - b.getFullYear()
  const m = TODAY.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && TODAY.getDate() < b.getDate())) a--
  return a
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const patient = SAMPLE_PATIENTS.find((p) => p.id === id)
  if (!patient) return <Placeholder title="Patient not found" />

  const initials = patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  const meds = SAMPLE_PRESCRIPTIONS.filter((r) => r.patientId === patient.id)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={patient.name}
        subtitle={`Patient ${patient.id} · NHF ${patient.nhfNumber}`}
        cta={
          <Button variant="secondary" size="md">
            Edit Profile
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <Link
          to="/patients"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft size={14} />
          Back to patients
        </Link>

        <div className="flex items-start gap-4 mb-6 p-4 bg-bg-surface rounded-card shadow-card">
          <div className="w-14 h-14 rounded-pill bg-primary/10 text-primary flex items-center justify-center text-base font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <p className="type-section text-text-primary">{patient.name}</p>
            <p className="text-xs text-text-secondary mt-0.5">
              <span className="type-mono-data">{patient.dob}</span> · {ageOf(patient.dob)} years · {patient.phone}
            </p>
            {patient.allergies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {patient.allergies.map((a) => (
                  <StatusPill key={a} variant="error">{a}</StatusPill>
                ))}
              </div>
            )}
          </div>
        </div>

        <Tabs
          tabs={[
            {
              value: 'overview',
              label: 'Overview',
              content: (
                <div className="grid grid-cols-3 gap-4">
                  <Card title="Last Visit" value={patient.lastVisit} mono />
                  <Card title="Active Rx" value={String(meds.filter((r) => r.status !== 'Dispensed').length)} mono />
                  <Card title="Total Rx" value={String(meds.length)} mono />
                </div>
              ),
            },
            {
              value: 'medication',
              label: `Medication (${meds.length})`,
              content: (
                <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                        <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Rx #</th>
                        <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Drugs</th>
                        <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Prescriber</th>
                        <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Received</th>
                        <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meds.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-text-secondary">No medications on file.</td></tr>
                      )}
                      {meds.map((rx) => (
                        <tr key={rx.id} className="h-11 border-b border-border-subtle hover:bg-bg-subtle">
                          <td className="px-4 type-mono-data text-text-primary">{rx.rxNumber}</td>
                          <td className="px-4 type-body-xs text-text-primary">{rx.drugs.join(', ')}</td>
                          <td className="px-4 type-body-xs text-text-secondary">{rx.prescriber}</td>
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
                </div>
              ),
            },
            {
              value: 'insurance',
              label: 'Insurance',
              content: (
                <div className="bg-bg-surface rounded-card shadow-card p-6">
                  <p className="type-card-title text-text-primary mb-3">National Health Fund (NHF)</p>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="type-label text-text-secondary mb-1">NHF Number</dt>
                      <dd className="type-mono-data text-text-primary">{patient.nhfNumber}</dd>
                    </div>
                    <div>
                      <dt className="type-label text-text-secondary mb-1">Status</dt>
                      <dd><StatusPill variant="success">Active</StatusPill></dd>
                    </div>
                  </dl>
                </div>
              ),
            },
            {
              value: 'jdpa',
              label: 'JDPA',
              content: (
                <div className="bg-bg-surface rounded-card shadow-card p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20} className="text-rx-filled-fg shrink-0 mt-0.5" />
                    <div>
                      <p className="type-card-title text-text-primary">Jamaica Data Protection Act consent</p>
                      <p className="text-xs text-text-secondary mt-1">
                        Consent v1.0 captured at registration · {patient.lastVisit}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-border-subtle">
                    <Button variant="secondary" size="md">
                      <DownloadSimple size={16} weight="bold" />
                      Export Patient Data
                    </Button>
                    <Button variant="destructive" size="md">
                      <Trash size={16} weight="bold" />
                      Request Erasure
                    </Button>
                  </div>
                  <p className="type-label text-text-disabled">
                    Erasure requests are reviewed against Pharmacy Act retention rules — clinical records may be
                    redacted rather than deleted.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  )
}

function Card({ title, value, mono = false }: { title: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card p-4">
      <p className="type-caption text-text-secondary">{title}</p>
      <p className={`mt-2 ${mono ? 'type-mono-metric' : 'type-section'} text-text-primary`}>{value}</p>
    </div>
  )
}

export default PatientDetailPage
