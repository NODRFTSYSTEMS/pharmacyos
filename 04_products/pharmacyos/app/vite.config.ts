import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
//
// ─── Deployment targets ───────────────────────────────────────────────────────
//
// VERCEL (primary)
//   base: '/' — correct as-is. vercel.json handles SPA rewrites.
//   Set in Vercel dashboard → Environment Variables:
//     VITE_DEMO_MODE=true
//     VITE_SUPABASE_URL=https://your-project.supabase.co
//     VITE_SUPABASE_ANON_KEY=your-anon-key
//   Vercel auto-runs: npm install && npm run build
//
// GITHUB PAGES (secondary / preview)
//   ⚠️  Do NOT set VITE_BASE_PATH as an env var — Git Bash on Windows (MSYS2)
//   converts /pharmacyos/ to a Windows filesystem path silently.
//   Use the CLI --base flag instead:
//     MSYS_NO_PATHCONV=1 VITE_DEMO_MODE=true npx vite build --base /pharmacyos/
//   Then sync dist/ → docs/ and copy docs/index.html → docs/404.html
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
