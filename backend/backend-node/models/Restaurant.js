const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);