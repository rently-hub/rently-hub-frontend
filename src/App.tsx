import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Singup";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Rotas Protegidas (Dashboard) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/properties"
            element={<div>Tela de Propriedades (Em breve)</div>}
          />
          <Route
            path="/calendar"
            element={<div>Tela de Calendário (Em breve)</div>}
          />
          <Route
            path="/profile"
            element={<div>Tela de Perfil (Em breve)</div>}
          />
          <Route
            path="/settings"
            element={<div>Tela de Configurações (Em breve)</div>}
          />
        </Route>

        {/* Redireciona qualquer rota maluca para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
