const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true, enum: ['available', 'busy'] },
  orders: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    status: { type: String, required: true, enum: ['assigned', 'delivered'] }
  }]
});

const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);
module.exports = DeliveryAgent;