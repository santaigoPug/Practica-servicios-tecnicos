const API_URL = "http://127.0.0.1:5000";
export async function login(username, password) {
const respuesta = await fetch(`${API_URL}/api/login`, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
username,
password,
}),
});
const datos = await respuesta.json();
return {
ok: respuesta.ok,
status: respuesta.status,
datos,
};
}
export async function obtenerClientes() {
     const respuesta = await fetch("http://127.0.0.1:5000/api/clientes");
     const datos = await respuesta.json();
     return { ok: respuesta.ok, status: respuesta.status, datos };
}
const APIs_URL = "http://127.0.0.1:5000/api/clientes";
export async function crearCliente(cliente) {
const r = await fetch(API_URL, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(cliente)
});
return { ok: r.ok, datos: await r.json() };
}
export async function actualizarCliente(id, cliente) {
const r = await fetch(`${API_URL}/${id}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(cliente)
});
return { ok: r.ok, datos: await r.json() };
}
export async function eliminarCliente(id) {
     const r = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
return { ok: r.ok, datos: await r.json() };
}
const API_TECNICOS = "http://127.0.0.1:5000/api/tecnicos";
export async function obtenerTecnicos() {
const r = await fetch(API_TECNICOS);
return { ok: r.ok, datos: await r.json() };
}
export async function crearTecnico(tecnico) {
const r = await fetch(API_TECNICOS, {
method: "POST",
headers: {"Content-Type":"application/json"},
body: JSON.stringify(tecnico)
});
return { ok: r.ok, datos: await r.json() };
}
export async function actualizarTecnico(id, tecnico) {
const r = await fetch(`${API_TECNICOS}/${id}`, {
method: "PUT",
headers: {"Content-Type":"application/json"},
body: JSON.stringify(tecnico)
});
return { ok: r.ok, datos: await r.json() };
}
export async function eliminarTecnico(id) {
const r = await fetch(`${API_TECNICOS}/${id}`, {method:"DELETE"});
return { ok: r.ok, datos: await r.json() };
}