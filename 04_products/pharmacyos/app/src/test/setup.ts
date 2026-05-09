import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// jsdom doesn't implement scrollIntoView; stub it so components that call it during effects don't crash.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {}
}
