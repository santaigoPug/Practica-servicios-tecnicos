import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RutaProtegida from "./components/RutaProtegida";
import Tecnicos from "./pages/Tecnicos";
function App() {
return (
<Routes>
<Route path="/" element={<Login />} />
<Route
path="/dashboard"
element={
<RutaProtegida>
<Dashboard />
</RutaProtegida>
}
/>
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
);
}
<Route path="/tecnicos"
element={<RutaProtegida><Tecnicos /></RutaProtegida>}
/>
export default App;