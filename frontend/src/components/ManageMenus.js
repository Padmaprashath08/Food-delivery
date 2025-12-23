import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ManageMenus = ({ user, logout }) => {
  const { restaurantId } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '', price: '', category: ''
  });

  useEffect(() => {
    fetchRestaurants();
    if (restaurantId) {
      fetchMenus(restaurantId);
      fetchRestaurantDetails(restaurantId);
    }
  }, [restaurantId]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchRestaurantDetails = async (id) => {
    try {
      const response = await axios.get('http://localhost:3001/api/restaurants');
      const restaurant = response.data.find(r => r._id === id);
      setSelectedRestaurant(restaurant);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  const fetchMenus = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/menus/${id}`);
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/menus', {
        ...menuForm,
        restaurantId: selectedRestaurant._id
      });
      setMenuForm({ name: '', price: '', category: '' });
      setShowAddForm(false);
      fetchMenus(selectedRestaurant._id);
      alert('Menu item added successfully!');
    } catch (error) {
      alert('Error adding menu item');
    }
  };

  const deleteMenu = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`http://localhost:3001/api/menus/${id}`);
        fetchMenus(selectedRestaurant._id);
        alert('Menu item deleted successfully!');
      } catch (error) {
        alert('Error deleting menu item');
      }
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Manage Menus</h1>
        <div className="header-nav">
          <Link to="/admin/restaurants" className="nav-link">Manage Restaurants</Link>
          <Link to="/admin/add-restaurant" className="nav-link">Add Restaurant</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        {!selectedRestaurant ? (
          <div className="restaurant-selector">
            <h2>Select a Restaurant to Manage Menu</h2>
            <div className="restaurants-grid">
              {restaurants.map(restaurant => (
                <Link 
                  key={restaurant._id}
                  to={`/admin/menus/${restaurant._id}`}
                  className="restaurant-select-card"
                >
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.type}</p>
                  <span className="select-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="menu-management">
            <div className="restaurant-info-bar">
              <div>
                <h2>{selectedRestaurant.name}</h2>
                <p>{selectedRestaurant.type} • {selectedRestaurant.address}</p>
              </div>
              <button 
                onClick={() => setShowAddForm(true)}
                className="add-menu-btn"
              >
                + Add Menu Item
              </button>
            </div>

            {showAddForm && (
              <div className="add-menu-form">
                <h3>Add New Menu Item</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Item Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Margherita Pizza"
                        value={menuForm.name}
                        onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        placeholder="299"
                        value={menuForm.price}
                        onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={menuForm.category}
                      onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Salads">Salads</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Item</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="menu-items-grid">
              {menus.map(menu => (
                <div key={menu._id} className="menu-item-card">
                  <div className="menu-item-header">
                    <h4>{menu.name}</h4>
                    <span className="menu-price">₹{menu.price}</span>
                  </div>
                  <p className="menu-category">{menu.category}</p>
                  <button 
                    onClick={() => deleteMenu(menu._id)}
                    className="delete-menu-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {menus.length === 0 && (
              <div className="empty-state">
                <h3>No menu items found</h3>
                <p>Start by adding your first menu item</p>
                <button onClick={() => setShowAddForm(true)} className="empty-action-btn">
                  + Add Menu Item
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMenus;