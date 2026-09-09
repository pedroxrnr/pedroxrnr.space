import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const d = new Date()
const LAST_UPDATE =
  `${String(d.getFullYear()).padStart(4, '0')}-` +
  `${String(d.getMonth() + 1).padStart(2, '0')}-` +
  `${String(d.getDate()).padStart(2, '0')}`

export default defineConfig({
  plugins: [react()],
  define: {
    __LAST_UPDATE__: JSON.stringify(LAST_UPDATE),
  },
})
