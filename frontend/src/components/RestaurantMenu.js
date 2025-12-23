import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const RestaurantMenu = ({ user, logout }) => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  useEffect(() => {
    fetchRestaurant();
    fetchMenus();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/restaurants');
      const restaurantData = response.data.find(r => r._id === restaurantId);
      setRestaurant(restaurantData);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/menus/${restaurantId}`);
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const addToCart = (menuItem, quantity = 1) => {
    const existingItem = cart.find(item => item._id === menuItem._id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item => 
        item._id === menuItem._id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { ...menuItem, quantity, restaurantId, restaurantName: restaurant?.name }];
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`Added ${quantity} ${menuItem.name}(s) to cart!`);
  };

  const groupedMenus = menus.reduce((acc, menu) => {
    if (!acc[menu.category]) {
      acc[menu.category] = [];
    }
    acc[menu.category].push(menu);
    return acc;
  }, {});

  if (!restaurant) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>🍽️ {restaurant.name}</h1>
        <div className="header-nav">
          <Link to="/user/restaurants" className="nav-link">← Back to Restaurants</Link>
          <Link to="/user/cart" className="nav-link cart-link">
            🛒 Cart ({cart.length})
          </Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="restaurant-header">
          <div className="restaurant-info">
            <h2>{restaurant.name}</h2>
            <p className="restaurant-details">
              <span>{restaurant.type}</span> • 
              <span>⭐ {restaurant.rating}/5</span> • 
              <span>📍 {restaurant.address}</span>
            </p>
          </div>
        </div>

        <div className="menu-sections">
          {Object.entries(groupedMenus).map(([category, items]) => (
            <div key={category} className="menu-category">
              <h3 className="category-title">{category}</h3>
              <div className="menu-items-grid">
                {items.map(menu => (
                  <MenuItemCard 
                    key={menu._id} 
                    menu={menu} 
                    addToCart={addToCart} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {menus.length === 0 && (
          <div className="empty-state">
            <h3>No menu items available</h3>
            <p>This restaurant hasn't added any menu items yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuItemCard = ({ menu, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(menu, quantity);
    setQuantity(1);
  };

  return (
    <div className="menu-item-card">
      <div className="menu-item-info">
        <h4>{menu.name}</h4>
        <p className="menu-item-price">₹{menu.price}</p>
      </div>
      
      <div className="quantity-controls">
        <label>Quantity:</label>
        <div className="quantity-input">
          <button 
            type="button" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="qty-btn"
          >
            -
          </button>
          <span className="qty-display">{quantity}</span>
          <button 
            type="button" 
            onClick={() => setQuantity(quantity + 1)}
            className="qty-btn"
          >
            +
          </button>
        </div>
      </div>
      
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        🛒 Add to Cart
      </button>
    </div>
  );
};

export default RestaurantMenu;