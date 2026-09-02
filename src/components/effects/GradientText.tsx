interface GradientTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
  style?: React.CSSProperties
}

export default function GradientText({
  children,
  className = '',
  colors = ['#6b8347', '#b9803a', '#d9a03a', '#6b8347'],
  animationSpeed = 8,
  showBorder = false,
  style = {},
}: GradientTextProps) {
  const titleStyle = {
    color: colors[1] ?? colors[0] ?? '#5d4931',
    animationDuration: `${animationSpeed}s`,
    ...style,
  } as React.CSSProperties

  return (
    <span
      className={`section-title-text ${showBorder ? 'section-title-bordered' : ''} ${className}`}
      style={titleStyle}
    >
      {children}
    </span>
  )
}
