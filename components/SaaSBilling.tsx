
import React from 'react';
import { ShieldCheck, Zap, Star, Crown, CreditCard, ArrowUpCircle, CheckCircle2, AlertCircle, Clock, ReceiptText } from 'lucide-react';
import { Doctor } from '../types';

interface SaaSBillingProps {
  doctor: Doctor;
}

const SaaSBilling: React.FC<SaaSBillingProps> = ({ doctor }) => {
  const plans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: 25,
      icon: <Zap size={24} className="text-slate-400" />,
      features: ['Hasta 50 Pacientes', 'Facturación Hacienda', 'Soporte vía Ticket'],
      color: 'bg-slate-50 border-slate-200 text-slate-600'
    },
    {
      id: 'pro',
      name: 'Plan Profesional',
      price: 45,
      icon: <Star size={24} className="text-sky-500" />,
      features: ['Pacientes Ilimitados', 'WhatsApp Masivo', 'Inventario CABYS Pro', 'Portal de Clientes'],
      color: 'bg-sky-50 border-sky-200 text-sky-600',
      popular: true
    },
    {
      id: 'elite',
      name: 'Plan Élite',
      price: 85,
      icon: <Crown size={24} className="text-amber-500" />,
      features: ['Multi-Doctor', 'Analítica Avanzada', 'API Externa', 'Soporte 24/7 Premium'],
      color: 'bg-amber-50 border-amber-200 text-amber-600'
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Estado Actual */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="text-emerald-400" size={28} />
                 <h2 className="text-2xl font-black tracking-tight">Tu Suscripción es <span className="text-sky-400 uppercase">{doctor.subscription.tier}</span></h2>
              </div>
              <p className="text-slate-400 font-medium max-w-md">Tu cuenta está activa y al día. Tu próximo cobro automático será el <span className="text-white font-black">{doctor.subscription.nextBillingDate}</span>.</p>
           </div>
           <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Monto Mensual</p>
              <h3 className="text-4xl font-black text-sky-400">${doctor.subscription.price}<span className="text-sm text-slate-500 font-bold">/mes</span></h3>
           </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5">
              <span className="text-xs font-bold text-slate-400">Pacientes Usados</span>
              <span className="font-black">{doctor.subscription.usage.clients} / {doctor.subscription.usage.clientsLimit}</span>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5">
              <span className="text-xs font-bold text-slate-400">Facturas Emitidas</span>
              <span className="font-black">{doctor.subscription.usage.invoices} / {doctor.subscription.usage.invoicesLimit}</span>
           </div>
        </div>
      </div>

      {/* Selector de Planes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {plans.map(plan => (
           <div key={plan.id} className={`relative p-10 rounded-[3rem] border-2 transition-all hover:scale-[1.02] ${plan.id === doctor.subscription.tier ? 'bg-white border-sky-500 shadow-2xl' : 'bg-white border-slate-100 opacity-80'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Más Recomendado</div>
              )}
              
              <div className="flex justify-between items-start mb-8">
                 <div className="p-4 rounded-2xl bg-slate-50">{plan.icon}</div>
                 <div className="text-right">
                    <p className="text-2xl font-black text-slate-800">${plan.price}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Mensual</p>
                 </div>
              </div>
              
              <h4 className="text-xl font-black text-slate-800 mb-6">{plan.name}</h4>
              
              <ul className="space-y-4 mb-10">
                 {plan.features.map((f, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                      <CheckCircle2 size={16} className="text-sky-500" /> {f}
                   </li>
                 ))}
              </ul>

              <button 
                disabled={plan.id === doctor.subscription.tier}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  plan.id === doctor.subscription.tier 
                    ? 'bg-slate-100 text-slate-400 cursor-default' 
                    : 'bg-sky-500 text-white shadow-xl shadow-sky-100 hover:bg-sky-600'
                }`}
              >
                {plan.id === doctor.subscription.tier ? 'Plan Actual' : 'Cambiar a este Plan'}
              </button>
           </div>
         ))}
      </div>

      {/* Historial de Facturas de la Plataforma */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3"><ReceiptText className="text-sky-500"/> Mis Facturas de VetHome</h3>
         </div>
         <div className="p-8 space-y-4">
            {[
              { id: 'VH-902', date: '01/06/2024', amount: 45, status: 'Pagado' },
              { id: 'VH-841', date: '01/05/2024', amount: 45, status: 'Pagado' }
            ].map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                 <div className="flex items-center gap-6">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-slate-400"><Clock size={20}/></div>
                    <div>
                       <p className="text-sm font-black text-slate-800">{inv.id}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">{inv.date}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <p className="text-lg font-black text-slate-800">${inv.amount}</p>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{inv.status}</span>
                    <button className="p-2.5 text-slate-300 hover:text-sky-500"><CreditCard size={18}/></button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SaaSBilling;
