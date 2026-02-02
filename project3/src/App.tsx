import { WeatherProvider, useWeather } from './context/WeatherContext';
import { WeatherSearch } from './components/WeatherSearch';
import { WeatherCard } from './components/WeatherCard';
import { FavoritesList } from './components/FavoritesList';
import { Cloud, AlertCircle, Wifi, WifiOff } from 'lucide-react';

function WeatherApp() {
  const { weather, loading, error, warning, source } = useWeather();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <Cloud size={32} />
            <h1>Weather App</h1>
          </div>
          <div className="header-status">
            {source === 'api' ? (
              <div className="status-online">
                <Wifi size={16} />
                <span>Online</span>
              </div>
            ) : (
              <div className="status-offline">
                <WifiOff size={16} />
                <span>Offline Mode</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="search-section">
          <WeatherSearch />

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {warning && (
            <div className="alert alert-warning">
              <AlertCircle size={20} />
              <span>{warning}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-section">
            <WeatherCard data={weather} />
          </div>
        )}

        <div className="favorites-section">
          <FavoritesList />
        </div>
      </main>

      <footer className="app-footer">
        <p>Weather App with Graceful Degradation</p>
        <p className="footer-hint">
          Works online with live data or offline with cached data
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WeatherProvider>
      <WeatherApp />
    </WeatherProvider>
  );
}

export default App;
