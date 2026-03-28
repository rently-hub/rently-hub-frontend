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
  CalendarDays,
  AlertCircle,
  Clock,
  Building2,
  Link as LinkIcon,
  RefreshCcw,
  Percent,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import type { Property, CreatePropertyData } from "../../types";
// Importando o modal que acabamos de criar
import { CreateRentalModal } from "./CreateRentalModal";
import { CreateExpenseModal } from "../expenses/CreateExpenseModal";
import { Receipt } from "lucide-react";

const gradients = [

  "from-blue-500 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-orange-400 to-rose-500",
  "from-purple-500 to-fuchsia-600",
  "from-cyan-500 to-blue-600",
];

function getGradient(id: number = 0) {
  return gradients[id % gradients.length];
}

import { createPortal } from "react-dom";

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
  const [syncing, setSyncing] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const [formData, setFormData] = useState<CreatePropertyData>({
    title: "",
    description: "",
    price_per_day: 0,
    address: "",
    cleaning_fee: 0,
    max_guests: 0,
    photo_url: "",
    ical_url: "",
    platform_fee_percentage: 15,
    property_type: 'seasonal',
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
        ical_url: property.ical_url || "",
        platform_fee_percentage: property.platform_fee_percentage || 15,
        property_type: property.property_type || 'seasonal',
      });
      setIsEditing(false);
    }
  }, [property, isOpen]);

  if (!isOpen || !property) return null;

  // Verifica status vindo do Backend
  const isOccupied = property.status === "Ocupada";
  const currentRental = property.current_rental;

  async function handleSave() {
    setLoading(true);
    try {
      const response = await api.put(`/properties/${property?.id}`, formData);
      onUpdate(response.data);
      setIsEditing(false);
      toast.success("Propriedade atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar propriedade.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setLoading(true);
      await api.delete(`/properties/${property?.id}`);
      toast.success("Propriedade excluída com sucesso!");
      location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro ao excluir propriedade.");
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  }

  const handleRentalSuccess = async () => {
    try {
      const response = await api.get(`/properties/${property.id}`);
      onUpdate(response.data);
    } catch (e) {
      console.error("Erro ao atualizar status na tela", e);
    }
  };

  async function handleSyncIcal() {
    setSyncing(true);
    try {
      const resp = await api.post(`/properties/${property?.id}/sync-ical`);
      toast.success(resp.data.message || "Sincronização concluída!");
      // Recarrega as informações atualizadas
      handleRentalSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro ao sincronizar iCal.");
    } finally {
      setSyncing(false);
    }
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60] flex justify-end">

        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose} 
        />

        {/* Drawer */}
        <div className="relative w-full md:w-[600px] xl:w-[700px] h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-500 ease-out">
          <div className={`h-56 relative shrink-0 group bg-gradient-to-br ${getGradient(property.id)} flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <Building2 className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            <span className="text-white text-8xl font-black tracking-tighter drop-shadow-lg z-10 transition-transform group-hover:scale-110 duration-500">
              {property.title.charAt(0).toUpperCase()}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur transition-all"
            >
              <X size={20} />
            </button>

            <div
              className={`absolute bottom-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-white/20 flex items-center gap-2 backdrop-blur-md ${
                isOccupied
                  ? "bg-red-500/90 text-white"
                  : "bg-emerald-500/90 text-white"
              }`}
            >
              {isOccupied ? (
                <>
                  <AlertCircle size={16} /> INDISPONÍVEL
                </>
              ) : (
                <>
                  <Sparkles size={16} /> DISPONÍVEL
                </>
              )}
            </div>
          </div>

          {/* === BODY === */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1">
            {/* BOX DE ALERTA SE ESTIVER OCUPADA */}
            {isOccupied && currentRental && !isEditing && (
              <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                <div className="bg-amber-100 p-2.5 rounded-full text-amber-600 mt-1">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    Aluguel em Andamento
                  </h4>
                  <p className="text-slate-600 mt-1">
                    Esta propriedade está ocupada até o dia{" "}
                    <strong className="text-slate-900">
                      {new Date(currentRental.end_date).toLocaleDateString(
                        "pt-BR",
                      )}
                    </strong>
                    .
                  </p>
                  <div className="flex gap-3 mt-3 text-xs font-medium text-amber-800/70">
                    <span className="bg-amber-100 px-2 py-1 rounded">
                      Reserva #{currentRental.rental_id}
                    </span>
                    {/* Se o backend mandar guest_name no current_rental, mostramos aqui */}
                    {currentRental.guest_name && (
                      <span className="bg-amber-100 px-2 py-1 rounded">
                        Hóspede: {currentRental.guest_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TÍTULO E EDIÇÃO */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div className="flex-1 space-y-2">
                {isEditing ? (
                  <input
                    className="text-2xl font-bold text-slate-900 w-full border-b-2 border-slate-200 focus:border-slate-900 outline-none pb-1"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                    {property.title}
                  </h2>
                )}

                <div className="flex items-center text-slate-500">
                  <MapPin
                    size={18}
                    className="mr-1.5 shrink-0 text-slate-400"
                  />
                  {isEditing ? (
                    <input
                      className="text-sm w-full border-b border-slate-200 focus:border-slate-900 outline-none"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  ) : (
                    <span className="truncate text-lg">{property.address}</span>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                >
                  <Edit2 size={16} /> Editar
                </button>
              )}
            </div>

            {/* GRID DE INFORMAÇÕES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <InfoCard
                icon={<DollarSign size={20} />}
                label="Diária"
                value={`R$ ${property.price_per_day}`}
                isEditing={isEditing}
                editValue={formData.price_per_day}
                onChange={(v: string) =>
                  setFormData({ ...formData, price_per_day: Number(v) })
                }
                type="number"
              />

              <InfoCard
                icon={<Sparkles size={20} />}
                label="Taxa Limpeza"
                value={`R$ ${property.cleaning_fee}`}
                isEditing={isEditing}
                editValue={formData.cleaning_fee}
                onChange={(v: string) =>
                  setFormData({ ...formData, cleaning_fee: Number(v) })
                }
                type="number"
              />

              <InfoCard
                icon={<Users size={20} />}
                label="Capacidade"
                value={`${property.max_guests} Pessoas`}
                isEditing={isEditing}
                editValue={formData.max_guests}
                onChange={(v: string) =>
                  setFormData({ ...formData, max_guests: Number(v) })
                }
                type="number"
              />

              <InfoCard
                icon={<Percent size={20} />}
                label="Taxa Plataforma"
                value={`${property.platform_fee_percentage}%`}
                isEditing={isEditing}
                editValue={formData.platform_fee_percentage}
                onChange={(v: string) =>
                  setFormData({ ...formData, platform_fee_percentage: Number(v) })
                }
                type="number"
              />

              {/* TIPO DE PROPRIEDADE */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 items-start">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Building2 size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Tipo de Aluguel</span>
                </div>
                {isEditing ? (
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value as 'seasonal' | 'fixed' })}
                  >
                    <option value="seasonal">Temporada</option>
                    <option value="fixed">Fixo / Mensal</option>
                  </select>
                ) : (
                  <span className="text-sm font-black text-slate-800 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {property.property_type === 'seasonal' ? 'Temporada' : 'Fixo'}
                  </span>
                )}
              </div>
            </div>

            {/* ICAL URL (IMPORT) */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 mb-3 text-lg flex items-center gap-2">
                <LinkIcon size={18} className="text-slate-500" /> Sincronizar de Outra Plataforma (Importar)
              </h3>
              {isEditing ? (
                <input
                  type="url"
                  className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                  placeholder="Ex: https://www.airbnb.com/calendar/ical/..."
                  value={formData.ical_url}
                  onChange={(e) =>
                    setFormData({ ...formData, ical_url: e.target.value })
                  }
                />
              ) : (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center gap-3">
                  <div className="truncate flex-1 text-xs text-slate-600 font-medium font-mono">
                    {property.ical_url || "Nenhum link configurado."}
                  </div>
                  {property.ical_url && (
                    <button
                      onClick={handleSyncIcal}
                      disabled={syncing}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-md border border-indigo-100 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                      <RefreshCcw size={14} className={syncing ? "animate-spin" : ""} />
                      {syncing ? "Atualizar" : "Sincronizar"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ICAL EXPORT (OUTBOUND) */}
            {!isEditing && (
              <div className="mb-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <h3 className="font-bold text-indigo-900 mb-2 text-sm flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-500" /> Link de Exportação (iCal do RentlyHub)
                </h3>
                <p className="text-xs text-indigo-700/70 mb-3">
                  Use este link para sincronizar o RentlyHub com o Airbnb, Booking ou Google Calendar.
                </p>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-indigo-100 shadow-sm">
                  <div className="flex-1 truncate text-[10px] font-mono text-indigo-600 bg-indigo-50/30 px-2 py-1.5 rounded">
                    {window.location.origin.replace(":5173", ":8000")}{property.export_url}
                  </div>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin.replace(":5173", ":8000")}${property.export_url}`;
                      navigator.clipboard.writeText(url);
                      toast.success("Link copiado para a área de transferência!");
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 active:scale-90"
                    title="Copiar Link"
                  >
                    <LinkIcon size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* DESCRIÇÃO */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">
                Sobre este lugar
              </h3>
              {isEditing ? (
                <textarea
                  rows={5}
                  className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              ) : (
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description ||
                    "Nenhuma descrição informada pelo anfitrião."}
                </p>
              )}
            </div>
          </div>

          {/* === FOOTER (AÇÕES) === */}
          <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
            {isEditing ? (
              <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 p-2 rounded-xl">
                    <span className="text-sm font-bold text-red-800 px-2 shrink-0">
                      Tem certeza?
                    </span>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md shadow-red-500/30 hover:bg-red-700 transition-colors"
                    >
                      {loading ? "..." : "Sim, Excluir"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={loading}
                      className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={18} /> Excluir Imóvel
                  </button>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-bold shadow-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:bg-indigo-700 transition-colors font-bold disabled:opacity-70"
                  >
                    <Save size={18} />{" "}
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </div>
            ) : (
              // MODO VISUALIZAÇÃO: Botões de Ação
              <div className="flex flex-col md:flex-row gap-3">
                {isOccupied ? (
                  <button
                    disabled
                    className="flex-1 px-8 py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <AlertCircle size={20} /> Imóvel Indisponível
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRentalModalOpen(true)}
                    className="flex-1 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 text-lg"
                  >
                    <CalendarDays size={22} /> Novo Aluguel
                  </button>
                )}
                
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="px-8 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-black transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 text-lg border border-rose-100"
                >
                  <Receipt size={22} /> Lançar Despesa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateRentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        property={property}
        onSuccess={handleRentalSuccess}
      />

      <CreateExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        initialPropertyId={property.id}
        onSuccess={() => {

          toast.success("Despesa lançada com sucesso!");
          setIsExpenseModalOpen(false);
        }}
      />

    </>
  , document.body);
}


// Componente auxiliar para os cards de info (Clean Code)
function InfoCard({
  icon,
  label,
  value,
  isEditing,
  editValue,
  onChange,
  type,
}: any) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium">
        {icon} {label}
      </div>
      {isEditing ? (
        <input
          type={type}
          className="font-bold text-lg text-slate-900 bg-white w-full rounded border px-3 py-1 focus:ring-1 focus:ring-slate-900 outline-none"
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="font-bold text-xl text-slate-900">{value}</p>
      )}
    </div>
  );
}
