import React from 'react';

interface IdeasLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  glyphColor?: string;
}

export const IdeasLogo: React.FC<IdeasLogoProps> = ({
  className = '',
  size = 'md',
  glyphColor = '#59B828',
  textColor = '#59B828'
}) => {
  const heights = {
    sm: 26,
    md: 38,
    lg: 52,
    xl: 66
  };

  const h = heights[size] || 38;
  const w = Math.round(h * 3.6);

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 210 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="Ideas Logo"
      >
        {/* 4-Leaf Emblem Grid */}
        <g transform="translate(0, 3)">
          {/* Top-Left */}
          <rect x="2" y="2" width="18" height="19" rx="7" fill={glyphColor} />
          {/* Top-Right */}
          <rect x="23" y="2" width="18" height="19" rx="7" fill={glyphColor} />
          {/* Bottom-Left */}
          <rect x="2" y="24" width="18" height="19" rx="7" fill={glyphColor} />
          {/* Bottom-Right */}
          <rect x="23" y="24" width="18" height="19" rx="7" fill={glyphColor} />
        </g>

        {/* Wordmark "ideas" in heavy rounded sans */}
        <text
          x="49"
          y="42"
          fill={textColor}
          fontFamily="'Plus Jakarta Sans', 'Arial Black', Arial, sans-serif"
          fontWeight="900"
          fontSize="46"
          letterSpacing="-2px"
        >
          ideas
        </text>

        {/* Registered Symbol ® */}
        <g transform="translate(180, 11)">
          <circle cx="6" cy="6" r="5.5" stroke={textColor} strokeWidth="1.3" fill="none" />
          <text
            x="6"
            y="8.8"
            fill={textColor}
            fontFamily="Arial, sans-serif"
            fontWeight="800"
            fontSize="6.5"
            textAnchor="middle"
          >
            R
          </text>
        </g>
      </svg>
    </div>
  );
};
