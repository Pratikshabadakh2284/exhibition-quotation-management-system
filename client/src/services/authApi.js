
const API_URL = "http://localhost:5000/api/auth";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const login = (email, password) => {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
};

export const logout = () => {
  return request("/logout", {
    method: "POST"
  });
};

export const getCurrentUser = () => {
  return request("/me");
};

export const createStaff = (staff) => {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(staff)
  });
};

export const getStaff = () => {
  return request("/users");
};

export const changePassword = (passwords) => {
  return request("/change-password", {
    method: "PUT",
    body: JSON.stringify(passwords)
  });
};
