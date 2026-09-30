import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],

    // Relative base so the built app can be served from any sub-path.
    base: './',

    server: {
      port: Number(env.VITE_PORT) || 5173,
      // Dev-only proxy: keeps the browser on one origin, so the backend's
      // CORS configuration does not have to allow localhost:5173 and no
      // absolute API URL is ever baked into the bundle.
      proxy: {
        '/api': {
          target: env.PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
  }
})
