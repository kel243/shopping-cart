const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const specialSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
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
  options: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("SpecialItem", specialSchema);
