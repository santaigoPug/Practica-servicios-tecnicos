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
    <main className="dashboard">
      <h1>Servicios Técnicos</h1>
      <h2>Panel principal</h2>
      <p>Bienvenido, <strong>{usuario?.username}</strong></p>
      <nav aria-label="Navegación principal">
        <Link to="/dashboard">Inicio</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/tecnicos">Técnicos</Link>
        <Link to="/servicios">Servicios</Link>
      </nav>
      <button type="button" onClick={salir}>Cerrar sesión</button>
    </main>
  );
}

export default Dashboard;
