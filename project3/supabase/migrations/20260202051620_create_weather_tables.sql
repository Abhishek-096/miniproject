/*
  # Weather App Database Schema

  1. New Tables
    - `weather_cache`
      - `id` (uuid, primary key)
      - `city` (text, indexed) - City name
      - `country` (text) - Country code
      - `temperature` (numeric) - Current temperature in Celsius
      - `feels_like` (numeric) - Feels like temperature
      - `humidity` (numeric) - Humidity percentage
      - `pressure` (numeric) - Atmospheric pressure
      - `wind_speed` (numeric) - Wind speed
      - `description` (text) - Weather description
      - `icon` (text) - Weather icon code
      - `cached_at` (timestamptz) - When data was cached
      - `expires_at` (timestamptz) - When cache expires
      
    - `favorite_cities`
      - `id` (uuid, primary key)
      - `city` (text) - City name
      - `country` (text) - Country code
      - `created_at` (timestamptz) - When favorite was added

  2. Security
    - Enable RLS on both tables
    - Public read access for weather_cache (it's public weather data)
    - Public read/write for favorite_cities (demo app, no auth required)

  3. Important Notes
    - Weather cache expires after 30 minutes to keep data fresh
    - Indexed city column for fast lookups
    - All timestamps use timestamptz for proper timezone handling
*/

-- Create weather_cache table
CREATE TABLE IF NOT EXISTS weather_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  country text NOT NULL DEFAULT '',
  temperature numeric NOT NULL DEFAULT 0,
  feels_like numeric NOT NULL DEFAULT 0,
  humidity numeric NOT NULL DEFAULT 0,
  pressure numeric NOT NULL DEFAULT 0,
  wind_speed numeric NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  cached_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 minutes')
);

-- Create index for faster city lookups
CREATE INDEX IF NOT EXISTS idx_weather_cache_city ON weather_cache(city);
CREATE INDEX IF NOT EXISTS idx_weather_cache_expires ON weather_cache(expires_at);

-- Create favorite_cities table
CREATE TABLE IF NOT EXISTS favorite_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  country text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate favorites
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorite_cities_unique ON favorite_cities(LOWER(city));

-- Enable RLS
ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_cities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weather_cache
-- Anyone can read cached weather data
CREATE POLICY "Anyone can read weather cache"
  ON weather_cache FOR SELECT
  TO public
  USING (true);

-- Anyone can insert weather cache (for caching API responses)
CREATE POLICY "Anyone can insert weather cache"
  ON weather_cache FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can update weather cache
CREATE POLICY "Anyone can update weather cache"
  ON weather_cache FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Anyone can delete expired cache
CREATE POLICY "Anyone can delete expired weather cache"
  ON weather_cache FOR DELETE
  TO public
  USING (expires_at < now());

-- RLS Policies for favorite_cities
-- Anyone can read favorites
CREATE POLICY "Anyone can read favorites"
  ON favorite_cities FOR SELECT
  TO public
  USING (true);

-- Anyone can add favorites
CREATE POLICY "Anyone can insert favorites"
  ON favorite_cities FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can delete favorites
CREATE POLICY "Anyone can delete favorites"
  ON favorite_cities FOR DELETE
  TO public
  USING (true);