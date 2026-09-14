import { useState, useEffect, useCallback, useRef } from 'react'
import { useI18n } from '../i18n/useI18n'

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
  const skipButtonRef = useRef(null)
  const { t } = useI18n()

  const skip = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // sessionStorage unavailable (private mode, etc.)
    }
    setIsExiting(true)
  }, [])

  useEffect(() => {
    if (bootSeen) {
      onComplete()
    }
  }, [bootSeen, onComplete])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    skipButtonRef.current?.focus()

    return () => {
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }
    }
  }, [])

  useEffect(() => {
    if (bootSeen) return

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) return

    const timer = setTimeout(skip, 0)
    return () => clearTimeout(timer)
  }, [bootSeen, skip])

  useEffect(() => {
    if (bootSeen) return

    const timers = BOOT_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 320 + i * LINE_DELAY)
    )

    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        // sessionStorage unavailable (private mode, etc.)
      }
    }, 320 + BOOT_LINES.length * LINE_DELAY + EXIT_DELAY)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
    }
  }, [bootSeen])

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(onComplete, EXIT_TRANSITION_MS)
      return () => clearTimeout(timer)
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
      aria-modal="true"
      aria-label={t('boot.dialogLabel')}
    >
      <div className="boot-log" role="log" aria-label={t('boot.logLabel')}>
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className={`boot-line ${i < visibleLines ? 'boot-line-visible' : ''} ${line.ok ? 'boot-ok' : ''}`}
          >
            {line.text}
          </div>
        ))}
      </div>

      <button className="boot-skip" onClick={skip} type="button" ref={skipButtonRef}>
        {t('boot.skip')}
      </button>
    </div>
  )
}