import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, MessageSquare, Loader2, Trash2, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface ActionCommand {
  type: 'ADD_EXPENSE';
  data: {
    amount: number;
    expense_title: string;
    category: string;
    property_id: number;
    property_name: string;
  };
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  command?: ActionCommand;
  status?: 'pending' | 'completed' | 'cancelled';
}

export function OracleChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Message[]>(() => {
    const saved = localStorage.getItem('oracle_history');
    return saved ? JSON.parse(saved) : [
      { role: 'bot', content: 'Olá! Sou o Oráculo RentlyHub. Posso te ajudar com dúvidas do sistema ou analisando seus dados de faturamento e despesas. O que deseja saber?' }
    ];
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('oracle_history', JSON.stringify(history));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  function parseResponse(fullResponse: string) {
    const separator = '@@COMMAND@@';
    if (fullResponse.includes(separator)) {
      const [text, commandStr] = fullResponse.split(separator);
      try {
        const command = JSON.parse(commandStr.trim());
        return { text: text.trim(), command };
      } catch (e) {
        console.error("Erro ao processar comando da IA:", e);
        return { text: fullResponse, command: undefined };
      }
    }
    return { text: fullResponse, command: undefined };
  }

  async function handleSend() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/oracle/chat', { message: userMessage });
      const { text, command } = parseResponse(response.data.response);
      
      setHistory(prev => [...prev, { 
        role: 'bot', 
        content: text,
        command: command,
        status: command ? 'pending' : undefined
      }]);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Erro ao consultar o Oráculo.";
      toast.error(errorMsg);
      setHistory(prev => [...prev, { role: 'bot', content: "Desculpe, tive um problema técnico. Verifique sua conexão ou tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmAction(index: number) {
    const msg = history[index];
    if (!msg.command || actionLoading) return;

    setActionLoading(true);
    try {
      if (msg.command.type === 'ADD_EXPENSE') {
        await api.post('/expenses/', {
          expense_title: msg.command.data.expense_title,
          amount: msg.command.data.amount,
          category: msg.command.data.category,
          property_id: msg.command.data.property_id,
          pay_date: new Date().toISOString().split('T')[0]
        });
        
        toast.success("Despesa adicionada com sucesso!");
        
        setHistory(prev => prev.map((item, i) => 
          i === index ? { ...item, status: 'completed' as const } : item
        ));
      }
    } catch (error) {
      toast.error("Erro ao executar ação.");
    } finally {
      setActionLoading(false);
    }
  }

  const handleClearHistory = () => {
    setHistory([
      { role: 'bot', content: 'Conversa reiniciada. Como posso ajudar agora?' }
    ]);
    setShowClearConfirm(false);
    toast.success("Conversa limpa!");
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100] group flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
          <MessageSquare className="relative z-10 h-8 w-8 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-primary">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Clear Confirmation Overlay Modal */}
            {showClearConfirm && (
              <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowClearConfirm(false)} />
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[280px] text-center border border-white/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mx-auto mb-4">
                    <Trash2 size={32} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 uppercase italic tracking-tight">Limpar Chat?</h3>
                  <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">Isso apagará todo o histórico atual e não poderá ser desfeito.</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleClearHistory}
                      className="w-full bg-red-500 hover:bg-red-600 text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                    >
                      Sim, Apagar Tudo
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 h-10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-slate-900 p-6 text-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-lg">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight uppercase italic">Oráculo <span className="text-emerald-400">Hub</span></h2>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inteligência Operacional</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowClearConfirm(true)} 
                    className="p-2.5 rounded-xl hover:bg-white/10 text-slate-400 transition-all hover:text-red-400"
                    title="Limpar Conversa"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2.5 rounded-xl hover:bg-white/10 text-slate-400 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
              {history.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 mb-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{msg.role === 'user' ? 'EU' : 'HUB'}</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{msg.role === 'user' ? 'Você' : 'Oráculo'}</span>
                  </div>
                  
                  <div className={`relative max-w-[90%] p-4 rounded-2xl shadow-sm text-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none leading-relaxed'}`}>
                    {msg.role === 'bot' ? (
                      <div className="prose prose-sm prose-slate max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>

                  {/* Action Card */}
                  {msg.command && msg.role === 'bot' && (
                    <div className="mt-3 w-[90%] bg-white rounded-2xl border-2 border-indigo-100 shadow-xl p-4 animate-in zoom-in-95 duration-200 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Sparkles size={40} className="text-indigo-600" />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                        <AlertCircle size={14} />
                        Confirmar Ação Sugerida
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Objetivo:</span>
                          <span className="font-bold text-slate-700">Nova Despesa</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Imóvel:</span>
                          <span className="font-bold text-slate-700">{msg.command.data.property_name}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                          <span className="font-bold text-slate-900">{msg.command.data.expense_title}</span>
                          <span className="font-black text-indigo-600">R$ {msg.command.data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      {msg.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmAction(idx)}
                            disabled={actionLoading}
                            className="flex-1 bg-indigo-600 text-white h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
                          >
                            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Aprovar Registro
                          </button>
                        </div>
                      ) : msg.status === 'completed' ? (
                        <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                          <Check size={14} /> Registro Confirmado
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-2 animate-pulse mb-6">
                  <div className="h-6 w-6 rounded-md bg-slate-200 flex items-center justify-center"><Loader2 size={12} className="animate-spin text-indigo-500" /></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">Oráculo está pensando...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-6 bg-white border-t border-slate-100 flex-shrink-0">
              <div className="relative group">
                <textarea
                  placeholder="Ex: Registre 50 reais de limpeza no Sabiá hoje"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pr-14 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium resize-none shadow-inner"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || loading}
                  className="absolute right-3 bottom-3 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg hover:bg-indigo-600 transition-all disabled:opacity-30 active:scale-95 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
