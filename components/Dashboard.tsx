
import React from 'react';
import { TrendingUp, Calendar, Users, Activity, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Doctor } from '../types';

interface DashboardProps {
  doctor: Doctor;
}

const Dashboard: React.FC<DashboardProps> = ({ doctor }) => {
  const usagePercentage = (doctor.subscription.usage.clients / doctor.subscription.usage.clientsLimit) * 100;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="bg-sky-50 p-3 rounded-2xl text-sky-600"><Users size={24}/></div>
             <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+{usagePercentage.toFixed(0)}% Uso</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pacientes Registrados</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{doctor.subscription.usage.clients}</h3>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
               <div className="bg-sky-500 h-full rounded-full" style={{ width: `${usagePercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><Calendar size={24}/></div>
             <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Hoy</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Citas para Hoy</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">8</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="bg-amber-50 p-3 rounded-2xl text-amber-600"><Activity size={24}/></div>
             <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+₡45k</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tu Facturación Mes</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">₡840k</h3>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between text-white overflow-hidden relative group border border-slate-800">
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-4">Estado Suscripción SaaS</p>
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">Plan {doctor.subscription.tier.toUpperCase()}</h3>
            <p className="text-[10px] font-bold mt-2 text-sky-400 uppercase tracking-widest">Activo hasta {doctor.subscription.nextBillingDate}</p>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Próximas Visitas Nómadas</h3>
            <button className="text-[10px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-1 hover:underline">Gestionar Agenda <ArrowRight size={14}/></button>
          </div>
          <div className="space-y-6">
            {[
              { time: '09:00 AM', name: 'Rocky', owner: 'Carlos Rojas', task: 'Vacuna Triple', status: 'confirmed' },
              { time: '11:30 AM', name: 'Luna', owner: 'Elena Solano', task: 'Control Quirúrgico', status: 'pending' },
              { time: '02:00 PM', name: 'Max', owner: 'Felipe Mora', task: 'Consulta General', status: 'confirmed' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-sky-50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="bg-white px-4 py-2 rounded-2xl shadow-sm text-xs font-black text-sky-600">{item.time}</div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{item.name} <span className="text-[10px] font-bold text-slate-400 font-normal">({item.owner})</span></p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.task}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {item.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-sky-500 p-10 rounded-[2.5rem] text-white shadow-xl shadow-sky-100">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Límite de Pacientes</p>
             <h4 className="text-xl font-black tracking-tight leading-snug mb-4">Estás al {usagePercentage.toFixed(0)}% de tu límite Pro.</h4>
             <div className="bg-white/20 h-2 rounded-full mb-6">
                <div className="bg-white h-full rounded-full" style={{ width: `${usagePercentage}%` }}></div>
             </div>
             <button className="bg-white text-sky-600 w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Mejorar a Plan Élite</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
