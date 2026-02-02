const API_BASE_URL = 'http://localhost:8080/api';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  description: string;
  icon: string;
}

export interface WeatherResponse {
  success: boolean;
  source?: 'api' | 'cache' | 'expired_cache' | 'demo';
  data: WeatherData;
  warning?: string;
}

export interface FavoriteCity {
  id: string;
  city: string;
  country: string;
  created_at: string;
}

export interface FavoritesResponse {
  success: boolean;
  data: FavoriteCity[];
}

class ApiService {
  private async fetchWithFallback<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getWeather(city: string): Promise<WeatherResponse> {
    try {
      return await this.fetchWithFallback<WeatherResponse>(
        `${API_BASE_URL}/weather/${encodeURIComponent(city)}`
      );
    } catch (error) {
      const cachedData = this.getFromLocalStorage(`weather_${city}`);
      if (cachedData) {
        return {
          success: true,
          source: 'cache',
          data: cachedData,
          warning: 'Showing cached data (offline)',
        };
      }

      return {
        success: false,
        source: 'demo',
        data: this.getDemoWeather(city),
        warning: 'Showing demo data (offline)',
      } as WeatherResponse;
    }
  }

  async getFavorites(): Promise<FavoriteCity[]> {
    try {
      const response = await this.fetchWithFallback<FavoritesResponse>(
        `${API_BASE_URL}/favorites`
      );
      return response.data;
    } catch (error) {
      const cachedFavorites = this.getFromLocalStorage('favorites');
      return cachedFavorites || [];
    }
  }

  async addFavorite(city: string, country: string): Promise<void> {
    try {
      await this.fetchWithFallback(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        body: JSON.stringify({ city, country }),
      });
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  }

  async deleteFavorite(id: string): Promise<void> {
    try {
      await this.fetchWithFallback(`${API_BASE_URL}/favorites/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete favorite:', error);
      throw error;
    }
  }

  saveToLocalStorage(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  getFromLocalStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  private getDemoWeather(city: string): WeatherData {
    return {
      city,
      country: 'DEMO',
      temperature: 20,
      feels_like: 18,
      humidity: 65,
      pressure: 1013,
      wind_speed: 5.5,
      description: 'Demo data',
      icon: '01d',
    };
  }
}

export const apiService = new ApiService();
