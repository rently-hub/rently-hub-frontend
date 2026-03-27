import { Bell, Shield, Smartphone, Globe, CreditCard, Settings as SettingsIcon } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6 max-w-5xl pb-10 animate-in fade-in zoom-in-95 duration-500 font-primary">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10 shrink-0 mb-6">
        <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-medium tracking-wider text-sm uppercase">
              <SettingsIcon size={16} /> Sistema
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Configurações
            </h1>
            <p className="text-slate-400 max-w-xl text-sm md:text-base font-medium">
              Personalize sua experiência e ajuste as preferências de segurança e notificações do RentlyHub.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu Lateral Ajustes */}
        <div className="lg:col-span-1 space-y-2">
          <SettingsMenuItem icon={Shield} title="Privacidade e Segurança" active />
          <SettingsMenuItem icon={Bell} title="Notificações" />
          <SettingsMenuItem icon={CreditCard} title="Faturamento" />
          <SettingsMenuItem icon={Globe} title="Região e Idioma" />
          <SettingsMenuItem icon={Smartphone} title="Dispositivos" />
        </div>

        {/* Área de Conteúdo */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100/50 p-8 md:p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tighter">
              <div className="p-2 bg-slate-100 rounded-xl">
                 <Shield size={22} className="text-slate-600" />
              </div>
              Preferências de Segurança
            </h3>
            
            <div className="space-y-8">
              <ToggleItem 
                title="Sessões Automáticas" 
                description="Manter logado por 30 dias em dispositivos conhecidos para acesso rápido."
                defaultChecked={true}
              />
              <div className="border-t border-slate-100/60"></div>
              <ToggleItem 
                title="Avisos de Novo Login" 
                description="Receber alertas em tempo real via e-mail e push caso um novo dispositivo acesse sua conta."
                defaultChecked={true}
              />
              <div className="border-t border-slate-100/60"></div>
              <ToggleItem 
                title="Comunicações de Marketing" 
                description="Receber e-mails exclusivos com dicas de experts, tendências de mercado e novas atualizações do RentlyHub."
                defaultChecked={false}
              />
            </div>

            <div className="mt-12 flex justify-end">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all hover:shadow-lg shadow-slate-300 active:scale-95">
                Salvar Alterações
              </button>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-3xl p-6 flex items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
                   <CreditCard size={24} />
                </div>
                <div>
                   <p className="font-black text-slate-900 text-sm uppercase">Plano Atual: Premium</p>
                   <p className="text-xs text-slate-500 font-bold">Acesso ilimitado a todas as ferramentas de gestão.</p>
                </div>
             </div>
             <button className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Ver Detalhes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsMenuItem({ icon: Icon, title, active = false }: any) {
  return (
    <button
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all text-left uppercase tracking-tighter ${
        active 
          ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      <Icon size={20} />
      {title}
    </button>
  );
}

function ToggleItem({ title, description, defaultChecked }: any) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1">
        <h4 className="text-base font-black text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
      </label>
    </div>
  );
}
