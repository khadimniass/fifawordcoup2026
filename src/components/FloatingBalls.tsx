import { useEffect, useRef, useState } from 'react'
import { SoccerBall } from './SoccerBall'

interface BallState {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rot: number
  vrot: number
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

// Décor de fond passif : de vrais ballons SVG qui flottent et rebondissent sur
// les bords (style screensaver). requestAnimationFrame + transforms, cleanup au
// unmount. N'affecte jamais le layout (fixed, pointer-events none, z-0).
export function FloatingBalls({ count = 7 }: { count?: number }) {
  // Tailles figées pour le rendu (stable, lues hors RAF).
  const [sizes] = useState(() =>
    Array.from({ length: count }, () => Math.round(rand(24, 44))),
  )
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const balls = useRef<BallState[]>([])

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const w = window.innerWidth
    const h = window.innerHeight
    balls.current = sizes.map((size) => ({
      x: rand(0, w - size),
      y: rand(0, h - size),
      vx: rand(-0.35, 0.35) || 0.25,
      vy: rand(-0.35, 0.35) || 0.25,
      size,
      rot: rand(0, 360),
      vrot: rand(-0.25, 0.25),
    }))

    let raf = 0
    const tick = () => {
      const cw = window.innerWidth
      const ch = window.innerHeight
      balls.current.forEach((b, i) => {
        b.x += b.vx
        b.y += b.vy
        b.rot += b.vrot
        if (b.x <= 0 || b.x >= cw - b.size) b.vx *= -1
        if (b.y <= 0 || b.y >= ch - b.size) b.vy *= -1
        const el = refs.current[i]
        if (el)
          el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [sizes])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {sizes.map((size, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="absolute left-0 top-0 opacity-[0.10]"
          style={{ willChange: 'transform' }}
        >
          <SoccerBall size={size} />
        </div>
      ))}
    </div>
  )
}
