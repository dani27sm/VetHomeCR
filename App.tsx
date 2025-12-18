
import React, { useState } from 'react';
import { 
  Users, Calendar, LayoutDashboard, Settings, CreditCard,
  History, Briefcase, Package, Menu, Bell, UserCircle,
  MessageCircle, LogOut, Smartphone, HeartPulse, ShieldCheck
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ClientManager from './components/ClientManager';
import Agenda from './components/Agenda';
import BillingSystem from './components/BillingSystem';
import InventoryManager from './components/InventoryManager';
import ClientPortal from './components/ClientPortal';
import SaaSBilling from './components/SaaSBilling';
import { Doctor } from './types';

type View = 'dashboard' | 'clients' | 'agenda' | 'billing' | 'inventory' | 'history' | 'settings' | 'client-portal' | 'messages' | 'saas-billing';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const [currentDoctor] = useState<Doctor>({
    id: 'doc_daniel_1',
    name: 'Daniel Sánchez',
    specialty: 'Médico Veterinario Especialista',
    clinicName: 'VetHome Daniel Sánchez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DanielSanchez',
    phone: '+506 8888-8888',
    email: 'daniel.sanchez@vethome.cr',
    subscription: {
      tier: 'pro',
      status: 'active',
      nextBillingDate: '01/07/2024',
      price: 45,
      usage: {
        clients: 45,
        clientsLimit: 100,
        invoices: 120,
        invoicesLimit: 500
      }
    }
  });

  const NavItem: React.FC<{ icon: React.ReactNode; label: string; view: View }> = ({ icon, label, view }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        currentView === view 
          ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' 
          : 'text-slate-500 hover:bg-sky-50 hover:text-sky-600'
      }`}
    >
      {icon}
      {isSidebarOpen && <span className="font-bold text-sm">{label}</span>}
    </button>
  );

  if (currentView === 'client-portal') {
    return <ClientPortal doctor={currentDoctor} onLogout={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-40 shadow-sm`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-gradient-to-tr from-sky-400 to-sky-600 p-2 rounded-xl shadow-inner">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">VetHome<span className="text-sky-500 font-extrabold">CR</span></h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">SaaS Professional</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Panel de Control" view="dashboard" />
          <NavItem icon={<Users size={20} />} label="Clientes y Pacientes" view="clients" />
          <NavItem icon={<Calendar size={20} />} label="Agenda Médica" view="agenda" />
          <NavItem icon={<Package size={20} />} label="Inventario CABYS" view="inventory" />
          <NavItem icon={<CreditCard size={20} />} label="Facturación" view="billing" />
          <NavItem icon={<MessageCircle size={20} />} label="Centro de Mensajes" view="messages" />
          <div className="h-[1px] bg-slate-100 my-4"></div>
          <NavItem icon={<ShieldCheck size={20} />} label="Mi Suscripción" view="saas-billing" />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button 
            onClick={() => setCurrentView('client-portal')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 rounded-xl hover:bg-sky-100 border border-sky-100 transition-colors"
          >
            <Smartphone size={16} /> {isSidebarOpen && "Simular Portal Cliente"}
          </button>
          <NavItem icon={<Settings size={20} />} label="Configuración" view="settings" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 text-slate-400 hover:text-sky-500 bg-slate-50 rounded-xl transition-all">
              <Menu size={22} />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight capitalize">{currentView.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-800">Dr. {currentDoctor.name}</p>
                <span className="text-[8px] font-black bg-sky-100 text-sky-600 px-2 py-0.5 rounded-md uppercase tracking-widest">{currentDoctor.subscription.tier} plan</span>
              </div>
              <img src={currentDoctor.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg" alt="Avatar Doctor" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          {currentView === 'dashboard' && <Dashboard doctor={currentDoctor} />}
          {currentView === 'clients' && <ClientManager />}
          {currentView === 'agenda' && <Agenda />}
          {currentView === 'inventory' && <InventoryManager />}
          {currentView === 'billing' && <BillingSystem />}
          {currentView === 'saas-billing' && <SaaSBilling doctor={currentDoctor} />}
          {currentView === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Configuración</h3>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center gap-8">
                  <img src={currentDoctor.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-100 shadow-md" />
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-slate-800">Dr. {currentDoctor.name}</h4>
                    <p className="text-slate-400 font-medium mb-4">{currentDoctor.clinicName}</p>
                    <button onClick={() => setCurrentView('saas-billing')} className="bg-sky-100 text-sky-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-sky-200">Gestionar Plan {currentDoctor.subscription.tier.toUpperCase()}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
