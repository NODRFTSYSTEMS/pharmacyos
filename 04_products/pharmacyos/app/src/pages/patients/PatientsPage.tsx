import { Plus, MagnifyingGlass } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_PATIENTS } from '@/data/sample'

function age(dob: string) {
  const birth = new Date(dob)
  const now = new Date('2026-05-08')
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

export function PatientsPage() {
  const withAllergies = SAMPLE_PATIENTS.filter((p) => p.allergies.length > 0).length
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Patients"
        subtitle={`${SAMPLE_PATIENTS.length} on file · ${withAllergies} with documented allergies`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            New Patient
          </Button>
        }
        filterBar={
          <div className="w-full max-w-md relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search by name, NHF #, or phone…"
              className="w-full h-10 pl-9 pr-3 type-body-sm bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-shadow"
            />
          </div>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Patient</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">DOB · Age</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">NHF #</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Phone</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Allergies</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_PATIENTS.map((p) => (
                <tr key={p.id} className="h-12 border-b border-border-subtle hover:bg-bg-subtle transition-colors cursor-pointer">
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-pill bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0">
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-text-primary leading-tight">{p.name}</p>
                        <p className="type-mono-data text-text-disabled text-[10px]">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <span className="type-mono-data text-text-secondary">{p.dob}</span>
                    <span className="text-[12px] text-text-secondary"> · {age(p.dob)}</span>
                  </td>
                  <td className="px-4 type-mono-data text-text-secondary">{p.nhfNumber}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{p.phone}</td>
                  <td className="px-4">
                    {p.allergies.length === 0 ? (
                      <span className="text-[12px] text-text-disabled">None recorded</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {p.allergies.map((a) => (
                          <StatusPill key={a} variant="error">{a}</StatusPill>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 type-mono-data text-text-secondary">{p.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default PatientsPage
