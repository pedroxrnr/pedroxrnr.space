import { useState, useEffect, useRef } from 'react'

const PULSE_DELAYS = {
  green: +(Math.random() * 2).toFixed(2),
  red: +(Math.random() * 2).toFixed(2),
}

const LINES = [
  'Wake up, Pedrø...',
  'The Matrix has you.',
  'Follow the white rabbit.',
  'Knock, knock, Pedrø.',
  'Take the red pill.',
]

let REPLAYED = false

const TYPING_MS = 130
const START_MS = 600
const GAP_TICKS = 4
const TRAIL_LEN = 10

const LINE_CHARS = LINES.map((line) => [...line])
const LINE_LENGTHS = LINE_CHARS.map((chars) => chars.length)
const LINE_SPANS = LINE_LENGTHS.map((len, i) =>
  len + (i < LINES.length - 1 ? GAP_TICKS : 0)
)
const SPAN_STARTS = LINE_SPANS.map((_, i) =>
  LINE_SPANS.slice(0, i).reduce((sum, span) => sum + span, 0)
)
const TOTAL_TICKS = LINE_SPANS.reduce((sum, span) => sum + span, 0)

const GLYPHS = 'アィウェオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'

const GREEN_SEGMENTS = [
  { text: 'The ', highlight: false },
  { text: 'Matrix', highlight: true, cls: 'matrix-green', delayKey: 'green' },
  { text: ' has you.', highlight: false },
]

const RED_SEGMENTS = [
  { text: 'Take the ', highlight: false },
  { text: 'red pill', highlight: true, cls: 'matrix-red', delayKey: 'red' },
  { text: '.', highlight: false },
]

const LINE_SEGMENTS = [null, GREEN_SEGMENTS, null, null, RED_SEGMENTS]

function renderSegments(segments, shown, delays) {
  let remaining = shown
  const out = []
  segments.forEach((seg, i) => {
    const cps = [...seg.text]
    const take = Math.max(0, Math.min(remaining, cps.length))
    remaining -= take
    if (take === 0) return
    const text = cps.slice(0, take).join('')
    if (seg.highlight) {
      out.push(
        <strong
          className={seg.cls}
          key={i}
          style={{ '--pulse-delay': `${delays[seg.delayKey]}s` }}
        >
          {text}
        </strong>
      )
    } else {
      out.push(<span key={i}>{text}</span>)
    }
  })
  return out
}

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function readColors() {
  const styles = getComputedStyle(document.documentElement)
  return {
    accent: styles.getPropertyValue('--accent').trim() || '#A78BFA',
  }
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function drawStaticFrame(ctx, width, height, font, colors) {
  ctx.clearRect(0, 0, width, height)
  ctx.font = font
  ctx.fillStyle = hexToRgba(colors.accent, 0.16)
  for (let i = 0; i < width; i += 14) {
    for (let j = -8; j < 0; j += 1) {
      ctx.fillText(randomGlyph(), i, height / 2 + j * 14)
    }
  }
}

export default function MatrixRain() {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const typingRef = useRef(null)
  const [chars, setChars] = useState(REPLAYED || PREFERS_REDUCED_MOTION ? TOTAL_TICKS : 0)

  useEffect(() => {
    if (REPLAYED || PREFERS_REDUCED_MOTION) return

    const startId = setTimeout(() => {
      typingRef.current = setInterval(() => {
        setChars((c) => (c >= TOTAL_TICKS ? c : c + 1))
      }, TYPING_MS)
    }, START_MS)

    return () => {
      clearTimeout(startId)
      if (typingRef.current) {
        clearInterval(typingRef.current)
        typingRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (chars >= TOTAL_TICKS) {
      REPLAYED = true
      if (typingRef.current) {
        clearInterval(typingRef.current)
        typingRef.current = null
      }
    }
  }, [chars])

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = heroRef.current
    if (!canvas || !hero) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let colors = readColors()
    let rafId = 0
    let drops = []
    let lastWidth = 0
    let lastHeight = 0
    const font = '14px "Inconsolata", monospace'
    const fontSize = 14

    function setup() {
      const dpr = window.devicePixelRatio || 1
      const width = hero.clientWidth
      const height = hero.clientHeight
      if (width === lastWidth && height === lastHeight) return

      lastWidth = width
      lastHeight = height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      drops = Array.from({ length: Math.ceil(width / fontSize) }, () =>
        Math.floor(Math.random() * (height / fontSize))
      )

      if (PREFERS_REDUCED_MOTION) {
        drawStaticFrame(ctx, width, height, font, colors)
      }
    }

    function draw() {
      const width = hero.clientWidth
      const height = hero.clientHeight

      ctx.clearRect(0, 0, width, height)
      ctx.font = font

      for (let i = 0; i < drops.length; i += 1) {
        const x = i * fontSize
        const head = drops[i]

        ctx.fillStyle = hexToRgba(colors.accent, 0.25)
        ctx.fillText(randomGlyph(), x, head * fontSize)

        for (let k = 1; k <= TRAIL_LEN; k += 1) {
          const alpha = 0.2 * (1 - k / (TRAIL_LEN + 1))
          ctx.fillStyle = hexToRgba(colors.accent, alpha)
          ctx.fillText(randomGlyph(), x, head * fontSize - k * fontSize)
        }

        if (head * fontSize - TRAIL_LEN * fontSize > height) {
          drops[i] = -Math.floor(Math.random() * TRAIL_LEN)
        } else {
          drops[i] += 0.1 + Math.random() * 0.15
        }
      }

      if (!PREFERS_REDUCED_MOTION) {
        rafId = requestAnimationFrame(draw)
      }
    }

    const observer = new MutationObserver(() => {
      colors = readColors()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    setup()
    if (!PREFERS_REDUCED_MOTION) {
      draw()
    }

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  const rows = LINES.map((line, i) => {
    const charsArr = LINE_CHARS[i]
    const start = SPAN_STARTS[i]
    const len = charsArr.length
    const shown = Math.max(0, Math.min(len, chars - start))
    const typing = chars > start && chars <= start + len
    const allDone = chars >= TOTAL_TICKS
    const showText = charsArr.slice(0, shown).join('')
    return { line, showText, shown, typing, persistent: allDone && i === LINES.length - 1 }
  })

  return (
    <div
      className="matrix-hero"
      ref={heroRef}
      role="img"
      aria-label="Wake up, Pedrø... The Matrix has you. Follow the white rabbit. Knock, knock, Pedrø. Take the red pill."
    >
      <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />
      <div className="matrix-phrases" aria-hidden="true">
        {rows.map(({ showText, shown, typing, persistent }, i) => {
          const segments = LINE_SEGMENTS[i]
          return (
            <div className="matrix-line" key={`${i}`}>
              <span className="matrix-prompt" aria-hidden="true">&gt;</span>
              <span className="matrix-text">
                {segments ? renderSegments(segments, shown, PULSE_DELAYS) : showText}
                {typing || persistent ? <span className="matrix-cursor" /> : null}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}