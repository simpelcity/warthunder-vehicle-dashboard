import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      "@/src": resolve(import.meta.dirname, "src"),
      "@/assets": resolve(import.meta.dirname, "src/assets"),
      "@/types": resolve(import.meta.dirname, "src/types"),
      "@/styles": resolve(import.meta.dirname, "src/styles"),
      "@/pages": resolve(import.meta.dirname, "src/pages"),
      "@/constants": resolve(import.meta.dirname, "src/constants"),
      "@/components": resolve(import.meta.dirname, "src/components"),
      "@/lib": resolve(import.meta.dirname, "src/lib"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ["color-functions", "global-builtin", "import", "if-function"]
      }
    }
  },
  server: {
    port: 5000
  },
})
