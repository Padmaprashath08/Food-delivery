const express = require('express');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');
const axios = require('axios');
const router = express.Router();

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { restaurantId, items, totalAmount } = req.body;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const order = new Order({
      userId: req.user._id,
      restaurantId,
      restaurantName: restaurant.name,
      items,
      totalAmount
    });

    await order.save();

    // Send order to Python backend for processing
    try {
      await axios.post('http://localhost:5000/api/process-order', {
        orderId: order._id,
        userId: req.user._id,
        restaurantId,
        totalAmount,
        items
      });
    } catch (pythonError) {
      console.log('Python backend processing failed:', pythonError.message);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (called by Python backend)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;