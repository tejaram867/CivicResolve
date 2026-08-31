import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        report: resolve(__dirname, 'report.html'),
        issues: resolve(__dirname, 'issues.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
      },
    },
  },
})
