import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const LAST_UPDATE_ISO = new Date().toISOString().slice(0, 10)

export default defineConfig({
  plugins: [react()],
  define: {
    __LAST_UPDATE_ISO__: JSON.stringify(LAST_UPDATE_ISO),
  },
})
