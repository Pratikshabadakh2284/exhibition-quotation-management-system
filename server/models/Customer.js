
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
      minlength: [2, "Contact name must have at least 2 characters"],
      maxlength: [60, "Contact name cannot exceed 60 characters"]
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must have at least 2 characters"],
      maxlength: [100, "Company name cannot exceed 100 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Enter a valid email address"
      ]
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (value) {
          if (typeof value !== "string") return false;

          const digits = value.replace(/\D/g, "");

          return (
            /^\+?[0-9()\s-]+$/.test(value) &&
            digits.length >= 7 &&
            digits.length <= 15
          );
        },
        message: "Enter a valid phone number (7 to 15 digits)"
      }
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must have at least 5 characters"],
      maxlength: [250, "Address cannot exceed 250 characters"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
