const config = {
  AUTH_SERVICE_URL: process.env.REACT_APP_AUTH_SERVICE_URL || 'https://food-delivery-auth-hekg.onrender.com',
  ORDER_SERVICE_URL: process.env.REACT_APP_ORDER_SERVICE_URL || 'https://food-delivery-orders-hekg.onrender.com',
  RESTAURANT_SERVICE_URL: process.env.REACT_APP_RESTAURANT_SERVICE_URL || 'https://food-delivery-restaurants-hekg.onrender.com',
  ANALYTICS_SERVICE_URL: process.env.REACT_APP_ANALYTICS_SERVICE_URL || 'https://food-delivery-analytics-hekg.onrender.com'
};

export default config;