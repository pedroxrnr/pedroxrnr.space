import { useState, useEffect, useCallback } from 'react'

const BOOT_LINES = [
  { text: '[    0.000000] PEDRØXRNR v2.0.0', ok: false },
  { text: '[    0.241337] Mounting root filesystem... done', ok: true },
  { text: '[    0.380012] Starting network services... done', ok: true },
  { text: '[    0.510823] Loading environment... done', ok: true },
  { text: '[    0.650441] Initializing portfolio... done', ok: true },
  { text: '[    0.781200] System ready. Launching workspace...', ok: false },
]

const LINE_DELAY = 300
const EXIT_DELAY = 500
const STORAGE_KEY = 'boot-seen-v1'
const EXIT_TRANSITION_MS = 400

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [bootSeen] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const skip = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    setIsExiting(true)
  }, [])

  useEffect(() => {
    if (bootSeen) {
      onComplete()
    }
  }, [bootSeen, onComplete])

  useEffect(() => {
    if (bootSeen) return

    const timers = BOOT_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 320 + i * LINE_DELAY)
    )

    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true')
      } catch {}
    }, 320 + BOOT_LINES.length * LINE_DELAY + EXIT_DELAY)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
    }
  }, [bootSeen])

  useEffect(() => {
    if (isExiting) {
      const t = setTimeout(onComplete, EXIT_TRANSITION_MS)
      return () => clearTimeout(t)
    }
  }, [isExiting, onComplete])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') skip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [skip])

  if (bootSeen) return null

  return (
    <div
      className={`boot-overlay ${isExiting ? 'boot-exit' : ''}`}
      role="dialog"
      aria-label="System boot"
    >
      <div className="boot-log" role="log" aria-label="Boot log">
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className={`boot-line ${i < visibleLines ? 'boot-line-visible' : ''} ${line.ok ? 'boot-ok' : ''}`}
          >
            {line.text}
          </div>
        ))}
      </div>

      <button className="boot-skip" onClick={skip} type="button">
        Skip [Enter]
      </button>
    </div>
  )
}