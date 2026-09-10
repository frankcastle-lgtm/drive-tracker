import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['fiscal-roman-centered-gamecube.trycloudflare.com']
  }
})