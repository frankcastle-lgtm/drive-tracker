import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['procedure-route-isaac-sculpture.trycloudflare.com']
  }
})