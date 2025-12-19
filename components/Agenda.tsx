
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, MessageSquare, Phone, MapPin, X, Check, Send, Users, AlertCircle, Filter } from 'lucide-react';
import { Appointment } from '../types';
import { generateBatchNotificationMessage } from '../services/geminiService';

const Agenda: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', clientId: 'c1', petId: 'p1', petName: 'Luna', date: '2024-06-24', time: '09:30 AM', reason: 'Vacuna Anual', status: 'confirmed' },
    { id: '2', clientId: 'c2', petId: 'p2', petName: 'Rocky', date: '2024-06-24', time: '11:00 AM', reason: 'Control Cirugía', status: 'pending' },
    { id: '3', clientId: 'c3', petId: 'p3', petName: 'Max', date: '2024-06-26', time: '02:00 PM', reason: 'Refuerzo Rabia', status: 'confirmed' },
    { id: '4', clientId: 'c4', petId: 'p4', petName: 'Mia', date: '2024-06-28', time: '10:00 AM', reason: 'Desparasitación', status: 'pending' }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isBatching, setIsBatching] = useState(false);
  const [startDate, setStartDate] = useState('2024-06-24');
  const [endDate, setEndDate] = useState('2024-06-30');
  const [isSendingBatch, setIsSendingBatch] = useState(false);
  const [batchMessages, setBatchMessages] = useState<Record<string, string>>({});

  // Filtrar citas por rango
  const filteredApps = appointments.filter(app => app.date >= startDate && app.date <= endDate);

  const startBatchCampaign = async () => {
    setIsSendingBatch(true);
    const messages: Record<string, string> = {};
    
    for (const app of filteredApps) {
      const msg = await generateBatchNotificationMessage("Daniel Sánchez", app.petName, "Propietario", app.reason, app.date);
      messages[app.id] = msg;
    }
    
    setBatchMessages(messages);
    setIsSendingBatch(false);
    alert(`Campaña preparada para ${filteredApps.length} clientes.`);
  };

  const confirmAndSendAll = () => {
    setIsSendingBatch(true);
    // Simulación de envío masivo
    setTimeout(() => {
      setIsSendingBatch(false);
      setIsBatching(false);
      alert("¡Éxito! Todos los mensajes han sido enviados vía WhatsApp y SMS.");
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Junio 2024</h3>
              <div className="flex gap-2">
                 <button className="p-2 bg-slate-50 rounded-xl hover:text-sky-500 transition-colors"><ChevronLeft size={18}/></button>
                 <button className="p-2 bg-slate-50 rounded-xl hover:text-sky-500 transition-colors"><ChevronRight size={18}/></button>
              </div>
           </div>
           <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['D','L','M','M','J','V','S'].map(d => <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>)}
           </div>
           <div className="grid grid-cols-7 gap-2 text-center">
              {Array.from({length: 30}).map((_, i) => (
                <button key={i} className={`py-3 rounded-2xl text-xs font-bold transition-all ${i + 1 === 24 ? 'bg-sky-500 text-white shadow-lg shadow-sky-100 scale-110' : 'hover:bg-sky-50 text-slate-600'}`}>
                  {i + 1}
                </button>
              ))}
           </div>
           <button onClick={() => setIsAdding(true)} className="w-full mt-10 py-5 bg-slate-800 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all">
             + Programar Visita
           </button>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-100 relative overflow-hidden group">
           <div className="relative z-10">
              <h4 className="text-xl font-black mb-2 flex items-center gap-2 tracking-tight"><MessageSquare size={20}/> Campaña Masiva</h4>
              <p className="text-xs font-bold opacity-90 leading-relaxed mb-6">Envía recordatorios de vacunas y citas a múltiples clientes por WhatsApp y SMS en un solo clic.</p>
              <button 
                onClick={() => setIsBatching(true)}
                className="bg-white text-amber-600 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-600/20 hover:scale-105 transition-all"
              >
                Abrir Centro de Campañas
              </button>
           </div>
           <Clock className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform" />
        </div>
      </div>

      <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Agenda Médica de Hoy</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lunes 24 de Junio</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-500">
               <Clock size={14} className="text-sky-500" /> 08:45 AM
            </div>
         </div>
         <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {appointments.filter(a => a.date === '2024-06-24').map(app => (
               <div key={app.id} className="p-8 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-center gap-6 group">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                     <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-center justify-center shadow-sm group-hover:border-sky-500 transition-colors">
                        <span className="text-xs font-black text-sky-500">{app.time.split(' ')[0]}</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{app.time.split(' ')[1]}</span>
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-800">{app.petName}</h4>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest mt-0.5"><MapPin size={10} className="text-sky-500"/> Visita a Domicilio</p>
                        <div className="flex gap-2 mt-3">
                           <span className="bg-slate-100 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest text-slate-500">{app.reason}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-sky-500 hover:bg-sky-50 transition-all shadow-sm"><Phone size={18}/></button>
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-sky-500 hover:bg-sky-50 transition-all shadow-sm"><MessageSquare size={18}/></button>
                     <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
                     <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${app.status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
                        {app.status === 'confirmed' ? <Check size={14}/> : <Clock size={14}/>}
                        {app.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                     </div>
                  </div>
               </div>
            ))}
            {appointments.length === 0 && <div className="p-24 text-center text-slate-300 italic">No hay citas para hoy. ¡Disfruta el descanso!</div>}
         </div>
      </div>

      {/* MODAL: Campaña de Notificación Masiva */}
      {isBatching && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-10 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-amber-800 tracking-tight">Centro de Campañas Preventivas</h3>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">Recordatorios Inteligentes de Salud</p>
              </div>
              <button onClick={() => setIsBatching(false)} className="p-3 bg-white rounded-2xl text-amber-300 hover:text-amber-500 shadow-sm"><X size={20}/></button>
            </div>
            
            <div className="p-10 flex-1 overflow-y-auto space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                   <div className="bg-sky-50 p-3 rounded-2xl text-sky-500"><Filter size={20}/></div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Configurar Rango de Envío</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Fin</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  onClick={startBatchCampaign}
                  disabled={isSendingBatch}
                  className="w-full mt-6 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                >
                  {isSendingBatch ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Users size={18}/> Analizar y Generar Mensajes</>}
                </button>
              </div>

              {filteredApps.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Destinatarios Encontrados ({filteredApps.length})</h4>
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black">Rango Válido</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredApps.map(app => (
                      <div key={app.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-start group">
                        <div className="flex gap-4">
                           <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 shadow-sm font-black text-lg">
                              {app.petName.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">{app.petName} <span className="text-[10px] font-bold text-slate-400 lowercase">({app.reason})</span></p>
                              <div className="bg-white/50 p-3 rounded-xl border border-slate-100 mt-3 max-w-lg">
                                 <p className="text-[10px] italic text-slate-600 leading-relaxed">
                                   {batchMessages[app.id] ? batchMessages[app.id] : "Haz clic en 'Analizar' para redactar mensaje personalizado..."}
                                 </p>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase">{app.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="flex-1">
                     <p className="text-xs font-bold text-slate-400">Se enviarán recordatorios automáticos vía WhatsApp y SMS. Asegúrate de tener saldo en tu pasarela de mensajes.</p>
                  </div>
                  <button 
                    disabled={filteredApps.length === 0 || isSendingBatch}
                    onClick={confirmAndSendAll}
                    className="bg-emerald-500 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                  >
                    <Send size={18}/> Ejecutar Envío Masivo
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Programar Visita (Original Simple) */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-slate-50 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Programar Nueva Cita</h3>
            </div>
            <div className="p-10 space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mascota / Paciente</label>
                 <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    <option>Selecciona Paciente...</option>
                    <option>Luna</option>
                    <option>Rocky</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha</label>
                    <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora</label>
                    <input type="time" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                  </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo de Consulta</label>
                 <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold h-24"></textarea>
               </div>
               <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                 <button onClick={() => setIsAdding(false)} className="flex-[2] py-4 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-sky-100">Agendar y Notificar</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
