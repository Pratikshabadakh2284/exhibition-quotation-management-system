
const API_URL = "http://localhost:5000/api/customers";

export async function getCustomers() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Unable to load customers");
  }

  return response.json();
}

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
    throw new Error(data.message || "Unable to add customer");
  }

  return data;
}

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
    throw new Error(data.message || "Unable to update customer");
  }

  return data;
}

export async function deleteCustomer(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete customer");
  }

  return data;
}
