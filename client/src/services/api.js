const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const buildHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (response) => {
  if (response.ok) {
    return response.status === 204 ? null : response.json();
  }

  const errorBody = await response.json().catch(() => ({}));
  throw new Error(errorBody.message || "Error en la API");
};

export const api = {
  login: async (payload) =>
    handleResponse(
      await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      })
    ),
  refreshToken: async (token) =>
    handleResponse(
      await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: buildHeaders(token),
      })
    ),
  get: async (resource, token) =>
    handleResponse(
      await fetch(`${API_BASE}/${resource}`, {
        headers: buildHeaders(token),
      })
    ),
  create: async (resource, payload, token) =>
    handleResponse(
      await fetch(`${API_BASE}/${resource}`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      })
    ),
  update: async (resource, id, payload, token) =>
    handleResponse(
      await fetch(`${API_BASE}/${resource}/${id}`, {
        method: "PUT",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      })
    ),
  remove: async (resource, id, token) =>
    handleResponse(
      await fetch(`${API_BASE}/${resource}/${id}`, {
        method: "DELETE",
        headers: buildHeaders(token),
      })
    ),
  translate: async (payload, token, signal) =>
    handleResponse(
      await fetch(`${API_BASE}/translate`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
        signal,
      })
    ),
  getUsers: async (token) =>
    handleResponse(
      await fetch(`${API_BASE}/users`, {
        headers: buildHeaders(token),
      })
    ),
  createUser: async (payload, token) =>
    handleResponse(
      await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      })
    ),
  updateUserPassword: async (id, payload, token) =>
    handleResponse(
      await fetch(`${API_BASE}/users/${id}/password`, {
        method: "PUT",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      })
    ),
  removeUser: async (id, token) =>
    handleResponse(
      await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: buildHeaders(token),
      })
    ),
};
