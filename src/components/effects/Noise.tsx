import { useEffect, useRef } from 'react'

export default function Noise() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const c: HTMLCanvasElement = canvas
    const g: CanvasRenderingContext2D = ctx

    let raf = 0
    let frame = 0
    const base = 24

    function resize() {
      c.width = window.innerWidth
      c.height = window.innerHeight
    }

    function draw() {
      frame++
      if (frame % 3 === 0) {
        const w = c.width
        const h = c.height
        const d = g.createImageData(w, h)
        const data = d.data
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255
          data[i] = v
          data[i + 1] = v
          data[i + 2] = v
          data[i + 3] = base
        }
        g.putImageData(d, 0, 0)
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="noise-overlay" aria-hidden="true" />
}
