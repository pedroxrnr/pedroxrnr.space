import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import './style.css'

const redirect = (() => {
  try {
    const value = sessionStorage.getItem('redirect')
    sessionStorage.removeItem('redirect')
    return value
  } catch {
    return null
  }
})()

if (redirect) {
  try {
    history.replaceState(null, '', redirect)
  } catch {
    // redirect unreachable/cross-origin: keep the current URL
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
)
