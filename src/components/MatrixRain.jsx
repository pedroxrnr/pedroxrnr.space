import { useEffect, useRef } from 'react'

const FONT_SIZE = 14
const FADE_ALPHA = 0.04
const SPEED_MIN = 0.4
const SPEED_MAX = 1.6
const RESET_CHANCE = 0.975
const CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789'

export default function MatrixRain({ active = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    let columns, drops, speeds
    let animId

    function init() {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.floor(width / FONT_SIZE)
      drops = Array.from({ length: columns }, () => Math.random() * -height / FONT_SIZE)
      speeds = Array.from({ length: columns }, () => SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN))
      ctx.clearRect(0, 0, width, height)
    }

    function draw() {
      animId = requestAnimationFrame(draw)

      ctx.globalAlpha = FADE_ALPHA
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)
      ctx.globalAlpha = 1

      ctx.font = FONT_SIZE + 'px monospace'

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE

        ctx.fillStyle = '#A78BFA'
        ctx.globalAlpha = 0.6
        ctx.fillText(char, x, y)
        ctx.globalAlpha = 1

        drops[i] += speeds[i]

        if (drops[i] * FONT_SIZE > canvas.height / dpr && Math.random() > RESET_CHANCE) {
          drops[i] = Math.random() * -20
          speeds[i] = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
        }
      }
    }

    init()
    draw()

    let lastWidth = canvas.offsetWidth
    const onResize = () => {
      if (canvas.offsetWidth !== lastWidth) {
        lastWidth = canvas.offsetWidth
        init()
      }
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        opacity: 0.1,
      }}
    />
  )
}