
const BASE_URL = "http://localhost:5000/api";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function getQuotations() {
  const response = await fetch(`${BASE_URL}/quotations`);
  return handleResponse(response);
}

export async function addQuotation(quotation) {
  const response = await fetch(`${BASE_URL}/quotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quotation)
  });

  return handleResponse(response);
}

export async function updateQuotation(id, quotation) {
  const response = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quotation)
  });

  return handleResponse(response);
}

export async function deleteQuotation(id) {
  const response = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "DELETE"
  });

  return handleResponse(response);
}

export async function getQuotationProjects() {
  const response = await fetch(`${BASE_URL}/projects`);
  return handleResponse(response);
}

export async function getQuotationProducts() {
  const response = await fetch(`${BASE_URL}/products-services`);
  return handleResponse(response);
}
