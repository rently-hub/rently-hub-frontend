import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Settings,
  User,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const location = useLocation(); // Para saber em qual página estamos
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("@RentlyHub:token");
    navigate("/");
  }

  // Lista de itens do menu para ficar fácil adicionar mais depois
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Propriedades", icon: Building2, path: "/properties" },
    { label: "Calendário", icon: Calendar, path: "/calendar" },
    { label: "Perfil", icon: User, path: "/profile" },
    { label: "Configurações", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      {/* Logo da Empresa */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-tight">
          Rently<span className="text-blue-500">Hub</span>
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-slate-800 text-white shadow-sm"
                    : "hover:bg-slate-800/50 hover:text-white"
                }`}
            >
              <item.icon
                size={20}
                className={isActive ? "text-blue-400" : "text-slate-400"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Área do Usuário / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
