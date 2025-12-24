import { Building2, Users, DollarSign, Activity } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500">Bem-vindo de volta ao RentlyHub.</p>
      </div>

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Imóveis"
          value="12"
          icon={Building2}
          trend="+2 esse mês"
        />
        <StatsCard
          title="Ocupação"
          value="85%"
          icon={Users}
          trend="+5% vs mês passado"
        />
        <StatsCard
          title="Receita Mensal"
          value="R$ 24.500"
          icon={DollarSign}
          trend="Dentro da meta"
        />
        <StatsCard
          title="Manutenções"
          value="3"
          icon={Activity}
          trend="Aguardando ação"
          alert
        />
      </div>

      {/* Área em Branco para Gráficos Futuros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2 h-64 flex items-center justify-center text-slate-400">
          [Gráfico de Receita Anual virá aqui]
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex items-center justify-center text-slate-400">
          [Últimas Atividades]
        </div>
      </div>
    </div>
  );
}

// Pequeno componente auxiliar para os cards não repetirem código
function StatsCard({ title, value, icon: Icon, trend, alert = false }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            alert ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
          }`}
        >
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        <span
          className={
            alert ? "text-red-600 font-medium" : "text-green-600 font-medium"
          }
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
