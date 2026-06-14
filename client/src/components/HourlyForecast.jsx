import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import GlassCard from './GlassCard';

const HourlyForecast = ({ hourly = [], unit = 'C' }) => {
  
  const formatTemp = (val) => {
    if (unit === 'F') {
      return `${Math.round(val * 1.8 + 32)}°`;
    }
    return `${Math.round(val)}°`;
  };

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} />;
      case 'cloudy':
      case 'overcast':
        return <Cloud size={20} className="text-tertiary" style={{ color: 'var(--tertiary)' }} />;
      case 'rainy':
      case 'rain':
      case 'drizzle':
        return <CloudRain size={20} className="text-primary" style={{ color: 'var(--primary)' }} />;
      case 'thunderstorm':
      case 'storm':
        return <CloudLightning size={20} className="text-primary" style={{ color: 'var(--primary)' }} />;
      default:
        return <Sun size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} />;
    }
  };

  return (
    <GlassCard title="Hourly Forecast">
      <div className="hourly-scroller">
        {hourly.map((item, idx) => (
          <div 
            key={idx} 
            className={`hourly-card ${idx === 0 ? 'active' : ''}`}
          >
            <span className="hourly-time">{item.time}</span>
            <div className="hourly-icon-wrap">
              {getWeatherIcon(item.condition)}
            </div>
            <span className="hourly-temp">{formatTemp(item.temp)}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default HourlyForecast;
