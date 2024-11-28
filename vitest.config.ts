// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'


export default defineConfig({
  test: {
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    setupFiles: "./src/test/setup.ts",
    environment: "happy-dom",
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
  }
  
})