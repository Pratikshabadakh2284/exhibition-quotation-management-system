
export function validateProductService(item) {
  const errors = {};

  // Validate Type
  if (!item.type) {
    errors.type = "Please select Product or Service";
  } else if (!["Product", "Service"].includes(item.type)) {
    errors.type = "Please select a valid type";
  }

  // Validate Name
  if (!item.name || !item.name.trim()) {
    errors.name = "Name is required";
  } else if (item.name.trim().length < 2) {
    errors.name = "Name must contain at least 2 characters";
  } else if (item.name.trim().length > 100) {
    errors.name = "Name cannot exceed 100 characters";
  }

  // Validate Category
  if (!item.category || !item.category.trim()) {
    errors.category = "Category is required";
  }

  // Validate Description
  if (!item.description || !item.description.trim()) {
    errors.description = "Description is required";
  } else if (item.description.trim().length < 5) {
    errors.description = "Description must contain at least 5 characters";
  } else if (item.description.trim().length > 300) {
    errors.description = "Description cannot exceed 300 characters";
  }

  // Validate Unit Price
  if (
    item.unitPrice === "" ||
    item.unitPrice === null ||
    item.unitPrice === undefined
  ) {
    errors.unitPrice = "Unit price is required";
  } else if (
    !Number.isFinite(Number(item.unitPrice)) ||
    Number(item.unitPrice) <= 0
  ) {
    errors.unitPrice = "Unit price must be greater than zero";
  } else if (Number(item.unitPrice) > 1000000) {
    errors.unitPrice = "Unit price cannot exceed €1,000,000";
  } else if (
    !/^\d+(\.\d{1,2})?$/.test(String(item.unitPrice))
  ) {
    errors.unitPrice = "Unit price can have a maximum of 2 decimal places";
  }

  // Validate Unit
  const allowedUnits = [
    "Each",
    "m²",
    "Metre",
    "Hour",
    "Job",
    "Trip",
    "Set"
  ];

  if (!item.unit) {
    errors.unit = "Please select a unit";
  } else if (!allowedUnits.includes(item.unit)) {
    errors.unit = "Please select a valid unit";
  }

  return errors;
}
