const API_URL = "http://localhost:8081";

async function apiRequest(endpoint, method = "GET", data) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_URL}${endpoint}`, options);
  return res.json().catch(() => res.text());
}
