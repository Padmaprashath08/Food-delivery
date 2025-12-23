# Deployment Guide - Current Setup

## Deployed Services

### Backend Services (Render)
- **Auth Service**: https://food-delivery-auth-ku49.onrender.com
- **Order Service**: https://food-delivery-orders-ku49.onrender.com  
- **Restaurant Service**: https://food-delivery-restaurants-ku49.onrender.com
- **Analytics Service**: https://food-delivery-analytics-ku49.onrender.com

### Frontend (Vercel)
- Deploy the `frontend` folder to Vercel
- Environment variables are configured in `vercel.json`

## Frontend Configuration

The frontend is configured to call services directly:
- Auth calls → Auth Service
- Restaurant calls → Restaurant Service  
- Order calls → Order Service
- Analytics calls → Analytics Service

## For Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Or use Vercel Dashboard**:
   - Connect GitHub repository
   - Set root directory to `frontend`
   - Environment variables are in `vercel.json`

## API Endpoints

### Auth Service (https://food-delivery-auth-ku49.onrender.com)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### Restaurant Service (https://food-delivery-restaurants-ku49.onrender.com)
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant (Admin)
- `GET /api/menus/:restaurantId` - Get restaurant menu
- `POST /api/menus` - Create menu item (Admin)

### Order Service (https://food-delivery-orders-ku49.onrender.com)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Analytics Service (https://food-delivery-analytics-ku49.onrender.com)
- Same endpoints as Restaurant Service (replica)
- Additional analytics logging

## Testing

Test each service health:
- https://food-delivery-auth-ku49.onrender.com/health
- https://food-delivery-orders-ku49.onrender.com/health
- https://food-delivery-restaurants-ku49.onrender.com/health
- https://food-delivery-analytics-ku49.onrender.com/health