import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const ManageRestaurants = ({ user, logout }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/restaurants`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const deleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.API_URL}/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRestaurants();
        alert('Restaurant deleted successfully!');
      } catch (error) {
        alert('Error deleting restaurant');
      }
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Manage Restaurants</h1>
        <div className="header-nav">
          <Link to="/admin/add-restaurant" className="nav-link primary">+ Add Restaurant</Link>
          <Link to="/admin/menus" className="nav-link">Manage Menus</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="restaurants-grid">
          {restaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card">
              <div className="card-header">
                <h3>{restaurant.name}</h3>
                <span className="restaurant-type">{restaurant.type}</span>
              </div>
              
              <div className="card-body">
                <div className="restaurant-info">
                  <p>{restaurant.address}</p>
                  <p> {restaurant.rating}/5</p>
                </div>
              </div>
              
              <div className="card-actions">
                <Link 
                  to={`/admin/menus/${restaurant._id}`} 
                  className="action-btn manage-btn"
                >
                  Manage Menu
                </Link>
                <button 
                  onClick={() => deleteRestaurant(restaurant._id)}
                  className="action-btn delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="empty-state">
            <h3>No restaurants found</h3>
            <p>Start by adding your first restaurant</p>
            <Link to="/admin/add-restaurant" className="empty-action-btn">
              + Add Restaurant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRestaurants;