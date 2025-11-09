// src/api.js
export const API_BASE = "http://127.0.0.1:8000/api"; // or your server URL

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  return res.json();
}

export async function apiPost(path, body = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
