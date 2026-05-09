import { useNavigate } from 'react-router-dom'
import { Plus } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { SAMPLE_STOCK } from '@/data/sample'

/**
 * Drug catalog — distinct from Stock Overview: catalog is the SKU master
 * (drug + DIN + supplier + unit cost), independent of current stock levels.
 * Real implementation pulls from `drugs` table via Supabase; sample fallback
 * uses SAMPLE_STOCK uniqued by DIN.
 */

const CATALOG = Array.from(new Map(SAMPLE_STOCK.map((s) => [s.din, s])).values())

export function CatalogPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Drug Catalog"
        subtitle={`${CATALOG.length} SKUs registered`}
        cta={
          <Button variant="primary" size="md">
            <Plus size={16} weight="bold" />
            Add Drug
          </Button>
        }
      />
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 z-10 bg-bg-subtle border-b border-border">
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Drug Name</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">DIN</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Default Supplier</th>
                <th scope="col" className="h-9 px-4 text-right type-caption text-text-secondary">Unit Cost (JMD)</th>
                <th scope="col" className="h-9 px-4 text-left type-caption text-text-secondary">Schedule</th>
              </tr>
            </thead>
            <tbody>
              {CATALOG.map((item) => (
                <tr
                  key={item.din}
                  onClick={() => navigate(`/inventory/catalog/${item.din}`)}
                  className="h-11 border-b border-border-subtle hover:bg-bg-subtle transition-colors cursor-pointer"
                >
                  <td className="px-4 type-body-sm text-text-primary">{item.drug}</td>
                  <td className="px-4 type-mono-data text-text-secondary">{item.din}</td>
                  <td className="px-4 type-body-xs text-text-secondary">{item.supplier}</td>
                  <td className="px-4 type-mono-data text-text-primary text-right">{item.unitCostJmd.toLocaleString()}</td>
                  <td className="px-4">
                    {item.isSchedule ? <StatusPill variant="schedule">SCHEDULED</StatusPill> : <span className="type-body-xs text-text-disabled">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default CatalogPage
