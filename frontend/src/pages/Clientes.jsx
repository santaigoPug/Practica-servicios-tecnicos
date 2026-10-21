import { useCallback, useEffect, useState } from "react";
import { actualizarCliente, crearCliente, eliminarCliente, obtenerClientes } from "../services/api";

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
    <main className="dashboard">
      <h1>Gestión de clientes</h1>
      {mensaje && <p role="status">{mensaje}</p>}
      <form onSubmit={guardar}>
        <label htmlFor="nombre-cliente">Nombre del cliente</label>
        <input id="nombre-cliente" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={120} />
        <button type="submit">{editandoId ? "Guardar cambios" : "Agregar cliente"}</button>
        {editandoId && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
      </form>
      {cargando ? <p>Cargando clientes…</p> : (
        <table>
          <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td><td>{cliente.nombre}</td>
                <td>
                  <button type="button" onClick={() => prepararEdicion(cliente)}>Editar</button>
                  <button type="button" onClick={() => borrar(cliente.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && <tr><td colSpan="3">No hay clientes registrados.</td></tr>}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default Clientes;
