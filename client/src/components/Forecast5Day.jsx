import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Droplet, Zap } from 'lucide-react';

const Forecast5Day = ({ forecast = [], unit = 'C' }) => {
  
  const formatTemp = (val) => {
    if (unit === 'F') {
      return `${Math.round(val * 1.8 + 32)}°`;
    }
    return `${Math.round(val)}°`;
  };

  const getWeatherIcon = (condition) => {
    const size = 32;
    const strokeWidth = 1.8;
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun size={size} strokeWidth={strokeWidth} style={{ color: '#ffc640' }} />;
      case 'cloudy':
      case 'overcast':
      case 'overcast clouds':
        return <Cloud size={size} strokeWidth={strokeWidth} style={{ color: 'var(--text-secondary)' }} />;
      case 'rainy':
      case 'rain':
      case 'drizzle':
      case 'moderate rain':
        return <CloudRain size={size} strokeWidth={strokeWidth} style={{ color: 'var(--accent-color)' }} />;
      case 'thunderstorm':
      case 'storm':
        return <CloudLightning size={size} strokeWidth={strokeWidth} style={{ color: 'var(--accent-color)' }} />;
      default:
        return <Sun size={size} strokeWidth={strokeWidth} style={{ color: '#ffc640' }} />;
    }
  };

  return (
    <div className="forecast-section">
      <span className="forecast-section-title">5-Day Forecast</span>
      <div className="forecast-cards-row">
        {forecast.map((dayData, index) => {
          const isStorm = dayData.condition?.toLowerCase().includes('storm') || dayData.condition?.toLowerCase().includes('thunder');
          
          return (
            <div key={index} className="forecast-day-card">
              <div>
                <div className="forecast-day-card-time">{dayData.day === 'Today' ? 'Today' : dayData.day}</div>
                <div className="forecast-day-card-subtime">12:00 PM</div>
              </div>

              <div className="forecast-day-card-icon">
                {getWeatherIcon(dayData.condition)}
              </div>

              <div className="forecast-day-card-temp">
                {formatTemp(dayData.tempMax)} / {formatTemp(dayData.tempMin)}
              </div>

              <div className="forecast-day-card-precip">
                {isStorm ? (
                  <Zap size={12} fill="currentColor" style={{ color: 'var(--accent-color)' }} />
                ) : (
                  <Droplet size={12} fill="currentColor" style={{ color: 'var(--accent-color)' }} />
                )}
                <span>{dayData.precip ?? 0}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast5Day;
