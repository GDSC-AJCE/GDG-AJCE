import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Compute NODE_ENV safely (guarding against non-Node environments)
const NODE_ENV = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.NODE_ENV) ? globalThis.process.env.NODE_ENV : 'development';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Provide a minimal process.env with NODE_ENV wired from the build environment
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV)
    }
  }
})
