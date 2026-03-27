import { User, Mail, Shield, Key, BadgeCheck } from "lucide-react";

export function Profile() {
  return (
    <div className="space-y-6 max-w-4xl pb-10 animate-in fade-in zoom-in-95 duration-500 font-primary">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10 shrink-0 mb-6">
        <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-medium tracking-wider text-sm uppercase">
              <User size={16} /> Conta
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Meu Perfil
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
             <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
                E
             </div>
             <div>
                <p className="font-black text-white">Emanuel Correa</p>
                <p className="text-indigo-200 text-sm">Administrador Premium</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100/50 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative w-32 h-32 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center text-5xl font-black ring-4 ring-white shadow-xl overflow-hidden">
                  <User size={60} />
               </div>
               <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-2 rounded-full ring-4 ring-white shadow-lg">
                  <BadgeCheck size={20} />
               </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Emanuel Correa Carneiro</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                 <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-600 border border-indigo-100">
                    Sócio Fundador
                 </span>
                 <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Shield size={12} /> Conta Verificada
                 </span>
              </div>
            </div>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">
                  Nome Completo
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value="Emanuel Correa Carneiro"
                    className="pl-12 block w-full rounded-2xl border-0 py-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 bg-slate-50 font-bold transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">
                  E-mail de Acesso
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value="emanuelcorreacarneiro@gmail.com"
                    className="pl-12 block w-full rounded-2xl border-0 py-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 bg-slate-50 font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm">
                  <Key size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Segurança Google Account</h4>
                  <p className="text-sm text-slate-500 font-medium">Sua autenticação e dados de login são protegidos via Google OAuth 2.0</p>
                </div>
              </div>
              <button disabled className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest cursor-not-allowed border border-slate-200">
                Alterar Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
