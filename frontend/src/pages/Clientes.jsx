import { useCallback, useEffect, useState } from "react";
import { actualizarCliente, crearCliente, eliminarCliente, obtenerClientes } from "../services/api";
import Layout from "../components/Layout";
import { IconoClientes } from "../components/Iconos";

const iniciales = (nombre = "") =>
  nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarClientes = useCallback(async () => {
    setCargando(true);
    try {
      const resultado = await obtenerClientes();
      if (resultado.ok && resultado.datos.success) {
        setClientes(resultado.datos.clientes || []);
        setMensaje("");
      } else {
        setMensaje(resultado.datos.message || "No se pudieron obtener los clientes.");
      }
    } catch {
      setMensaje("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarClientes(); }, [cargarClientes]);

  const guardar = async (event) => {
    event.preventDefault();
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      setMensaje("El nombre es obligatorio.");
      return;
    }
    try {
      const resultado = editandoId
        ? await actualizarCliente(editandoId, { nombre: nombreLimpio })
        : await crearCliente({ nombre: nombreLimpio });
      setMensaje(resultado.datos.message || (resultado.ok ? "Cliente guardado." : "No se pudo guardar el cliente."));
      if (resultado.ok) {
        setNombre("");
        setEditandoId(null);
        await cargarClientes();
      }
    } catch {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  const prepararEdicion = (cliente) => {
    setEditandoId(cliente.id);
    setNombre(cliente.nombre || "");
    setMensaje("");
  };

  const borrar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      const resultado = await eliminarCliente(id);
      setMensaje(resultado.datos.message || (resultado.ok ? "Cliente eliminado." : "No se pudo eliminar el cliente."));
      if (resultado.ok) await cargarClientes();
    } catch {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  const cancelarEdicion = () => { setEditandoId(null); setNombre(""); setMensaje(""); };

  return (
    <Layout>
      {mensaje && <p className="aviso" role="status">{mensaje}</p>}
      <div className="bento">
        <section className="tile tile-acento span-4">
          <div className="tile-encabezado">
            <span className="tile-etiqueta">Clientes</span>
            <span className="tile-icono"><IconoClientes /></span>
          </div>
          <p className="stat-numero">{cargando ? "–" : clientes.length}</p>
          <p className="stat-detalle">{clientes.length === 1 ? "cliente registrado" : "clientes registrados"}</p>
        </section>

        <section className="tile span-8">
          <h2>{editandoId ? "Editar cliente" : "Nuevo cliente"}</h2>
          <form className="formulario" onSubmit={guardar}>
            <div className="campo">
              <label htmlFor="nombre-cliente">Nombre del cliente</label>
              <input
                id="nombre-cliente"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo o razón social"
                required
                maxLength={120}
              />
            </div>
            <div className="acciones">
              <button className="btn" type="submit">{editandoId ? "Guardar cambios" : "Agregar cliente"}</button>
              {editandoId && (
                <button className="btn btn-secundario" type="button" onClick={cancelarEdicion}>Cancelar</button>
              )}
            </div>
          </form>
        </section>

        <section className="tile span-12">
          <h2>Listado de clientes</h2>
          {cargando ? (
            <p className="lista-vacia">Cargando clientes…</p>
          ) : clientes.length === 0 ? (
            <p className="lista-vacia">No hay clientes registrados.</p>
          ) : (
            <ul className="lista lista-rejilla">
              {clientes.map((cliente) => (
                <li className="lista-item" key={cliente.id}>
                  <span className="avatar" aria-hidden="true">{iniciales(cliente.nombre)}</span>
                  <div className="lista-item-cuerpo">
                    <span className="lista-item-titulo">{cliente.nombre}</span>
                    <span className="lista-item-sub">ID {cliente.id}</span>
                  </div>
                  <div className="acciones">
                    <button type="button" className="btn btn-secundario btn-chico" onClick={() => prepararEdicion(cliente)}>Editar</button>
                    <button type="button" className="btn btn-peligro btn-chico" onClick={() => borrar(cliente.id)}>Eliminar</button>
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

export default Clientes;
