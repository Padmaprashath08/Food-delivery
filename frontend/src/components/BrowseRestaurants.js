import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const BrowseRestaurants = ({ user, logout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${config.RESTAURANT_SERVICE_URL}/api/restaurants`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === '' || restaurant.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const restaurantTypes = [...new Set(restaurants.map(r => r.type))];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Browse Restaurants</h1>
        <div className="header-nav">
          <Link to="/user/cart" className="nav-link">Cart</Link>
          <Link to="/user/orders" className="nav-link">My Orders</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search restaurants or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-bar">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Cuisines</option>
              {restaurantTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="restaurants-grid">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-browse-card">
              <div className="restaurant-image">
                <span className="cuisine-emoji">
                  {restaurant.type}
                </span>
              </div>
              
              <div className="restaurant-details">
                <h3>{restaurant.name}</h3>
                <p className="restaurant-type">{restaurant.type}</p>
                <p className="restaurant-address">{restaurant.address}</p>

                <div className="restaurant-rating">
                  <span className="rating-stars">
                    {'*'.repeat(Math.floor(restaurant.rating))}
                  </span>
                  <span className="rating-number">{restaurant.rating}/5</span>
                </div>
              </div>
              
              <div className="restaurant-actions">
                <Link 
                  to={`/user/restaurant/${restaurant._id}`}
                  className="view-menu-btn"
                >
                  View Menu →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="empty-state">
            <h3>No restaurants found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRestaurants;
