import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";
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
} catch (error) {
setExito(false);
setMensaje("No se pudo conectar con el servidor");
}
};
return (
<div className="contenedor">
<div className="login">
<h1>Servicios Técnicos</h1>
<h2>Iniciar sesión</h2>
<form onSubmit={manejarLogin}>
<label>Username</label>
<input
type="text"
value={username}
onChange={(e) => setUsername(e.target.value)}
placeholder="Ingrese su username"
/>
<label>Contraseña</label>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Ingrese su contraseña"
/>
<button type="submit">Ingresar</button>
</form>
{mensaje && (
<p className={exito ? "mensaje exito" : "mensaje error"}>
{mensaje}
</p>
)}
</div>
</div>
);
}
export default Login;