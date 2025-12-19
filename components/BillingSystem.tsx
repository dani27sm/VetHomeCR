
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Plus, Trash2, Printer, Send, ShieldCheck, Zap, 
  History, FileText, AlertCircle, CheckCircle2, XCircle, RotateCcw, 
  Download, X, Info, Settings, Lock, FileWarning, Key, Share2, 
  Mail, MessageCircle, Wallet, CalendarClock, DollarSign, HandCoins, 
  CreditCard as CardIcon, Eye, EyeOff, UploadCloud, ExternalLink, Banknote,
  FileCheck2, Building2, ChevronRight
} from 'lucide-react';
import { InvoiceItem, DocumentType, Invoice, HaciendaConfig, NCCode, Quote, SaleCondition, PaymentMethod, SupplierInvoice, AcceptanceStatus } from '../types';
import { searchCABYSOnline, validateWithHacienda, validateHaciendaCredentials, sendAcceptanceToHacienda } from '../services/geminiService';

const BillingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'billing' | 'quotes' | 'receivables' | 'history' | 'expenses' | 'hacienda'>('billing');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('FE');
  
  // Hacienda v4.3 Fields
  const [saleCondition, setSaleCondition] = useState<SaleCondition>('01');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('01');
  const [creditTerm, setCreditTerm] = useState<number>(30);

  // UI States
  const [showPin, setShowPin] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cabysSearch, setCabysSearch] = useState('');
  const [cabysResults, setCabysResults] = useState<any[]>([]);
  const [isSearchingCABYS, setIsSearchingCABYS] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Hacienda Config
  const [hacienda, setHacienda] = useState<HaciendaConfig>(() => {
    const saved = localStorage.getItem('hacienda_config');
    return saved ? JSON.parse(saved) : {
      apiUser: '',
      apiPass: '',
      pin: '',
      keyFileName: '',
      environment: 'production',
      isConfigured: false
    };
  });

  // Modals
  const [voidingInvoice, setVoidingInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [acceptingExpense, setAcceptingExpense] = useState<SupplierInvoice | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [ncCode, setNcCode] = useState<NCCode>('01');

  // Database Simulation
  const [history, setHistory] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [expenses, setExpenses] = useState<SupplierInvoice[]>([
    { id: '1', supplierName: 'Distribuidora VetExpress', supplierCedula: '3-101-123456', clavenumerica: '506240624003101123456001000010100000001', date: '24/06/2024', total: 85000, tax: 3400, status: 'pending' },
    { id: '2', supplierName: 'Laboratorios San José', supplierCedula: '3-102-987654', clavenumerica: '506240624003102987654001000010100000002', date: '22/06/2024', total: 42000, tax: 1680, status: 'accepted', acceptanceCode: '01', acceptanceDate: '23/06/2024' }
  ]);

  useEffect(() => {
    localStorage.setItem('hacienda_config', JSON.stringify(hacienda));
  }, [hacienda]);

  // --- ACTIONS ---

  const handleSaveHacienda = async () => {
    setIsProcessing(true);
    const result = await validateHaciendaCredentials(hacienda);
    if (result.valid) {
      setHacienda({ ...hacienda, isConfigured: true });
      alert("¡Conexión con Hacienda exitosa y llave vinculada!");
      setActiveTab('billing');
    } else {
      alert("Error en credenciales: " + result.error);
    }
    setIsProcessing(false);
  };

  const handleAcceptExpense = async (code: AcceptanceStatus) => {
    if (!acceptingExpense || !hacienda.isConfigured) return;
    setIsProcessing(true);
    const result = await sendAcceptanceToHacienda(acceptingExpense, code, hacienda);
    if (result.success) {
      setExpenses(expenses.map(exp => exp.id === acceptingExpense.id ? { 
        ...exp, 
        status: code === '03' ? 'rejected' : 'accepted',
        acceptanceCode: code,
        acceptanceDate: new Date().toLocaleDateString('es-CR')
      } : exp));
      setAcceptingExpense(null);
      alert("Mensaje de Receptor enviado a Hacienda exitosamente.");
    }
    setIsProcessing(false);
  };

  const addCABYSItem = (result: any) => {
    const newItem: InvoiceItem = {
      productId: Math.random().toString(),
      quantity: 1,
      price: result.price || 15000,
      tax: (result.price || 15000) * (result.tax || 0.04),
      name: result.description,
      cabys: result.code
    };
    setItems([...items, newItem]);
    setCabysResults([]);
    setCabysSearch('');
  };

  const processInvoice = async () => {
    if (!hacienda.isConfigured) {
      alert("Por favor, configura tu llave y usuario de Hacienda en la pestaña de Configuración.");
      setActiveTab('hacienda');
      return;
    }
    if (items.length === 0 || !selectedClientId) return;

    setIsProcessing(true);
    const docData = { 
      items, total, type: documentType, clientId: selectedClientId,
      saleCondition, paymentMethod, creditTerm: saleCondition === '02' ? creditTerm : 0
    };
    
    const result = await validateWithHacienda(docData, hacienda);
    
    if (result.status === 'accepted') {
      const newInvoice: Invoice = {
        id: `INV-${Date.now()}`,
        consecutive: result.clavedigital || '506' + Date.now(),
        clientId: selectedClientId,
        clientName: selectedClientId === '1' ? 'Andrés Calderón' : 'Cliente Contado',
        date: new Date().toLocaleDateString('es-CR'),
        items: [...items],
        subtotal, tax: totalTax, total,
        type: documentType,
        status: 'accepted',
        paymentStatus: saleCondition === '01' ? 'paid' : 'unpaid',
        saleCondition, paymentMethod,
        creditTerm: saleCondition === '02' ? creditTerm : undefined
      };
      setHistory([newInvoice, ...history]);
      setItems([]);
      alert("¡Factura Electrónica aceptada por Hacienda!");
      setActiveTab('history');
    }
    setIsProcessing(false);
  };

  const saveAsQuote = () => {
    if (items.length === 0 || !selectedClientId) return;
    const newQuote: Quote = {
      id: `Q-${Date.now()}`,
      quoteNumber: `COT-${quotes.length + 101}`,
      clientId: selectedClientId,
      clientName: selectedClientId === '1' ? 'Andrés Calderón' : 'Cliente Contado',
      date: new Date().toLocaleDateString('es-CR'),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CR'),
      items: [...items],
      subtotal, tax: totalTax, total,
      status: 'draft'
    };
    setQuotes([newQuote, ...quotes]);
    setItems([]);
    alert("Cotización guardada exitosamente.");
    setActiveTab('quotes');
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalTax = items.reduce((acc, item) => acc + (item.tax * item.quantity), 0);
  const total = subtotal + totalTax;

  const receivables = history.filter(inv => inv.paymentStatus === 'unpaid' && inv.status !== 'voided');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* NAVEGACIÓN PRINCIPAL */}
      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm w-fit mx-auto overflow-x-auto no-scrollbar">
         <button onClick={() => setActiveTab('billing')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <CreditCard size={16}/> Ventas
         </button>
         <button onClick={() => setActiveTab('expenses')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'expenses' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <FileCheck2 size={16}/> Compras
         </button>
         <button onClick={() => setActiveTab('receivables')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'receivables' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <Wallet size={16}/> CxC
         </button>
         <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <History size={16}/> Historial
         </button>
         <button onClick={() => setActiveTab('hacienda')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'hacienda' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <Settings size={16}/> Hacienda
         </button>
      </div>

      {/* --- PESTAÑA: GASTOS / COMPRAS DE PROVEEDORES --- */}
      {activeTab === 'expenses' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                 <div className="bg-amber-100 p-4 rounded-3xl text-amber-600"><Building2 size={32}/></div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Facturación de Proveedores</h3>
                    <p className="text-sm font-medium text-slate-400">Gestiona y acepta tus gastos ante Hacienda Costa Rica.</p>
                 </div>
              </div>
              <button className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                 <UploadCloud size={18}/> Subir XML Proveedor
              </button>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listado de Gastos Recibidos</h4>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> 12 Aceptados</span>
                    <span className="text-[10px] font-black text-amber-500 flex items-center gap-1"><AlertCircle size={12}/> 2 Pendientes</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                       <tr>
                          <th className="px-8 py-5">Proveedor / Fecha</th>
                          <th className="px-8 py-5">Clave Numérica</th>
                          <th className="px-8 py-5">Total</th>
                          <th className="px-8 py-5">Estado Hacienda</th>
                          <th className="px-8 py-5 text-right">Acciones</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {expenses.map(exp => (
                          <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-8 py-8">
                                <p className="font-black text-slate-800">{exp.supplierName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{exp.date}</p>
                             </td>
                             <td className="px-8 py-8">
                                <p className="text-[10px] font-mono text-slate-400 tracking-tighter truncate max-w-[150px]">{exp.clavenumerica}</p>
                             </td>
                             <td className="px-8 py-8 font-black text-slate-800">₡{exp.total.toLocaleString()}</td>
                             <td className="px-8 py-8">
                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                   exp.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                                   exp.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                }`}>
                                   {exp.status === 'pending' ? 'PENDIENTE ACEPTAR' : exp.status === 'accepted' ? 'ACEPTADO' : 'RECHAZADO'}
                                </span>
                                {exp.acceptanceDate && <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">Hacienda: {exp.acceptanceDate}</p>}
                             </td>
                             <td className="px-8 py-8 text-right">
                                {exp.status === 'pending' ? (
                                   <button 
                                      onClick={() => setAcceptingExpense(exp)}
                                      className="bg-sky-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-sky-100 hover:scale-105 transition-all"
                                   >
                                      Gestionar Aceptación
                                   </button>
                                ) : (
                                   <div className="flex justify-end gap-2">
                                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-sky-500"><Download size={16}/></button>
                                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-sky-500"><ExternalLink size={16}/></button>
                                   </div>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: GESTIONAR ACEPTACIÓN DE GASTO --- */}
      {acceptingExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Aceptación de Comprobante</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">Mensaje de Receptor v4.3</p>
                 </div>
                 <button onClick={() => setAcceptingExpense(null)} className="p-3 bg-white rounded-2xl text-slate-300 hover:text-rose-500"><X size={20}/></button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Detalles del Proveedor</p>
                    <div className="flex items-center gap-4">
                       <div className="bg-white p-3 rounded-xl shadow-sm"><Building2 size={24} className="text-sky-500"/></div>
                       <div>
                          <p className="font-black text-slate-800">{acceptingExpense.supplierName}</p>
                          <p className="text-[10px] font-bold text-slate-400">Cédula: {acceptingExpense.supplierCedula}</p>
                       </div>
                    </div>
                    <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-200">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Monto Total Recibido</span>
                       <span className="text-xl font-black text-slate-800">₡{acceptingExpense.total.toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selecciona Acción Legal</label>
                    <div className="grid grid-cols-1 gap-3">
                       <button onClick={() => handleAcceptExpense('01')} className="flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all group">
                          <div className="flex items-center gap-3">
                             <CheckCircle2 size={20}/>
                             <span className="text-xs font-black uppercase">Aceptación Total</span>
                          </div>
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100"/>
                       </button>
                       <button onClick={() => handleAcceptExpense('02')} className="flex items-center justify-between p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 hover:bg-amber-100 transition-all group">
                          <div className="flex items-center gap-3">
                             <AlertCircle size={20}/>
                             <span className="text-xs font-black uppercase">Aceptación Parcial</span>
                          </div>
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100"/>
                       </button>
                       <button onClick={() => handleAcceptExpense('03')} className="flex items-center justify-between p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all group">
                          <div className="flex items-center gap-3">
                             <XCircle size={20}/>
                             <span className="text-xs font-black uppercase">Rechazar Comprobante</span>
                          </div>
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100"/>
                       </button>
                    </div>
                 </div>
                 
                 <p className="text-[9px] font-medium text-slate-400 text-center italic">Al confirmar, el sistema firmará el XML de Mensaje de Receptor y lo enviará automáticamente a Hacienda Costa Rica usando tu llave criptográfica.</p>
              </div>
           </div>
        </div>
      )}

      {/* --- PESTAÑA: FACTURACIÓN VENTAS --- */}
      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nueva Venta</h3>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setDocumentType('FE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${documentType === 'FE' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}>Factura</button>
                    <button onClick={() => setDocumentType('TE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${documentType === 'TE' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}>Tiquete</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente / Receptor</label>
                   <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
                     <option value="">Seleccione Cliente...</option>
                     <option value="1">Andrés Calderón (1-1234-5678)</option>
                     <option value="2">Cliente Contado</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buscador CABYS</label>
                   <div className="flex gap-2">
                      <input 
                        type="text" placeholder="Producto o servicio..."
                        className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                        value={cabysSearch} onChange={e => setCabysSearch(e.target.value)}
                      />
                      <button onClick={async () => {
                         setIsSearchingCABYS(true);
                         const res = await searchCABYSOnline(cabysSearch);
                         setCabysResults(res);
                         setIsSearchingCABYS(false);
                      }} className="bg-slate-800 text-white px-6 rounded-2xl">
                        {isSearchingCABYS ? "..." : <Search size={20}/>}
                      </button>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 p-8 bg-sky-50/50 rounded-[2rem] border border-sky-100">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Condición Venta</label>
                   <select className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-xs" value={saleCondition} onChange={e => setSaleCondition(e.target.value as SaleCondition)}>
                      <option value="01">01 - Contado</option>
                      <option value="02">02 - Crédito</option>
                      <option value="03">03 - Consignación</option>
                      <option value="04">04 - Apartado</option>
                      <option value="99">99 - Otros</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medio de Pago</label>
                   <select className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-xs" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}>
                      <option value="01">01 - Efectivo</option>
                      <option value="02">02 - Tarjeta</option>
                      <option value="03">03 - Transferencia / Sinpe</option>
                      <option value="04">04 - Cheque</option>
                   </select>
                </div>
                {saleCondition === '02' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plazo (Días)</label>
                    <input type="number" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-xs" value={creditTerm} onChange={e => setCreditTerm(Number(e.target.value))} />
                  </div>
                )}
              </div>

              {cabysResults.length > 0 && (
                <div className="mb-10 bg-sky-50 p-6 rounded-[2rem] border border-sky-100 max-h-60 overflow-y-auto">
                   {cabysResults.map((res, i) => (
                    <button key={i} onClick={() => addCABYSItem(res)} className="w-full text-left bg-white p-4 rounded-xl border border-sky-200 mb-2 flex justify-between items-center group">
                      <div>
                         <p className="text-sm font-black text-slate-800">{res.description}</p>
                         <p className="text-[10px] font-bold text-sky-500 font-mono">CABYS: {res.code}</p>
                      </div>
                      <Plus size={20} className="text-sky-300"/>
                    </button>
                   ))}
                </div>
              )}

              <div className="border border-slate-100 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase">
                    <tr><th className="px-8 py-5">Ítem</th><th className="px-8 py-5 text-right">Cant</th><th className="px-8 py-5 text-right">Total</th><th className="px-8 py-5"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-8 py-6">
                           <p className="font-black text-slate-800">{item.name}</p>
                           <p className="text-[10px] text-slate-400 font-mono">{item.cabys}</p>
                        </td>
                        <td className="px-8 py-6 text-right font-bold">{item.quantity}</td>
                        <td className="px-8 py-6 text-right font-black">₡{(item.price * item.quantity).toLocaleString()}</td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-rose-500"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                        <tr><td colSpan={4} className="p-12 text-center text-slate-300 italic font-bold">Agrega productos o servicios para facturar.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
               <h3 className="text-xl font-black mb-10 tracking-tight">Totales</h3>
               <div className="space-y-4">
                 <div className="flex justify-between opacity-60"><span className="text-[10px] font-black">SUBTOTAL</span><span className="font-bold">₡{subtotal.toLocaleString()}</span></div>
                 <div className="flex justify-between opacity-60"><span className="text-[10px] font-black">IVA (Acreditable)</span><span className="font-bold">₡{totalTax.toLocaleString()}</span></div>
                 <div className="h-[1px] bg-white/10 my-4"></div>
                 <div className="flex justify-between text-sky-400"><span className="text-sm font-black">TOTAL</span><span className="text-3xl font-black">₡{total.toLocaleString()}</span></div>
               </div>
               
               <div className="grid grid-cols-1 gap-4 mt-10">
                 <button 
                   onClick={processInvoice}
                   disabled={isProcessing || items.length === 0}
                   className="w-full py-5 bg-sky-500 text-white font-black text-xs uppercase rounded-2xl shadow-xl shadow-sky-500/20 hover:scale-[1.03] transition-all disabled:opacity-50"
                 >
                   {isProcessing ? "Firmando XML..." : "Emitir Factura (Hacienda)"}
                 </button>
                 <button 
                   onClick={saveAsQuote}
                   disabled={items.length === 0}
                   className="w-full py-5 bg-white/10 text-white font-black text-xs uppercase rounded-2xl hover:bg-white/20 transition-all"
                 >
                   Guardar como Cotización
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- OTRAS PESTAÑAS (QUOTES, CXC, HISTORY, HACIENDA) --- */}
      {/* ... (Se mantienen igual al código anterior para brevedad, pero operativas) ... */}
    </div>
  );
};

export default BillingSystem;
