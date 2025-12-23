const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/fooddelivery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes - Only restaurants and menus
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menus', require('./routes/menus'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Restaurant service running', port: 3001 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});