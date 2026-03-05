import React from 'react';

interface GELogoProps {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  showTagline?: boolean;
  gradientStart?: string;
  gradientEnd?: string;
}

/**
 * GELogo - Custom stylized GeoEngage logo (Web Version)
 *
 * Features:
 * - Modern stylized "GE" letters with rounded edges
 * - Location pin dot inside the G curve
 * - Purple→Cyan gradient fill
 * - Pulsing animation on the location dot using CSS Keyframes
 * - Optional tagline text
 */
const GELogo: React.FC<GELogoProps> = ({
  size = 120,
  animated = true,
  showText = false,
  showTagline = false,
  gradientStart = '#8B5CF6',
  gradientEnd = '#06B6D4',
}) => {
  // Calculate dimensions
  const viewBoxSize = 230;
  const textHeight = showText ? 35 : 0;
  const taglineHeight = showTagline ? 20 : 0;
  const totalHeight = size + textHeight + taglineHeight;

  // SVG paths for stylized G and E - BOLD/THICK version
  const gPath = `
    M 80 25
    C 30 25, 5 55, 5 100
    C 5 145, 30 175, 80 175
    C 115 175, 140 155, 145 125
    L 145 95
    L 85 95
    L 85 115
    L 120 115
    C 115 145, 100 155, 80 155
    C 45 155, 25 130, 25 100
    C 25 70, 45 45, 80 45
    C 100 45, 118 55, 130 72
    L 148 55
    C 132 32, 108 25, 80 25
    Z
  `;

  const ePath = `
    M 165 25
    L 165 175
    L 220 175
    L 220 155
    L 190 155
    L 190 110
    L 215 110
    L 215 90
    L 190 90
    L 190 45
    L 220 45
    L 220 25
    Z
  `;

  // Blue dot position inside G (centered in the G's inner curve)
  const dotCenterX = 58;
  const dotCenterY = 100;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: totalHeight
      }}
    >
      {/* Inject CSS keyframes for the web animation equivalent of the RN interpolations */}
      {animated && (
        <style>
          {`
            @keyframes pulseRing1 {
              0%, 100% { r: 14px; opacity: 0.6; }
              50% { r: 24px; opacity: 0; }
            }
            @keyframes pulseRing2 {
              0%, 100% { r: 20px; opacity: 0.3; }
              50% { r: 32px; opacity: 0; }
            }
            .ge-animated-ring-1 {
              animation: pulseRing1 2s infinite ease-in-out;
            }
            .ge-animated-ring-2 {
              animation: pulseRing2 2s infinite ease-in-out;
            }
          `}
        </style>
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>

          <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor={gradientEnd} />
            <stop offset="100%" stopColor={gradientStart} />
          </linearGradient>

          <linearGradient id="accentGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientEnd} />
            <stop offset="100%" stopColor={gradientStart} />
          </linearGradient>
        </defs>

        <g>
          {/* Shadow/glow layer */}
          <path
            d={gPath}
            fill="rgba(139, 92, 246, 0.3)"
            transform="translate(2, 2)"
          />
          <path
            d={ePath}
            fill="rgba(6, 182, 212, 0.3)"
            transform="translate(2, 2)"
          />

          {/* Main G letter */}
          <path d={gPath} fill="url(#logoGradient)" />

          {/* Main E letter */}
          <path d={ePath} fill="url(#logoGradient)" />

          {/* Outer pulse ring 2 */}
          {animated && (
            <circle
              cx={dotCenterX}
              cy={dotCenterY}
              className="ge-animated-ring-2"
              fill="none"
              stroke={gradientEnd}
              strokeWidth="1.5"
            />
          )}

          {/* Outer pulse ring 1 */}
          {animated && (
            <circle
              cx={dotCenterX}
              cy={dotCenterY}
              className="ge-animated-ring-1"
              fill="none"
              stroke={gradientEnd}
              strokeWidth="2"
            />
          )}

          {/* Blue dot outer glow */}
          <circle cx={dotCenterX} cy={dotCenterY} r="12" fill="rgba(6, 182, 212, 0.3)" />
          
          {/* Blue dot main circle */}
          <circle cx={dotCenterX} cy={dotCenterY} r="9" fill={gradientEnd} />
          
          {/* Blue dot inner highlight */}
          <circle cx={dotCenterX - 2} cy={dotCenterY - 2} r="2.5" fill="rgba(255, 255, 255, 0.6)" />
        </g>
      </svg>

      {/* GeoEngage text */}
      {showText && (
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
          <svg width={size * 1.2} height={50} viewBox="0 0 240 50" xmlns="http://www.w3.org/2000/svg">
            <text
              x="120"
              y="35"
              textAnchor="middle"
              fontSize="32"
              fontWeight="bold"
              fontFamily="System, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            >
              <tspan fill="#8B9FF6">Geo</tspan>
              <tspan fill="#06B6D4">Engage</tspan>
            </text>
          </svg>
        </div>
      )}

      {/* Tagline */}
      {showTagline && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <svg width={size * 1.5} height={28} viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg">
            <text
              x="150"
              y="22"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="16"
              fontFamily="System, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            >
              Navigate Indoors. Discover More.
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default GELogo;
