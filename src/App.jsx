import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BootSequence from './components/BootSequence'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Articles from './pages/Articles'
import About from './pages/About'
import NotFound from './pages/NotFound'
import { NAV_LINKS } from './nav'

const THEME_COLORS = { dark: '#100F12', light: '#F8F9FC' }

function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}

function useKeyboardShortcuts(onNavigate, onToggleTheme, enabled) {
  useEffect(() => {
    if (!enabled) return

    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 't' || e.key === 'T') {
        onToggleTheme()
        return
      }
      const idx = e.key >= '1' && e.key <= '9' ? Number(e.key) - 1 : -1
      if (idx >= 0 && idx < NAV_LINKS.length) {
        onNavigate(NAV_LINKS[idx].to)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNavigate, onToggleTheme, enabled])
}

function getInitialTheme() {
  try {
    return localStorage.getItem('theme') || 'dark'
  } catch {
    return 'dark'
  }
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [booted, setBooted] = useState(false)
  const navigate = useNavigate()

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  useScrollToTop()
  useKeyboardShortcuts(navigate, toggleTheme, booted)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
  }, [theme])

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}