import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkipLink } from './SkipLink'

describe('SkipLink', () => {
  it('renders an anchor pointing at #main-content', () => {
    render(<SkipLink />)
    const link = screen.getByRole('link', { name: /skip to main content/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#main-content')
  })

  it('is sr-only by default and visible when focused', () => {
    render(<SkipLink />)
    const link = screen.getByRole('link', { name: /skip to main content/i })
    // sr-only visually hides until focus (peer pseudo class via Tailwind)
    expect(link.className).toMatch(/sr-only/)
    expect(link.className).toMatch(/focus:not-sr-only/)
  })
})
