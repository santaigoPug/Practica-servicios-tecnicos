import { useCallback, useEffect, useState } from "react";
import {
  obtenerTecnicos, crearTecnico,
  actualizarTecnico, eliminarTecnico,
} from "../services/api";
import Layout from "../components/Layout";
import { IconoTecnicos } from "../components/Iconos";

const iniciales = (nombre = "") =>
  nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarTecnicos = useCallback(async () => {
    try {
      const r = await obtenerTecnicos();
      if (r.ok && r.datos.success) setTecnicos(r.datos.tecnicos || []);
      else setMensaje(r.datos.message || "Error al cargar");
    } catch {
      setMensaje("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarTecnicos(); }, [cargarTecnicos]);

  const limpiar = () => { setEditandoId(null); setNombre(""); setEspecialidad(""); };

  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !especialidad.trim()) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }
    const datos = { nombre, especialidad };
    try {
      const r = editandoId
        ? await actualizarTecnico(editandoId, datos)
        : await crearTecnico(datos);
      setMensaje(r.datos.message || "Operación realizada");
      if (r.ok) {
        limpiar();
        await cargarTecnicos();
      }
    } catch {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  const editar = (tecnico) => {
    setEditandoId(tecnico.id);
    setNombre(tecnico.nombre);
    setEspecialidad(tecnico.especialidad);
    setMensaje("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este técnico?")) return;
    try {
      const r = await eliminarTecnico(id);
      setMensaje(r.datos.message || "Operación realizada");
      if (r.ok) await cargarTecnicos();
    } catch {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
    <Layout>
      {mensaje && <p className="aviso" role="status">{mensaje}</p>}
      <div className="bento">
        <section className="tile tile-oscuro span-4">
          <div className="tile-encabezado">
            <span className="tile-etiqueta">Técnicos</span>
            <span className="tile-icono"><IconoTecnicos /></span>
          </div>
          <p className="stat-numero">{cargando ? "–" : tecnicos.length}</p>
          <p className="stat-detalle">{tecnicos.length === 1 ? "técnico en el equipo" : "técnicos en el equipo"}</p>
        </section>

        <section className="tile span-8">
          <h2>{editandoId ? "Editar técnico" : "Nuevo técnico"}</h2>
          <form className="formulario" onSubmit={guardar}>
            <div className="campo">
              <label htmlFor="nombre-tecnico">Nombre</label>
              <input
                id="nombre-tecnico"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del técnico"
                maxLength={120}
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="especialidad-tecnico">Especialidad</label>
              <input
                id="especialidad-tecnico"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                placeholder="Ej. Redes, hardware, impresoras"
                maxLength={120}
                required
              />
            </div>
            <div className="acciones">
              <button className="btn" type="submit">{editandoId ? "Actualizar" : "Registrar"}</button>
              {editandoId && (
                <button className="btn btn-secundario" type="button" onClick={limpiar}>Cancelar</button>
              )}
            </div>
          </form>
        </section>

        <section className="tile span-12">
          <h2>Equipo técnico</h2>
          {cargando ? (
            <p className="lista-vacia">Cargando técnicos…</p>
          ) : tecnicos.length === 0 ? (
            <p className="lista-vacia">No hay técnicos registrados.</p>
          ) : (
            <ul className="lista lista-rejilla">
              {tecnicos.map((tecnico) => (
                <li className="lista-item" key={tecnico.id}>
                  <span className="avatar" aria-hidden="true">{iniciales(tecnico.nombre)}</span>
                  <div className="lista-item-cuerpo">
                    <span className="lista-item-titulo">{tecnico.nombre}</span>
                    <span className="lista-item-sub">{tecnico.especialidad}</span>
                  </div>
                  <div className="acciones">
                    <button type="button" className="btn btn-secundario btn-chico" onClick={() => editar(tecnico)}>Editar</button>
                    <button type="button" className="btn btn-peligro btn-chico" onClick={() => eliminar(tecnico.id)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default Tecnicos;
