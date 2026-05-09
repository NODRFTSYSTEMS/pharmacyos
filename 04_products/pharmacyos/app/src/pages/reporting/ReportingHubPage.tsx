import { Link } from 'react-router-dom'
import { Package, Pill, Lock, ChartLine, ArrowRight } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'

const REPORTS = [
  {
    to: '/reports/inventory',
    icon: <Package size={20} className="text-rx-received-fg" />,
    title: 'Inventory Report',
    description: 'Stock movement, shrinkage, lot expiry summary by period.',
    bgClass: 'bg-rx-received-bg',
  },
  {
    to: '/reports/dispensing',
    icon: <Pill size={20} className="text-rx-filled-fg" />,
    title: 'Dispensing Report',
    description: 'Prescription fill rates and dispensing activity.',
    bgClass: 'bg-rx-filled-bg',
  },
  {
    to: '/reports/schedule-log',
    icon: <Lock size={20} className="text-tag-schedule-fg" />,
    title: 'Schedule Log Report',
    description: 'Regulatory controlled-substance activity export — Pharmacy Act compliance.',
    bgClass: 'bg-tag-schedule-bg',
  },
  {
    to: '/reports/revenue',
    icon: <ChartLine size={20} className="text-tag-nhf-fg" />,
    title: 'Revenue Report',
    description: 'Sales and payment-method breakdown by period.',
    bgClass: 'bg-tag-nhf-bg',
  },
]

export function ReportingHubPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reports"
        subtitle="Pick a report type — date range and filters apply on the report page"
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {REPORTS.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group bg-bg-surface rounded-card shadow-card p-5 hover:shadow-card-hover hover:border-primary border border-transparent transition-all flex items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-control ${r.bgClass} flex items-center justify-center shrink-0`}>
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="type-card-title text-text-primary">{r.title}</p>
                  <ArrowRight size={16} className="text-text-disabled group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-text-secondary leading-snug">{r.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ReportingHubPage
