import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const d = new Date()
const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const LAST_UPDATE =
  `${String(d.getDate()).padStart(2, '0')} ${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`

export default defineConfig({
  plugins: [react()],
  define: {
    __LAST_UPDATE__: JSON.stringify(LAST_UPDATE),
  },
})
