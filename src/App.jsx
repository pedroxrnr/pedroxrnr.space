import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MatrixRain from './components/MatrixRain'
import BootSequence from './components/BootSequence'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Articles from './pages/Articles'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  const [booted, setBooted] = useState(false)

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      <MatrixRain active={booted} />
      <Header />
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
