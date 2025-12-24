import { useState } from "react";
import { X, Upload, Home, DollarSign, Users } from "lucide-react"; // Novos ícones
import { api } from "../../services/api";
import type { CreatePropertyData, Property } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProperty: Property) => void;
}

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
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/properties/", formData);
      onSuccess(response.data);
      onClose();
      // Reset do form
      setFormData({
        title: "",
        description: "",
        price_per_day: 0,
        address: "",
        cleaning_fee: 0,
        max_guests: 1,
        photo_url: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao criar propriedade.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Home className="text-slate-900" size={24} />
          Nova Propriedade
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* 5. ÁREA DA FOTO (PLACEHOLDER VISUAL) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Foto Principal
            </label>
            <button
              type="button" // Importante: type="button" pra não submeter o form ao clicar
              className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:border-slate-500 hover:bg-slate-50 transition-all cursor-pointer group"
              onClick={() =>
                alert("Em breve: Integração com Upload de Imagens!")
              }
            >
              <div className="bg-slate-100 p-3 rounded-full mb-2 group-hover:bg-slate-200 transition-colors">
                <Upload size={24} className="text-slate-600" />
              </div>
              <span className="text-sm font-medium">
                Clique para adicionar uma foto
              </span>
              <span className="text-xs text-slate-400 mt-1">
                PNG, JPG até 5MB
              </span>
            </button>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium disabled:opacity-70 transition-colors shadow-sm"
            >
              {loading ? "Salvando..." : "Criar Propriedade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
