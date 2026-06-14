const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const { parseWeatherData } = require('./utils/weatherParser');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// High-fidelity local fallback data matching the screenshots for preview testing without API key
const MOCK_SCENARIOS = {
  'zocca': {
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
  'tokyo': {
    cityName: 'Tokyo, JP',
    date: 'Fri, October 27',
    condition: 'Sunny',
    temp: 26.0,
    feelsLike: 23,
    tempHigh: 28,
    tempLow: 19,
    humidity: 45,
    visibility: 12,
    windSpeed: 8,
    windDirection: 130,
    rainChance: 0,
    pressure: 1016,
    sunrise: '04:25 AM',
    sunset: '07:00 PM',
    sunProgress: 0.72,
    forecast: [
      { day: 'Today', condition: 'Sunny', tempMax: 28, tempMin: 19, precip: 0 },
      { day: 'Sat', condition: 'Sunny', tempMax: 27, tempMin: 18, precip: 5 },
      { day: 'Sun', condition: 'Cloudy', tempMax: 24, tempMin: 17, precip: 10 },
      { day: 'Mon', condition: 'Rainy', tempMax: 21, tempMin: 16, precip: 80 },
      { day: 'Tue', condition: 'Sunny', tempMax: 26, tempMin: 18, precip: 15 }
    ]
  },
  'london': {
    cityName: 'London, GB',
    date: 'Fri, October 27',
    condition: 'Moderate Rain',
    temp: 14.0,
    feelsLike: 12,
    tempHigh: 16,
    tempLow: 11,
    humidity: 88,
    visibility: 8,
    windSpeed: 18,
    windDirection: 250,
    rainChance: 85,
    pressure: 1008,
    sunrise: '04:43 AM',
    sunset: '09:19 PM',
    sunProgress: 0.58,
    forecast: [
      { day: 'Today', condition: 'Rainy', tempMax: 16, tempMin: 11, precip: 85 },
      { day: 'Sat', condition: 'Cloudy', tempMax: 18, tempMin: 10, precip: 20 },
      { day: 'Sun', condition: 'Sunny', tempMax: 21, tempMin: 12, precip: 0 },
      { day: 'Mon', condition: 'Sunny', tempMax: 23, tempMin: 13, precip: 5 },
      { day: 'Tue', condition: 'Rainy', tempMax: 17, tempMin: 11, precip: 90 }
    ]
  },
  'mumbai': {
    cityName: 'Mumbai, IN',
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

// Weather Query Endpoint
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name query parameter is required' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const isKeyPlaceholder = !apiKey || apiKey === 'YOUR_API_KEY';

  // Fallback to high-fidelity mock data if no API Key is configured
  if (isKeyPlaceholder) {
    const key = city.toLowerCase().trim();
    const mockData = MOCK_SCENARIOS[key] || MOCK_SCENARIOS['zocca'];
    
    // Set response header to indicate mock fallback
    res.setHeader('X-Mock-Data', 'true');
    return res.json(mockData);
  }

  try {
    // 1. Fetch current weather details to retrieve coordinates (lat, lon)
    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const { lat, lon } = currentRes.data.coord;

    // 2. Fetch the 5-day / 3-hour forecast using coordinate values
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    // 3. Format raw OpenWeather data to match frontend dashboard model
    const dashboardData = parseWeatherData(currentRes.data, forecastRes.data);

    res.json(dashboardData);
  } catch (error) {
    console.error('API Fetch Error:', error.message);
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'Error communicating with OpenWeatherMap';
      return res.status(status).json({ error: message });
    }
    
    res.status(500).json({ error: 'Internal server error occurred while fetching weather data.' });
  }
});

// Start Server listener
app.listen(PORT, () => {
  console.log(`[Aerocast Server] Listening on http://localhost:${PORT}`);
  if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'YOUR_API_KEY') {
    console.log(`[Aerocast Server] Note: Running with Mock Data fallback. Replace key in server/.env to use live data.`);
  }
});
