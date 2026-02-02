# MERN Weather App with Graceful Degradation

A full-stack weather application built with MongoDB (Supabase), Express, React, and Node.js that demonstrates graceful degradation patterns for resilient user experiences.

## Features

### Core Functionality
- Real-time weather data fetching from OpenWeatherMap API
- City search with autocomplete
- Save and manage favorite cities
- Detailed weather information (temperature, humidity, wind speed, pressure)
- Beautiful, responsive UI with smooth animations

### Graceful Degradation Strategy

The app implements multiple layers of fallback to ensure it works even when services fail:

1. **API Layer** (Best Case)
   - Fetches live weather data from OpenWeatherMap API
   - Caches responses in Supabase database

2. **Database Cache** (API Failure)
   - Serves cached weather data from Supabase
   - Cache expires after 30 minutes
   - Shows "Cached" badge

3. **Expired Cache** (Fresh Data Unavailable)
   - Falls back to expired cache data
   - Shows warning message

4. **LocalStorage** (Database Failure)
   - Stores data in browser localStorage
   - Works completely offline

5. **Demo Mode** (Complete Failure)
   - Shows demo data for popular cities
   - Allows continued interaction

### Online/Offline Indicators
- Visual status indicator showing connection state
- Color-coded badges showing data source (Live, Cached, Demo)
- Warning messages when using fallback data

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Context API for state management
- Lucide React for icons
- Custom CSS with CSS variables

### Backend
- Node.js with Express
- Supabase (PostgreSQL) for database
- RESTful API design
- Environment-based configuration

### Database
- Supabase PostgreSQL
- Row Level Security (RLS) enabled
- Automatic cache expiration
- Indexed queries for performance

## Project Structure

```
project/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── WeatherSearch.tsx   # Search component
│   │   ├── WeatherCard.tsx     # Weather display
│   │   └── FavoritesList.tsx   # Favorites management
│   ├── context/                # State management
│   │   └── WeatherContext.tsx  # Weather context
│   ├── services/               # API services
│   │   └── api.ts             # API client
│   ├── App.tsx                # Main app component
│   └── index.css              # Styles
│
├── server/                     # Backend source
│   ├── config/                # Configuration
│   │   └── supabase.js       # Supabase client
│   ├── controllers/           # Route controllers
│   │   ├── weatherController.js
│   │   └── favoritesController.js
│   ├── services/              # Business logic
│   │   └── weatherService.js # Weather API integration
│   ├── routes/               # API routes
│   │   ├── weather.routes.js
│   │   └── favorites.routes.js
│   └── server.js            # Express server
│
└── .env                      # Environment variables
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (database is pre-configured)
- OpenWeatherMap API key (optional, works with demo data)

### Installation

1. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Configure Environment Variables**

   The `.env` file is already configured with Supabase credentials. Optionally add your OpenWeatherMap API key:

   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   ```

   Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)

3. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:8080`

4. **Start the Frontend**
   ```bash
   npm run dev
   ```
   App will open on `http://localhost:5173`

## API Endpoints

### Weather
- `GET /api/weather/:city` - Get weather for a city
- `POST /api/weather/cache/clean` - Clean expired cache

### Favorites
- `GET /api/favorites` - Get all favorite cities
- `POST /api/favorites` - Add a favorite city
- `DELETE /api/favorites/:id` - Remove a favorite city

## Database Schema

### weather_cache
Stores cached weather data with automatic expiration.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| city | text | City name (indexed) |
| country | text | Country code |
| temperature | numeric | Temperature in Celsius |
| feels_like | numeric | Feels like temperature |
| humidity | numeric | Humidity percentage |
| pressure | numeric | Atmospheric pressure |
| wind_speed | numeric | Wind speed |
| description | text | Weather description |
| icon | text | Weather icon code |
| cached_at | timestamptz | Cache timestamp |
| expires_at | timestamptz | Expiration timestamp |

### favorite_cities
Stores user's favorite cities.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| city | text | City name (unique) |
| country | text | Country code |
| created_at | timestamptz | Creation timestamp |

## Graceful Degradation Implementation

### Frontend Strategy
1. Try API call
2. If fails, check localStorage
3. Display appropriate warning message
4. Update UI to show data source

### Backend Strategy
1. Check database cache first
2. If expired, fetch from API
3. Cache new data
4. If API fails, return expired cache
5. If all fails, return demo data

### User Experience
- Loading states for all async operations
- Error boundaries prevent app crashes
- Informative error messages
- Visual indicators for data freshness
- Responsive design for all devices

## Testing Scenarios

### Test Graceful Degradation

1. **Normal Operation**
   - Search for a city
   - Should show "Live" badge
   - Should cache in database

2. **API Failure Simulation**
   - Stop the backend server
   - Search for a previously searched city
   - Should show cached data from localStorage

3. **Demo Mode**
   - Clear all storage
   - Stop backend
   - Search for any city
   - Should show demo data

4. **Offline Mode**
   - Disconnect internet
   - App should still work with cached data
   - Shows offline indicator

## Performance Optimizations

- Database indexes on frequently queried columns
- API response caching (30-minute TTL)
- LocalStorage fallback for instant access
- Debounced search input
- Lazy loading of components
- CSS animations using GPU acceleration

## Security Features

- Row Level Security (RLS) on all tables
- Environment variables for sensitive data
- CORS configuration for API
- Input validation and sanitization
- SQL injection prevention via Supabase

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- 5-day weather forecast
- Weather alerts and notifications
- Geolocation support
- Weather maps visualization
- Historical weather data
- PWA with service worker
- User authentication
- Multiple language support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
