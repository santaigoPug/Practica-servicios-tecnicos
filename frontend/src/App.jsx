import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Tecnicos from "./pages/Tecnicos";
import Servicios from "./pages/Servicios";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
      <Route path="/clientes" element={<RutaProtegida><Clientes /></RutaProtegida>} />
      <Route path="/tecnicos" element={<RutaProtegida><Tecnicos /></RutaProtegida>} />
      <Route path="/servicios" element={<RutaProtegida><Servicios /></RutaProtegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
