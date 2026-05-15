// crypto.randomUUID — available natively in Chrome 92+, Firefox 95+, Safari 15.4+.
// Browsers older than these thresholds (e.g. iOS 14.x Safari) do not have it.
// crypto.getRandomValues() is universally available and used here as the entropy source.
;(function polyfillCryptoRandomUUID() {
  if (typeof crypto === 'undefined') return
  const ext = crypto as unknown as { randomUUID?: () => string }
  if (typeof ext.randomUUID === 'function') return
  ext.randomUUID = function randomUUID() {
    const d = new Uint8Array(16)
    crypto.getRandomValues(d)
    d[6] = (d[6] & 0x0f) | 0x40 // version 4
    d[8] = (d[8] & 0x3f) | 0x80 // variant RFC 4122
    const h = Array.from(d, b => b.toString(16).padStart(2, '0'))
    return (
      h.slice(0, 4).join('') + '-' +
      h.slice(4, 6).join('') + '-' +
      h.slice(6, 8).join('') + '-' +
      h.slice(8, 10).join('') + '-' +
      h.slice(10).join('')
    )
  }
})()
