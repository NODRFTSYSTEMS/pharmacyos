import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import {
  Skeleton,
  SkeletonRow,
  SkeletonTableRow,
  SkeletonCard,
  SkeletonMetricCard,
  SkeletonKanbanColumn,
  SkeletonFormField,
  SkeletonPageHeader,
} from './Skeleton'

describe('Skeleton primitives', () => {
  it('renders a Skeleton with default 100% width and 1rem height', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('100%')
    expect(el.style.height).toBe('1rem')
    expect(el).toHaveAttribute('aria-hidden', 'true')
  })

  it('honors width + height props', () => {
    const { container } = render(<Skeleton width="6rem" height="3.5rem" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('6rem')
    expect(el.style.height).toBe('3.5rem')
  })

  it('applies the requested rounded variant', () => {
    const variants: Array<'none' | 'control' | 'card' | 'pill' | 'full'> = [
      'none', 'control', 'card', 'pill', 'full',
    ]
    for (const v of variants) {
      const { container, unmount } = render(<Skeleton rounded={v} />)
      const el = container.firstChild as HTMLElement
      expect(el.className).toMatch(/rounded/)
      unmount()
    }
  })

  it('SkeletonRow renders one Skeleton per item', () => {
    const { container } = render(
      <SkeletonRow items={[{ width: '10%' }, { width: '20%' }, { width: '30%' }]} />,
    )
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3)
  })

  it('SkeletonTableRow renders the requested column count', () => {
    const { container } = render(<SkeletonTableRow cols={4} />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4)
  })

  it('SkeletonCard renders header + N body lines', () => {
    const { container } = render(<SkeletonCard lines={3} />)
    // 1 header + 3 body lines = 4 skeleton blocks
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4)
  })

  it('SkeletonCard with header=false renders only body lines', () => {
    const { container } = render(<SkeletonCard lines={3} header={false} />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3)
  })

  it('SkeletonMetricCard renders 3 blocks (icon + value + label)', () => {
    const { container } = render(<SkeletonMetricCard />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3)
  })

  it('SkeletonKanbanColumn renders header + 2 card stubs (1 + 3 + 3 = 7 blocks)', () => {
    const { container } = render(<SkeletonKanbanColumn />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(7)
  })

  it('SkeletonFormField renders label + input', () => {
    const { container } = render(<SkeletonFormField />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })

  it('SkeletonPageHeader renders title + optional breadcrumb', () => {
    const { container, rerender } = render(<SkeletonPageHeader />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1)
    rerender(<SkeletonPageHeader breadcrumb />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })
})
