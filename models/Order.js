const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderDetails: { type: Object, required: true },
  status: { type: String, required: true, enum: ['processing', 'assigned', 'delivered'] },
  deliveryAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent' }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;