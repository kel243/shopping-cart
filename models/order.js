const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customer: {
    type: String,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
