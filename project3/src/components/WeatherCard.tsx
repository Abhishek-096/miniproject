import { Cloud, Droplets, Wind, Gauge, Heart } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherData } from '../services/api';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { addToFavorites, favorites, source } = useWeather();

  const isFavorite = favorites.some(
    (fav) => fav.city.toLowerCase() === data.city.toLowerCase()
  );

  const handleAddFavorite = () => {
    if (!isFavorite) {
      addToFavorites(data.city, data.country);
    }
  };

  const getSourceBadge = () => {
    const badges = {
      api: { text: 'Live', color: 'badge-success' },
      cache: { text: 'Cached', color: 'badge-info' },
      expired_cache: { text: 'Cached (Expired)', color: 'badge-warning' },
      demo: { text: 'Demo', color: 'badge-demo' },
    };

    const badge = badges[source as keyof typeof badges] || badges.cache;
    return <span className={`badge ${badge.color}`}>{badge.text}</span>;
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
          <h2 className="city-name">
            {data.city}, {data.country}
          </h2>
          {source && getSourceBadge()}
        </div>
        <button
          onClick={handleAddFavorite}
          disabled={isFavorite}
          className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}
          title={isFavorite ? 'Already in favorites' : 'Add to favorites'}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="weather-main">
        <div className="temperature-container">
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
            className="weather-icon"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Weather';
            }}
          />
          <div className="temperature">{data.temperature}°C</div>
        </div>
        <div className="description">
          <Cloud size={20} />
          <span>{data.description}</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-icon">
            <Gauge size={20} />
          </div>
          <div className="detail-content">
            <div className="detail-label">Feels like</div>
            <div className="detail-value">{data.feels_like}°C</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <Droplets size={20} />
          </div>
          <div className="detail-content">
            <div className="detail-label">Humidity</div>
            <div className="detail-value">{data.humidity}%</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <Wind size={20} />
          </div>
          <div className="detail-content">
            <div className="detail-label">Wind Speed</div>
            <div className="detail-value">{data.wind_speed} m/s</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <Gauge size={20} />
          </div>
          <div className="detail-content">
            <div className="detail-label">Pressure</div>
            <div className="detail-value">{data.pressure} hPa</div>
          </div>
        </div>
      </div>
    </div>
  );
}
