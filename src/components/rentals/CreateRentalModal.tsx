import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { api } from "../../services/api";
import type { Rental, Property } from "../../types";

interface CreateRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rental: Rental) => void;
}

import { createPortal } from "react-dom";

export function CreateRentalModal({ isOpen, onClose, onSuccess }: CreateRentalModalProps) {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    property_id: "",
    start_date: "",
    end_date: "",
    guest_count: 1,
    platform_source: "Direto",
  });

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

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
        guest_count: Number(formData.guest_count),
      };

      const { data } = await api.post("/rentals/", payload);
      onSuccess(data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Erro ao criar aluguel.");
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
      <div className="relative w-full md:w-[500px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out font-primary">

        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Calendar className="text-emerald-400" size={24} />
            Nova Reserva
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nº Hóspedes
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                value={formData.guest_count}
                onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Plataforma
              </label>
              <select
                required
                className="w-full rounded-md border py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-slate-600 outline-none"
                value={formData.platform_source}
                onChange={(e) => setFormData({ ...formData, platform_source: e.target.value })}
              >
                <option value="Direto">Direto (Particular)</option>
                <option value="Airbnb">Airbnb</option>
                <option value="Booking">Booking.com</option>
                <option value="Vrbo">Vrbo</option>
              </select>
            </div>
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
              className="px-6 py-3.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors font-bold disabled:opacity-70 w-full md:w-auto"
            >
              {loading ? "Salvando..." : "Criar Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body);
}

