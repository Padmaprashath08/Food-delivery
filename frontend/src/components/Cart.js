import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = ({ user, logout }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      const updatedCart = cart.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter(item => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/user/checkout');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Shopping Cart</h1>
        <div className="header-nav">
          <Link to="/user/restaurants" className="nav-link">← Continue Shopping</Link>
          <Link to="/user/orders" className="nav-link">My Orders</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">Cart</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to get started!</p>
            <Link to="/user/restaurants" className="continue-shopping-btn">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <h2>Cart Items ({cart.length})</h2>
              
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-restaurant">from {item.restaurantName}</p>
                    <p className="item-price">₹{item.price} each</p>
                  </div>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="summary-line">
                  <span>Delivery Fee:</span>
                  <span>₹49.00</span>
                </div>
                
                <div className="summary-line">
                  <span>Tax (8%):</span>
                  <span>₹{(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="summary-line total">
                  <span>Total:</span>
                  <span>₹{(getTotalPrice() + 49 + (getTotalPrice() * 0.08)).toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={proceedToCheckout}
                  className="checkout-btn"
                >
                  💳 Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
