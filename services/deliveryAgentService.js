const express = require('express');
const connectDB = require('../utils/database');
const DeliveryAgent = require('../models/DeliveryAgent');
const logger = require('../middleware/logger');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(logger);

// Connect to MongoDB
connectDB();

// Create a new delivery agent
app.post('/create-agent', async (req, res, next) => {
  try {
    const { fullName, mobileNumber, dateOfBirth, age, status } = req.body;
    const newAgent = new DeliveryAgent({ fullName, mobileNumber, dateOfBirth, age, status, orders: [] });
    await newAgent.save();
    res.status(201).json({ message: 'Delivery agent created', agentId: newAgent._id });
  } catch (err) {
    next(err);
  }
});

// Assign a delivery agent to an order
app.post('/assign', async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const agent = await DeliveryAgent.findOneAndUpdate({ status: 'available' }, { status: 'busy' }, { new: true });
    if (!agent) {
      const error = new Error('No available delivery agents');
      error.status = 404;
      throw error;
    }
    agent.orders.push({ orderId, status: 'assigned' });
    await agent.save();
    res.json({ message: 'Delivery agent assigned', agentId: agent._id });
  } catch (err) {
    next(err);
  }
});

// Update the delivery status of an order
app.put('/update-status', async (req, res, next) => {
  try {
    const { agentId, orderId, status } = req.body;
    const agent = await DeliveryAgent.findById(agentId);
    if (!agent) {
      const error = new Error('Delivery agent not found');
      error.status = 404;
      throw error;
    }
    const order = agent.orders.find(order => order.orderId.toString() === orderId);
    if (!order) {
      const error = new Error('Order not found for this agent');
      error.status = 404;
      throw error;
    }
    order.status = status;
    if (status === 'delivered') agent.status = 'available';
    await agent.save();
    res.json({ message: 'Order status updated' });
  } catch (err) {
    next(err);
  }
});

// Use the error handling middleware
app.use(errorHandler);

// Start the Delivery Agent Service
app.listen(3003, () => {
  console.log('Delivery Agent Service running on port 3003');
});
