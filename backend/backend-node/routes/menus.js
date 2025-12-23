const express = require('express');
const Menu = require('../models/Menu');
const router = express.Router();

// Get menus by restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const menus = await Menu.find({ restaurantId: req.params.restaurantId });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create menu item
router.post('/', async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;