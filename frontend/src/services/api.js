const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const datos = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, datos };
}

export function login(username, password) {
  return request("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function obtenerClientes() {
  return request("/api/clientes");
}
export function crearCliente(cliente) {
  return request("/api/clientes", { method: "POST", body: JSON.stringify(cliente) });
}
export function actualizarCliente(id, cliente) {
  return request(`/api/clientes/${id}`, { method: "PUT", body: JSON.stringify(cliente) });
}
export function eliminarCliente(id) {
  return request(`/api/clientes/${id}`, { method: "DELETE" });
}

export function obtenerTecnicos() {
  return request("/api/tecnicos");
}
export function crearTecnico(tecnico) {
  return request("/api/tecnicos", { method: "POST", body: JSON.stringify(tecnico) });
}
export function actualizarTecnico(id, tecnico) {
  return request(`/api/tecnicos/${id}`, { method: "PUT", body: JSON.stringify(tecnico) });
}
export function eliminarTecnico(id) {
  return request(`/api/tecnicos/${id}`, { method: "DELETE" });
}

export function obtenerServicios() {
  return request("/api/servicios");
}
export function crearServicio(servicio) {
  return request("/api/servicios", { method: "POST", body: JSON.stringify(servicio) });
}
export function actualizarServicio(id, servicio) {
  return request(`/api/servicios/${id}`, { method: "PUT", body: JSON.stringify(servicio) });
}
export function eliminarServicio(id) {
  return request(`/api/servicios/${id}`, { method: "DELETE" });
}
