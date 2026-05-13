import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: override with VITE_BASE_PATH env var for sub-path deployments.
  // Vercel (pharmacyos.vercel.app) → default '/'
  // GitHub Pages (nodrftsystems.github.io/pharmacyos) → '/pharmacyos/'
  base: process.env.VITE_BASE_PATH ?? '/',
  server: { port: 5174 },
  build: {
    // Vendor chunks prevent the entire dependency tree from landing in a single bundle.
    // Each chunk is cached independently — a React upgrade doesn't bust the Supabase cache.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          // @radix-ui intentionally omitted — it imports React; letting Rollup
          // colocate it avoids a circular-chunk warning with no size downside.
          'vendor-react':    ['react', 'react-dom', 'react-router', 'react-router-dom'],
          'vendor-query':    ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons':    ['@phosphor-icons/react'],
        },
      },
    },
  },
})
