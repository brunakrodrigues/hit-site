import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        nexus: resolve(__dirname, 'nexus.html'),
      },
    },
  },
})
