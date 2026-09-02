import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

interface TextLoopProps {
  text: string
  className?: string
  fontSize?: number
  durability?: number
}

function wavePath(id: string, textLength: number) {
  const width = 1200
  const height = 160
  const amp = 40
  const period = 300
  const d: string[] = []
  d.push(`M 0 ${height / 2}`)
  for (let x = 0; x <= width; x += 10) {
    const y = height / 2 + Math.sin((x / period) * Math.PI * 2) * amp
    d.push(`L ${x} ${y}`)
  }
  return d.join(' ')
}

export default function TextLoop({ text, className = '', fontSize = 44, durability = 90 }: TextLoopProps) {
  const id = useId()
  const pathId = `tl-path-${id.replace(/[^a-zA-Z0-9-]/g, '')}`
  const textPathRef = useRef<SVGTextPathElement>(null)

  useEffect(() => {
    const el = textPathRef.current
    if (!el) return
    const tl = gsap.to(el, {
      startOffset: '50%',
      duration: durability / 10,
      ease: 'none',
      repeat: -1,
    })
    return () => {
      tl.kill()
    }
  }, [durability])

  // fill the path with a repeated phrase for a seamless loop (2 copies)
  const repeated = `${text}  ✦  ${text}  ✦  ${text}  ✦  ${text}`

  return (
    <svg
      viewBox="0 0 1200 160"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <path id={pathId} d={wavePath(pathId, repeated.length)} fill="none" />
      </defs>
      <text style={{ fontSize, fontWeight: 700, letterSpacing: 4 }}>
        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0%">
          {repeated}
        </textPath>
      </text>
    </svg>
  )
}
