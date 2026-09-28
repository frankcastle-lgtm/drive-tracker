import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['librarian-wide-celtic-national.trycloudflare.com']
  }
})