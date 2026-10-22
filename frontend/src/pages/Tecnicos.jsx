import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
obtenerTecnicos, crearTecnico,
actualizarTecnico, eliminarTecnico
} from "../services/api";
function Tecnicos() {
const [tecnicos,setTecnicos]=useState([]);
const [nombre,setNombre]=useState("");
const [especialidad,setEspecialidad]=useState("");
const [editandoId,setEditandoId]=useState(null);
const [mensaje,setMensaje]=useState("");
const cargarTecnicos=async()=>{
const r=await obtenerTecnicos();
if(r.ok && r.datos.success) setTecnicos(r.datos.tecnicos);
else setMensaje(r.datos.message || "Error al cargar");
};
useEffect(()=>{ cargarTecnicos(); },[]);
const guardar=async(e)=>{
e.preventDefault();
if(!nombre.trim() || !especialidad.trim()){
setMensaje("Todos los campos son obligatorios"); return;
}
const datos={nombre,especialidad};
const r=editandoId
? await actualizarTecnico(editandoId,datos)
: await crearTecnico(datos);
setMensaje(r.datos.message || "Operación realizada");
if(r.ok){
setNombre(""); setEspecialidad(""); setEditandoId(null);
await cargarTecnicos();
}
};
const editar=(tecnico)=>{
setEditandoId(tecnico.id);
setNombre(tecnico.nombre);
setEspecialidad(tecnico.especialidad);
};
const eliminar=async(id)=>{
if(!window.confirm("¿Deseas eliminar este técnico?")) return;
const r=await eliminarTecnico(id);
setMensaje(r.datos.message || "Operación realizada");
if(r.ok) await cargarTecnicos();
};
return (
<div className="dashboard">
<h1>Técnicos</h1>
<nav aria-label="Navegación principal">
<Link to="/dashboard">Inicio</Link>
<Link to="/clientes">Clientes</Link>
<Link to="/tecnicos">Técnicos</Link>
<Link to="/servicios">Servicios</Link>
</nav>
<form className="formulario-gestion formulario-tecnicos" onSubmit={guardar}>
<div className="campo-formulario">
<label htmlFor="nombre-tecnico">Nombre</label>
<input value={nombre}
id="nombre-tecnico"
onChange={e=>setNombre(e.target.value)}
placeholder="Nombre del técnico" required/>
</div>
<div className="campo-formulario">
<label htmlFor="especialidad-tecnico">Especialidad</label>
<input value={especialidad}
id="especialidad-tecnico"
onChange={e=>setEspecialidad(e.target.value)}
placeholder="Especialidad" required/>
</div>
<div className="acciones-formulario">
<button type="submit">
{editandoId ? "Actualizar" : "Registrar"}
</button>
{editandoId && <button className="boton-secundario" type="button"
onClick={()=>{setEditandoId(null);setNombre("");setEspecialidad("");}}>
Cancelar
</button>}
</div>
</form>
{mensaje && <p className="aviso" role="status">{mensaje}</p>}
<div className="tabla-contenedor"><table>
<thead><tr>
<th>ID</th><th>Nombre</th><th>Especialidad</th><th>Acciones</th>
</tr></thead>
<tbody>
{tecnicos.map(tecnico=>
<tr key={tecnico.id}>
<td>{tecnico.id}</td>
<td>{tecnico.nombre}</td>
<td>{tecnico.especialidad}</td>
<td><div className="acciones-tabla">
<button onClick={()=>editar(tecnico)}>Editar</button>
<button className="boton-peligro" onClick={()=>eliminar(tecnico.id)}>Eliminar</button>
</div></td>
</tr>
)}
{tecnicos.length === 0 && <tr><td className="tabla-vacia" colSpan="4">No hay técnicos registrados.</td></tr>}
</tbody>
</table></div>
</div>
);
}
export default Tecnicos;