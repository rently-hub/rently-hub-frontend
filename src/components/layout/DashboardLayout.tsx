import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  // Verificação de Segurança Básica
  const isAuthenticated = !!localStorage.getItem("@RentlyHub:token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Área de Conteúdo (Deslocada para a direita por causa da sidebar fixa) */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {/* O Outlet é onde as páginas filhas (Dashboard, Properties) serão renderizadas */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
