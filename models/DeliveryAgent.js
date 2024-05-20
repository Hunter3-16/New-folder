const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  status: { type: String, required: true, enum: ['available', 'busy'] },
  orders: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    status: { type: String, required: true, enum: ['assigned', 'delivered'] }
  }]
});

const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);
module.exports = DeliveryAgent;
