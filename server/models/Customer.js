
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, "Contact name is required"],
            trim: true,
            minlength: [2, "Name must contain at least 2 characters"],
            maxlength: [60, "Name cannot exceed 60 characters"]
        },

        companyName: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            minlength: [2, "Company name must contain at least 2 characters"],
            maxlength: [100, "Company name cannot exceed 100 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Enter a valid email address"
            ]
        },

        phone: {
            type: String,
            trim: true,
            default: "",
            validate: {
                validator: function (value) {
                    if (!value) return true;

                    const digits = value.replace(/\D/g, "");

                    return /^\+?[0-9()\s-]+$/.test(value) &&
                        digits.length >= 7 &&
                        digits.length <= 15;
                },
                message: "Enter a valid phone number"
            }
        },

        address: {
            type: String,
            trim: true,
            default: "",
            maxlength: [250, "Address cannot exceed 250 characters"]
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
