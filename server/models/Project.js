
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    exhibitionName: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    standSize: {
      type: Number,
      required: true,
      min: 0.01
    },

    status: {
      type: String,
      enum: [
        "Planning",
        "In Progress",
        "Completed",
        "Cancelled"
      ],
      default: "Planning"
    },

    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

projectSchema.path("endDate").validate(function (value) {
  return !this.startDate || value >= this.startDate;
}, "End date cannot be earlier than start date");

module.exports = mongoose.model("Project", projectSchema);
