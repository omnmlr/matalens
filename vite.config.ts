import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep small font subsets on the same origin under the production font policy.
    assetsInlineLimit: file => file.endsWith('.woff2') ? false : undefined,
  },
  server: {
    strictPort: true,
    proxy: { '/api': `http://127.0.0.1:${process.env.MATALENS_API_PORT ?? '3001'}` },
  },
})
