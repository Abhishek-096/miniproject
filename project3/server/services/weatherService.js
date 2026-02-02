require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const supabase = require('../config/supabase');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getWeatherByCity(cityName) {
    try {
      const cachedWeather = await this.getCachedWeather(cityName);
      if (cachedWeather) {
        return {
          source: 'cache',
          data: cachedWeather
        };
      }

      if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweathermap_api_key_here') {
        return {
          source: 'demo',
          data: this.getDemoWeather(cityName)
        };
      }

      const weatherData = await this.fetchWeatherFromAPI(cityName);
      await this.cacheWeather(weatherData);

      return {
        source: 'api',
        data: weatherData
      };
    } catch (error) {
      const cachedWeather = await this.getCachedWeather(cityName, true);
      if (cachedWeather) {
        return {
          source: 'expired_cache',
          data: cachedWeather,
          warning: 'Showing cached data due to API error'
        };
      }

      return {
        source: 'demo',
        data: this.getDemoWeather(cityName),
        warning: 'Showing demo data due to API error'
      };
    }
  }

  async fetchWeatherFromAPI(cityName) {
    const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
  }

  async getCachedWeather(cityName, includeExpired = false) {
    const { data, error } = await supabase
      .from('weather_cache')
      .select('*')
      .ilike('city', cityName)
      .order('cached_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    if (!includeExpired && new Date(data.expires_at) < new Date()) {
      return null;
    }

    return {
      city: data.city,
      country: data.country,
      temperature: Number(data.temperature),
      feels_like: Number(data.feels_like),
      humidity: Number(data.humidity),
      pressure: Number(data.pressure),
      wind_speed: Number(data.wind_speed),
      description: data.description,
      icon: data.icon
    };
  }

  async cacheWeather(weatherData) {
    const existingCache = await supabase
      .from('weather_cache')
      .select('id')
      .ilike('city', weatherData.city)
      .maybeSingle();

    const cacheData = {
      ...weatherData,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };

    if (existingCache.data) {
      await supabase
        .from('weather_cache')
        .update(cacheData)
        .eq('id', existingCache.data.id);
    } else {
      await supabase
        .from('weather_cache')
        .insert([cacheData]);
    }
  }

  async cleanExpiredCache() {
    await supabase
      .from('weather_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());
  }

  getDemoWeather(cityName) {
    const demoData = {
      'London': { country: 'GB', temp: 15, desc: 'cloudy', icon: '04d' },
      'New York': { country: 'US', temp: 20, desc: 'partly cloudy', icon: '02d' },
      'Tokyo': { country: 'JP', temp: 22, desc: 'clear sky', icon: '01d' },
      'Paris': { country: 'FR', temp: 18, desc: 'light rain', icon: '10d' },
      'Sydney': { country: 'AU', temp: 25, desc: 'sunny', icon: '01d' }
    };

    const city = demoData[cityName] || demoData['London'];

    return {
      city: cityName,
      country: city.country,
      temperature: city.temp,
      feels_like: city.temp - 2,
      humidity: 65,
      pressure: 1013,
      wind_speed: 5.5,
      description: city.desc,
      icon: city.icon
    };
  }
}

module.exports = new WeatherService();
