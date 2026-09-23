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
      "@/src": resolve(__dirname, "src"),
      "@/types": resolve(__dirname, "src/types"),
      "@/styles": resolve(__dirname, "src/styles"),
      "@/pages": resolve(__dirname, "src/pages"),
      "@/constants": resolve(__dirname, "src/constants"),
      "@/components": resolve(__dirname, "src/components"),
      "@/lib": resolve(__dirname, "src/lib"),
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
