import { useEffect, useState } from "react";
import { Plus, MapPin, Building2, Sparkles } from "lucide-react";

import { api } from "../services/api";
import type { Property } from "../types";
import { CreatePropertyModal } from "../components/properties/CreatePropertyModal";
import { PropertyDetailsModal } from "../components/properties/PropertyDetailsModal";

const gradients = [
  "from-blue-600 to-indigo-700",
  "from-emerald-500 to-teal-700",
  "from-orange-500 to-rose-600",
  "from-purple-600 to-fuchsia-700",
  "from-cyan-600 to-blue-700",
];

function getGradient(id: number = 0) {
  return gradients[id % gradients.length];
}

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const response = await api.get("/properties/");
      setProperties(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleUpdateProperty(updatedProperty: Property) {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)),
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10">
      <CreatePropertyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newProp) => setProperties((prev) => [...prev, newProp])}
      />

      <PropertyDetailsModal
        isOpen={!!selectedProperty}
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onUpdate={handleUpdateProperty}
      />

      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10">
        <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-medium tracking-wider text-sm uppercase">
              <Sparkles size={16} /> Meu Portfólio
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Gestão de Propriedades
            </h1>
            <p className="text-slate-400 max-w-xl text-sm md:text-base">
              Cadastre e gerencie os detalhes, valores e reservas dos seus imóveis com uma interface inteligente e integrada.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl transition-all font-bold shadow-lg shadow-indigo-500/30 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Nova Propriedade
          </button>
        </div>
      </div>

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group relative"
            >
              <div className={`h-48 w-full relative bg-gradient-to-br ${getGradient(property.id)} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                <Building2 className="absolute -bottom-10 -right-8 text-white/10 w-48 h-48 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                <span className="text-white text-7xl font-black tracking-tighter drop-shadow-lg z-10 transition-transform group-hover:scale-110 duration-500">
                  {property.title.charAt(0).toUpperCase()}
                </span>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-slate-900 shadow-xl shadow-black/10">
                  R$ {(property.price_per_day || 0).toLocaleString("pt-BR")} / dia
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col relative z-20 -mt-6 bg-white rounded-t-3xl">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-black text-xl text-slate-800 tracking-tight line-clamp-1 pr-2">
                    {property.title}
                  </h3>
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-4 font-medium">
                  <MapPin size={16} className="mr-1.5 text-indigo-400" />
                  <span className="truncate">{property.address}</span>
                </div>

                <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                  {property.description}
                </p>

                <div className="pt-4 border-t border-slate-100/80">
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="w-full flex justify-center items-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-slate-200 hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Building2 size={18} strokeWidth={2.5} />
                    Gerenciar Imóvel
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
