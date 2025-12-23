const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fooddelivery';
mongoose.connect(MONGODB_URI);

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        restaurantId: String
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'preparing', 'delivered'], default: 'confirmed' },
    paymentMethod: { type: String, required: true },
    deliveryAddress: { type: String, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PORT = process.env.PORT || 4002;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

app.get('/health', (req, res) => {
    res.json({ status: 'Order service running', port: PORT });
});

app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/orders', verifyToken, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, deliveryAddress } = req.body;
        
        const order = new Order({
            userId: req.user.userId,
            items,
            totalAmount,
            paymentMethod,
            deliveryAddress: 'Default Address'
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/orders/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});