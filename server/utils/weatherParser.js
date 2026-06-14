/**
 * Maps OpenWeatherMap weather conditions to the dashboard themes: Sunny, Overcast Clouds, Moderate Rain, Thunderstorm
 */
const getThemeCondition = (main, description, id) => {
  const m = main?.toLowerCase() || '';
  const desc = description?.toLowerCase() || '';

  if (m === 'clear') {
    return 'Sunny';
  }
  if (m === 'clouds') {
    if (desc.includes('overcast')) {
      return 'Overcast Clouds';
    }
    return 'Cloudy';
  }
  if (m === 'rain' || m === 'drizzle' || m === 'snow') {
    return 'Moderate Rain';
  }
  if (m === 'thunderstorm') {
    return 'Thunderstorm';
  }

  // ID based fallback matching OpenWeather standard codes
  if (id >= 200 && id < 300) return 'Thunderstorm';
  if (id >= 300 && id < 600) return 'Moderate Rain';
  if (id >= 700 && id < 800) return 'Cloudy'; // Atmosphere (Mist, Smoke, Haze)
  if (id === 800) return 'Sunny';
  return 'Sunny';
};

/**
 * Parses current weather API and 5-day forecast API responses
 */
const parseWeatherData = (current, forecast) => {
  // 1. Location and Localized Date format (e.g. "Fri, October 27")
  const cityName = `${current.name}, ${current.sys.country}`;
  
  // dt is Unix timestamp in seconds
  const dateObj = new Date(current.dt * 1000);
  const options = { weekday: 'short', month: 'long', day: 'numeric' };
  const date = dateObj.toLocaleDateString('en-US', options);

  // 2. Map main weather state
  const condition = getThemeCondition(
    current.weather[0]?.main,
    current.weather[0]?.description,
    current.weather[0]?.id
  );

  // 3. Sunrise / Sunset formatted strings
  const sunriseDate = new Date(current.sys.sunrise * 1000);
  const sunsetDate = new Date(current.sys.sunset * 1000);
  
  const sunrise = sunriseDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const sunset = sunsetDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Calculate Sun progression percentage (between sunrise and sunset)
  const nowUnix = Math.floor(Date.now() / 1000);
  const totalDaylight = current.sys.sunset - current.sys.sunrise;
  let sunProgress = 0.5; // Default center fallback
  if (totalDaylight > 0) {
    sunProgress = (nowUnix - current.sys.sunrise) / totalDaylight;
    sunProgress = Math.min(Math.max(sunProgress, 0), 1);
  }

  // 4. Group 3-hour forecast lists by Calendar Date
  const dailyGroups = {};
  forecast.list.forEach((item) => {
    const dateStr = item.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
    if (!dailyGroups[dateStr]) {
      dailyGroups[dateStr] = [];
    }
    dailyGroups[dateStr].push(item);
  });

  // 5. Construct 5-day Forecast list
  const forecast5Day = [];
  const daysKeys = Object.keys(dailyGroups).sort(); // Chronological dates

  daysKeys.slice(0, 5).forEach((dateKey, index) => {
    const dayItems = dailyGroups[dateKey];
    
    // Choose the representative weather state closest to 12:00 PM (noon)
    let repItem = dayItems[0];
    let minDiff = Infinity;
    dayItems.forEach((item) => {
      const timeStr = item.dt_txt.split(' ')[1]; // "12:00:00"
      const hour = parseInt(timeStr.split(':')[0]);
      const diff = Math.abs(hour - 12);
      if (diff < minDiff) {
        minDiff = diff;
        repItem = item;
      }
    });

    // Extract maximum/minimum temperatures and maximum precip probability (pop)
    const minTemp = Math.min(...dayItems.map((item) => item.main.temp_min));
    const maxTemp = Math.max(...dayItems.map((item) => item.main.temp_max));
    const maxPop = Math.max(...dayItems.map((item) => item.pop ?? 0));

    const itemDate = new Date(repItem.dt * 1000);
    const dayLabel = index === 0 ? 'Today' : itemDate.toLocaleDateString('en-US', { weekday: 'short' });
    const dayCondition = getThemeCondition(
      repItem.weather[0]?.main,
      repItem.weather[0]?.description,
      repItem.weather[0]?.id
    );

    forecast5Day.push({
      day: dayLabel,
      condition: dayCondition,
      tempMax: maxTemp,
      tempMin: minTemp,
      precip: Math.round(maxPop * 100) // Convert 0-1 probability to 0-100%
    });
  });

  // Calculate rain chance (pop * 100 from current forecast window)
  const currentPop = forecast.list[0]?.pop ?? 0;
  const rainChance = Math.round(currentPop * 100);

  return {
    cityName,
    date,
    condition,
    temp: current.main.temp,
    feelsLike: current.main.feels_like,
    tempHigh: current.main.temp_max,
    tempLow: current.main.temp_min,
    humidity: current.main.humidity,
    visibility: current.visibility / 1000, // Meters to km
    windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
    windDirection: current.wind.deg || 0,
    rainChance,
    pressure: current.main.pressure,
    sunrise,
    sunset,
    sunProgress,
    forecast: forecast5Day
  };
};

module.exports = {
  parseWeatherData
};
