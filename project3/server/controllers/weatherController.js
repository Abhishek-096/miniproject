const weatherService = require('../services/weatherService');

exports.getWeather = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City name is required'
      });
    }

    const result = await weatherService.getWeatherByCity(city);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
};

exports.cleanCache = async (req, res) => {
  try {
    await weatherService.cleanExpiredCache();
    res.json({
      success: true,
      message: 'Expired cache cleaned'
    });
  } catch (error) {
    console.error('Error cleaning cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clean cache'
    });
  }
};
