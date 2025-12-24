import { useState, useEffect } from "react";
import {
  X,
  Edit2,
  Save,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { api } from "../../services/api";
import type { Property, CreatePropertyData } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onUpdate: (updatedProperty: Property) => void;
}

export function PropertyDetailsModal({
  isOpen,
  onClose,
  property,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreatePropertyData>({
    title: "",
    description: "",
    price_per_day: 0,
    address: "",
    cleaning_fee: 0,
    max_guests: 0,
    photo_url: "",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price_per_day: property.price_per_day,
        address: property.address,
        cleaning_fee: property.cleaning_fee,
        max_guests: property.max_guests,
        photo_url: property.photo_url || "",
      });
      setIsEditing(false);
    }
  }, [property, isOpen]);

  if (!isOpen || !property) return null;

  async function handleSave() {
    setLoading(true);
    try {
      const response = await api.put(`/properties/${property?.id}`, formData);

      onUpdate(response.data);
      setIsEditing(false);
      alert("Propriedade atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (confirm("Tem certeza que deseja excluir este imóvel?")) {
      try {
        await api.delete(`/properties/${property?.id}`);
        location.reload();
      } catch (error) {
        alert("Erro ao deletar.");
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* === HEADER (FOTO) === */}
        <div className="h-48 bg-slate-200 relative shrink-0">
          <img
            src={`https://placehold.co/800x400/e2e8f0/1e293b?text=${formData.title.charAt(
              0
            )}`}
            alt="Capa"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* === BODY === */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Cabeçalho do Conteúdo + Botão Editar */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 mr-4">
              {isEditing ? (
                <input
                  className="text-2xl font-bold text-slate-900 w-full border-b-2 border-slate-200 focus:border-slate-900 outline-none pb-1"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900">
                  {property.title}
                </h2>
              )}

              <div className="flex items-center text-slate-500 mt-1">
                <MapPin size={16} className="mr-1" />
                {isEditing ? (
                  <input
                    className="text-sm w-full border-b border-slate-200 focus:border-slate-900 outline-none"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                ) : (
                  <span>{property.address}</span>
                )}
              </div>
            </div>

            {/* Botão de Toggle Edit */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                <Edit2 size={16} /> Editar
              </button>
            )}
          </div>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Preço */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm">
                <DollarSign size={16} /> Diária
              </div>
              {isEditing ? (
                <input
                  type="number"
                  className="font-bold text-lg text-slate-900 bg-white w-full rounded border px-2 py-1"
                  value={formData.price_per_day}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_per_day: Number(e.target.value),
                    })
                  }
                />
              ) : (
                <p className="font-bold text-xl text-slate-900">
                  R$ {property.price_per_day}
                </p>
              )}
            </div>

            {/* Taxa de Limpeza */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm">
                <Sparkles size={16} /> Taxa Limpeza
              </div>
              {isEditing ? (
                <input
                  type="number"
                  className="font-bold text-lg text-slate-900 bg-white w-full rounded border px-2 py-1"
                  value={formData.cleaning_fee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cleaning_fee: Number(e.target.value),
                    })
                  }
                />
              ) : (
                <p className="font-bold text-xl text-slate-900">
                  R$ {property.cleaning_fee}
                </p>
              )}
            </div>

            {/* Capacidade */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm">
                <Users size={16} /> Hóspedes
              </div>
              {isEditing ? (
                <input
                  type="number"
                  className="font-bold text-lg text-slate-900 bg-white w-full rounded border px-2 py-1"
                  value={formData.max_guests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_guests: Number(e.target.value),
                    })
                  }
                />
              ) : (
                <p className="font-bold text-xl text-slate-900">
                  {property.max_guests} Pessoas
                </p>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Sobre este lugar
            </h3>
            {isEditing ? (
              <textarea
                rows={4}
                className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description || "Sem descrição."}
              </p>
            )}
          </div>
        </div>

        {/* === FOOTER (AÇÕES) === */}
        {isEditing && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Trash2 size={18} /> Excluir Imóvel
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-slate-300 rounded-lg font-medium hover:bg-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2"
              >
                <Save size={18} />{" "}
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
