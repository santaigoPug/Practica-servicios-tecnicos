import { createContext, useContext, useState } from "react";
const AuthContext = createContext();
export function AuthProvider({ children }) {
const [usuario, setUsuario] = useState(() => {
const guardado = localStorage.getItem("usuario");
return guardado ? JSON.parse(guardado) : null;
});
const iniciarSesion = (datosUsuario) => {
setUsuario(datosUsuario);
localStorage.setItem("usuario", JSON.stringify(datosUsuario));
};
const cerrarSesion = () => {
setUsuario(null);
localStorage.removeItem("usuario");
};
return (
<AuthContext.Provider
value={{ usuario, iniciarSesion, cerrarSesion }}
>
{children}
</AuthContext.Provider>
);
}
export function useAuth() {
    return useContext(AuthContext);
}