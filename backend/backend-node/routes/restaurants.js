const express = require('express');
const Restaurant = require('../models/Restaurant');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create restaurant (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    
    // Notify Python backend
    try {
      const pythonUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';
      await axios.post(`${pythonUrl}/api/restaurant-created`, {
        restaurantId: restaurant._id,
        name: restaurant.name
      });
    } catch (pythonError) {
      console.log('Python backend notification failed:', pythonError.message);
    }
    
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Restaurant creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update restaurant (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('Restaurant update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete restaurant (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    console.error('Restaurant deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;