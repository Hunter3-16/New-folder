const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  username: { type: String, required: true },
  ratings: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true }
  }],
  orders: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    orderDetails: { type: Object, required: true }
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
