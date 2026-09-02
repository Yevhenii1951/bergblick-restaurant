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
  colors = ['#5c7a4a', '#c05b3c', '#d9a03a', '#5c7a4a'],
  animationSpeed = 8,
  showBorder = false,
  style = {},
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
    ...style,
  } as React.CSSProperties

  return (
    <span
      className={`bg-clip-text bg-[length:200%_auto] animate-gradient text-transparent ${className}`}
      style={gradientStyle}
    >
      {children}
    </span>
  )
}
