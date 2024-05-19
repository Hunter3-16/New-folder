const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  menu: [{ item: { type: String, required: true }, price: { type: Number, required: true } }],
  status: { type: String, required: true, enum: ['online', 'offline'] },
  orders: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderDetails: { type: Object, required: true }
  }]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;