import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MenuItemCard = ({ menu, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log('Button clicked for:', menu.name, 'Quantity:', quantity);
    addToCart(menu, quantity);
    setQuantity(1);
  };

  return (
    <div className="menu-card">
      <h4>{menu.name}</h4>
      <p>Price: ${menu.price}</p>
      <p>Category: {menu.category}</p>
      <div className="quantity-selector">
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        />
      </div>
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add {quantity} to Cart
      </button>
    </div>
  );
};

const UserDashboard = ({ user, logout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addToCart = (menuItem, quantity = 1) => {
    console.log('Adding to cart:', menuItem, 'Quantity:', quantity);
    const existingItem = cart.find(item => item._id === menuItem._id);
    if (existingItem) {
      const updatedCart = cart.map(item => 
        item._id === menuItem._id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
      console.log('Updated cart:', updatedCart);
    } else {
      const newCart = [...cart, { ...menuItem, quantity }];
      setCart(newCart);
      console.log('New cart:', newCart);
    }
    alert(`Added ${quantity} ${menuItem.name}(s) to cart!`);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        restaurantId: selectedRestaurant._id,
        items: cart.map(item => ({
          menuId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getTotalPrice()
      };

      await axios.post('http://localhost:3001/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart([]);
      setShowCart(false);
      fetchOrders();
      alert('Order placed successfully!');
    } catch (error) {
      alert('Error placing order');
    }
  };

  return (
    <div className="user-dashboard">
      <header>
        <h1>Food Delivery</h1>
        <div>
          <button onClick={() => setShowCart(true)}>Cart ({cart.length})</button>
          <button onClick={() => setShowOrders(true)}>My Orders</button>
          <Link to="/profile" className="profile-link">Profile</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="user-content">
        <div className="restaurants-section">
          <h2>Restaurants</h2>
          <div className="restaurants-grid">
            {restaurants.map(restaurant => (
              <div key={restaurant._id} className="restaurant-card">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.address}</p>
                <p>Rating: {restaurant.rating}/5</p>
                <p>Type: {restaurant.type}</p>
                <button onClick={() => {
                  setSelectedRestaurant(restaurant);
                  fetchMenus(restaurant._id);
                }}>View Menu</button>
              </div>
            ))}
          </div>
        </div>

        {selectedRestaurant && (
          <div className="menu-section">
            <h2>Menu - {selectedRestaurant.name}</h2>
            <div className="menu-grid">
              {menus.map(menu => (
                <MenuItemCard key={menu._id} menu={menu} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}

        {showCart && (
          <div className="modal">
            <div className="modal-content">
              <h2>Shopping Cart</h2>
              {cart.length === 0 ? (
                <p>Cart is empty</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item._id} className="cart-item">
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                        min="0"
                      />
                      <button onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  ))}
                  <div className="cart-total">
                    <h3>Total: ${getTotalPrice()}</h3>
                    <button onClick={placeOrder}>Place Order</button>
                  </div>
                </>
              )}
              <button onClick={() => setShowCart(false)}>Close</button>
            </div>
          </div>
        )}

        {showOrders && (
          <div className="modal">
            <div className="modal-content">
              <h2>My Orders</h2>
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <p>Restaurant: {order.restaurantName}</p>
                  <p>Total: ${order.totalAmount}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              <button onClick={() => setShowOrders(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;