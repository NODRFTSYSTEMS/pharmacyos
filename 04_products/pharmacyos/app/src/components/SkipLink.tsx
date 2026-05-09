/**
 * SkipLink — WCAG 2.4.1 Bypass Blocks.
 * Visible only on focus; first tabbable element in each layout.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-control focus:bg-primary focus:text-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
    >
      Skip to main content
    </a>
  )
}
