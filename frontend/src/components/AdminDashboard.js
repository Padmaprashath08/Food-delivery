import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = ({ user, logout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState({
    name: '', address: '', rating: '', type: ''
  });
  const [menuForm, setMenuForm] = useState({
    name: '', price: '', category: '', restaurantId: ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchMenus = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/menus/${restaurantId}`);
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/restaurants', restaurantForm);
      setRestaurantForm({ name: '', address: '', rating: '', type: '' });
      setShowRestaurantForm(false);
      fetchRestaurants();
    } catch (error) {
      alert('Error creating restaurant');
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/menus', {
        ...menuForm,
        restaurantId: selectedRestaurant._id
      });
      setMenuForm({ name: '', price: '', category: '', restaurantId: '' });
      setShowMenuForm(false);
      fetchMenus(selectedRestaurant._id);
    } catch (error) {
      alert('Error creating menu item');
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      alert('Error deleting restaurant');
    }
  };

  const deleteMenu = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/menus/${id}`);
      fetchMenus(selectedRestaurant._id);
    } catch (error) {
      alert('Error deleting menu item');
    }
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/profile" className="profile-link">Profile</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="restaurants-section">
          <h2>Restaurants</h2>
          <button onClick={() => setShowRestaurantForm(true)}>Add Restaurant</button>
          
          {showRestaurantForm && (
            <form onSubmit={handleRestaurantSubmit} className="form">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurantForm.name}
                onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={restaurantForm.address}
                onChange={(e) => setRestaurantForm({...restaurantForm, address: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Rating (1-5)"
                value={restaurantForm.rating}
                onChange={(e) => setRestaurantForm({...restaurantForm, rating: e.target.value})}
                min="1" max="5"
                required
              />
              <input
                type="text"
                placeholder="Type (e.g., Italian, Chinese)"
                value={restaurantForm.type}
                onChange={(e) => setRestaurantForm({...restaurantForm, type: e.target.value})}
                required
              />
              <button type="submit">Create Restaurant</button>
              <button type="button" onClick={() => setShowRestaurantForm(false)}>Cancel</button>
            </form>
          )}

          <div className="restaurants-list">
            {restaurants.map(restaurant => (
              <div key={restaurant._id} className="restaurant-card">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.address}</p>
                <p>Rating: {restaurant.rating}/5</p>
                <p>Type: {restaurant.type}</p>
                <button onClick={() => {
                  setSelectedRestaurant(restaurant);
                  fetchMenus(restaurant._id);
                }}>Manage Menu</button>
                <button onClick={() => deleteRestaurant(restaurant._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {selectedRestaurant && (
          <div className="menu-section">
            <h2>Menu for {selectedRestaurant.name}</h2>
            <button onClick={() => setShowMenuForm(true)}>Add Menu Item</button>
            
            {showMenuForm && (
              <form onSubmit={handleMenuSubmit} className="form">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={menuForm.category}
                  onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                  required
                />
                <button type="submit">Add Item</button>
                <button type="button" onClick={() => setShowMenuForm(false)}>Cancel</button>
              </form>
            )}

            <div className="menu-list">
              {menus.map(menu => (
                <div key={menu._id} className="menu-card">
                  <h4>{menu.name}</h4>
                  <p>Price: ${menu.price}</p>
                  <p>Category: {menu.category}</p>
                  <button onClick={() => deleteMenu(menu._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;