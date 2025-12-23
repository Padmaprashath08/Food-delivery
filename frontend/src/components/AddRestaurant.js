import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const AddRestaurant = ({ user, logout }) => {
  const [restaurantForm, setRestaurantForm] = useState({
    name: '', address: '', rating: '', type: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.API_URL}/api/restaurants`, restaurantForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurantForm({ name: '', address: '', rating: '', type: '' });
      alert('Restaurant added successfully!');
    } catch (error) {
      alert('Error adding restaurant');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Add New Restaurant</h1>
        <div className="header-nav">
          <Link to="/admin/restaurants" className="nav-link">View Restaurants</Link>
          <Link to="/admin/menus" className="nav-link">Manage Menus</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="form-container">
          <div className="form-header">
            <h2>Restaurant Details</h2>
            <p>Add a new restaurant to your platform</p>
          </div>
          
          <form onSubmit={handleSubmit} className="restaurant-form">
            <div className="form-row">
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  placeholder="Enter restaurant name"
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Restaurant Type</label>
                <select
                  value={restaurantForm.type}
                  onChange={(e) => setRestaurantForm({...restaurantForm, type: e.target.value})}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Thai">Thai</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                placeholder="Enter complete address"
                value={restaurantForm.address}
                onChange={(e) => setRestaurantForm({...restaurantForm, address: e.target.value})}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                placeholder="4.5"
                value={restaurantForm.rating}
                onChange={(e) => setRestaurantForm({...restaurantForm, rating: e.target.value})}
                min="1" max="5" step="0.1"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Add Restaurant
              </button>
              <Link to="/admin/restaurants" className="cancel-btn">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;