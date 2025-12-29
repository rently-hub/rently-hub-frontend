import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { api } from "../services/api";
import type { Property } from "../types";
import { CreatePropertyModal } from "../components/properties/CreatePropertyModal";
import { PropertyDetailsModal } from "../components/properties/PropertyDetailsModal";

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
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
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
    );
  }

  return (
    <div className="space-y-6">
      <CreatePropertyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newProp) => setProperties((prev) => [...prev, newProp])}
      />

      {/* MODAL DE DETALHES/EDIÇÃO */}
      <PropertyDetailsModal
        isOpen={!!selectedProperty}
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onUpdate={handleUpdateProperty}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          Nova Propriedade
        </button>
      </div>
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
            >
              {/* Imagem */}
              <div className="h-48 bg-slate-200 w-full relative">
                <img
                  src={`https://placehold.co/600x400/e2e8f0/1e293b?text=${property.title.charAt(
                    0
                  )}`}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900 shadow-sm">
                  R$ {(property.price_per_day || 0).toLocaleString("pt-BR")} /
                  dia
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">
                  {property.title}
                </h3>

                <div className="flex items-center text-slate-500 text-sm mb-3">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{property.address}</span>
                </div>

                <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
                  {property.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                  <span className="text-xs text-slate-400">
                    ID: #{property.id}
                  </span>
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="text-sm font-medium text-slate-900 hover:text-green-600 transition-colors"
                  >
                    Alugar
                  </button>
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    Detalhes →
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
