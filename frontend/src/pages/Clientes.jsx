import { useEffect, useState } from "react";
import { obtenerClientes } from "../services/api";
import { crearCliente } from "../services/api";
function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [mensaje, setMensaje] = useState("");
    useEffect(() => { cargarClientes(); }, []);
    const cargarClientes = async () => {
        try{
            const resultado = await obtenerClientes();
            if (resultado.ok && resultado.datos.success) {
              setClientes(resultado.datos.clientes);
            } else {
             setMensaje("No se pudieron obtener los clientes");
            }
        } catch (error) {
           setMensaje("Error al conectar con el servidor");
      }
        };
    return(
        <div className="Dashboard">
            <h1>Clientes</h1>
            {mensaje && <p className="error">{mensaje}</p>}
            <table>
                <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nombre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
const [nombre, setNombre] = useState("");
const [editandoId, setEditandoId] = useState(null);
const [mensaje, setMensaje] = useState("");
const guardar = async (e) => {
    e.preventDefault();
const r = editandoId
? await actualizarCliente(editandoId, { nombre })
: await crearCliente({ nombre });
setMensaje(r.datos.message || "Solicitud procesada");
if (r.ok) {
setNombre("");
setEditandoId(null);
await cargarClientes();
}
};
const prepararEdicion = (cliente) => {
setEditandoId(cliente.id);
setNombre(cliente.nombre);
};
const borrar = async (id) => {
if (!window.confirm("¿Eliminar este cliente de prueba?")) return;
const r = await eliminarCliente(id);
setMensaje(r.datos.message || "Solicitud procesada");
if (r.ok) await cargarClientes();
};
export default Clientes;