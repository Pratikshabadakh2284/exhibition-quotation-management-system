
export function validateQuotation(form) {
  const errors = {};

  if (!form.project) {
    errors.project = "Please select an exhibition project";
  }

  if (!Array.isArray(form.items) || form.items.length === 0) {
    errors.items = "Please add at least one product or service";
  } else {
    form.items.forEach((item, index) => {
      if (!item.productService) {
        errors[`item_${index}`] = "Please select a product or service";
      } else if (
        item.quantity === "" ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0
      ) {
        errors[`item_${index}`] = "Quantity must be greater than zero";
      }
    });
  }

  return errors;
}
