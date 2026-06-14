import React from 'react';
import { Navigation, Droplet, ChevronsUpDown, Zap } from 'lucide-react';

const MiddleWidgets = ({ windSpeed = 12, windDirection = 0, rainChance = 0, pressure = 1012, isThunderstorm = false }) => {
  // Navigation pointer angle alignment (Navigation icon defaults pointing top-right 45deg)
  const rotationAngle = windDirection - 45;

  // Svg circular gauge circumference parameters
  // Radius of 15.9155 makes the circumference exactly 100 units
  const strokeDashoffset = 100 - rainChance;

  return (
    <div className="middle-layout-grid">
      {/* 1. Wind Speed */}
      <div className="redesign-glass-card">
        <div className="middle-card-content">
          <div className="middle-card-left">
            <span className="middle-card-title">Wind Speed</span>
            <span className="middle-card-value">{windSpeed} km/h</span>
          </div>
          <div 
            className="widget-circle-icon"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
            title={`Wind Direction: ${windDirection}°`}
          >
            <Navigation size={18} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* 2. Rain Chance (Gauge with droplet/lightning inside) */}
      <div className="redesign-glass-card">
        <div className="middle-card-content">
          <div className="middle-card-left">
            <span className="middle-card-title">{isThunderstorm ? 'Storm Chance' : 'Rain Chance'}</span>
            <span className="middle-card-value">{rainChance}%</span>
          </div>
          <div className="rain-gauge-container">
            <svg viewBox="0 0 36 36" style={{ width: '44px', height: '44px' }}>
              {/* Background circle track */}
              <path
                className="rain-gauge-bg-circle"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Active filled track */}
              <path
                className="rain-gauge-fill-circle"
                strokeDasharray="100"
                strokeDashoffset={strokeDashoffset}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="rain-gauge-inner-node">
              {isThunderstorm ? (
                <Zap size={14} fill="currentColor" style={{ color: 'var(--accent-color)' }} />
              ) : (
                <Droplet size={14} fill="currentColor" style={{ color: 'var(--accent-color)' }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pressure */}
      <div className="redesign-glass-card">
        <div className="middle-card-content">
          <div className="middle-card-left">
            <span className="middle-card-title">Pressure</span>
            <span className="middle-card-value">{pressure} hPa</span>
          </div>
          <div className="widget-circle-icon">
            <ChevronsUpDown size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddleWidgets;
