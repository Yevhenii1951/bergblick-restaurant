import { useRef, type ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  className?: string
  strength?: number
}

export default function Magnet({ children, className = '', strength = 30 }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    el.style.transform = `translate(${x * (strength / 100)}px, ${y * (strength / 100)}px)`
  }

  function onLeave() {
    const el = ref.current
    if (el) el.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.2s ease-out', transformOrigin: 'center', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
