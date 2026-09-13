import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
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
  history.replaceState(null, '', redirect)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)