import React from 'react';

const SunMoonCard = ({ sunrise = '06:15 AM', sunset = '08:30 PM', progress = 0.5 }) => {
  // Trigonometric coordinates for sun positioning on a circular arc
  // Circle Center: cx = 50, cy = 65. Radius: r = 35.
  // Progress goes from 0 (sunrise) to 1 (sunset)
  const t = Math.min(Math.max(progress, 0), 1);
  const angle = Math.PI - t * Math.PI; // from PI (180deg) to 0 (0deg)
  
  const cx = 50;
  const cy = 65;
  const r = 35;
  
  const x = cx + r * Math.cos(angle);
  const y = cy - r * Math.sin(angle); // y is inverted in SVG viewport

  // Calculate Dash offset to only draw the solid progress curve
  // Total circumference of circle = 2 * PI * 35 = 219.9
  // Semicircle arc length = PI * 35 = 109.95
  const arcLength = Math.PI * r;
  const strokeDashoffset = arcLength - t * arcLength;

  return (
    <div className="redesign-glass-card sun-moon-card">
      <span className="sun-moon-header">Sun & Moon</span>
      <div className="sun-moon-body">
        <div className="sun-path-svg-container">
          <svg viewBox="0 0 100 70" className="sun-path-canvas">
            {/* Background Dashed Arc */}
            <path 
              d="M 15,65 A 35,35 0 0,1 85,65" 
              className="sun-path-track-dash" 
            />
            {/* Foreground Solid Path representing elapsed time */}
            <path 
              d="M 15,65 A 35,35 0 0,1 85,65" 
              className="sun-path-track-solid" 
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
            />
            {/* Sun Bulb node */}
            <circle cx={x} cy={y} r="3.5" className="sun-node-bulb" />
          </svg>
        </div>
        <div className="sun-moon-times-row">
          <span>{sunrise}</span>
          <span>{sunset}</span>
        </div>
      </div>
    </div>
  );
};

export default SunMoonCard;
