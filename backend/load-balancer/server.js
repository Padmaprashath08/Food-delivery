const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Environment variables for service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'https://food-delivery-auth-hekg.onrender.com';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'https://food-delivery-orders-hekg.onrender.com';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'https://food-delivery-restaurants-hekg.onrender.com';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'https://food-delivery-analytics-hekg.onrender.com';
const PORT = process.env.PORT || 8080;

// Primary and Replica servers for restaurants/menus
const restaurantServers = [
  RESTAURANT_SERVICE_URL,  // Node.js primary
  ANALYTICS_SERVICE_URL    // Python replica
];

// Dedicated microservices
const microservices = {
  auth: AUTH_SERVICE_URL,
  orders: ORDER_SERVICE_URL
};

let currentServer = 0;

// Round-robin for restaurant/menu services
function getNextRestaurantServer() {
  const server = restaurantServers[currentServer];
  currentServer = (currentServer + 1) % restaurantServers.length;
  return server;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Load balancer running', 
    port: PORT,
    restaurantServers: restaurantServers,
    microservices: microservices
  });
});

// Route auth requests to dedicated auth microservice
app.use('/api/auth', createProxyMiddleware({
  target: microservices.auth,
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}));

// Route order requests to dedicated order microservice
app.use('/api/orders', createProxyMiddleware({
  target: microservices.orders,
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Order service unavailable' });
  }
}));

// Load balance restaurant/menu requests - Write operations go to Node.js only
app.use(['/api/restaurants', '/api/menus'], (req, res, next) => {
  // Write operations (POST, PUT, DELETE) always go to Node.js primary
  const targetServer = (req.method === 'GET') ? getNextRestaurantServer() : RESTAURANT_SERVICE_URL;
  console.log(`Routing ${req.method} ${req.path} to ${targetServer}`);
  
  const proxy = createProxyMiddleware({
    target: targetServer,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.log(`Error with ${targetServer}, trying fallback...`);
      // For write operations, only fallback to Node.js
      const fallbackServer = (req.method === 'GET') ? 
        restaurantServers.find(s => s !== targetServer) : 
        RESTAURANT_SERVICE_URL;
      
      if (fallbackServer && fallbackServer !== targetServer) {
        console.log(`Falling back to ${fallbackServer}`);
        const fallbackProxy = createProxyMiddleware({
          target: fallbackServer,
          changeOrigin: true
        });
        fallbackProxy(req, res, next);
      } else {
        res.status(503).json({ error: 'Restaurant service unavailable' });
      }
    }
  });
  
  proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
  console.log('Architecture:');
  console.log(`- Auth Service: ${AUTH_SERVICE_URL} (Dedicated)`);
  console.log(`- Order Service: ${ORDER_SERVICE_URL} (Dedicated)`);
  console.log(`- Restaurant Primary: ${RESTAURANT_SERVICE_URL} (Node.js)`);
  console.log(`- Analytics Service: ${ANALYTICS_SERVICE_URL} (Python)`);
  console.log('Load balancing: Round-robin for restaurants/menus only');
});