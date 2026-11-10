
const BASE_URL = "http://localhost:5000/api";

// Handle API response
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// Get all quotations
export async function getQuotations() {
  const response = await fetch(`${BASE_URL}/quotations`, {
    credentials: "include"
  });

  return handleResponse(response);
}

// Create quotation
export async function addQuotation(quotation) {
  const response = await fetch(`${BASE_URL}/quotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(quotation)
  });

  return handleResponse(response);
}

// Update quotation
export async function updateQuotation(id, quotation) {
  const response = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(quotation)
  });

  return handleResponse(response);
}

// Delete quotation
export async function deleteQuotation(id) {
  const response = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  return handleResponse(response);
}

// Get exhibition projects
export async function getQuotationProjects() {
  const response = await fetch(`${BASE_URL}/projects`, {
    credentials: "include"
  });

  return handleResponse(response);
}

// Get products and services
export async function getQuotationProducts() {
  const response = await fetch(
    `${BASE_URL}/products-services`,
    {
      credentials: "include"
    }
  );

  return handleResponse(response);
}
