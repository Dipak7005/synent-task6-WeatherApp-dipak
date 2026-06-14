import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import SunMoonCard from './components/SunMoonCard';
import MiddleWidgets from './components/MiddleWidgets';
import Forecast5Day from './components/Forecast5Day';
import logoImg from './assets/aerocast_logo.png';

// High-fidelity weather conditions matching the 4 screenshots for "Zocca, IT"
const SCENARIO_DATA = {
  clear: {
    cityName: 'Zocca, IT',
    date: 'Fri, October 27',
    condition: 'Sunny',
    temp: 24.5,
    feelsLike: 17,
    tempHigh: 21,
    tempLow: 14,
    humidity: 82,
    visibility: 8,
    windSpeed: 12,
    windDirection: 180,
    rainChance: 0,
    pressure: 1012,
    sunrise: '06:15 AM',
    sunset: '08:30 PM',
    sunProgress: 0.5,
    forecast: [
      { day: 'Today', condition: 'Sunny', tempMax: 24, tempMin: 16, precip: 0 },
      { day: 'Sat', condition: 'Cloudy', tempMax: 22, tempMin: 15, precip: 15 },
      { day: 'Sun', condition: 'Rainy', tempMax: 19, tempMin: 14, precip: 85 },
      { day: 'Mon', condition: 'Sunny', tempMax: 21, tempMin: 16, precip: 10 },
      { day: 'Tue', condition: 'Thunderstorm', tempMax: 18, tempMin: 13, precip: 60 }
    ]
  },
  cloudy: {
    cityName: 'Zocca, IT',
    date: 'Fri, October 27',
    condition: 'Overcast Clouds',
    temp: 16.0,
    feelsLike: 17,
    tempHigh: 21,
    tempLow: 14,
    humidity: 82,
    visibility: 8,
    windSpeed: 12,
    windDirection: 180,
    rainChance: 5,
    pressure: 1012,
    sunrise: '06:15 AM',
    sunset: '08:30 PM',
    sunProgress: 0.5,
    forecast: [
      { day: 'Today', condition: 'Cloudy', tempMax: 16, tempMin: 12, precip: 5 },
      { day: 'Sat', condition: 'Sunny', tempMax: 22, tempMin: 15, precip: 0 },
      { day: 'Sun', condition: 'Cloudy', tempMin: 20, tempMax: 14, precip: 2 },
      { day: 'Mon', condition: 'Rainy', tempMin: 14, tempMax: 10, precip: 85 },
      { day: 'Tue', condition: 'Thunderstorm', tempMax: 13, tempMin: 9, precip: 60 }
    ]
  },
  rainy: {
    cityName: 'Zocca, IT',
    date: 'Fri, October 27',
    condition: 'Moderate Rain',
    temp: 18.5,
    feelsLike: 17,
    tempHigh: 21,
    tempLow: 14,
    humidity: 82,
    visibility: 8,
    windSpeed: 12,
    windDirection: 180,
    rainChance: 85,
    pressure: 1012,
    sunrise: '06:15 AM',
    sunset: '08:30 PM',
    sunProgress: 0.5,
    forecast: [
      { day: 'Today', condition: 'Rainy', tempMax: 21, tempMin: 14, precip: 15 },
      { day: 'Sat', condition: 'Cloudy', tempMax: 20, tempMin: 15, precip: 20 },
      { day: 'Sun', condition: 'Sunny', tempMax: 23, tempMin: 16, precip: 5 },
      { day: 'Mon', condition: 'Cloudy', tempMax: 21, tempMin: 14, precip: 10 },
      { day: 'Tue', condition: 'Thunderstorm', tempMax: 18, tempMin: 12, precip: 60 }
    ]
  },
  thunderstorm: {
    cityName: 'Zocca, IT',
    date: 'Fri, October 27',
    condition: 'Thunderstorm',
    temp: 19.0,
    feelsLike: 17,
    tempHigh: 21,
    tempLow: 14,
    humidity: 82,
    visibility: 8,
    windSpeed: 12,
    windDirection: 180,
    rainChance: 95,
    pressure: 1012,
    sunrise: '06:15 AM',
    sunset: '08:30 PM',
    sunProgress: 0.5,
    forecast: [
      { day: 'Today', condition: 'Thunderstorm', tempMax: 19, tempMin: 14, precip: 95 },
      { day: 'Sat', condition: 'Cloudy', tempMax: 20, tempMin: 15, precip: 15 },
      { day: 'Sun', condition: 'Rainy', tempMax: 19, tempMin: 14, precip: 85 },
      { day: 'Mon', condition: 'Sunny', tempMax: 22, tempMin: 16, precip: 0 },
      { day: 'Tue', condition: 'Thunderstorm', tempMax: 18, tempMin: 13, precip: 60 }
    ]
  }
};

function App() {
  const [activeWeatherData, setActiveWeatherData] = useState(SCENARIO_DATA['clear']);
  const [currentTheme, setCurrentTheme] = useState('clear');
  const [unit, setUnit] = useState('C');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [triggerFlash, setTriggerFlash] = useState(false);

  // Map condition to theme
  const getThemeFromCondition = (cond) => {
    switch (cond?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return 'clear';
      case 'cloudy':
      case 'overcast':
      case 'overcast clouds':
        return 'cloudy';
      case 'rainy':
      case 'rain':
      case 'drizzle':
      case 'moderate rain':
        return 'rainy';
      case 'thunderstorm':
      case 'storm':
        return 'thunderstorm';
      default:
        return 'clear';
    }
  };

  // Fetch weather from Express backend API
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(cityName)}`);
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to fetch weather data');
      }
      const data = await res.json();
      setActiveWeatherData(data);
      setCurrentTheme(getThemeFromCondition(data.condition));
      setSearchQuery('');
    } catch (err) {
      console.error('Fetch weather error:', err.message);
      alert(`Could not fetch weather: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch default location (Zocca) on mount
  useEffect(() => {
    fetchWeatherData('Zocca');
  }, []);

  // Periodic lightning overlay flash for the thunderstorm theme
  useEffect(() => {
    if (currentTheme !== 'thunderstorm') {
      setTriggerFlash(false);
      return;
    }

    const flashTimer = setInterval(() => {
      setTriggerFlash(true);
      const offTimeout = setTimeout(() => {
        setTriggerFlash(false);
      }, 400);
      return () => clearTimeout(offTimeout);
    }, Math.random() * 5000 + 4000); // Flashes every 4 to 9 seconds

    return () => clearInterval(flashTimer);
  }, [currentTheme]);

  // Sync the theme class directly on the body element so parent elements inherit variables correctly
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  // Handle unit toggling
  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <>
      {/* Background lightning overlay */}
      <div className={`lightning-flash-overlay ${triggerFlash ? 'active' : ''}`} />

      <div className="app-container">
        {/* Header Row */}
        <header className="header-row">
          {/* Logo container */}
          <div className="aerocast-logo-box" title="AeroCast logo" style={{ overflow: 'hidden', padding: '0px' }}>
            <img 
              src={logoImg} 
              alt="AeroCast Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>

          {/* Centered pill-shaped Search Bar */}
          <div className="search-pill-wrapper">
            <Search size={16} className="search-pill-icon" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="search-pill-input"
              placeholder={loading ? 'Fetching weather details...' : 'Search city...'}
              value={searchQuery}
              disabled={loading}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  fetchWeatherData(searchQuery.trim());
                }
              }}
            />
          </div>

          {/* Right Controls */}
          <div className="header-controls">
            <button className="icon-btn" title="Toggle Temperature Unit" onClick={toggleUnit}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>°{unit}</span>
            </button>
          </div>
        </header>

        {/* Location & Date Details */}
        <section className="location-header">
          <h2 className="location-title">{activeWeatherData.cityName}</h2>
          <span className="location-date">{activeWeatherData.date}</span>
        </section>

        {/* Grid layouts */}
        <section className="top-layout-grid">
          <CurrentWeather
            temp={activeWeatherData.temp}
            condition={activeWeatherData.condition}
            feelsLike={activeWeatherData.feelsLike}
            tempHigh={activeWeatherData.tempHigh}
            tempLow={activeWeatherData.tempLow}
            humidity={activeWeatherData.humidity}
            visibility={activeWeatherData.visibility}
            unit={unit}
          />
          <SunMoonCard
            sunrise={activeWeatherData.sunrise}
            sunset={activeWeatherData.sunset}
            progress={activeWeatherData.sunProgress}
          />
        </section>

        {/* Middle row */}
        <section>
          <MiddleWidgets
            windSpeed={activeWeatherData.windSpeed}
            windDirection={activeWeatherData.windDirection}
            rainChance={activeWeatherData.rainChance}
            pressure={activeWeatherData.pressure}
            isThunderstorm={currentTheme === 'thunderstorm'}
          />
        </section>

        {/* Bottom forecast */}
        <section>
          <Forecast5Day
            forecast={activeWeatherData.forecast}
            unit={unit}
          />
        </section>
      </div>
    </>
  );
}

export default App;
