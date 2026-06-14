# AeroCast Weather Dashboard (Atmospheric Intelligence)

A modern, high-fidelity full-stack Weather Dashboard featuring dynamic, data-driven visual themes that update in real time based on active weather conditions. Built using a React frontend and a Node.js/Express backend integrated with the OpenWeatherMap API.

---

## 🌟 Key Features

- **Data-Driven Visual Themes**: The interface automatically transitions its background gradient, card styles, and text contrast depending on the searched city's active weather:
  - ☀️ **Clear / Sunny**: Warm bright sky gradients (blue, green, yellow).
  - ☁️ **Cloudy / Overcast**: Soft grey/slate gradients.
  - 🌧️ **Rainy / Drizzle**: Dark navy/indigo tones with high contrast metrics.
  - ⛈️ **Thunderstorm**: Deep violet and purple gradients with randomized, periodic animated lightning flashes.
- **Glassmorphic UI Widgets**:
  - **Current Weather Panel**: Renders temperature, active conditions, and a clean 2x2 grid (Feels Like, Min/Max range, Humidity, and Visibility).
  - **Sun & Moon Daylight Curve**: Visual SVG semicircle path showing real-time solar progression from sunrise to sunset.
  - **Wind Vector Widget**: Shows speed and rotates a directional arrow based on the wind degrees vector.
  - **Rain Chance Circular Gauge**: Interactive circular SVG gauge detailing active precipitation probability.
  - **Pressure Widget**: Metric gauge showing atmospheric pressure.
  - **5-Day Forecast Row**: Horizontal scroller displaying 12:00 PM forecasts, dynamic weather icons, and storm/rain markers.
- **Global Temperature Conversion**: Toggle dynamically between Celsius (°C) and Fahrenheit (°F) across all dashboard readouts (including feels like, high/low, and forecast cards).
- **Clean Backend API Layer**: NodeExpress proxy aggregates and structures current and 5-day / 3-hour forecast API responses into a single clean JSON payload.

---

## 📂 Project Structure

```
synent-task6-WeatherApp-dipak/
├── client/                 # React Frontend (Vite)
│   ├── public/             # Static SVGs, favicon, and icons
│   ├── src/
│   │   ├── assets/         # Brand logos and assets
│   │   ├── components/     # UI widgets and modular card components
│   │   ├── App.jsx         # App router and theme manager
│   │   ├── index.css       # Core vanilla CSS design system & styles
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Node.js Express Backend
    ├── utils/
    │   └── weatherParser.js # OpenWeather response sanitizer & compiler
    ├── server.js           # Server routes and port handler
    ├── .env.example        # Environment variable template
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed locally (v16+ recommended).
- An API Key from [OpenWeatherMap](https://openweathermap.org/api) (Free Tier is sufficient).

### 1. Server Configuration
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and configure your API key:
   ```env
   PORT=5000
   OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
   ```
5. Start the backend development server (starts on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 2. Client Configuration
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the client Vite development server (starts on `http://localhost:5173`):
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173` to explore the dashboard.

---

## 📡 API Reference

### Get City Weather Info
Returns parsed, formatted weather metrics for a given city query.

- **URL**: `/api/weather`
- **Method**: `GET`
- **Query Params**:
  - `city` [string] (Required) - Name of the city to lookup (e.g. `London`, `Tokyo`, `Zocca`).
- **Response Format**: `JSON`

**Example Response**:
```json
{
  "cityName": "Zocca, IT",
  "date": "Fri, October 27",
  "condition": "Sunny",
  "temp": 24.5,
  "feelsLike": 17,
  "tempHigh": 21,
  "tempLow": 14,
  "humidity": 82,
  "visibility": 8,
  "windSpeed": 12,
  "windDirection": 180,
  "rainChance": 0,
  "pressure": 1012,
  "sunrise": "06:15 AM",
  "sunset": "08:30 PM",
  "sunProgress": 0.5,
  "forecast": [
    { "day": "Today", "condition": "Sunny", "tempMax": 24, "tempMin": 16, "precip": 0 },
    { "day": "Sat", "condition": "Cloudy", "tempMax": 22, "tempMin": 15, "precip": 15 },
    ...
  ]
}
```