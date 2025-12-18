
import React, { useState, useEffect } from 'react';
import { 
  LogOut, Dog, Cat, Calendar, FileText, Download, MessageSquare, 
  Send, ChevronRight, Activity, Clock, Bell, BellOff, CheckCircle2, 
  X, Wallet, DollarSign, History as HistoryIcon, ShieldAlert 
} from 'lucide-react';
import { Doctor, Message, Invoice } from '../types';
import { generateReminderNotificationText } from '../services/geminiService';

interface ClientPortalProps {
  doctor: Doctor;
  onLogout: () => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ doctor, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'pets' | 'chat' | 'payments'>('pets');
  const [newMessage, setNewMessage] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  
  // Datos simulados de facturas para el cliente Andrés
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([
    {
      id: 'INV-1',
      consecutive: '506200624001001010000000001000000001',
      clientId: '1',
      clientName: 'Andrés Calderón',
      date: '20/06/2024',
      items: [],
      subtotal: 25000,
      tax: 1000,
      total: 26000,
      type: 'FE',
      status: 'accepted',
      paymentStatus: 'paid'
    },
    {
      id: 'INV-2',
      consecutive: '506200624001001010000000001000000002',
      clientId: '1',
      clientName: 'Andrés Calderón',
      date: '21/06/2024',
      items: [],
      subtotal: 15000,
      tax: 600,
      total: 15600,
      type: 'FE',
      status: 'accepted',
      paymentStatus: 'unpaid'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'doc', senderName: `Dr. ${doctor.name}`, text: '¡Hola! ¿Cómo sigue Luna de su patita?', timestamp: '09:00 AM', isAdmin: true },
    { id: '2', senderId: 'client', senderName: 'Andrés', text: 'Mucho mejor Dr Daniel, ya está saltando.', timestamp: '09:15 AM', isAdmin: false }
  ]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    const timer = setTimeout(() => triggerPushSimulation("Max", "Refuerzo de Rabia"), 3000);
    return () => clearTimeout(timer);
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const triggerPushSimulation = async (petName: string, reason: string) => {
    const text = await generateReminderNotificationText(petName, reason);
    if (Notification.permission === 'granted') {
      new Notification(`VetHome: ${petName}`, { body: text });
    } else {
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 5000);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'client',
      senderName: 'Andrés',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: false
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const paidTotal = clientInvoices.filter(i => i.paymentStatus === 'paid').reduce((acc, i) => acc + i.total, 0);
  const pendingTotal = clientInvoices.filter(i => i.paymentStatus === 'unpaid').reduce((acc, i) => acc + i.total, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {showNotificationToast && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right-full">
           <div className="bg-white border-l-4 border-sky-500 p-6 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm">
              <div className="bg-sky-100 p-3 rounded-xl text-sky-600"><Bell size={24} className="animate-bounce" /></div>
              <div>
                <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Recordatorio</p>
                <p className="text-sm font-bold text-slate-800">Max tiene cita próximamente.</p>
              </div>
              <button onClick={() => setShowNotificationToast(false)} className="text-slate-300 hover:text-slate-500"><X size={18}/></button>
           </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2.5 rounded-2xl text-white shadow-lg"><Dog size={20}/></div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Mi Portal <span className="text-sky-500 font-extrabold">VetHome</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Bienvenido, Andrés</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setActiveTab('payments')} className={`p-3.5 rounded-2xl transition-all relative ${activeTab === 'payments' ? 'bg-sky-500 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-sky-500'}`}>
             <Wallet size={22}/>
             {pendingTotal > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>}
           </button>
           <button onClick={() => setActiveTab('chat')} className={`p-3.5 rounded-2xl transition-all relative ${activeTab === 'chat' ? 'bg-sky-500 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-sky-500'}`}>
             <MessageSquare size={22}/>
           </button>
           <button onClick={onLogout} className="text-slate-400 font-black text-xs uppercase tracking-wider hover:text-rose-500 transition-all bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 shadow-sm">
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-10">
        {activeTab === 'pets' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
               <h2 className="text-4xl font-black tracking-tighter mb-4">¡Hola, Andrés! 👋</h2>
               <p className="text-slate-400 font-medium text-lg max-w-lg mb-10">Revisa el estado de salud y pagos de tus compañeros peludos.</p>
               <div className="flex gap-6">
                  <div className="bg-white/5 backdrop-blur-md px-10 py-6 rounded-3xl text-center border border-white/10">
                    <p className="text-4xl font-black">2</p>
                    <p className="text-[10px] font-black uppercase text-slate-400">Mascotas</p>
                  </div>
                  <div onClick={() => setActiveTab('payments')} className="bg-rose-500/20 px-10 py-6 rounded-3xl text-center border border-rose-500/20 cursor-pointer hover:bg-rose-500/30 transition-all">
                    <p className="text-4xl font-black text-rose-500">₡{pendingTotal.toLocaleString()}</p>
                    <p className="text-[10px] font-black uppercase text-rose-300">Pendiente de Pago</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Luna', species: 'Cat', breed: 'Persa', status: 'Sana' },
                { name: 'Max', species: 'Dog', breed: 'Labrador', status: 'Cita Pendiente' }
              ].map(pet => (
                <div key={pet.name} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-sky-500 group-hover:text-white transition-all">
                      {pet.species === 'Dog' ? <Dog size={32}/> : <Cat size={32}/>}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${pet.status === 'Sana' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>{pet.status}</span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800">{pet.name}</h4>
                  <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest">{pet.breed}</p>
                  <button className="w-full py-4 bg-slate-800 text-white font-black text-[10px] uppercase rounded-2xl hover:bg-sky-500 transition-all">Ver Historial Médico</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Mis Finanzas con VetHome</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                      <div className="flex items-center gap-4 mb-4 text-emerald-600">
                        <CheckCircle2 size={32} />
                        <h4 className="text-lg font-black uppercase tracking-widest">Pagos Realizados</h4>
                      </div>
                      <p className="text-3xl font-black text-emerald-700">₡{paidTotal.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase mt-2 tracking-widest">Gracias por tu puntualidad</p>
                   </div>
                   
                   <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100">
                      <div className="flex items-center gap-4 mb-4 text-rose-600">
                        <ShieldAlert size={32} />
                        <h4 className="text-lg font-black uppercase tracking-widest">Pendiente de Pago</h4>
                      </div>
                      <p className="text-3xl font-black text-rose-700">₡{pendingTotal.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-rose-500 uppercase mt-2 tracking-widest">Paga vía Sinpe al 8888-8888</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Detalle de Transacciones</h4>
                   {clientInvoices.map(inv => (
                     <div key={inv.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                        <div className="flex items-center gap-6">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${inv.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'}`}>
                              <DollarSign size={24} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">#{inv.consecutive.slice(-8)}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{inv.date}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-slate-800">₡{inv.total.toLocaleString()}</p>
                           <span className={`text-[9px] font-black uppercase tracking-widest ${inv.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {inv.paymentStatus === 'paid' ? 'Liquidado' : 'Pendiente'}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <button className="p-3 bg-white rounded-xl text-slate-300 hover:text-sky-500 transition-all shadow-sm"><Download size={18}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto h-[70vh] flex flex-col bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center gap-5">
               <img src={doctor.avatar} className="w-16 h-16 rounded-2xl shadow-lg" />
               <div>
                  <h4 className="text-xl font-black text-slate-800">Mensajes con Dr. Daniel</h4>
                  <p className="text-[10px] font-black text-emerald-500 uppercase">En Línea</p>
               </div>
            </div>
            <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-slate-50/20">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-6 rounded-[2rem] ${msg.isAdmin ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' : 'bg-sky-500 text-white rounded-tr-none shadow-xl shadow-sky-100'}`}>
                    <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                    <p className="text-[9px] font-black mt-3 uppercase tracking-widest opacity-40">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-white border-t border-slate-50 flex gap-4">
              <input type="text" placeholder="Escribe tu consulta..." className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
              <button onClick={handleSendMessage} className="bg-sky-500 text-white p-5 rounded-2xl shadow-xl hover:scale-105 transition-all"><Send size={22} /></button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientPortal;
