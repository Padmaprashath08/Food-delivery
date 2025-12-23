import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AddRestaurant from './components/AddRestaurant';
import ManageRestaurants from './components/ManageRestaurants';
import ManageMenus from './components/ManageMenus';
import BrowseRestaurants from './components/BrowseRestaurants';
import RestaurantMenu from './components/RestaurantMenu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'admin' ? '/admin/restaurants' : '/user/restaurants'} />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/restaurants" 
            element={user && user.role === 'admin' ? <ManageRestaurants user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/add-restaurant" 
            element={user && user.role === 'admin' ? <AddRestaurant user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/menus" 
            element={user && user.role === 'admin' ? <ManageMenus user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/menus/:restaurantId" 
            element={user && user.role === 'admin' ? <ManageMenus user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          
          {/* User Routes */}
          <Route 
            path="/user/restaurants" 
            element={user && user.role === 'user' ? <BrowseRestaurants user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/user/restaurant/:restaurantId" 
            element={user && user.role === 'user' ? <RestaurantMenu user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/user/cart" 
            element={user && user.role === 'user' ? <Cart user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/user/checkout" 
            element={user && user.role === 'user' ? <Checkout user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/user/orders" 
            element={user && user.role === 'user' ? <Orders user={user} logout={logout} /> : <Navigate to="/login" />} 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;