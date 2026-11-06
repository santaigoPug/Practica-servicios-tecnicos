import { useCallback, useEffect, useMemo, useState } from "react";
import {
  actualizarServicio, crearServicio, eliminarServicio,
  obtenerClientes, obtenerServicios, obtenerTecnicos,
} from "../services/api";
import Layout from "../components/Layout";
import { IconoServicios } from "../components/Iconos";
import { ESTADOS, claseEstado } from "../utils/estados";

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

  const conteo = useMemo(
    () => ESTADOS.map((estado) => ({ estado, total: servicios.filter((s) => s.estado === estado).length })),
    [servicios],
  );

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

  const sinBase = clientes.length === 0 || tecnicos.length === 0;

  return (
    <Layout>
      {mensaje && <p className="aviso" role="status">{mensaje}</p>}
      {sinBase && !cargando && (
        <p className="aviso aviso-info">Para registrar servicios, primero agrega al menos un cliente y un técnico.</p>
      )}
      <div className="bento">
        <section className="tile tile-acento span-4">
          <div className="tile-encabezado">
            <span className="tile-etiqueta">Servicios</span>
            <span className="tile-icono"><IconoServicios /></span>
          </div>
          <p className="stat-numero">{cargando ? "–" : servicios.length}</p>
          <p className="stat-detalle">{servicios.length === 1 ? "servicio registrado" : "servicios registrados"}</p>
        </section>

        {conteo.map(({ estado, total }) => (
          <section className="tile span-2" key={estado}>
            <span className={claseEstado(estado)} style={{ alignSelf: "flex-start" }}>{estado}</span>
            <p className="stat-numero" style={{ fontSize: "clamp(32px, 4vw, 44px)" }}>{cargando ? "–" : total}</p>
          </section>
        ))}

        <section className="tile span-12">
          <h2>{editandoId ? "Editar servicio" : "Nuevo servicio"}</h2>
          <form className="formulario formulario-servicio" onSubmit={guardar}>
            <div className="campo campo-descripcion">
              <label htmlFor="descripcion">Descripción</label>
              <input
                id="descripcion"
                name="descripcion"
                value={formulario.descripcion}
                onChange={cambiarCampo}
                placeholder="¿Qué se necesita resolver?"
                required
                maxLength={500}
              />
            </div>
            <div className="campo">
              <label htmlFor="cliente_id">Cliente</label>
              <select id="cliente_id" name="cliente_id" value={formulario.cliente_id} onChange={cambiarCampo} required>
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="tecnico_id">Técnico</label>
              <select id="tecnico_id" name="tecnico_id" value={formulario.tecnico_id} onChange={cambiarCampo} required>
                <option value="">Selecciona un técnico</option>
                {tecnicos.map((tecnico) => <option key={tecnico.id} value={tecnico.id}>{tecnico.nombre} — {tecnico.especialidad}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="estado">Estado</label>
              <select id="estado" name="estado" value={formulario.estado} onChange={cambiarCampo}>
                {ESTADOS.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
              </select>
            </div>
            <div className="acciones acciones-servicio">
              <button className="btn" type="submit" disabled={sinBase}>
                {editandoId ? "Guardar cambios" : "Registrar servicio"}
              </button>
              {editandoId && <button className="btn btn-secundario" type="button" onClick={cancelar}>Cancelar</button>}
            </div>
          </form>
        </section>

        <section className="tile span-12">
          <h2>Listado de servicios</h2>
          {cargando ? (
            <p className="lista-vacia">Cargando servicios…</p>
          ) : (
            <div className="tabla-contenedor">
              <table>
                <thead>
                  <tr><th>ID</th><th>Descripción</th><th>Cliente</th><th>Técnico</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {servicios.map((servicio) => (
                    <tr key={servicio.id}>
                      <td>{servicio.id}</td>
                      <td className="celda-descripcion">{servicio.descripcion}</td>
                      <td>{servicio.cliente}</td>
                      <td>{servicio.tecnico}</td>
                      <td><span className={claseEstado(servicio.estado)}>{servicio.estado}</span></td>
                      <td>{servicio.fecha ? String(servicio.fecha).slice(0, 10) : "—"}</td>
                      <td>
                        <div className="acciones">
                          <button type="button" className="btn btn-secundario btn-chico" onClick={() => editar(servicio)}>Editar</button>
                          <button type="button" className="btn btn-peligro btn-chico" onClick={() => eliminar(servicio.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {servicios.length === 0 && (
                    <tr><td className="tabla-vacia" colSpan="7">No hay servicios registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default Servicios;
