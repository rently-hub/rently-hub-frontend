import { useState } from "react";
import { X, Home, DollarSign, Users, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import type { CreatePropertyData, Property } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProperty: Property) => void;
}

import { createPortal } from "react-dom";

export function CreatePropertyModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePropertyData>({
    title: "",
    description: "",
    price_per_day: 0,
    address: "",
    cleaning_fee: 0,
    max_guests: 1,
    photo_url: "",
    ical_url: "",
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/properties/", formData);
      onSuccess(response.data);
      onClose();
      setFormData({
        title: "",
        description: "",
        price_per_day: 0,
        address: "",
        cleaning_fee: 0,
        max_guests: 1,
        photo_url: "",
        ical_url: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar propriedade.");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full md:w-[600px] xl:w-[700px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">

        
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Home size={20} />
            </div>
            Nova Propriedade
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="create-property-form" onSubmit={handleSubmit} className="space-y-6">
            {/* 1. TÍTULO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Título do Anúncio
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                placeholder="Ex: Apartamento Aconchegante no Centro"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* 2. LINHA FINANCEIRA (PREÇO + TAXA DE LIMPEZA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <DollarSign size={14} /> Preço por Dia (R$)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={formData.price_per_day}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_per_day: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Taxa de Limpeza (R$)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={formData.cleaning_fee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cleaning_fee: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* 3. LINHA ENDEREÇO + CAPACIDADE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Users size={14} /> Máx. Hóspedes
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={formData.max_guests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_guests: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* 4. DESCRIÇÃO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descrição
              </label>
              <textarea
                required
                rows={3}
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                placeholder="Conte os detalhes que tornam seu imóvel especial..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <LinkIcon size={16} className="text-indigo-500" /> Link iCal (Airbnb / Booking) <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opcional</span>
              </label>
              <input
                type="url"
                className="w-full rounded-xl border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm bg-slate-50 focus:bg-white"
                placeholder="Ex: https://www.airbnb.com/calendar/ical/..."
                value={formData.ical_url}
                onChange={(e) =>
                  setFormData({ ...formData, ical_url: e.target.value })
                }
              />
              <p className="text-xs text-slate-500 mt-2">Cole aqui o link ".ics" se desejar que o calendário sincronize automaticamente as datas para evitar overbooking.</p>
            </div>
          </form>
        </div>

        {/* Footer (Sticky) */}
        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col-reverse md:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-1/3 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-property-form"
            disabled={loading}
            className="w-full md:w-2/3 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-70 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Salvando...
              </span>
            ) : "Criar Propriedade"}
          </button>
        </div>
      </div>
    </div>
  , document.body);
}

