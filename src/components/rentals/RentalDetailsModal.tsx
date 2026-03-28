import { X, Calendar, User, DollarSign, CreditCard, CheckCircle, Info, MapPin, Receipt, Clock } from "lucide-react";
import { createPortal } from "react-dom";
import type { Rental } from "../../types";
import { useState } from "react";
import { api } from "../../services/api";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rental: Rental | null;
  onUpdate: () => void;
}

export function RentalDetailsModal({ isOpen, onClose, rental, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !rental) return null;

  const handleTogglePaid = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      await api.put(`/rentals/${rental.id}`, { 
        is_paid: !rental.is_paid,
        paid_at: !rental.is_paid ? now : null
      });
      toast.success(rental.is_paid ? "Pagamento marcado como pendente" : "Pagamento recebido com sucesso! 💰");
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status de pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const isPast = new Date(rental.end_date) < new Date();

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        {/* Header Header */}
        <div className={`p-6 bg-gradient-to-r ${rental.is_external ? 'from-slate-700 to-slate-900' : 'from-indigo-600 to-violet-700'} text-white relative`}>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
                <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2 opacity-80 text-xs font-bold uppercase tracking-widest">
                <Calendar size={14} /> Detalhes da Reserva
            </div>
            <h2 className="text-2xl font-black truncate">
                {rental.property?.title || "Imóvel"}
            </h2>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Status Section */}
            <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    rental.is_paid 
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}>
                    {rental.is_paid ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {rental.is_paid ? "RECEBIDO" : "PENDENTE"}
                </span>
                {rental.is_paid && rental.paid_at && (
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold">
                        PAGO EM: {new Date(rental.paid_at).toLocaleDateString('pt-BR')}
                    </span>
                )}
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-black uppercase">
                    {rental.platform_source}
                </span>
                {isPast && (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold uppercase italic">
                        Histórico
                    </span>
                )}
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Check-in</p>
                    <p className="font-bold text-slate-800">{new Date(rental.start_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Check-out</p>
                    <p className="font-bold text-slate-800">{new Date(rental.end_date).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <DollarSign size={16} className="text-indigo-500" /> Resumo Financeiro
                </h3>
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-indigo-600 font-bold">Valor Total</p>
                        <p className="text-xl font-black text-indigo-900">R$ {rental.total_price.toLocaleString('pt-BR')}</p>
                    </div>
                </div>
            </div>

            {/* Guest Info */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <User size={16} className="text-indigo-500" /> Hóspede
                </h3>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                        H
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Reserva #{rental.id}</p>
                        <p className="text-xs text-slate-500">{rental.guest_count} Adultos</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Actions - Only for FIXED properties */}
        {rental.property?.property_type === 'fixed' && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                    onClick={handleTogglePaid}
                    disabled={loading}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                        rental.is_paid 
                            ? "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100" 
                            : "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                    }`}
                >
                    {rental.is_paid ? "Marcar como Pendente" : "Marcar como Recebido ✅"}
                </button>
            </div>
        )}
      </div>
    </div>,
    document.body
  );
}
