const supabase = require('../config/supabase');

exports.getAllFavorites = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorite_cities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites',
      message: error.message
    });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { city, country } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City name is required'
      });
    }

    const existing = await supabase
      .from('favorite_cities')
      .select('id')
      .ilike('city', city)
      .maybeSingle();

    if (existing.data) {
      return res.status(400).json({
        success: false,
        error: 'City is already in favorites'
      });
    }

    const { data, error } = await supabase
      .from('favorite_cities')
      .insert([{ city, country: country || '' }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add favorite',
      message: error.message
    });
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Favorite ID is required'
      });
    }

    const { error } = await supabase
      .from('favorite_cities')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Favorite deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete favorite',
      message: error.message
    });
  }
};
