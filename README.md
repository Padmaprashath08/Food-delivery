# Food Delivery Application

A complete food delivery application with React frontend, Node.js backend, Python backend, and MongoDB database.

## Architecture

- **Frontend**: React (Port 3000)
- **Backend 1**: Node.js/Express (Port 3001) - Main API
- **Backend 2**: Python/Flask (Port 5000) - Analytics & Billing
- **Load Balancer**: Node.js (Port 8080)
- **Database**: MongoDB (Port 27017)

## Features

### Admin Functionality
- Create, update, delete restaurants
- Manage restaurant details (name, address, rating, type)
- Add, modify, delete menu items
- View restaurant and menu management

### User Functionality
- Browse restaurants
- View restaurant menus
- Add items to cart
- Place orders
- View order history
- Real-time order tracking

### System Features
- JWT Authentication
- Role-based access (Admin/User)
- Inter-service communication
- Load balancing
- Order processing and billing
- Analytics tracking

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone/Download the project**

2. **Install Dependencies**
   ```bash
   install-dependencies.bat
   ```

3. **Setup MongoDB**
   - Install MongoDB
   - Start MongoDB service
   - Run database initialization:
   ```bash
   mongosh < database/init-db.js
   ```

4. **Start All Services**
   ```bash
   start-all.bat
   ```

## Manual Setup

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

### Node.js Backend
```bash
cd backend-node
npm install
npm start
```

### Python Backend
```bash
cd backend-python
pip install -r requirements.txt
python app.py
```

### Load Balancer
```bash
cd load-balancer
npm install
npm start
```

## API Endpoints

### Node.js Backend (Port 3001)

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant (Admin)
- `PUT /api/restaurants/:id` - Update restaurant (Admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (Admin)

#### Menus
- `GET /api/menus/:restaurantId` - Get restaurant menu
- `POST /api/menus` - Create menu item (Admin)
- `PUT /api/menus/:id` - Update menu item (Admin)
- `DELETE /api/menus/:id` - Delete menu item (Admin)

#### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Python Backend (Port 5000)

#### Analytics & Billing
- `POST /api/restaurant-created` - Log restaurant creation
- `POST /api/process-order` - Process order and billing
- `GET /api/analytics/orders` - Get order analytics
- `GET /api/billing/:orderId` - Get billing details

## Default Login Credentials

**Admin Account:**
- Email: admin@fooddelivery.com
- Password: password

## Project Structure

```
Food Delivery Application/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js          # Main app component
│   │   └── App.css         # Styles
│   └── package.json
├── backend-node/            # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
├── backend-python/          # Python backend
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
├── load-balancer/           # Load balancer
│   └── server.js           # Load balancer server
├── database/               # Database scripts
│   └── init-db.js          # MongoDB initialization
├── install-dependencies.bat # Dependency installer
└── start-all.bat           # Startup script
```

## Communication Flow

1. **Frontend** → **Load Balancer** → **Node.js Backend**
2. **Node.js Backend** ↔ **Python Backend** (Order processing)
3. **Both Backends** → **MongoDB**

## Key Features Implementation

### Authentication & Authorization
- JWT tokens for secure authentication
- Role-based access control (Admin/User)
- Protected routes and middleware

### Restaurant Management
- CRUD operations for restaurants
- Restaurant details and ratings
- Menu management per restaurant

### Order Processing
- Shopping cart functionality
- Order placement and tracking
- Billing calculation with taxes and fees
- Inter-service communication for order processing

### Load Balancing
- Request routing between services
- Fallback mechanisms
- Health checks

## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check connection string in .env files

2. **Port Conflicts**
   - Ensure ports 3000, 3001, 5000, 8080 are available
   - Modify ports in respective configuration files

3. **Dependencies Issues**
   - Run `npm install` in each Node.js directory
   - Run `pip install -r requirements.txt` in Python directory

4. **CORS Issues**
   - CORS is configured for all services
   - Check frontend proxy configuration

## Development

- Frontend runs on `http://localhost:3000`
- Node.js API on `http://localhost:3001`
- Python API on `http://localhost:5000`
- Load Balancer on `http://localhost:8080`

## Production Deployment

1. Build React app: `npm run build`
2. Configure environment variables
3. Use process managers (PM2 for Node.js, Gunicorn for Python)
4. Setup reverse proxy (Nginx)
5. Configure MongoDB replica set
6. Implement proper logging and monitoring