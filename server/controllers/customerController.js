
const Customer = require("../models/Customer");

// Check if the customer ID is valid
function isValidId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Validate and clean customer details
function validateCustomer(data) {
  const fields = ["name", "companyName", "email", "phone", "address"];
  const customer = {};

  for (const field of fields) {
    if (typeof data[field] !== "string") {
      return { error: `${field} is required` };
    }

    customer[field] = data[field].trim();
  }

  customer.email = customer.email.toLowerCase();

  if (customer.name.length < 2 || customer.name.length > 60) {
    return { error: "Contact name must contain 2 to 60 characters" };
  }

  if (
    customer.companyName.length < 2 ||
    customer.companyName.length > 100
  ) {
    return { error: "Company name must contain 2 to 100 characters" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return { error: "Enter a valid email address" };
  }

  const digits = customer.phone.replace(/\D/g, "");

  if (
    !/^\+?[0-9()\s-]+$/.test(customer.phone) ||
    digits.length < 7 ||
    digits.length > 15
  ) {
    return { error: "Enter a valid phone number (7 to 15 digits)" };
  }

  if (customer.address.length < 5 || customer.address.length > 250) {
    return { error: "Address must contain 5 to 250 characters" };
  }

  return { customer };
}

// Return a useful error message
function sendError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "A customer with this email already exists"
    });
  }

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

// GET all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    sendError(res, error);
  }
};

// GET one customer
exports.getCustomerById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    sendError(res, error);
  }
};

// POST new customer
exports.createCustomer = async (req, res) => {
  try {
    const result = validateCustomer(req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const existingCustomer = await Customer.findOne({
      email: result.customer.email
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "A customer with this email already exists"
      });
    }

    const customer = await Customer.create(result.customer);

    res.status(201).json(customer);
  } catch (error) {
    sendError(res, error);
  }
};

// PUT update customer
exports.updateCustomer = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const result = validateCustomer(req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      result.customer,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE customer
exports.deleteCustomer = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};
