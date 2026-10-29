
const mongoose = require("mongoose");

const quotationItemSchema = new mongoose.Schema(
  {
    productService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductService",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    unit: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.01
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const quotationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    quotationNumber: {
      type: String,
      required: true,
      unique: true
    },

    items: {
      type: [quotationItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one item is required"
      }
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["Draft", "Sent", "Accepted", "Rejected"],
      default: "Draft"
    },

    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);
