const express = require('express');
const axios = require('axios');
const connectDB = require('../utils/database');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const logger = require('../middleware/logger');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(logger);

// Connect to MongoDB
connectDB();

// Get a list of all restaurants available online at the given hour
app.get('/restaurants', async (req, res, next) => {
  try {
    const hour = req.query.hour;
    const restaurants = await Restaurant.find({ status: 'online' });
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
});

// Place an order to a restaurant
app.post('/order', async (req, res, next) => {
  try {
    const { userId, restaurantId, orderDetails } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.status !== 'online') {
      const error = new Error('Restaurant is offline or not found');
      error.status = 400;
      throw error;
    }

    const newOrder = new Order({ restaurantId, userId, orderDetails, status: 'processing' });
    await newOrder.save();

    const deliveryAgentResponse = await axios.post('http://localhost:3003/assign', { orderId: newOrder._id });
    newOrder.deliveryAgentId = deliveryAgentResponse.data.agentId;
    await newOrder.save();

    res.json({ message: 'Order placed', orderId: newOrder._id });
  } catch (err) {
    next(err);
  }
});

// Update the menu of a restaurant
app.put('/update-menu', async (req, res, next) => {
  try {
    const { restaurantId, menu } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, { menu }, { new: true });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
});

// Update the status of a restaurant
app.put('/update-status', async (req, res, next) => {
  try {
    const { restaurantId, status } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, { status }, { new: true });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
});

// Use the error handling middleware
app.use(errorHandler);

// Start the Restaurant Service
app.listen(3002, () => {
  console.log('Restaurant Service running on port 3002');
});