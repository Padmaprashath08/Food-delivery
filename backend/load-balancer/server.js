const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Primary and Replica servers for restaurants/menus
const restaurantServers = [
  'http://localhost:3001',  // Node.js primary
  'http://localhost:5000'   // Python replica
];

// Dedicated microservices
const microservices = {
  auth: 'http://localhost:4001',
  orders: 'http://localhost:4002'
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
    port: 8080,
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

// Load balance restaurant/menu requests between primary and replica
app.use(['/api/restaurants', '/api/menus'], (req, res, next) => {
  const targetServer = getNextRestaurantServer();
  console.log(`Routing ${req.method} ${req.path} to ${targetServer}`);
  
  const proxy = createProxyMiddleware({
    target: targetServer,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.log(`Error with ${targetServer}, trying other server...`);
      const fallbackServer = restaurantServers.find(s => s !== targetServer);
      if (fallbackServer) {
        console.log(`Falling back to ${fallbackServer}`);
        const fallbackProxy = createProxyMiddleware({
          target: fallbackServer,
          changeOrigin: true
        });
        fallbackProxy(req, res, next);
      } else {
        res.status(503).json({ error: 'All restaurant servers unavailable' });
      }
    }
  });
  
  proxy(req, res, next);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
  console.log('Architecture:');
  console.log('- Auth Service: http://localhost:4001 (Dedicated)');
  console.log('- Order Service: http://localhost:4002 (Dedicated)');
  console.log('- Restaurant Primary: http://localhost:3001 (Node.js)');
  console.log('- Restaurant Replica: http://localhost:5000 (Python)');
  console.log('Load balancing: Round-robin for restaurants/menus only');
});