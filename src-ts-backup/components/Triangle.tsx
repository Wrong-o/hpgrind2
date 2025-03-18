import React from 'react'

interface TriangleProps {
  a: number | null
  b: number | null
  c: number | null
  missingLabel: 'a' | 'b' | 'c'
}

export const Triangle: React.FC<TriangleProps> = ({ a, b, c, missingLabel }) => {
  // Fixed dimensions for consistent visual size
  const BASE_WIDTH = 200
  const BASE_HEIGHT = 150

  // Calculate the coordinates for all three points of the triangle
  const points = {
    A: { x: 0, y: BASE_HEIGHT },        // Bottom-left corner (right angle)
    B: { x: BASE_WIDTH, y: BASE_HEIGHT }, // Bottom-right corner
    C: { x: 0, y: 0 }                    // Top corner
  }

  // Add padding around the triangle
  const padding = 40
  const width = BASE_WIDTH + padding * 2
  const height = BASE_HEIGHT + padding * 2

  // Calculate label positions next to their sides
  const labelPositions = {
    a: {
      x: -30,                    // Left of vertical line
      y: BASE_HEIGHT / 2         // Middle of vertical line
    },
    b: {
      x: BASE_WIDTH / 2,        // Center of horizontal line
      y: BASE_HEIGHT + 30       // Below horizontal line
    },
    c: {
      x: BASE_WIDTH * 0.6,      // Along hypotenuse
      y: BASE_HEIGHT * 0.4      // Along hypotenuse
    }
  }

  // Get the value for each side
  const getSideValue = (side: 'a' | 'b' | 'c'): string => {
    const values = { a, b, c }
    const value = values[side]
    return side === missingLabel ? '?' : (value !== null ? value.toString() : '?')
  }

  return (
    <div className="relative flex justify-center mb-4">
      <svg
        width={width}
        height={height}
        viewBox={`${-padding} ${-padding} ${width} ${height}`}
      >
        {/* Background */}
        <rect
          x={-padding}
          y={-padding}
          width={width}
          height={height}
          fill="white"
          fillOpacity="0.5"
          rx="10"
        />

        {/* Right angle marker */}
        <path
          d={`M ${points.A.x + 20} ${points.A.y} L ${points.A.x} ${points.A.y} L ${points.A.x} ${points.A.y - 20}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />

        {/* Draw all sides */}
        <line
          x1={points.A.x}
          y1={points.A.y}
          x2={points.B.x}
          y2={points.B.y}
          stroke={missingLabel === 'b' ? '#ec4899' : 'currentColor'}
          strokeWidth="2.5"
          className={missingLabel === 'b' ? 'stroke-dashed' : ''}
        />
        <line
          x1={points.A.x}
          y1={points.A.y}
          x2={points.C.x}
          y2={points.C.y}
          stroke={missingLabel === 'a' ? '#ec4899' : 'currentColor'}
          strokeWidth="2.5"
          className={missingLabel === 'a' ? 'stroke-dashed' : ''}
        />
        <line
          x1={points.B.x}
          y1={points.B.y}
          x2={points.C.x}
          y2={points.C.y}
          stroke={missingLabel === 'c' ? '#ec4899' : 'currentColor'}
          strokeWidth="2.5"
          className={missingLabel === 'c' ? 'stroke-dashed' : ''}
        />

        {/* Draw labels next to their sides */}
        {(['a', 'b', 'c'] as const).map(side => {
          const pos = labelPositions[side]
          const value = getSideValue(side)

          return (
            <g key={side}>
              <rect
                x={pos.x - 15}
                y={pos.y - 12}
                width="30"
                height="24"
                fill="white"
                fillOpacity="0.9"
                rx="4"
              />
              <text
                x={pos.x}
                y={pos.y}
                className="fill-current text-base font-bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
} 