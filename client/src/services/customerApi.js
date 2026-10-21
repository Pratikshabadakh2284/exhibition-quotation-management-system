
const API_URL = "http://localhost:5000/api/customers";

// Get all customers
export async function getCustomers() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load customers");
  }

  return response.json();
}

// Add a customer
export async function addCustomer(customer) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(customer)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add customer");
  }

  return data;
}

// Update a customer
export async function updateCustomer(id, customer) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(customer)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update customer");
  }

  return data;
}

// Delete a customer
export async function deleteCustomer(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete customer");
  }
}
