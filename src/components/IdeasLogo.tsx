import React from 'react';

interface IdeasLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  height?: number;
  textColor?: string;
  glyphColor?: string;
  showBadge?: boolean;
}

export const IdeasLogo: React.FC<IdeasLogoProps> = ({
  className = '',
  size = 'md',
  height,
  glyphColor = '#59B828',
  textColor = '#59B828'
}) => {
  // Dimensions based on size or custom height
  const heights = {
    sm: 24,
    md: 36,
    lg: 48,
    xl: 60
  };

  const h = height || heights[size] || 36;
  const w = Math.round(h * 3.4);

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 200 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="Ideas Logo"
      >
        {/* Ideas 4-element Clover / Grid Emblem */}
        <g transform="translate(0, 4)">
          {/* Top-Left petal */}
          <rect
            x="2"
            y="2"
            width="17"
            height="18"
            rx="6"
            fill={glyphColor}
          />
          {/* Top-Right petal */}
          <rect
            x="23"
            y="2"
            width="17"
            height="18"
            rx="6"
            fill={glyphColor}
          />
          {/* Bottom-Left petal */}
          <rect
            x="2"
            y="24"
            width="17"
            height="18"
            rx="6"
            fill={glyphColor}
          />
          {/* Bottom-Right petal */}
          <rect
            x="23"
            y="24"
            width="17"
            height="18"
            rx="6"
            fill={glyphColor}
          />
        </g>

        {/* Ideas stylized typography */}
        <text
          x="50"
          y="42"
          fill={textColor}
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
          fontWeight="900"
          fontSize="44"
          letterSpacing="-1.5px"
        >
          ideas
        </text>

        {/* Registered symbol ® */}
        <circle cx="174" cy="16" r="5" stroke={textColor} strokeWidth="1.2" fill="none" />
        <text
          x="174"
          y="18.5"
          fill={textColor}
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fontSize="6"
          textAnchor="middle"
        >
          R
        </text>
      </svg>
    </div>
  );
};
