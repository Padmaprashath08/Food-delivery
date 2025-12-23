# Render Deployment Guide

## Prerequisites
- MongoDB Atlas cluster set up with connection string: `mongodb+srv://spadmaprashath_db_user:Padma123@food-delivery.0bd2vyd.mongodb.net/fooddelivery?retryWrites=true&w=majority&appName=Food-delivery`
- Render account created
- GitHub repository with your code

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Connect Repository to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select the repository containing your food delivery app

### 3. Deploy Using Blueprint
Render will automatically detect the `render.yaml` file and deploy all services:

**Services that will be created:**
- `food-delivery-frontend` - React frontend (Static Site)
- `food-delivery-auth` - Authentication service (Node.js)
- `food-delivery-orders` - Order management service (Node.js)
- `food-delivery-restaurants` - Restaurant service (Node.js)
- `food-delivery-analytics` - Analytics service (Python)
- `food-delivery-loadbalancer` - Load balancer (Node.js)

### 4. Service URLs
After deployment, your services will be available at:
- **Frontend**: `https://food-delivery-frontend.onrender.com`
- **Load Balancer**: `https://food-delivery-loadbalancer.onrender.com`
- **Auth Service**: `https://food-delivery-auth.onrender.com`
- **Order Service**: `https://food-delivery-orders.onrender.com`
- **Restaurant Service**: `https://food-delivery-restaurants.onrender.com`
- **Analytics Service**: `https://food-delivery-analytics.onrender.com`

### 5. Environment Variables
The following environment variables are automatically configured:

**All Node.js Services:**
- `MONGODB_URI`: MongoDB Atlas connection string
- `NODE_ENV`: production
- `PORT`: 10000 (Render default)

**Auth & Order Services:**
- `JWT_SECRET`: Auto-generated secure secret

**Python Service:**
- `PYTHON_VERSION`: 3.9.16
- `MONGODB_URI`: MongoDB Atlas connection string

**Load Balancer:**
- Service URLs for routing between microservices

**Frontend:**
- `REACT_APP_API_URL`: Points to load balancer

### 6. Database Setup
Your MongoDB Atlas database should have:
- Database name: `fooddelivery`
- Collections: `users`, `restaurants`, `menus`, `orders`, `analytics`

### 7. Default Admin Account
After deployment, you can log in with:
- **Email**: admin@fooddelivery.com
- **Password**: password

### 8. Testing Deployment
1. Visit your frontend URL
2. Register a new user or login with admin credentials
3. Test restaurant creation (admin)
4. Test menu management (admin)
5. Test order placement (user)

### 9. Monitoring
- Check service logs in Render dashboard
- Monitor service health at `/health` endpoints
- Verify database connections

## Architecture Overview

```
Frontend (React) → Load Balancer → Microservices
                                 ├── Auth Service
                                 ├── Order Service
                                 ├── Restaurant Service
                                 └── Analytics Service
                                           ↓
                                   MongoDB Atlas
```

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check service logs for dependency issues
2. **Database Connection**: Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for Render)
3. **CORS Issues**: Services are configured with CORS enabled
4. **Environment Variables**: Check if all required env vars are set

### Service Health Checks:
- Auth: `https://food-delivery-auth.onrender.com/health`
- Orders: `https://food-delivery-orders.onrender.com/health`
- Restaurants: `https://food-delivery-restaurants.onrender.com/health`
- Analytics: `https://food-delivery-analytics.onrender.com/health`
- Load Balancer: `https://food-delivery-loadbalancer.onrender.com/health`

## Notes
- Free tier services may sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Consider upgrading to paid plans for production use
- All services use HTTPS in production