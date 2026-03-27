import { useState, useEffect } from "react";
import { Building2, Users, DollarSign, Receipt, TrendingUp, Sparkles, Percent, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from "../services/api";
import type { Property } from "../types";

interface DashboardSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  upcoming_checkins: number;
  occupancy_rate: number;
  adr: number;
  chart_data: { name: string; receita: number; despesa: number }[];
}

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const propsRes = await api.get("/properties/");
        setProperties(propsRes.data);
      } catch (err) {
        console.error("Erro ao carregar propriedades", err);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const params = selectedPropertyId ? { property_id: selectedPropertyId } : {};
        const { data } = await api.get("/dashboard/summary", { params });
        console.log("Dashboard Data:", data);
        setSummary(data);

      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [selectedPropertyId]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10 font-primary">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10 shrink-0">
        <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-medium tracking-wider text-sm uppercase">
              <Sparkles size={16} /> Dashboard Financeiro
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Visão Geral
            </h1>
            <p className="text-slate-400 max-w-xl text-sm md:text-base font-medium">
              Análise completa do seu portfólio imobiliário e performance de locação.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
             <div className="flex items-center gap-3">
                <Building2 size={20} className="text-indigo-300" />
                <span className="text-sm font-bold text-white uppercase tracking-widest">Filtrar Imóvel:</span>
             </div>
             <select 
               className="bg-slate-800 text-white text-sm font-bold py-2 px-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none min-w-[200px] cursor-pointer"
               value={selectedPropertyId}
               onChange={(e) => setSelectedPropertyId(e.target.value)}
             >
                <option value="">Todos os Imóveis</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      {loading && !summary ? (
        <div className="h-64 flex items-center justify-center text-slate-400 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium text-slate-500 uppercase tracking-widest text-xs">Sincronizando estatísticas...</span>
          </div>
        </div>
      ) : summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatsCard
              title="Receita Total"
              value={`R$ ${summary.total_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
              trend="Rendimento Bruto"
              color="indigo"
            />
            <StatsCard
              title="Despesas"
              value={`R$ ${summary.total_expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={Receipt}
              trend="Fluxo de Saída"
              color="rose"
            />
            <StatsCard
              title="Lucro Líquido"
              value={`R$ ${summary.net_profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              trend="Resultado Final"
              color="emerald"
            />
             <StatsCard
              title="Taxa de Ocupação"
              value={`${summary.occupancy_rate}%`}
              icon={Percent}
              trend="Últimos 30 dias"
              color="blue"
            />
             <StatsCard
              title="Diária Média (ADR)"
              value={`R$ ${summary.adr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={Calendar}
              trend="Ticket Médio"
              color="amber"
            />
            <StatsCard
              title="Check-ins Prox."
              value={summary.upcoming_checkins}
              icon={Users}
              trend="Próximo Mês"
              color="indigo"
            />
          </div>

          {/* Premium Chart Area */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100/50 flex flex-col transition-all hover:shadow-2xl hover:shadow-slate-200/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div>
                <h2 className="font-black text-slate-900 text-2xl tracking-tight uppercase">Evolução Financeira</h2>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Comparativo semestral de fluxo de caixa</p>
              </div>
              <div className="flex gap-6 text-xs font-black px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner uppercase tracking-widest">
                <span className="flex items-center gap-2 text-slate-700">
                  <div className="w-3 h-3 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full shadow-lg shadow-indigo-200"></div> Receita
                </span>
                <span className="flex items-center gap-2 text-slate-700">
                  <div className="w-3 h-3 bg-gradient-to-tr from-rose-500 to-rose-300 rounded-full shadow-lg shadow-rose-200"></div> Despesa
                </span>
              </div>
            </div>
            
            <div className="w-full h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={summary.chart_data} 
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }} 
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} 
                    interval={0}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                    tickFormatter={(val) => `R$${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px 20px', fontWeight: '900'}} 
                    formatter={(value: any) => [`R$ ${value.toLocaleString("pt-BR")}`, '']}
                  />
                  <Bar dataKey="receita" name="Receita" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="despesa" name="Despesa" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={40} />


                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#fb7185" stopOpacity={0.9}/>
                    </linearGradient>

                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const iconBgMap: Record<string, string> = {
  blue: "bg-blue-600 shadow-blue-500/30",
  emerald: "bg-emerald-500 shadow-emerald-500/30",
  rose: "bg-rose-500 shadow-rose-500/30",
  amber: "bg-amber-500 shadow-amber-500/30",
  indigo: "bg-indigo-600 shadow-indigo-500/30",
};

function StatsCard({ title, value, icon: Icon, trend, color = "blue" }: any) {
  const iconBg = iconBgMap[color] || iconBgMap.blue;

  return (
    <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/30 border border-slate-100/60 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-50 ${color === 'blue' ? 'bg-blue-400' : color === 'emerald' ? 'bg-emerald-400' : color === 'rose' ? 'bg-rose-400' : color === 'amber' ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${iconBg} transition-transform group-hover:scale-110 duration-300`}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            {trend}
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">{title}</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}
