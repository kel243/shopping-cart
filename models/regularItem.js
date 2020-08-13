const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const regularSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  prices: [
    {
      type: String,
      required: true,
    },
  ],
  spicy: {
    type: Boolean,
    default: false,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("RegularItem", regularSchema);
