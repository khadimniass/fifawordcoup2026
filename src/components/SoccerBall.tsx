// Ballon de foot SVG réutilisable (loader + décor de fond).
export function SoccerBall({
  size = 80,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="presentation"
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#0b1a13" strokeWidth="2" />
      {/* Pentagone central noir */}
      <polygon
        points="50,32 65,43 59,61 41,61 35,43"
        fill="#13212b"
      />
      {/* Pentagones périphériques (points sombres) */}
      <polygon points="50,8 60,18 50,28 40,18" fill="#13212b" />
      <polygon points="86,40 92,55 80,62 73,49" fill="#13212b" />
      <polygon points="14,40 27,49 20,62 8,55" fill="#13212b" />
      <polygon points="30,80 41,72 50,82 38,92" fill="#13212b" />
      <polygon points="70,80 62,72 50,82 62,92" fill="#13212b" />
      {/* Coutures */}
      <g stroke="#0b1a13" strokeWidth="1.5" fill="none" opacity="0.6">
        <line x1="50" y1="28" x2="50" y2="32" />
        <line x1="65" y1="43" x2="73" y2="49" />
        <line x1="35" y1="43" x2="27" y2="49" />
        <line x1="59" y1="61" x2="62" y2="72" />
        <line x1="41" y1="61" x2="38" y2="72" />
      </g>
    </svg>
  )
}
