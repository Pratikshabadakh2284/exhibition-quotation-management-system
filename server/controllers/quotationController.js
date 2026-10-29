
const mongoose = require("mongoose");

const Quotation = require("../models/Quotation");
const Project = require("../models/Project");
const ProductService = require("../models/ProductService");

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Prepare quotation items using catalogue prices
async function prepareItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Please add at least one item");
  }

  const preparedItems = [];

  for (const item of items) {
    if (!mongoose.isValidObjectId(item.productService)) {
      throw new Error("Invalid product or service selected");
    }

    const quantity = Number(item.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const product = await ProductService.findById(
      item.productService
    );

    if (!product) {
      throw new Error("Selected product or service not found");
    }

    const unitPrice = Number(product.unitPrice);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error("Invalid catalogue price");
    }

    preparedItems.push({
      productService: product._id,
      name: product.name,
      unit: product.unit,
      quantity,
      unitPrice,
      lineTotal: roundMoney(quantity * unitPrice)
    });
  }

  return preparedItems;
}

// Get all quotations
exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate({
        path: "project",
        populate: {
          path: "customer"
        }
      })
      .sort({ createdAt: -1 });

    res.json(quotations);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load quotations"
    });
  }
};

// Get a quotation by ID
exports.getQuotationById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid quotation ID"
      });
    }

    const quotation = await Quotation.findById(req.params.id)
      .populate({
        path: "project",
        populate: {
          path: "customer"
        }
      });

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found"
      });
    }

    res.json(quotation);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load quotation"
    });
  }
};

// Create quotation
exports.createQuotation = async (req, res) => {
  try {
    const { project, items, notes = "" } = req.body;

    if (!mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        message: "Please select a valid project"
      });
    }

    const projectExists = await Project.exists({
      _id: project
    });

    if (!projectExists) {
      return res.status(400).json({
        message: "Selected project does not exist"
      });
    }

    const preparedItems = await prepareItems(items);

    const subtotal = roundMoney(
      preparedItems.reduce(
        (total, item) => total + item.lineTotal,
        0
      )
    );

    // Generate a unique quotation reference
    const quotationNumber =
      "QT-" +
      new Date().getFullYear() +
      "-" +
      new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase();

    const quotation = await Quotation.create({
      project,
      quotationNumber,
      items: preparedItems,
      subtotal,
      status: "Draft",
      notes
    });

    res.status(201).json(quotation);
  } catch (error) {
    if (error.message.startsWith("Please") ||
        error.message.startsWith("Invalid") ||
        error.message.startsWith("Quantity") ||
        error.message.startsWith("Selected")) {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Create quotation error:", error);

    res.status(500).json({
      message: "Unable to create quotation"
    });
  }
};

// Update quotation
exports.updateQuotation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid quotation ID"
      });
    }

    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found"
      });
    }

    const { project, items, status, notes } = req.body;

    if (project !== undefined) {
      if (!mongoose.isValidObjectId(project)) {
        return res.status(400).json({
          message: "Invalid project selected"
        });
      }

      const projectExists = await Project.exists({
        _id: project
      });

      if (!projectExists) {
        return res.status(400).json({
          message: "Selected project does not exist"
        });
      }

      quotation.project = project;
    }

    if (items !== undefined) {
      quotation.items = await prepareItems(items);

      quotation.subtotal = roundMoney(
        quotation.items.reduce(
          (total, item) => total + item.lineTotal,
          0
        )
      );
    }

    if (status !== undefined) {
      quotation.status = status;
    }

    if (notes !== undefined) {
      quotation.notes = notes;
    }

    await quotation.save();

    res.json(quotation);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    if (error.message.startsWith("Please") ||
        error.message.startsWith("Invalid") ||
        error.message.startsWith("Quantity") ||
        error.message.startsWith("Selected")) {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Update quotation error:", error);

    res.status(500).json({
      message: "Unable to update quotation"
    });
  }
};

// Delete quotation
exports.deleteQuotation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid quotation ID"
      });
    }

    const quotation = await Quotation.findByIdAndDelete(
      req.params.id
    );

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found"
      });
    }

    res.json({
      message: "Quotation deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete quotation"
    });
  }
};
