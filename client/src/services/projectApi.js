
const API_URL = "http://localhost:5000/api/projects";
const CUSTOMER_URL = "http://localhost:5000/api/customers";

// Get all projects
export async function getProjects() {
  const response = await fetch(API_URL, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Unable to load projects");
  }

  return response.json();
}

// Get customers for dropdown
export async function getProjectCustomers() {
  const response = await fetch(CUSTOMER_URL, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Unable to load customers");
  }

  return response.json();
}

// Add project
export async function addProject(project) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(project)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to add project");
  }

  return data;
}

// Update project
export async function updateProject(id, project) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(project)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update project");
  }

  return data;
}

// Delete project
export async function deleteProject(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete project");
  }

  return data;
}
