
const mongoose = require("mongoose");

const productServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },

    type: {
      type: String,
      required: true,
      enum: ["Product", "Service"]
    },

    unitPrice: {
      type: Number,
      required: true,
      min: [0.01, "Unit price must be greater than zero"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ProductService",
  productServiceSchema
);
