import { useState, useEffect } from "react";
import { X, Receipt } from "lucide-react";
import { api } from "../../services/api";
import type { Expense, Property } from "../../types";

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (expense: Expense) => void;
  initialPropertyId?: number;
}

import { createPortal } from "react-dom";

export function CreateExpenseModal({ isOpen, onClose, onSuccess, initialPropertyId }: CreateExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    property_id: initialPropertyId?.toString() || "",
    expense_title: "",
    category: "Água",
    amount: "",
    pay_date: new Date().toISOString().split('T')[0],
    description: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialPropertyId) {
        setFormData(prev => ({ ...prev, property_id: initialPropertyId.toString() }));
      }
      fetchProperties();
    }
  }, [isOpen, initialPropertyId]);


  async function fetchProperties() {
    try {
      const { data } = await api.get("/properties/");
      setProperties(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        property_id: Number(formData.property_id),
        amount: Number(formData.amount),
      };

      const { data } = await api.post("/expenses/", payload);
      onSuccess(data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Erro ao adicionar despesa.");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full md:w-[500px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">

        
        {/* CABEÇALHO */}
        <div className="bg-slate-900 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Receipt className="text-emerald-400" size={24} />
            Nova Despesa
          </h2>
          <button onClick={onClose} className="text-slate-400 bg-slate-800/50 hover:bg-slate-800 hover:text-white p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto flex flex-col">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Propriedade
            </label>
            <select
              required
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
              value={formData.property_id}
              onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
            >
              <option value="" disabled>Selecione um imóvel</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Descrição (Título da despesa)
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Conta de Luz Jan/26"
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
              value={formData.expense_title}
              onChange={(e) => setFormData({ ...formData, expense_title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Categoria
              </label>
              <select
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Água">Água</option>
                <option value="Luz">Luz</option>
                <option value="Internet">Internet</option>
                <option value="Condomínio">Condomínio</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Valor (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Data de Pagamento
            </label>
            <input
              type="date"
              required
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
              value={formData.pay_date}
              onChange={(e) => setFormData({ ...formData, pay_date: e.target.value })}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-4 rounded-xl flex items-center shadow-sm font-medium">
              {error}
            </div>
          )}

          <div className="mt-auto pt-6 flex flex-col-reverse md:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-bold shadow-sm w-full md:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.property_id}
              className="px-6 py-3.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors font-bold disabled:opacity-70 w-full md:w-auto"
            >
              {loading ? "Salvando..." : "Adicionar Despesa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body);
}

