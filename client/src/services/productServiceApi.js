
const API_URL = "http://localhost:5000/api/products-services";

// Get all products and services
export async function getProductsServices() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Unable to load products and services");
  }

  return response.json();
}

// Add a new product or service
export async function addProductService(item) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to add item");
  }

  return data;
}

// Update an existing product or service
export async function updateProductService(id, item) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update item");
  }

  return data;
}

// Delete a product or service
export async function deleteProductService(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete item");
  }

  return data;
}
