import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export function WeatherSearch() {
  const [city, setCity] = useState('');
  const { searchWeather, loading } = useWeather();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      await searchWeather(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="search-input"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !city.trim()} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
