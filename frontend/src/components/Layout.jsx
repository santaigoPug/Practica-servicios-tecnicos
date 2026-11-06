import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ENLACES = [
  { to: "/dashboard", texto: "Inicio" },
  { to: "/clientes", texto: "Clientes" },
  { to: "/tecnicos", texto: "Técnicos" },
  { to: "/servicios", texto: "Servicios" },
];

function Layout({ children }) {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/dashboard" className="marca">
          <span className="marca-icono" aria-hidden="true">ST</span>
          Servicios Técnicos
        </Link>
        <nav aria-label="Navegación principal">
          {ENLACES.map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to}>{enlace.texto}</NavLink>
          ))}
        </nav>
        <div className="topbar-usuario">
          <span>Hola, <strong>{usuario?.username}</strong></span>
          <button type="button" className="btn btn-secundario btn-chico" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="pagina">{children}</main>
    </div>
  );
}

export default Layout;
