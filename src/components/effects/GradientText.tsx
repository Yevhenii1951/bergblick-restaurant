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
  colors = ['#b9812d', '#4c5b43', '#c4703f', '#b9812d'],
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
