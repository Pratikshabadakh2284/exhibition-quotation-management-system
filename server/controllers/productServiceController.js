
const mongoose = require("mongoose");
const ProductService = require("../models/ProductService");

// Validate product or service
function validateItem(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { error: "Invalid form data" };
  }

  const { name, type, unitPrice } = data;

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 100
  ) {
    return { error: "Name must contain 2 to 100 characters" };
  }

  if (!["Product", "Service"].includes(type)) {
    return { error: "Please select Product or Service" };
  }

  if (
    unitPrice === "" ||
    unitPrice === null ||
    unitPrice === undefined ||
    !Number.isFinite(Number(unitPrice)) ||
    Number(unitPrice) < 0.01
  ) {
    return { error: "Enter a valid price greater than zero" };
  }

  return {
    item: {
      name: name.trim(),
      type,
      unitPrice: Number(unitPrice)
    }
  };
}

// Handle server errors
function sendError(res, error) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Server error. Please try again."
  });
}

// Get all products and services
exports.getItems = async (req, res) => {
  try {
    const items = await ProductService.find()
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    sendError(res, error);
  }
};

// Get one item
exports.getItemById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid item ID"
      });
    }

    const item = await ProductService.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json(item);
  } catch (error) {
    sendError(res, error);
  }
};

// Create product or service
exports.createItem = async (req, res) => {
  try {
    const result = validateItem(req.body);

    if (result.error) {
      return res.status(400).json({
        message: result.error
      });
    }

    const item = await ProductService.create(result.item);

    res.status(201).json(item);
  } catch (error) {
    sendError(res, error);
  }
};

// Update product or service
exports.updateItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid item ID"
      });
    }

    const result = validateItem(req.body);

    if (result.error) {
      return res.status(400).json({
        message: result.error
      });
    }

    const item = await ProductService.findByIdAndUpdate(
      req.params.id,
      result.item,
      {
        new: true,
        runValidators: true
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json(item);
  } catch (error) {
    sendError(res, error);
  }
};

// Delete product or service
exports.deleteItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid item ID"
      });
    }

    const item = await ProductService.findByIdAndDelete(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json({
      message: "Item deleted successfully"
    });
  } catch (error) {
    sendError(res, error);
  }
};
