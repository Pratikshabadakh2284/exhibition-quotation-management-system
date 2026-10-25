
const mongoose = require("mongoose");

const productServiceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Product", "Service"]
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must contain at least 5 characters"],
      maxlength: [300, "Description cannot exceed 300 characters"]
    },

    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0.01, "Unit price must be greater than zero"]
    },

    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["Each", "m²", "Metre", "Hour", "Job", "Trip", "Set"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductService", productServiceSchema);
