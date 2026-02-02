import { useEffect } from 'react';
import { Star, Trash2, MapPin } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export function FavoritesList() {
  const { favorites, loadFavorites, removeFromFavorites, searchWeather } = useWeather();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <Star size={48} />
        <p>No favorite cities yet</p>
        <p className="favorites-empty-hint">Search for a city and add it to favorites</p>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <div className="favorites-header">
        <Star size={20} />
        <h3>Favorite Cities</h3>
      </div>
      <div className="favorites-grid">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="favorite-item">
            <button
              onClick={() => searchWeather(favorite.city)}
              className="favorite-button-main"
            >
              <MapPin size={16} />
              <span className="favorite-city">
                {favorite.city}
                {favorite.country && `, ${favorite.country}`}
              </span>
            </button>
            <button
              onClick={() => removeFromFavorites(favorite.id)}
              className="favorite-delete"
              title="Remove from favorites"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
