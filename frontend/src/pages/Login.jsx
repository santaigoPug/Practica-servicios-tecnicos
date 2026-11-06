import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { IconoServicios, IconoTecnicos } from "../components/Iconos";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!username || !password) {
      setMensaje("Username y contraseña son obligatorios");
      setExito(false);
      return;
    }
    try {
      const resultado = await login(username, password);
      if (resultado.ok && resultado.datos.success) {
        iniciarSesion({ username: resultado.datos.username });
        setExito(true);
        setMensaje(resultado.datos.message);
        navigate("/dashboard");
      } else {
        setExito(false);
        setMensaje(resultado.datos.message || "Usuario o contraseña incorrectos");
      }
    } catch {
      setExito(false);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="login-pagina">
      <div className="bento login-bento">
        <section className="tile tile-acento span-7">
          <div className="marca">
            <span className="marca-icono" style={{ background: "rgba(255,255,255,0.2)" }} aria-hidden="true">ST</span>
            <span style={{ color: "#fff" }}>Servicios Técnicos</span>
          </div>
          <h1 style={{ color: "#fff", marginTop: "auto" }}>
            Clientes, técnicos y servicios en un solo lugar.
          </h1>
          <p>Organiza cada solicitud y mantén el estado de tu trabajo siempre a la vista.</p>
        </section>

        <section className="tile span-5 fila-2">
          <div>
            <h2 style={{ fontSize: 24 }}>Bienvenido</h2>
            <p className="login-subtitulo">Inicia sesión para continuar</p>
          </div>
          <form className="formulario" onSubmit={manejarLogin}>
            <div className="campo">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su username"
                autoComplete="username"
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn btn-bloque">Ingresar</button>
          </form>
          {mensaje && (
            <p className={exito ? "aviso aviso-ok" : "aviso"} role="status">{mensaje}</p>
          )}
        </section>

        <div className="tile tile-soft mini-metrica span-3">
          <span className="tile-icono"><IconoTecnicos /></span>
          <strong>Técnicos</strong>
        </div>
        <div className="tile tile-oscuro mini-metrica span-4">
          <span className="tile-icono"><IconoServicios /></span>
          <strong>Servicios con estado</strong>
        </div>
      </div>
    </main>
  );
}

export default Login;
