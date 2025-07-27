import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins = [
    vue(),
    tailwindcss(),
  ]

  // Only add dev tools in development mode
  if (command === 'serve' || mode === 'development') {
    plugins.push(vueDevTools())
  }

  // Use relative paths for flexible deployment
  const base = process.env.VITE_BASE_PATH || './'

  // Set output directory based on mode
  const outDir = mode === 'github' ? 'docs' : 'dist'

  return {
    base,
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      outDir,
      // Production optimizations
      minify: 'esbuild',
      assetsDir: 'assets',
      cssCodeSplit: false, // Keep all CSS in a single file to prevent FOUC
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'chart.js', 'vue-chartjs']
          },
          // Ensure CSS loads before JS
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          }
        }
      }
    },
    define: {
      // Ensure Vue runs in production mode
      __VUE_PROD_DEVTOOLS__: false,
    }
  }
})
