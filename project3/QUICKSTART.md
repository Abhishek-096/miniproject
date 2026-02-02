# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Start Backend Server

```bash
cd server
npm start
```

Server runs on: `http://localhost:8080`

### 3. Start Frontend

In a new terminal:

```bash
npm run dev
```

App opens on: `http://localhost:5173`

## Optional: Add Weather API Key

For live weather data, get a free API key from [OpenWeatherMap](https://openweathermap.org/api) and add to `.env`:

```env
OPENWEATHER_API_KEY=your_key_here
```

Without an API key, the app works with demo data and caching.

## Test Features

1. **Search Weather**: Try searching "London", "New York", or "Tokyo"
2. **Add Favorites**: Click the heart icon to save cities
3. **Test Offline**: Stop the backend to see graceful degradation
4. **View Cached Data**: Search same city again to see caching in action

## Troubleshooting

- **Port 8080 in use**: Change PORT in `.env`
- **Port 5173 in use**: Vite will offer alternative port
- **Build fails**: Run `npm install` again
- **Backend errors**: Check Supabase connection in `.env`

## Architecture Overview

```
┌─────────────┐
│   React UI  │  (Frontend: localhost:5173)
└──────┬──────┘
       │
       ├─ Try API Call
       │
┌──────▼──────┐
│  Express    │  (Backend: localhost:8080)
│  API Server │
└──────┬──────┘
       │
       ├─ Check Cache
       │
┌──────▼──────┐
│  Supabase   │  (Database: PostgreSQL)
│  Database   │
└──────┬──────┘
       │
       ├─ Fetch if expired
       │
┌──────▼──────┐
│OpenWeather  │  (External API)
│    API      │
└─────────────┘

If API fails → Use cached data
If cache fails → Use localStorage
If all fails → Show demo data
```

## Key Files

- `src/App.tsx` - Main application
- `src/context/WeatherContext.tsx` - State management
- `server/server.js` - API server
- `server/services/weatherService.js` - Weather logic
- `.env` - Configuration

Enjoy your weather app!
