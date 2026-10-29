const API_URL = "http://localhost:5000/api/projects";
const CUSTOMER_URL = "http://localhost:5000/api/customers";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function getProjects() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function getProjectById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
}

export async function addProject(project) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  });

  return handleResponse(response);
}

export async function updateProject(id, project) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  });

  return handleResponse(response);
}

export async function deleteProject(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  return handleResponse(response);
}

export async function getProjectCustomers() {
  const response = await fetch(CUSTOMER_URL);
  return handleResponse(response);
}
