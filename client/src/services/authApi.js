
const BASE_URL = "http://localhost:5000/api/auth";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data;
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  return handleResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/me`, {
    credentials: "include"
  });

  return handleResponse(response);
}

export async function logout() {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });

  return handleResponse(response);
}
