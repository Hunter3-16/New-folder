const express = require('express');
const axios = require('axios');
const connectDB = require('../utils/database');
const User = require('../models/User');
const logger = require('../middleware/logger');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(logger);

// Connect to MongoDB
connectDB();

// Create a new user
app.post('/create-user', async (req, res, next) => {
  try {
    const { fullName, mobileNumber, dateOfBirth, age, gender, username } = req.body;
    const newUser = new User({ fullName, mobileNumber, dateOfBirth, age, gender, username, ratings: [], orders: [] });
    await newUser.save();
    res.status(201).json({ message: 'User created', userId: newUser._id });
  } catch (err) {
    next(err);
  }
});

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
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    user.ratings.push({ orderId, rating });
    await user.save();
    res.json({ message: 'Rating submitted' });
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
