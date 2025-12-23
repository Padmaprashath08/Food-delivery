import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = ({ user, logout }) => {
  const [cart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const deliveryFee = 49;
    const tax = subtotal * 0.08;
    return subtotal + deliveryFee + tax;
  };

  const getPaymentAmount = () => {
    const total = getFinalTotal();
    if (paymentMethod === 'half') {
      return total / 2;
    }
    return total;
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const restaurantId = cart[0]?.restaurantId;
      
      const orderData = {
        restaurantId,
        items: cart.map(item => ({
          menuId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getFinalTotal(),
        paymentMethod,
        paidAmount: getPaymentAmount(),
        deliveryAddress: 'Default Address'
      };

      await axios.post('http://localhost:4002/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('cart');
      setOrderPlaced(true);
      
      setTimeout(() => {
        navigate('/user/orders');
      }, 2000);

    } catch (error) {
      alert('Error placing order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <div className="page-container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h1>Payment Successful!</h1>
          <h2>Order Placed Successfully!</h2>
          <p>Amount Paid: ₹{getPaymentAmount().toFixed(2)}</p>
          {paymentMethod === 'half' && (
            <p>Remaining ₹{(getFinalTotal() - getPaymentAmount()).toFixed(2)} to be paid on delivery</p>
          )}
          <p>Your delicious food is being prepared</p>
          <p>Redirecting to orders page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Checkout</h1>
        <div className="header-nav">
          <Link to="/user/cart" className="nav-link">← Back to Cart</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="checkout-content">
          <div className="checkout-form">
            <div className="section">
              <h3>Delivery Address</h3>
              <div className="address-form">
                <input type="text" placeholder="Street Address" required />
                <div className="form-row">
                  <input type="text" placeholder="City" required />
                  <input type="text" placeholder="PIN Code" required />
                </div>
                <textarea placeholder="Delivery Instructions (Optional)" rows="3"></textarea>
              </div>
            </div>

            <div className="section">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                <button 
                  className={`payment-btn ${paymentMethod === 'half' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('half')}
                >
                  Pay Half Now (₹{(getFinalTotal() / 2).toFixed(2)})
                  <small>Remaining on delivery</small>
                </button>
                
                <button 
                  className={`payment-btn ${paymentMethod === 'full' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('full')}
                >
                  Pay Full After Delivery (₹{getFinalTotal().toFixed(2)})
                  <small>Cash on delivery</small>
                </button>
              </div>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {cart.map(item => (
                  <div key={item._id} className="summary-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
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
                  <span>₹{getFinalTotal().toFixed(2)}</span>
                </div>

                {paymentMethod && (
                  <div className="payment-breakdown">
                    <div className="summary-line payment">
                      <span>Pay Now:</span>
                      <span>₹{getPaymentAmount().toFixed(2)}</span>
                    </div>
                    {paymentMethod === 'half' && (
                      <div className="summary-line remaining">
                        <span>Pay on Delivery:</span>
                        <span>₹{(getFinalTotal() - getPaymentAmount()).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button 
                onClick={handlePayment}
                className="place-order-btn"
                disabled={!paymentMethod}
              >
                {paymentMethod ? `Pay ₹${getPaymentAmount().toFixed(2)} & Place Order` : 'Select Payment Method'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;