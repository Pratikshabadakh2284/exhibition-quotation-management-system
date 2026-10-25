
const ProductService = require("../models/ProductService");

function validateItem(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { error: "Invalid form data" };
  }

  const { type, name, category, description, unitPrice, unit } = data;

  if (!["Product", "Service"].includes(type)) {
    return { error: "Please select Product or Service" };
  }

  if (typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 100) {
    return { error: "Name must contain 2 to 100 characters" };
  }

  if (typeof category !== "string" || !category.trim()) {
    return { error: "Category is required" };
  }

  if (typeof description !== "string" ||
      description.trim().length < 5 ||
      description.trim().length > 300) {
    return { error: "Description must contain 5 to 300 characters" };
  }

  if (unitPrice === "" || unitPrice === null ||
      unitPrice === undefined ||
      !Number.isFinite(Number(unitPrice)) ||
      Number(unitPrice) <= 0) {
    return { error: "Enter a valid price greater than zero" };
  }

  const allowedUnits = [
    "Each", "m²", "Metre", "Hour", "Job", "Trip", "Set"
  ];

  if (!allowedUnits.includes(unit)) {
    return { error: "Please select a valid unit" };
  }

  return {
    item: {
      type,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      unitPrice: Number(unitPrice),
      unit
    }
  };
}

function sendError(res, error) {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({
    message: "Server error. Please try again."
  });
}

// GET all products and services
exports.getItems = async (req, res) => {
  try {
    const items = await ProductService.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    sendError(res, error);
  }
};

// GET one item
exports.getItemById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await ProductService.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    sendError(res, error);
  }
};

// POST new item
exports.createItem = async (req, res) => {
  try {
    const result = validateItem(req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const item = await ProductService.create(result.item);
    res.status(201).json(item);
  } catch (error) {
    sendError(res, error);
  }
};

// PUT update item
exports.updateItem = async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const result = validateItem(req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const item = await ProductService.findByIdAndUpdate(
      id,
      result.item,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE item
exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await ProductService.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};
