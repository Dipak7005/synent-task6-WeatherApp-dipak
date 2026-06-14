import React from 'react';
import { 
  Wind, 
  Sun, 
  Droplets, 
  CloudRain, 
  Sunrise, 
  Sunset, 
  Gauge, 
  Eye, 
  Activity 
} from 'lucide-react';
import GlassCard from './GlassCard';

const MetricsGrid = ({ metrics = {}, unit = 'C' }) => {
  const {
    windSpeed = 0,
    windDirection = 0,
    uvIndex = 0,
    humidity = 0,
    rainfall = 0,
    sunrise = '',
    sunset = '',
    sunProgress = 0, // 0 to 1
    aqi = 1,
    aqiValue = 0,
    visibility = 0,
    pressure = 0
  } = metrics;

  // UV Index label helper
  const getUVLabel = (val) => {
    if (val <= 2) return 'Low';
    if (val <= 5) return 'Moderate';
    if (val <= 7) return 'High';
    if (val <= 10) return 'Very High';
    return 'Extreme';
  };

  // AQI Level Helpers
  const getAQIInfo = (val) => {
    switch (val) {
      case 1:
        return { label: 'Good', class: 'aqi-level-1', desc: 'Air quality is satisfactory.' };
      case 2:
        return { label: 'Fair', class: 'aqi-level-2', desc: 'Acceptable air quality.' };
      case 3:
        return { label: 'Moderate', class: 'aqi-level-3', desc: 'Moderate health concern.' };
      case 4:
        return { label: 'Poor', class: 'aqi-level-4', desc: 'Sensitive groups may feel effects.' };
      default:
        return { label: 'Good', class: 'aqi-level-1', desc: 'Air quality is satisfactory.' };
    }
  };

  const aqiInfo = getAQIInfo(aqi);

  // Sunrise/Sunset SVG Sun coordinate calculation
  // Start point: P0=(15, 55), Control point: P1=(50, 5), End point: P2=(85, 55)
  const t = Math.min(Math.max(sunProgress, 0), 1);
  const x = (1 - t) * (1 - t) * 15 + 2 * (1 - t) * t * 50 + t * t * 85;
  const y = (1 - t) * (1 - t) * 55 + 2 * (1 - t) * t * 5 + t * t * 55;

  return (
    <div className="metrics-grid">
      {/* 1. Wind Card */}
      <GlassCard title="Wind" icon={Wind}>
        <div className="compass-container">
          <div className="compass-dial">
            <span className="compass-direction-label compass-label-n">N</span>
            <span className="compass-direction-label compass-label-e">E</span>
            <span className="compass-direction-label compass-label-s">S</span>
            <span className="compass-direction-label compass-label-w">W</span>
            <div 
              className="compass-needle-wrap"
              style={{ transform: `rotate(${windDirection}deg)` }}
            >
              <div className="compass-needle" />
              <div className="compass-needle-south" />
            </div>
            <div className="compass-center" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className="metric-highlight-val">{windSpeed}</span>
            <span className="label-sm" style={{ textTransform: 'lowercase', marginLeft: '4px' }}>km/h</span>
          </div>
        </div>
      </GlassCard>

      {/* 2. UV Index Card */}
      <GlassCard title="UV Index" icon={Sun}>
        <div className="metric-slider-layout">
          <div>
            <span className="metric-highlight-val">{uvIndex}</span>
            <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>
              {getUVLabel(uvIndex)}
            </div>
          </div>
          <div className="progress-bar-container" style={{ marginTop: '8px' }}>
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${Math.min((uvIndex / 12) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #ffc640 0%, #ff4b4b 100%)'
              }}
            />
          </div>
          <span className="body-md" style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            Protect your skin from sun exposure.
          </span>
        </div>
      </GlassCard>

      {/* 3. Air Quality Card */}
      <GlassCard title="Air Quality" icon={Activity}>
        <div className="aqi-container" style={{ padding: '8px 0' }}>
          <div>
            <span className="metric-highlight-val">{aqiValue}</span>
            <span className="label-sm" style={{ marginLeft: '6px' }}>US AQI</span>
          </div>
          <div style={{ marginTop: '4px' }}>
            <span className={`aqi-badge ${aqiInfo.class}`}>
              {aqiInfo.label}
            </span>
          </div>
          <span className="body-md" style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '8px' }}>
            {aqiInfo.desc}
          </span>
        </div>
      </GlassCard>

      {/* 4. Humidity Card */}
      <GlassCard title="Humidity" icon={Droplets}>
        <div className="metric-slider-layout">
          <div>
            <span className="metric-highlight-val">{humidity}%</span>
            <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
              The dew point is {unit === 'F' ? `${Math.round(15 * 1.8 + 32)}°` : '15°'} right now.
            </div>
          </div>
          <div className="progress-bar-container" style={{ marginTop: '8px' }}>
            <div 
              className="progress-bar-fill"
              style={{ width: `${humidity}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* 5. Sunrise / Sunset Card */}
      <GlassCard title="Sunrise & Sunset" icon={Sunrise}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div className="sunpath-container">
            <svg viewBox="0 0 100 60" className="sunpath-svg">
              {/* Backing arc */}
              <path d="M 15,55 Q 50,5 85,55" className="sunpath-line" />
              {/* Active path */}
              <path 
                d="M 15,55 Q 50,5 85,55" 
                className="sunpath-active-line" 
                style={{
                  strokeDasharray: '200',
                  strokeDashoffset: `${200 - t * 105}` // Approximate offset mapping
                }}
              />
              {/* Sun node */}
              <circle cx={x} cy={y} r="4" className="sunpath-sun" />
            </svg>
          </div>
          <div className="sunpath-time-labels">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sunrise size={12} style={{ color: 'var(--secondary)' }} />
              <span>{sunrise}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sunset size={12} style={{ color: 'var(--on-surface-variant)' }} />
              <span>{sunset}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 6. Rainfall Card */}
      <GlassCard title="Rainfall" icon={CloudRain}>
        <div className="metric-slider-layout">
          <div>
            <span className="metric-highlight-val">{rainfall} mm</span>
            <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>
              in last 24h
            </div>
          </div>
          <div className="progress-bar-container" style={{ marginTop: '8px' }}>
            <div 
              className="progress-bar-fill"
              style={{ width: `${Math.min((rainfall / 15) * 100, 100)}%` }}
            />
          </div>
          <span className="body-md" style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            {rainfall > 0 ? 'Light rain measured recently.' : 'No rainfall in the last 24h.'}
          </span>
        </div>
      </GlassCard>

      {/* 7. Extra Details: Visibility & Pressure */}
      <GlassCard title="Visibility" icon={Eye}>
        <div style={{ padding: '10px 0' }}>
          <span className="metric-highlight-val">{visibility}</span>
          <span className="label-sm" style={{ textTransform: 'lowercase', marginLeft: '4px' }}>km</span>
          <p className="body-md" style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '12px' }}>
            Clear view.
          </p>
        </div>
      </GlassCard>

      <GlassCard title="Pressure" icon={Gauge}>
        <div style={{ padding: '10px 0' }}>
          <span className="metric-highlight-val">{pressure}</span>
          <span className="label-sm" style={{ textTransform: 'lowercase', marginLeft: '4px' }}>hPa</span>
          <p className="body-md" style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '12px' }}>
            Normal barometric pressure.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default MetricsGrid;
