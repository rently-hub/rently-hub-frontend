import { useEffect, useState } from "react";
import { Plus, Calendar, Users, DollarSign, Home, ClipboardList } from "lucide-react";
import { api } from "../services/api";
import type { Rental } from "../types";
import { CreateRentalModal } from "../components/rentals/CreateRentalModal";

export function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRentals();
  }, []);

  async function fetchRentals() {
    try {
      const { data } = await api.get("/rentals/");
      setRentals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <CreateRentalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newRental) => setRentals((prev) => [newRental, ...prev])}
      />

      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10 shrink-0 mb-6 font-primary">
        <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-medium tracking-wider text-sm uppercase">
              <ClipboardList size={16} /> Ocupação
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Gestão de Aluguéis
            </h1>
            <p className="text-slate-400 max-w-xl text-sm md:text-base">
              Visualize e controle todas as reservas e check-ins ativos em sua rede de propriedades.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold font-primary shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10">Novo Aluguel</span>
          </button>
        </div>
      </div>

      {!loading && (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100/50 overflow-hidden font-primary">
          <div className="overflow-x-auto p-4 md:p-6">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200/60 pb-2">
                <tr>
                  <th className="px-6 py-4 pb-4">ID / Status</th>
                  <th className="px-6 py-4 pb-4">Propriedade</th>
                  <th className="px-6 py-4 pb-4">Período</th>
                  <th className="px-6 py-4 pb-4">Hóspedes</th>
                  <th className="px-6 py-4 pb-4">Plataforma</th>
                  <th className="px-6 py-4 pb-4 text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 pt-2">
                {rentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">#{rental.id}</div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                        rental.status === 'active' ? 'bg-green-100 text-green-700' : 
                        rental.status === 'completed' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {rental.status === 'active' ? 'Ativo' : rental.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {rental.property?.title || `Imóvel #${rental.property_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{new Date(rental.start_date).toLocaleDateString("pt-BR")} até {new Date(rental.end_date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-slate-400" />
                        <span>{rental.guest_count}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {rental.platform_source || "Direto"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 font-semibold text-slate-900">
                        <DollarSign size={16} className="text-green-600" />
                        <span>R$ {rental.total_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {rentals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Nenhum aluguel encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
