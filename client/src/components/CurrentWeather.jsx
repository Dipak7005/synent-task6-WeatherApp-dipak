import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

const CurrentWeather = ({ 
  temp, 
  condition, 
  feelsLike, 
  tempHigh, 
  tempLow, 
  humidity, 
  visibility, 
  unit = 'C' 
}) => {
  
  const formatTemp = (val) => {
    if (unit === 'F') {
      return `${Math.round(val * 1.8 + 32)}°`;
    }
    return `${Math.round(val * 10) / 10}°`;
  };

  // Weather icon next to temperature (for cloudy, rainy, storm)
  const renderWeatherIcon = () => {
    const size = 64;
    const strokeWidth = 1.8;
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        // No icon is rendered next to the temperature in the clear sky image
        return null;
      case 'cloudy':
      case 'overcast':
      case 'overcast clouds':
        return <Cloud size={size} strokeWidth={strokeWidth} style={{ color: 'var(--text-primary)' }} />;
      case 'rainy':
      case 'rain':
      case 'drizzle':
      case 'moderate rain':
        return <CloudRain size={size} strokeWidth={strokeWidth} style={{ color: 'var(--accent-color)' }} />;
      case 'thunderstorm':
      case 'storm':
        return <CloudLightning size={size} strokeWidth={strokeWidth} style={{ color: 'var(--accent-color)' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="redesign-glass-card current-weather-card">
      <div className="current-weather-content">
        {/* Left Side: Weather Icon, Temperature & Description */}
        <div className="current-weather-left">
          <div className="temp-row">
            {renderWeatherIcon()}
            <span className="temp-large-val">{formatTemp(temp)}</span>
          </div>
          <span className="desc-subtext">{condition}</span>
        </div>

        {/* Divider */}
        <div className="current-weather-vertical-divider" />

        {/* Right Side: 2x2 details grid */}
        <div className="weather-details-2x2">
          <div className="detail-item-col">
            <span className="detail-item-label">Feels Like</span>
            <span className="detail-item-value">{formatTemp(feelsLike)}</span>
          </div>

          <div className="detail-item-col">
            <span className="detail-item-label">Max / Min</span>
            <span className="detail-item-value">
              {formatTemp(tempHigh)} / {formatTemp(tempLow)}
            </span>
          </div>

          <div className="detail-item-col">
            <span className="detail-item-label">Humidity</span>
            <span className="detail-item-value">{humidity}%</span>
          </div>

          <div className="detail-item-col">
            <span className="detail-item-label">Visibility</span>
            <span className="detail-item-value">{visibility} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
