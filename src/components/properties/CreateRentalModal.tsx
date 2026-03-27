import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Calculator,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import type { Property } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSuccess: () => void;
}

export function CreateRentalModal({
  isOpen,
  onClose,
  property,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DO FORMULÁRIO ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  // --- ESTADOS DE CÁLCULO (Apenas Visual) ---
  const [totalDays, setTotalDays] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Calcula estimativa de preço sempre que datas mudam
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Diferença em milissegundos convertida para dias
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setTotalDays(diffDays);
        setEstimatedPrice(diffDays * property.price_per_day);
      } else {
        setTotalDays(0);
        setEstimatedPrice(0);
      }
    }
  }, [startDate, endDate, property.price_per_day]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Validação Extra de Frontend
    if (guestCount > property.max_guests) {
      toast.error(`O limite máximo é de ${property.max_guests} pessoas.`);
      return;
    }

    try {
      // PAYLOAD ESTRITO (Exatamente o que seu RentalCreate espera)
      const payload = {
        property_id: property.id,
        start_date: startDate,
        end_date: endDate,
        guest_count: Number(guestCount),
      };

      await api.post("/rentals/", payload);

      toast.success("Reserva realizada com sucesso!");
      onSuccess(); // Atualiza a tela anterior
      onClose(); // Fecha o modal

      // Limpa formulário
      setStartDate("");
      setEndDate("");
      setGuestCount(1);
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.detail ||
        "Erro ao registrar. Verifique se as datas já estão ocupadas.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full md:w-[500px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        
        {/* CABEÇALHO */}
        <div className="bg-slate-900 p-6 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold flex items-center gap-3 text-lg">
            <Calendar className="text-emerald-400" size={24} />
            Nova Reserva
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto flex flex-col">
          {/* RESUMO DO IMÓVEL */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-2">
              Imóvel
            </p>
            <p className="font-bold text-slate-900 text-xl leading-tight">
              {property.title}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                <span className="font-bold text-emerald-600">
                  R$ {property.price_per_day}
                </span>
                /dia
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                <Users size={16} className="text-slate-400" /> Max: {property.max_guests}
              </span>
            </div>
          </div>

          {/* INPUTS DE DATA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Check-in
              </label>
              <input
                type="date"
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Check-out
              </label>
              <input
                type="date"
                required
                min={startDate}
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* INPUT DE HÓSPEDES */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Quantidade de Pessoas
            </label>
            <div className="relative">
              <Users
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <input
                type="number"
                required
                min="1"
                max={property.max_guests}
                className="w-full pl-12 p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition-all"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              />
            </div>
            {guestCount > property.max_guests && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-bold">
                <AlertCircle size={14} /> Ultrapassa limite de {property.max_guests}!
              </p>
            )}
          </div>

          {/* ESTIMATIVA DE PREÇO (VISUAL) */}
          <div className="mt-auto pt-6">
            {totalDays > 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-3 text-sm text-slate-600 font-medium">
                  <span className="flex items-center gap-2">
                    <Calculator size={16} className="text-emerald-600" /> {totalDays} diárias
                  </span>
                  <span>x R$ {property.price_per_day}</span>
                </div>
                <div className="h-px bg-emerald-200/60 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-900 font-black text-lg">
                    Total Estimado
                  </span>
                  <span className="text-2xl font-black text-emerald-700 tracking-tight">
                    R$ {estimatedPrice}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center text-slate-500 text-sm font-medium border-dashed">
                Selecione as datas para ver a estimativa de custos.
              </div>
            )}
            
            <button
              type="submit"
              disabled={
                loading || totalDays <= 0 || guestCount > property.max_guests
              }
              className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-black text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-xl shadow-slate-300 active:scale-[0.98] transition-all"
            >
              {loading ? (
                "Gerando Reserva..."
              ) : (
                <>
                  <CheckCircle size={22} /> Confirmar Reserva
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
