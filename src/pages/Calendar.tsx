import { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { api } from "../services/api";
import type { Rental, Property } from "../types";
import { Calendar as CalendarIcon, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { PropertyDetailsModal } from "../components/properties/PropertyDetailsModal";
import { RentalDetailsModal } from "../components/rentals/RentalDetailsModal";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PROPERTY_COLORS = ["#3b82f6", "#10b981", "#f43f5e", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#84cc16"];

export function Calendar() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isRentalDetailsOpen, setIsRentalDetailsOpen] = useState(false);

  // Responsive view
  const [view, setView] = useState<View>("month");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView("agenda");
      } else {
        setView("month");
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [rentalsResp, propertiesResp] = await Promise.all([
        api.get("/rentals/"),
        api.get("/properties/")
      ]);
      setRentals(rentalsResp.data);
      setProperties(propertiesResp.data);
    } catch (error) {
      console.error("Erro ao carregar dados do calendário", error);
    } finally {
      setLoading(false);
    }
  }

  // Filtering Logic
  const filteredRentals = selectedPropertyId === "all" 
    ? rentals 
    : rentals.filter(r => r.property_id.toString() === selectedPropertyId);

  const events = filteredRentals.map((rental) => ({
    title: rental.property?.title || `Imóvel #${rental.property_id}`,
    start: new Date(rental.start_date),
    end: new Date(rental.end_date),
    allDay: true,
    resource: rental,
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedRental(event.resource);
    setIsRentalDetailsOpen(true);
  };

  // Custom event styles
  const eventPropGetter = (event: any) => {
    const isPast = new Date(event.end) < new Date();
    return {
      className: "rbc-event-custom",
      style: {
        opacity: isPast ? 0.5 : 1,
        transition: "opacity 0.2s ease",
      }
    };
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in zoom-in-95 duration-500 pb-10 font-primary">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10 shrink-0">
        <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-medium tracking-wider text-sm uppercase">
              <CalendarIcon size={16} /> Planejamento
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Calendário Geral
            </h1>
            <p className="text-slate-400 max-w-xl text-sm">
              Gestão visual de ocupação e reservas para toda a sua rede de imóveis.
            </p>
          </div>

          {/* PROPERTY FILTER */}
          <div className="relative z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10 min-w-[240px]">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
              <Filter size={18} />
            </div>
            <select 
              className="bg-transparent text-white font-bold outline-none cursor-pointer w-full text-sm appearance-none"
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
            >
              <option value="all" className="text-slate-900">Todos os Imóveis</option>
              {properties.map(p => (
                <option key={p.id} value={p.id} className="text-slate-900">
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-4 md:p-6 flex-1 min-h-[600px] border border-slate-100 flex flex-col overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 font-medium">
            <Loader2 className="animate-spin mr-2" /> Carregando calendário...
          </div>
        ) : (
          <div className="h-full animate-in fade-in duration-500">
            <BigCalendar
              localizer={localizer}
              events={events}
              date={currentDate}
              view={view}
              onView={(v) => setView(v)}
              onNavigate={(newDate) => setCurrentDate(newDate)}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              culture="pt-BR"
              eventPropGetter={eventPropGetter}
              onSelectEvent={handleSelectEvent}
              components={{
                toolbar: CustomToolbar,
                event: CustomEvent
              }}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Reserva",
                noEventsInRange: "Não há reservas neste período.",
              }}
            />
          </div>
        )}
      </div>

      <PropertyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
        onUpdate={() => {
          fetchData(); 
        }}
      />
      <RentalDetailsModal
        isOpen={isRentalDetailsOpen}
        onClose={() => setIsRentalDetailsOpen(false)}
        rental={selectedRental}
        onUpdate={() => {
            fetchData();
        }}
      />
    </div>
  );
}

// 🎫 CUSTOM EVENT COMPONENT (TRELLO STYLE)
function CustomEvent({ event }: any) {
  const rental = event.resource as Rental;
  const propertyId = rental.property_id || 0;
  const propertyColor = PROPERTY_COLORS[propertyId % PROPERTY_COLORS.length];

  // Colors for platforms
  const getPlatformColor = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes("airbnb")) return "#ff5a5f";
    if (s.includes("booking")) return "#003580";
    if (s.includes("google")) return "#4285f4";
    if (s.includes("direto")) return "#10b981";
    return "#94a3b8"; // Default slate
  };

  const statusColors: Record<string, string> = {
    "active": "#3b82f6",
    "completed": "#64748b",
    "cancelled": "#f43f5e",
    "Confirmada": "#10b981",
    "paid": "#10b981"
  };

  const status = rental.is_paid ? "paid" : rental.status;

  return (
    <div className="event-card">
      <div className="event-property-bar" style={{ backgroundColor: propertyColor }}></div>
      <div className="event-title">{event.title}</div>
      <div className="event-flags">
        {/* Status Flag */}
        <div 
          className="flag" 
          title={`Status: ${rental.is_paid ? 'Pago' : rental.status}`}
          style={{ backgroundColor: statusColors[status] || "#3b82f6" }} 
        />
        <div 
          className="flag" 
          title={`Origem: ${rental.platform_source}`}
          style={{ backgroundColor: getPlatformColor(rental.platform_source) }} 
        />
      </div>
    </div>
  );
}

// 🛠️ CUSTOM PREMIUM TOOLBAR
function CustomToolbar(toolbar: any) {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };
  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };
  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  const handleViewChange = (v: View) => {
    toolbar.onView(v);
  };

  return (
    <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-black text-slate-800 capitalize drop-shadow-sm min-w-[200px]">
          {toolbar.label}
        </h2>
        
        {/* VIEW SWITCHER */}
        <div className="hidden md:flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(["month", "week", "agenda"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                toolbar.view === v 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {v === "month" ? "Mês" : v === "week" ? "Semana" : "Agenda"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm p-1">
          <button
            onClick={goToBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToCurrent}
            className="px-4 py-1 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={goToNext}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

