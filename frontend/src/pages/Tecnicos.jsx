import { useEffect, useState } from "react";
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
<form onSubmit={guardar}>
<input value={nombre}
onChange={e=>setNombre(e.target.value)}
placeholder="Nombre"/>
<input value={especialidad}
onChange={e=>setEspecialidad(e.target.value)}
placeholder="Especialidad"/>
<button type="submit">
{editandoId ? "Actualizar" : "Registrar"}
</button>
{editandoId && <button type="button"
onClick={()=>{setEditandoId(null);setNombre("");setEspecialidad("");}}>
Cancelar
</button>}
</form>
{mensaje && <p>{mensaje}</p>}
<table>
<thead><tr>
<th>ID</th><th>Nombre</th><th>Especialidad</th><th>Acciones</th>
</tr></thead>
<tbody>
{tecnicos.map(tecnico=>
<tr key={tecnico.id}>
<td>{tecnico.id}</td>
<td>{tecnico.nombre}</td>
<td>{tecnico.especialidad}</td>
<td>
<button onClick={()=>editar(tecnico)}>Editar</button>
<button onClick={()=>eliminar(tecnico.id)}>Eliminar</button>
</td>
</tr>
)}
</tbody>
</table>
</div>
);
}
export default Tecnicos;