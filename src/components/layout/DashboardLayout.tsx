import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Importe os ícones
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  const isAuthenticated = !!localStorage.getItem("@RentlyHub:token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado do menu mobile

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-50 shadow-md">
        <span className="text-xl font-bold text-white">
          Rently<span className="text-blue-500">Hub</span>
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex
      `}
      >
        <Sidebar />
      </div>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen pt-20 md:pt-8 w-full">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
