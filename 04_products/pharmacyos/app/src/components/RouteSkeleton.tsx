import { useLocation } from 'react-router-dom'
import {
  Skeleton,
  SkeletonTableRow,
  SkeletonCard,
  SkeletonMetricCard,
  SkeletonKanbanColumn,
  SkeletonFormField,
  SkeletonPageHeader,
} from '@/components/Skeleton'

function DashboardSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <SkeletonPageHeader />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-[1.5fr_1fr] gap-6">
        <div className="space-y-3">
          <Skeleton width="40%" height="0.875rem" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonKanbanColumn key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton width="40%" height="0.875rem" />
          <SkeletonCard lines={2} header={false} />
          <SkeletonCard lines={2} header={false} />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton width="30%" height="0.875rem" />
        <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRow key={i} cols={5} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-5">
      <SkeletonPageHeader breadcrumb />
      <div className="flex items-center gap-3">
        <Skeleton width="16rem" height="2.5rem" />
        <Skeleton width="6rem" height="2rem" className="ml-auto" />
      </div>
      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonTableRow key={i} cols={6} />
        ))}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-5">
      <SkeletonPageHeader breadcrumb />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
      <SkeletonCard lines={4} />
      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonTableRow key={i} cols={5} />
        ))}
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-5 max-w-2xl">
      <SkeletonPageHeader breadcrumb />
      <div className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <Skeleton width="35%" height="1rem" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonFormField />
          <SkeletonFormField />
        </div>
        <SkeletonFormField />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonFormField />
          <SkeletonFormField />
        </div>
      </div>
      <div className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <Skeleton width="30%" height="1rem" />
        <SkeletonFormField />
        <SkeletonFormField />
      </div>
    </div>
  )
}

function KanbanSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-5">
      <SkeletonPageHeader />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonKanbanColumn key={i} />
        ))}
      </div>
    </div>
  )
}

function POSSkeleton() {
  return (
    <div className="h-full grid grid-cols-[1.5fr_1fr] divide-x divide-border bg-bg-base">
      <div className="flex flex-col min-h-0 p-6 space-y-4">
        <Skeleton width="100%" height="3.5rem" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} lines={2} header={false} />
          ))}
        </div>
      </div>
      <div className="flex flex-col min-h-0 p-6 space-y-4">
        <Skeleton width="40%" height="0.875rem" />
        <Skeleton width="60%" height="0.75rem" />
        <div className="space-y-2 pt-4">
          <Skeleton width="100%" height="2.5rem" />
          <Skeleton width="100%" height="2.5rem" />
          <Skeleton width="100%" height="2.5rem" />
        </div>
        <Skeleton width="100%" height="3.5rem" className="mt-auto" />
      </div>
    </div>
  )
}

function ReportSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-5">
      <SkeletonPageHeader />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
      <SkeletonCard lines={5} />
      <div className="bg-bg-surface rounded-card shadow-card border border-border overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonTableRow key={i} cols={5} />
        ))}
      </div>
    </div>
  )
}

function CardGridSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-5">
      <SkeletonPageHeader />
      <Skeleton width="16rem" height="2.5rem" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} lines={3} />
        ))}
      </div>
    </div>
  )
}

function AuthSkeleton() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-base px-4">
      <div className="mb-10 text-center space-y-3">
        <Skeleton width="3rem" height="3rem" rounded="card" className="mx-auto" />
        <Skeleton width="8rem" height="1.25rem" className="mx-auto" />
        <Skeleton width="12rem" height="0.75rem" className="mx-auto" />
      </div>
      <div className="w-full max-w-[400px] bg-bg-surface rounded-card shadow-card p-8 space-y-4">
        <SkeletonFormField />
        <SkeletonFormField />
        <Skeleton width="100%" height="3rem" />
      </div>
    </div>
  )
}

function GenericSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center text-text-secondary text-sm p-6">
      Loading…
    </div>
  )
}

const ROUTE_PATTERNS: { test: RegExp; skeleton: React.FC }[] = [
  { test: /^\/dashboard$/, skeleton: DashboardSkeleton },
  { test: /^\/(inventory|pos\/(products|inventory|suppliers|reports|loyalty))$/, skeleton: TableSkeleton },
  { test: /^\/(inventory\/catalog|inventory\/alerts|inventory\/suppliers|prescriptions\/schedule-log|reports\/inventory|reports\/dispensing|reports\/schedule-log|reports\/revenue|ai\/queue|admin\/users|admin\/audit|admin\/security)$/, skeleton: TableSkeleton },
  { test: /^\/(inventory\/catalog\/|pos\/products\/|pos\/loyalty\/)(?!new|dashboard)/, skeleton: DetailSkeleton },
  { test: /^\/(patients\/new|inventory\/receive|prescriptions\/new|pos\/loyalty\/new|profile|admin\/settings)$/, skeleton: FormSkeleton },
  { test: /^\/prescriptions$/, skeleton: KanbanSkeleton },
  { test: /^\/patients$/, skeleton: CardGridSkeleton },
  { test: /^\/pos$/, skeleton: POSSkeleton },
  { test: /^\/reports$/, skeleton: ReportSkeleton },
  { test: /^\/pos\/loyalty\/dashboard$/, skeleton: ReportSkeleton },
  { test: /^\/(login|login\/2fa)$/, skeleton: AuthSkeleton },
]

export function RouteSkeleton() {
  const { pathname } = useLocation()
  const match = ROUTE_PATTERNS.find((p) => p.test.test(pathname))
  const SkeletonComponent = match?.skeleton ?? GenericSkeleton
  return <SkeletonComponent />
}

export default RouteSkeleton
