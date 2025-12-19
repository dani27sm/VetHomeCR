
import React, { useState } from 'react';
import { Search, Plus, UserPlus, Phone, Mail, FileText, Upload, Download, X, ClipboardList, Dog, Cat, MapPin, Zap, Edit3, Users } from 'lucide-react';
import { Client, Species, Pet, MedicalEntry, Attachment } from '../types';
import { DOG_BREEDS, CAT_BREEDS } from '../constants';
import { fetchTSEName } from '../services/geminiService';

const ClientManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isAddingPet, setIsAddingPet] = useState<string | null>(null); // clientId
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingHistory, setViewingHistory] = useState<{clientId: string, petId: string} | null>(null);

  // Form Client
  const [cedula, setCedula] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearchingTSE, setIsSearchingTSE] = useState(false);

  // Form Pet
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<Species>(Species.Dog);
  const [petBreed, setPetBreed] = useState('');

  // Form Medical Entry
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [historyReason, setHistoryReason] = useState('');
  const [historyDiagnosis, setHistoryDiagnosis] = useState('');
  const [historyTreatment, setHistoryTreatment] = useState('');

  const handleTSESearch = async () => {
    if (!cedula || cedula.length < 9) {
      alert("Por favor ingrese una cédula válida (9 dígitos)");
      return;
    }
    
    setIsSearchingTSE(true);
    
    // Especial para Daniel
    if (cedula === "111111111") {
      setFullName("DANIEL SANCHEZ VET");
      setIsSearchingTSE(false);
      return;
    }

    // Llamada al simulador inteligente de TSE usando Gemini
    const result = await fetchTSEName(cedula);
    setFullName(result);
    setIsSearchingTSE(false);
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      cedula, fullName, email, phone, address: 'Costa Rica',
      pets: []
    };
    setClients([...clients, newClient]);
    setIsAddingClient(false);
    setCedula(''); setFullName(''); setEmail(''); setPhone('');
  };

  const handleAddPet = () => {
    if (!isAddingPet) return;
    const newPet: Pet = {
      id: Math.random().toString(36).substr(2, 9),
      name: petName,
      species: petSpecies,
      breed: petBreed,
      birthDate: new Date().toISOString(),
      weight: 0,
      ownerId: isAddingPet,
      vaccinations: [],
      history: []
    };

    setClients(clients.map(c => c.id === isAddingPet ? { ...c, pets: [...c.pets, newPet] } : c));
    setIsAddingPet(null);
    setPetName(''); setPetBreed('');
  };

  const addMedicalEntry = () => {
    if (!viewingHistory) return;
    const newEntry: MedicalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('es-CR'),
      reason: historyReason,
      diagnosis: historyDiagnosis,
      treatment: historyTreatment,
      attachments: [
        { id: '1', name: 'Examen_Laboratorio.pdf', type: 'application/pdf', url: '#', date: new Date().toLocaleDateString() }
      ]
    };

    setClients(clients.map(c => 
      c.id === viewingHistory.clientId 
      ? { ...c, pets: c.pets.map(p => p.id === viewingHistory.petId ? {...p, history: [newEntry, ...(p.history || [])]} : p) }
      : c
    ));
    setIsAddingHistory(false);
    setHistoryReason(''); setHistoryDiagnosis(''); setHistoryTreatment('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Gestión de Pacientes</h2>
          <p className="text-slate-400 font-medium">Administra tus clientes y sus mascotas de forma individual.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o cédula..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-100 transition-all font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsAddingClient(true)} className="bg-sky-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-100 hover:scale-105 transition-all flex items-center gap-2">
            <UserPlus size={18} /> Nuevo Cliente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {clients.filter(c => c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || c.cedula.includes(searchTerm)).map(client => (
          <div key={client.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                 <div className="bg-slate-100 p-4 rounded-2xl text-slate-400 font-black text-lg">
                    {client.fullName.charAt(0)}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800">{client.fullName}</h3>
                    <p className="text-xs font-bold text-sky-500 tracking-widest uppercase">ID: {client.cedula}</p>
                 </div>
              </div>
              <button className="p-2.5 text-slate-300 hover:text-sky-500 transition-colors"><Edit3 size={18}/></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <Phone size={16} className="text-slate-400" />
                <span className="font-bold text-slate-600">{client.phone}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 overflow-hidden">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="font-bold text-slate-600 truncate">{client.email}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mascotas Registradas ({client.pets.length})</p>
                <button onClick={() => setIsAddingPet(client.id)} className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:underline">+ Agregar Mascota</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {client.pets.map(pet => (
                  <button 
                    key={pet.id} 
                    onClick={() => setViewingHistory({clientId: client.id, petId: pet.id})}
                    className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 hover:bg-sky-50 hover:border-sky-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-sky-500 transition-colors shadow-sm">
                      {pet.species === Species.Dog ? <Dog size={24}/> : <Cat size={24}/>}
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-black text-slate-800 truncate">{pet.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{pet.breed}</p>
                    </div>
                  </button>
                ))}
                {client.pets.length === 0 && <p className="text-xs font-medium text-slate-400 italic">No hay mascotas registradas aún.</p>}
              </div>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="lg:col-span-2 text-center py-24 space-y-4">
             <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-inner"><Users size={32}/></div>
             <p className="text-slate-400 font-bold">Inicia registrando a tu primer cliente.</p>
          </div>
        )}
      </div>

      {/* MODAL: Nuevo Cliente (TSE Integration) */}
      {isAddingClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Registro de Propietario</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Conexión TSE Costa Rica</p>
              </div>
              <button onClick={() => setIsAddingClient(false)} className="p-3 bg-white rounded-2xl text-slate-300 hover:text-slate-500 shadow-sm"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddClient} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cédula Física o Jurídica</label>
                <div className="flex gap-2">
                  <input 
                    required 
                    type="text" 
                    placeholder="Ejem: 102340567"
                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-100"
                    value={cedula} onChange={e => setCedula(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={handleTSESearch}
                    disabled={isSearchingTSE}
                    className={`px-6 rounded-2xl transition-all flex items-center justify-center ${isSearchingTSE ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                  >
                    {isSearchingTSE ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Zap size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo / Razón Social</label>
                <input 
                  required 
                  type="text" 
                  placeholder={isSearchingTSE ? "Buscando en Registro Civil..." : ""}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-100"
                  value={fullName} onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-100"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-100"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-sky-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-sky-100 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                Confirmar y Registrar Cliente
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Mascota (Species then Breed) */}
      {isAddingPet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-slate-50 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Agregar Nuevo Paciente</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ficha de Identificación</p>
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Mascota</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                  value={petName} onChange={e => setPetName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especie</label>
                <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl">
                   <button 
                     onClick={() => setPetSpecies(Species.Dog)}
                     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${petSpecies === Species.Dog ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}
                   >
                     <Dog size={16}/> Perro
                   </button>
                   <button 
                     onClick={() => setPetSpecies(Species.Cat)}
                     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${petSpecies === Species.Cat ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}
                   >
                     <Cat size={16}/> Gato
                   </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Raza (Filtrado por Especie)</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
                  value={petBreed} onChange={e => setPetBreed(e.target.value)}
                >
                  <option value="">Selecciona Raza...</option>
                  {(petSpecies === Species.Dog ? DOG_BREEDS : CAT_BREEDS).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsAddingPet(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Cancelar</button>
                 <button onClick={handleAddPet} className="flex-[2] py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200">Registrar Paciente</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Expediente Médico Avanzado (con Archivos) */}
      {viewingHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-3xl shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-sky-100"><FileText size={28}/></div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">Expediente Clínico Digital</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paciente: {clients.find(c => c.id === viewingHistory.clientId)?.pets.find(p => p.id === viewingHistory.petId)?.name}</p>
                </div>
              </div>
              <button onClick={() => setViewingHistory(null)} className="p-3 bg-white rounded-2xl text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/20">
              <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                 <div>
                   <h4 className="text-lg font-black text-slate-800">Evolución Clínica</h4>
                   <p className="text-xs font-medium text-slate-400">Listado cronológico de consultas y procedimientos</p>
                 </div>
                 <button 
                   onClick={() => setIsAddingHistory(!isAddingHistory)}
                   className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-100 hover:scale-105 transition-all"
                 >
                   {isAddingHistory ? "Cerrar Editor" : "+ Nueva Entrada"}
                 </button>
              </div>

              {isAddingHistory && (
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-sky-200 space-y-8 animate-in slide-in-from-top-4 duration-300 shadow-xl shadow-sky-100/20">
                   <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo / Título</label>
                         <input placeholder="Ejem: Revisión post-vacuna" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={historyReason} onChange={e => setHistoryReason(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnóstico Clínico</label>
                         <textarea placeholder="Describe el estado observado..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold h-32" value={historyDiagnosis} onChange={e => setHistoryDiagnosis(e.target.value)}></textarea>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tratamiento o Indicaciones</label>
                         <textarea placeholder="Receta, medicamentos, reposo..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold h-32" value={historyTreatment} onChange={e => setHistoryTreatment(e.target.value)}></textarea>
                      </div>
                      <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 border-dashed">
                        <label className="flex-1 cursor-pointer flex flex-col items-center">
                           <Upload size={20} className="text-sky-500 mb-2" />
                           <span className="text-[10px] font-black text-slate-400 uppercase">Adjuntar Resultados (PDF/IMG)</span>
                           <input type="file" className="hidden" />
                        </label>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setIsAddingHistory(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                        <button onClick={addMedicalEntry} className="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-sky-100">Guardar Entrada</button>
                      </div>
                   </div>
                </div>
              )}

              <div className="space-y-10 relative">
                <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                {clients.find(c => c.id === viewingHistory.clientId)?.pets.find(p => p.id === viewingHistory.petId)?.history?.map((entry, idx) => (
                  <div key={entry.id} className="relative pl-20 group">
                    <div className="absolute left-0 top-0 w-16 h-16 bg-white border-4 border-slate-50 rounded-3xl shadow-sm flex items-center justify-center text-sky-500 font-black text-sm z-10 group-hover:border-sky-500 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-center mb-6">
                          <span className="text-xs font-black text-sky-600 tracking-widest uppercase">{entry.date}</span>
                          <span className="bg-slate-100 text-[9px] font-black px-4 py-1.5 rounded-full uppercase text-slate-500 tracking-widest">{entry.reason}</span>
                       </div>
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Diagnóstico</p>
                             <p className="text-sm font-bold text-slate-700 leading-relaxed">{entry.diagnosis}</p>
                          </div>
                          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plan de Tratamiento</p>
                             <p className="text-sm font-medium text-slate-600 italic">{entry.treatment}</p>
                          </div>
                          {entry.attachments.length > 0 && (
                            <div className="pt-4 flex flex-wrap gap-3">
                               {entry.attachments.map(att => (
                                 <button key={att.id} className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase text-sky-500 hover:bg-sky-50 transition-colors">
                                   <Download size={14} /> {att.name}
                                 </button>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
                {(!clients.find(c => c.id === viewingHistory.clientId)?.pets.find(p => p.id === viewingHistory.petId)?.history || clients.find(c => c.id === viewingHistory.clientId)?.pets.find(p => p.id === viewingHistory.petId)?.history?.length === 0) && (
                  <div className="text-center py-20 text-slate-300 italic">No hay historial clínico registrado.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManager;
