
export function validateCustomer(customer) {
  const errors = {};

  const name = customer.name.trim();
  const company = customer.companyName.trim();
  const email = customer.email.trim();
  const phone = customer.phone.trim();
  const address = customer.address.trim();

  if (!name) {
    errors.name = "Contact name is required";
  } else if (name.length < 2 || name.length > 60) {
    errors.name = "Contact name must contain 2 to 60 characters";
  }

  if (!company) {
    errors.companyName = "Company name is required";
  } else if (company.length < 2 || company.length > 100) {
    errors.companyName = "Company name must contain 2 to 100 characters";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address";
  }

  const phonePattern = /^\+?[0-9()\s-]+$/;
  const digits = phone.replace(/\D/g, "");

  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (
    !phonePattern.test(phone) ||
    digits.length < 7 ||
    digits.length > 15
  ) {
    errors.phone = "Enter a valid phone number (7 to 15 digits)";
  }

  if (!address) {
    errors.address = "Address is required";
  } else if (address.length < 5 || address.length > 250) {
    errors.address = "Address must contain 5 to 250 characters";
  }

  return errors;
}
