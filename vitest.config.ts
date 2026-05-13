import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Vitest configuration for PharmacyOS
// Run: npm test (interactive) | npm run test:run (CI) | npm run test:coverage
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/types/**',
      ],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
})
