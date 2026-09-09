import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BootSequence from './components/BootSequence'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Articles from './pages/Articles'
import About from './pages/About'
import NotFound from './pages/NotFound'

const THEME_COLORS = { dark: '#100F12', light: '#F8F9FC' }

function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
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

  useScrollToTop()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
    try {
      localStorage.setItem('theme', theme)
    } catch {}
  }, [theme])

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

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