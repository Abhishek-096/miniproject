import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { apiService, WeatherData, FavoriteCity } from '../services/api';

interface WeatherContextType {
  weather: WeatherData | null;
  favorites: FavoriteCity[];
  loading: boolean;
  error: string | null;
  warning: string | null;
  source: string | null;
  searchWeather: (city: string) => Promise<void>;
  addToFavorites: (city: string, country: string) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const searchWeather = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await apiService.getWeather(city);

      if (response.success) {
        setWeather(response.data);
        setSource(response.source || null);
        setWarning(response.warning || null);

        apiService.saveToLocalStorage(`weather_${city}`, response.data);
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (err) {
      setError('Unable to fetch weather. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const data = await apiService.getFavorites();
      setFavorites(data);
      apiService.saveToLocalStorage('favorites', data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  }, []);

  const addToFavorites = useCallback(async (city: string, country: string) => {
    try {
      await apiService.addFavorite(city, country);
      await loadFavorites();
    } catch (err) {
      setError('Failed to add to favorites');
      console.error(err);
    }
  }, [loadFavorites]);

  const removeFromFavorites = useCallback(async (id: string) => {
    try {
      await apiService.deleteFavorite(id);
      await loadFavorites();
    } catch (err) {
      setError('Failed to remove from favorites');
      console.error(err);
    }
  }, [loadFavorites]);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        favorites,
        loading,
        error,
        warning,
        source,
        searchWeather,
        addToFavorites,
        removeFromFavorites,
        loadFavorites,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
