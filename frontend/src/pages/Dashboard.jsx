import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";
function Dashboard() {
const { usuario, cerrarSesion } = useAuth();
const navigate = useNavigate();
const salir = () => {
cerrarSesion();
navigate("/");
};
return (
<div className="dashboard">
<h1>Servicios Técnicos</h1>
<h2>Panel principal</h2>
<p>Bienvenido, <strong>{usuario?.username}</strong></p>
<nav>
<Link to="/Dashboard">Inicio</Link>
<Link to="/Clientes">Clientes</Link>
<Link to="/tecnicos">Técnicos</Link>
</nav>
<button onClick={salir}>Cerrar sesión</button>
</div>
);
}
export default Dashboard;