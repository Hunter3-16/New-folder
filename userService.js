const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(logger);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodDelivery', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB for User Service'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define the User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  ratings: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    rating: Number
  }]
});
const User = mongoose.model('User', userSchema);

// Get a list of all restaurants available online at the given hour
app.get('/restaurants', async (req, res, next) => {
  try {
    const hour = new Date().getHours();
    const response = await axios.get(`http://localhost:3002/restaurants?hour=${hour}`);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

// Place an order from the available restaurants
app.post('/order', async (req, res, next) => {
  try {
    const { userId, restaurantId, orderDetails } = req.body;
    const response = await axios.post('http://localhost:3002/order', { userId, restaurantId, orderDetails });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

// Allow users to leave ratings for their orders and delivery agents
app.post('/rate', async (req, res, next) => {
  try {
    const { userId, orderId, rating } = req.body;
    const user = await User.findById(userId);
    if (user) {
      user.ratings.push({ orderId, rating });
      await user.save();
      res.json({ message: 'Rating submitted' });
    } else {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

// Use the error handling middleware
app.use(errorHandler);

// Start the User Service
app.listen(3001, () => {
  console.log('User Service running on port 3001');
});