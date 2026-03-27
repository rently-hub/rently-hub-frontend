import { useEffect, useState } from "react";
import { Plus, Calendar, DollarSign, Home, Tag, Receipt } from "lucide-react";
import { api } from "../services/api";
import type { Expense } from "../types";
import { CreateExpenseModal } from "../components/expenses/CreateExpenseModal";

export function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const { data } = await api.get("/expenses/");
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <CreateExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newExpense) => setExpenses((prev) => [newExpense, ...prev])}
      />

      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10 shrink-0 mb-6">
        <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-medium tracking-wider text-sm uppercase">
              <Receipt size={16} /> Financeiro
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Despesas e Custos
            </h1>
            <p className="text-slate-400 max-w-xl text-sm md:text-base">
              Acompanhe rigorosamente todos os custos fixos e variáveis. Mantenha seu fluxo de caixa otimizado.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10">Nova Despesa</span>
          </button>
        </div>
      </div>

      {!loading && (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto p-4 md:p-6">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200/60 pb-2">
                <tr>
                  <th className="px-6 py-4 pb-4">Despesa</th>
                  <th className="px-6 py-4 pb-4">Propriedade</th>
                  <th className="px-6 py-4 pb-4">Categoria</th>
                  <th className="px-6 py-4 pb-4">Data Pagamento</th>
                  <th className="px-6 py-4 pb-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 pt-2">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{expense.expense_title}</div>
                      {expense.description && (
                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{expense.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {expense.property?.title || `Imóvel #${expense.property_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Tag size={16} className="text-slate-400" />
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{new Date(expense.pay_date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 font-semibold text-slate-900">
                        <DollarSign size={16} className="text-red-500" />
                        <span>R$ {expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Nenhuma despesa encontrada
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
