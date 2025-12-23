const config = {
  AUTH_SERVICE_URL: process.env.REACT_APP_AUTH_SERVICE_URL || 'https://food-delivery-auth-ku49.onrender.com',
  ORDER_SERVICE_URL: process.env.REACT_APP_ORDER_SERVICE_URL || 'https://food-delivery-orders-ku49.onrender.com',
  RESTAURANT_SERVICE_URL: process.env.REACT_APP_RESTAURANT_SERVICE_URL || 'https://food-delivery-restaurants-ku49.onrender.com',
  ANALYTICS_SERVICE_URL: process.env.REACT_APP_ANALYTICS_SERVICE_URL || 'https://food-delivery-analytics-ku49.onrender.com'
};

export default config;