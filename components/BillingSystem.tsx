
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Plus, Trash2, Printer, Send, ShieldCheck, Zap, 
  History, FileText, AlertCircle, CheckCircle2, XCircle, RotateCcw, 
  Download, X, Info, Settings, Lock, FileWarning, Key, Share2, 
  Mail, MessageCircle, Wallet, CalendarClock, DollarSign, HandCoins, 
  CreditCard as CardIcon, Eye, EyeOff, UploadCloud, ExternalLink, Banknote
} from 'lucide-react';
import { InvoiceItem, DocumentType, Invoice, HaciendaConfig, NCCode, Quote, SaleCondition, PaymentMethod } from '../types';
import { searchCABYSOnline, validateWithHacienda, validateHaciendaCredentials } from '../services/geminiService';

const BillingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'billing' | 'quotes' | 'receivables' | 'history' | 'hacienda'>('billing');
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
  const [voidReason, setVoidReason] = useState('');
  const [ncCode, setNcCode] = useState<NCCode>('01');

  // Database Simulation
  const [history, setHistory] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

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

  const handleOpenVoidModal = (invoice: Invoice) => {
    setVoidingInvoice(invoice);
    setVoidReason('');
    setNcCode('01');
  };

  const emitCreditNote = async () => {
    if (!voidingInvoice || !voidReason.trim()) return;
    setIsProcessing(true);
    const result = await validateWithHacienda({ ...voidingInvoice, type: 'NC', ncCode, reason: voidReason }, hacienda);
    if (result.status === 'accepted') {
      const nc: Invoice = {
        ...voidingInvoice,
        id: `NC-${Date.now()}`,
        consecutive: result.clavedigital || '506NC' + Date.now(),
        type: 'NC',
        status: 'accepted',
        referenceId: voidingInvoice.consecutive,
        voidReason, ncCode,
        total: voidingInvoice.total * -1,
        date: new Date().toLocaleDateString('es-CR'),
        paymentStatus: 'paid'
      };
      setHistory(prev => prev.map(inv => inv.id === voidingInvoice.id ? { ...inv, status: 'voided' } : inv));
      setHistory(prev => [nc, ...prev]);
      setVoidingInvoice(null);
      alert("Nota de Crédito aceptada por Hacienda.");
    }
    setIsProcessing(false);
  };

  const registerPayment = (id: string) => {
    setHistory(history.map(inv => inv.id === id ? { ...inv, paymentStatus: 'paid' } : inv));
    setPayingInvoice(null);
    alert("Pago registrado satisfactoriamente.");
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
           <CreditCard size={16}/> Facturar
         </button>
         <button onClick={() => setActiveTab('quotes')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'quotes' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <FileText size={16}/> Cotizaciones
         </button>
         <button onClick={() => setActiveTab('receivables')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'receivables' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <Wallet size={16}/> CxC (Por Cobrar)
         </button>
         <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <History size={16}/> Historial
         </button>
         <button onClick={() => setActiveTab('hacienda')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'hacienda' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <Settings size={16}/> Hacienda
         </button>
      </div>

      {/* --- PESTAÑA: FACTURACIÓN --- */}
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

              {/* Campos Tributarios Hacienda */}
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

      {/* --- PESTAÑA: COTIZACIONES --- */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Presupuestos y Cotizaciones</h3>
              <button onClick={() => setActiveTab('billing')} className="bg-sky-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">+ Crear Nueva</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5">N° / Fecha</th>
                    <th className="px-8 py-5">Cliente</th>
                    <th className="px-8 py-5">Vencimiento</th>
                    <th className="px-8 py-5 text-right">Monto</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {quotes.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6">
                         <p className="font-black text-slate-800">{q.quoteNumber}</p>
                         <p className="text-[10px] text-slate-400 font-bold">{q.date}</p>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600">{q.clientName}</td>
                      <td className="px-8 py-6 text-slate-400 font-bold">{q.expiryDate}</td>
                      <td className="px-8 py-6 text-right font-black">₡{q.total.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                           <button className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"><MessageCircle size={16}/></button>
                           <button className="p-2.5 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-all"><Mail size={16}/></button>
                           <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-sky-500 transition-all"><Download size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic font-bold">No tienes cotizaciones activas.</td></tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* --- PESTAÑA: CXC (CUENTAS POR COBRAR) --- */}
      {activeTab === 'receivables' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-rose-50/50">
              <div>
                <h3 className="text-2xl font-black text-rose-800 tracking-tight flex items-center gap-3"><CalendarClock /> Cuentas por Cobrar</h3>
                <p className="text-xs font-bold text-rose-600 uppercase mt-1">Saldos pendientes de pago</p>
              </div>
              <div className="bg-white px-6 py-4 rounded-2xl border border-rose-100 shadow-sm text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Por Cobrar Total</p>
                 <p className="text-xl font-black text-rose-500">₡{receivables.reduce((acc, r) => acc + r.total, 0).toLocaleString()}</p>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5">Factura / Fecha</th>
                    <th className="px-8 py-5">Cliente</th>
                    <th className="px-8 py-5 text-right">Monto Pendiente</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {receivables.map(r => (
                    <tr key={r.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="px-8 py-6">
                         <p className="font-black text-slate-800 text-xs">#{r.consecutive.slice(-8)}</p>
                         <p className="text-[10px] text-slate-400 font-bold">{r.date}</p>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600">{r.clientName}</td>
                      <td className="px-8 py-6 text-right font-black text-rose-600">₡{r.total.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                           <button className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase">
                             <MessageCircle size={14}/> Recordatorio
                           </button>
                           <button onClick={() => setPayingInvoice(r)} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase shadow-md transition-all">
                             <DollarSign size={14}/> Registrar Pago
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {receivables.length === 0 && (
                    <tr><td colSpan={4} className="p-20 text-center text-slate-300 italic font-bold">¡Genial! No tienes saldos pendientes.</td></tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* --- PESTAÑA: HISTORIAL (CON NOTAS DE CRÉDITO Y REGISTRO DE PAGO) --- */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Comprobantes Electrónicos</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5">Clave Hacienda / Fecha</th>
                    <th className="px-8 py-5">Tipo / Condición</th>
                    <th className="px-8 py-5">Estado Pago</th>
                    <th className="px-8 py-5 text-right">Monto</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6">
                         <p className="font-black text-slate-800 text-xs truncate max-w-[180px]">{inv.consecutive}</p>
                         <p className="text-[10px] text-slate-400 font-bold">{inv.date} • {inv.clientName}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit ${inv.type === 'NC' ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'}`}>{inv.type}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{inv.saleCondition === '01' ? 'Contado' : 'Crédito'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {inv.paymentStatus === 'paid' ? 'LIQUIDADO' : 'PENDIENTE'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-black">₡{inv.total.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-sky-500 transition-all"><Download size={16}/></button>
                          {inv.paymentStatus === 'unpaid' && inv.status !== 'voided' && (
                            <button 
                              onClick={() => setPayingInvoice(inv)}
                              className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                              title="Registrar Pago"
                            >
                              <DollarSign size={16}/>
                            </button>
                          )}
                          {inv.status === 'accepted' && inv.type !== 'NC' && (
                            <button onClick={() => handleOpenVoidModal(inv)} className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-100 transition-all"><RotateCcw size={16}/></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic font-bold">Historial vacío.</td></tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* --- PESTAÑA: CONFIGURACIÓN HACIENDA (LLAVE CRIPTOGRÁFICA) --- */}
      {activeTab === 'hacienda' && (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-10 duration-500 pb-20">
           <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-8 border-b border-slate-100">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Actualiza tu llave criptográfica</h2>
                 <p className="text-sm font-medium text-slate-500 mt-2">
                   Carga tu nueva llave criptográfica para continuar facturando electrónicamente. <span className="text-sky-500 underline cursor-pointer">Saber más</span>
                 </p>
              </div>

              <div className="p-8 space-y-8">
                 {/* Carga de archivo */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      Llave criptográfica (.p12 o .pfx) <span className="text-rose-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/50 group hover:border-sky-500 hover:bg-sky-50 transition-all cursor-pointer relative">
                       <UploadCloud className="text-slate-300 group-hover:text-sky-500 mb-4" size={40} />
                       <p className="text-sm font-bold text-slate-600">Haz clic para seleccionar o arrastra el archivo</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">El formato del archivo debe ser .pfx, .p12</p>
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setHacienda({...hacienda, keyFileName: e.target.files?.[0]?.name || ''})} />
                       {hacienda.keyFileName && <span className="mt-4 bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">✓ {hacienda.keyFileName}</span>}
                    </div>
                 </div>

                 {/* PIN */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">PIN <span className="text-rose-500">*</span></label>
                    <div className="relative">
                       <input 
                         type={showPin ? "text" : "password"}
                         className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-100"
                         placeholder="PIN de 4 dígitos"
                         maxLength={4}
                         value={hacienda.pin}
                         onChange={e => setHacienda({...hacienda, pin: e.target.value})}
                       />
                       <button onClick={() => setShowPin(!showPin)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPin ? <EyeOff size={20}/> : <Eye size={20}/>}
                       </button>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">Corresponde al PIN que indicaste para generar tu llave criptográfica.</p>
                 </div>

                 {/* Usuario de Producción */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Usuario de producción <span className="text-rose-500">*</span></label>
                    <input 
                      type="text"
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-100"
                      placeholder="Ejem: cpj-3-101-..."
                      value={hacienda.apiUser}
                      onChange={e => setHacienda({...hacienda, apiUser: e.target.value})}
                    />
                    <p className="text-[10px] font-medium text-slate-400 mt-1">Usuario asignado por la ATV al generar tu contraseña de producción.</p>
                 </div>

                 {/* Contraseña de Producción */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Contraseña de producción <span className="text-rose-500">*</span></label>
                    <div className="relative">
                       <input 
                         type={showPass ? "text" : "password"}
                         className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-100"
                         placeholder="Contraseña de producción"
                         value={hacienda.apiPass}
                         onChange={e => setHacienda({...hacienda, apiPass: e.target.value})}
                       />
                       <button onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                       </button>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">Contraseña asignada por la ATV en el portal oficial.</p>
                 </div>

                 <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button onClick={() => setActiveTab('billing')} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500 hover:text-slate-800 transition-all">Cancelar</button>
                    <button 
                      onClick={handleSaveHacienda}
                      className="flex-[2] py-4 bg-[#00A89C] text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-[#00A89C]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                      {isProcessing ? "Validando..." : "Actualizar"}
                    </button>
                 </div>
              </div>
              
              <div className="p-6 bg-slate-50 text-center">
                 <a href="https://www.hacienda.go.cr/ATV/Login.aspx" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-sky-500 uppercase tracking-widest flex items-center justify-center gap-2 hover:underline">
                    Ir a portal ATV Hacienda <ExternalLink size={12}/>
                 </a>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: ANULACIÓN (NOTA DE CRÉDITO) --- */}
      {voidingInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-rose-50 border-b border-rose-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-rose-800 tracking-tight">Anular Documento</h3>
              <button onClick={() => setVoidingInvoice(null)} className="p-3 bg-white rounded-2xl text-rose-300 hover:text-rose-500"><X size={20}/></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código de Referencia</label>
                <div className="grid grid-cols-1 gap-2">
                   {[
                     { code: '01', label: '01 - Anula documento' },
                     { code: '02', label: '02 - Corrige texto' },
                     { code: '03', label: '03 - Corrige montos' }
                   ].map(c => (
                    <button key={c.code} onClick={() => setNcCode(c.code as NCCode)} className={`text-left p-4 rounded-xl border text-xs font-bold transition-all ${ncCode === c.code ? 'bg-rose-500 text-white border-rose-500 shadow-lg' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>{c.label}</button>
                   ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivo</label>
                <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold h-24 outline-none focus:ring-2 focus:ring-rose-100" value={voidReason} onChange={e => setVoidReason(e.target.value)} />
              </div>
              <button onClick={emitCreditNote} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-sm uppercase shadow-xl hover:scale-[1.03] transition-all">Generar NC en Hacienda</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: REGISTRAR PAGO (POPUP) --- */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-emerald-800 tracking-tight">Recibir Pago</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Liquidación de Comprobante</p>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="p-3 bg-white rounded-2xl text-emerald-300 hover:text-emerald-500"><X size={20}/></button>
            </div>
            <div className="p-10 space-y-10 text-center">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Monto a Liquidar</p>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">₡{payingInvoice.total.toLocaleString()}</h2>
                <div className="flex justify-center gap-2 mt-4">
                   <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black text-emerald-600 border border-emerald-100 uppercase tracking-widest">#{payingInvoice.consecutive.slice(-8)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-left">
                    <div className="bg-white p-3 rounded-xl text-emerald-500 shadow-sm"><Banknote size={20}/></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Método Registrado</p>
                       <p className="text-sm font-black text-slate-700">{payingInvoice.paymentMethod === '01' ? 'Efectivo' : payingInvoice.paymentMethod === '02' ? 'Tarjeta' : 'Transferencia/Sinpe'}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 text-left">
                    <div className="bg-white p-3 rounded-xl text-slate-400 shadow-sm"><CardIcon size={20}/></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Condición</p>
                       <p className="text-sm font-black text-slate-700">Venta al Crédito</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => registerPayment(payingInvoice.id)}
                  className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:scale-[1.03] active:scale-95 transition-all"
                >
                  Confirmar Cobro
                </button>
                <button 
                  onClick={() => setPayingInvoice(null)}
                  className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSystem;
