import { useCallback, useEffect, useState } from "react";
import {
  actualizarServicio, crearServicio, eliminarServicio,
  obtenerClientes, obtenerServicios, obtenerTecnicos,
} from "../services/api";

const ESTADOS = ["Pendiente", "En proceso", "Finalizado", "Cancelado"];
const FORMULARIO_VACIO = { descripcion: "", cliente_id: "", tecnico_id: "", estado: "Pendiente" };

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [s, c, t] = await Promise.all([obtenerServicios(), obtenerClientes(), obtenerTecnicos()]);
      if (!s.ok || !s.datos.success) throw new Error(s.datos.message || "No se pudieron cargar los servicios.");
      setServicios(s.datos.servicios || []);
      setClientes(c.ok && c.datos.success ? c.datos.clientes || [] : []);
      setTecnicos(t.ok && t.datos.success ? t.datos.tecnicos || [] : []);
      setMensaje("");
    } catch (error) {
      setMensaje(error.message || "Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const cambiarCampo = (event) => {
    setFormulario((actual) => ({ ...actual, [event.target.name]: event.target.value }));
  };

  const guardar = async (event) => {
    event.preventDefault();
    if (!formulario.descripcion.trim() || !formulario.cliente_id || !formulario.tecnico_id) {
      setMensaje("Descripción, cliente y técnico son obligatorios.");
      return;
    }
    try {
      const datos = {
        ...formulario,
        descripcion: formulario.descripcion.trim(),
        cliente_id: Number(formulario.cliente_id),
        tecnico_id: Number(formulario.tecnico_id),
      };
      const resultado = editandoId
        ? await actualizarServicio(editandoId, datos)
        : await crearServicio(datos);
      setMensaje(resultado.datos.message || (resultado.ok ? "Servicio guardado." : "No se pudo guardar el servicio."));
      if (resultado.ok) {
        setFormulario(FORMULARIO_VACIO);
        setEditandoId(null);
        await cargarDatos();
      }
    } catch {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  const editar = (servicio) => {
    setEditandoId(servicio.id);
    setFormulario({
      descripcion: servicio.descripcion || "",
      cliente_id: String(servicio.cliente_id),
      tecnico_id: String(servicio.tecnico_id),
      estado: servicio.estado || "Pendiente",
    });
    setMensaje("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
    try {
      const resultado = await eliminarServicio(id);
      setMensaje(resultado.datos.message || (resultado.ok ? "Servicio eliminado." : "No se pudo eliminar el servicio."));
      if (resultado.ok) await cargarDatos();
    } catch {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  const cancelar = () => { setEditandoId(null); setFormulario(FORMULARIO_VACIO); };

  return (
    <main className="dashboard">
      <h1>Gestión de servicios</h1>
      {mensaje && <p role="status">{mensaje}</p>}
      {(clientes.length === 0 || tecnicos.length === 0) && (
        <p>Para registrar servicios, primero agrega al menos un cliente y un técnico.</p>
      )}
      <form onSubmit={guardar}>
        <label htmlFor="descripcion">Descripción</label>
        <input id="descripcion" name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} required maxLength={500} />
        <label htmlFor="cliente_id">Cliente</label>
        <select id="cliente_id" name="cliente_id" value={formulario.cliente_id} onChange={cambiarCampo} required>
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}
        </select>
        <label htmlFor="tecnico_id">Técnico</label>
        <select id="tecnico_id" name="tecnico_id" value={formulario.tecnico_id} onChange={cambiarCampo} required>
          <option value="">Selecciona un técnico</option>
          {tecnicos.map((tecnico) => <option key={tecnico.id} value={tecnico.id}>{tecnico.nombre} — {tecnico.especialidad}</option>)}
        </select>
        <label htmlFor="estado">Estado</label>
        <select id="estado" name="estado" value={formulario.estado} onChange={cambiarCampo}>
          {ESTADOS.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
        </select>
        <button type="submit" disabled={clientes.length === 0 || tecnicos.length === 0}>
          {editandoId ? "Guardar cambios" : "Registrar servicio"}
        </button>
        {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
      </form>
      {cargando ? <p>Cargando servicios…</p> : (
        <table>
          <thead><tr><th>ID</th><th>Descripción</th><th>Cliente</th><th>Técnico</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td><td>{servicio.descripcion}</td><td>{servicio.cliente}</td>
                <td>{servicio.tecnico}</td><td>{servicio.estado}</td><td>{servicio.fecha ? String(servicio.fecha).slice(0, 10) : "—"}</td>
                <td><button type="button" onClick={() => editar(servicio)}>Editar</button>{" "}
                  <button type="button" onClick={() => eliminar(servicio.id)}>Eliminar</button></td>
              </tr>
            ))}
            {servicios.length === 0 && <tr><td colSpan="7">No hay servicios registrados.</td></tr>}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default Servicios;
