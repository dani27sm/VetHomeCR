
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Calendar, Filter, Download, 
  ArrowUpRight, ArrowDownRight, Award, Dog, Cat, Briefcase, 
  ChevronDown, Search, MousePointerClick, Wallet, HandCoins, Building2,
  FileSpreadsheet, Scale, Calculator, Info, FileCheck2
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'taxes'>('general');
  const [timeRange, setTimeRange] = useState('30d');

  // Datos Simulados Generales
  const grossRevenue = 3400000;
  const totalExpenses = 1200000;
  const netUtility = grossRevenue - totalExpenses;

  // Datos Detallados de IVA (Simulados para el reporte de Hacienda)
  // Se calculan internamente los totales con impuestos para la vista
  const taxData = {
    sales: [
      { rate: '13%', subtotal: 450000, tax: 58500, label: 'Bienes/Servicios Grales' },
      { rate: '4%', subtotal: 2800000, tax: 112000, label: 'Servicios Veterinarios' },
      { rate: '1%', subtotal: 50000, tax: 500, label: 'Insumos Básicos' },
      { rate: '0%', subtotal: 100000, tax: 0, label: 'Exento' },
    ],
    purchases: [
      { rate: '13%', subtotal: 800000, tax: 104000, label: 'Compras Generales' },
      { rate: '4%', subtotal: 150000, tax: 6000, label: 'Servicios de Salud' },
      { rate: '1%', subtotal: 200000, tax: 2000, label: 'Medicamentos Canasta' },
      { rate: '0%', subtotal: 50000, tax: 0, label: 'Otros Gastos' },
    ]
  };

  const totalSalesTax = taxData.sales.reduce((acc, curr) => acc + curr.tax, 0);
  const totalPurchasesTax = taxData.purchases.reduce((acc, curr) => acc + curr.tax, 0);
  const netTaxBalance = totalSalesTax - totalPurchasesTax;

  const revenueData = [
    { month: 'Ene', revenue: 450000, expenses: 180000 },
    { month: 'Feb', revenue: 520000, expenses: 210000 },
    { month: 'Mar', revenue: 480000, expenses: 190000 },
    { month: 'Abr', revenue: 610000, expenses: 250000 },
    { month: 'May', revenue: 590000, expenses: 230000 },
    { month: 'Jun', revenue: 840000, expenses: 320000 },
  ];

  const serviceDistribution = [
    { name: 'Consultas', value: 45, color: '#0ea5e9' },
    { name: 'Vacunas', value: 30, color: '#10b981' },
    { name: 'Cirugías', value: 15, color: '#f59e0b' },
    { name: 'Laboratorio', value: 10, color: '#6366f1' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Selector de Vista Principal */}
      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm w-fit mx-auto">
         <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <TrendingUp size={16}/> Rendimiento
         </button>
         <button onClick={() => setActiveTab('taxes')} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'taxes' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
           <Scale size={16}/> Borrador IVA D-140
         </button>
      </div>

      {activeTab === 'general' ? (
        <>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Inteligencia de Negocio</h2>
              <p className="text-slate-400 font-medium">Analiza tu rendimiento y utilidad real neta.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {['7d', '30d', '90d', 'Año'].map(range => (
                  <button 
                    key={range} 
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${timeRange === range ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button className="bg-slate-800 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg"><Download size={18}/></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between mb-4">
                <div className="bg-sky-50 p-3 rounded-2xl text-sky-600"><DollarSign size={24}/></div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventas Brutas</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">₡{(grossRevenue/1000000).toFixed(1)}M</h3>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between mb-4">
                <div className="bg-rose-50 p-3 rounded-2xl text-rose-600"><Building2 size={24}/></div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gastos Proveedores</p>
              <h3 className="text-3xl font-black text-rose-600 tracking-tight mt-1">₡{(totalExpenses/1000000).toFixed(1)}M</h3>
            </div>
            <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl text-white">
              <div className="flex justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-2xl text-white"><HandCoins size={24}/></div>
              </div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Utilidad Neta</p>
              <h3 className="text-3xl font-black tracking-tight mt-1">₡{(netUtility/1000000).toFixed(1)}M</h3>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
              <div className="flex justify-between mb-4">
                <div className="bg-white/10 p-3 rounded-2xl text-white"><TrendingUp size={24}/></div>
              </div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Margen de Ganancia</p>
              <h3 className="text-3xl font-black tracking-tight mt-1">{((netUtility/grossRevenue)*100).toFixed(0)}%</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 tracking-tight mb-10">Ingresos vs Gastos</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 tracking-tight mb-10">Mezcla de Servicios</h3>
              <div className="flex items-center justify-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={serviceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                        {serviceDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
           {/* RESUMEN TRIBUTARIO CABECERA */}
           <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end lg:items-center gap-8">
                 <div className="space-y-4">
                    <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-sky-400">Hoja de Trabajo IVA D-140</div>
                    <h2 className="text-4xl font-black tracking-tight">Periodo: Junio 2024</h2>
                    <p className="text-slate-400 font-medium max-w-md">Consolidado exacto para declaración. Cruza tus facturas de ventas con los gastos aceptados de proveedores.</p>
                 </div>
                 <div className="flex flex-wrap gap-4">
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[200px]">
                       <p className="text-[10px] font-black uppercase text-slate-500 mb-2">IVA Neto a Pagar</p>
                       <p className="text-4xl font-black text-sky-400">₡{netTaxBalance.toLocaleString()}</p>
                    </div>
                    <button className="bg-white text-slate-900 p-8 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-sky-400 transition-all flex flex-col items-center gap-2 group">
                       <FileSpreadsheet size={24} className="group-hover:scale-110 transition-transform"/> Exportar Excel
                    </button>
                 </div>
              </div>
              <Scale className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 rotate-12" />
           </div>

           {/* DESGLOSE POR TARIFAS CON TOTALES BRUTOS */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              
              {/* IVA DEVENGADO (VENTAS) */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
                 <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                       <div className="bg-sky-50 p-3 rounded-2xl text-sky-500 shadow-sm"><TrendingUp size={20}/></div>
                       <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">IVA Devengado (Ventas)</h3>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lo que cobraste</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Total Impuestos</p>
                       <p className="text-xl font-black text-sky-500">₡{totalSalesTax.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-6 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6 pb-2 border-b border-slate-50">
                       <div className="col-span-2">Tarifa / Concepto</div>
                       <div className="text-right">Base (Sin IVA)</div>
                       <div className="text-right">Impuesto</div>
                       <div className="text-right col-span-2">Total (Bruto)</div>
                    </div>
                    
                    {taxData.sales.map((item, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-6 items-center gap-2 hover:bg-sky-50 transition-colors group">
                          <div className="col-span-2 flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-slate-400 shadow-sm group-hover:text-sky-500 transition-colors">{item.rate}</div>
                             <div className="truncate">
                                <p className="text-xs font-black text-slate-800 truncate">{item.label}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">F. Hacienda</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-600">₡{item.subtotal.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-sky-600">₡{item.tax.toLocaleString()}</p>
                          </div>
                          <div className="text-right col-span-2">
                             <div className="bg-white/50 px-3 py-2 rounded-xl inline-block border border-slate-100 group-hover:border-sky-200 transition-colors">
                                <p className="text-xs font-black text-slate-900 tracking-tight">₡{(item.subtotal + item.tax).toLocaleString()}</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumen Total Ventas</span>
                    <span className="text-lg font-black text-slate-800">₡{(taxData.sales.reduce((a,b) => a + b.subtotal + b.tax, 0)).toLocaleString()}</span>
                 </div>
              </div>

              {/* IVA SOPORTADO (GASTOS) */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
                 <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                       <div className="bg-rose-50 p-3 rounded-2xl text-rose-500 shadow-sm"><FileCheck2 size={20}/></div>
                       <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">IVA Soportado (Gastos)</h3>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lo que pagaste</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Crédito Fiscal</p>
                       <p className="text-xl font-black text-rose-500">₡{totalPurchasesTax.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-6 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6 pb-2 border-b border-slate-50">
                       <div className="col-span-2">Tarifa / Concepto</div>
                       <div className="text-right">Base (Sin IVA)</div>
                       <div className="text-right">Impuesto</div>
                       <div className="text-right col-span-2">Total (Bruto)</div>
                    </div>
                    
                    {taxData.purchases.map((item, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-6 items-center gap-2 hover:bg-rose-50 transition-colors group">
                          <div className="col-span-2 flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-slate-400 shadow-sm group-hover:text-rose-500 transition-colors">{item.rate}</div>
                             <div className="truncate">
                                <p className="text-xs font-black text-slate-800 truncate">{item.label}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">F. Proveedor</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-600">₡{item.subtotal.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-rose-600">₡{item.tax.toLocaleString()}</p>
                          </div>
                          <div className="text-right col-span-2">
                             <div className="bg-white/50 px-3 py-2 rounded-xl inline-block border border-slate-100 group-hover:border-rose-200 transition-colors">
                                <p className="text-xs font-black text-slate-900 tracking-tight">₡{(item.subtotal + item.tax).toLocaleString()}</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumen Total Compras</span>
                    <span className="text-lg font-black text-slate-800">₡{(taxData.purchases.reduce((a,b) => a + b.subtotal + b.tax, 0)).toLocaleString()}</span>
                 </div>
              </div>
           </div>

           {/* CALCULADORA RÁPIDA DE CRÉDITO */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-4 mb-8">
                 <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-500"><Calculator size={24}/></div>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight">Verificación Cruzada de Totales</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Monto Bruto Ventas (Ingreso Total)</p>
                    <p className="text-3xl font-black text-slate-800">₡{(taxData.sales.reduce((a,b) => a + b.subtotal + b.tax, 0)).toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Base + IVA Recaudado</p>
                 </div>
                 <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Monto Bruto Compras (Salida Total)</p>
                    <p className="text-3xl font-black text-slate-800">₡{(taxData.purchases.reduce((a,b) => a + b.subtotal + b.tax, 0)).toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Base + IVA Pagado</p>
                 </div>
                 <div className={`p-8 rounded-[2rem] border ${netTaxBalance > 0 ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${netTaxBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>Saldo Hacienda</p>
                    <p className={`text-3xl font-black ${netTaxBalance > 0 ? 'text-amber-800' : 'text-emerald-800'}`}>₡{Math.abs(netTaxBalance).toLocaleString()}</p>
                    <p className={`text-[9px] font-bold mt-2 uppercase ${netTaxBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                       {netTaxBalance > 0 ? 'Monto a Pagar' : 'Saldo a Favor (Crédito)'}
                    </p>
                 </div>
              </div>
              <Scale className="absolute right-[-20px] top-[-20px] w-32 h-32 opacity-[0.03] rotate-12" />
           </div>

           {/* NOTA DE AYUDA TRIBUTARIA */}
           <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex items-start gap-6">
              <div className="bg-white p-4 rounded-2xl text-amber-500 shadow-sm shrink-0"><Info size={24}/></div>
              <div>
                 <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-2">Consejo para tu Declaración</h4>
                 <p className="text-sm font-medium text-amber-700 leading-relaxed">
                    Asegúrate de que los montos en la columna <strong>Base (Sin IVA)</strong> coincidan con los que ingresas en las casillas correspondientes a cada tarifa en el portal de Hacienda. 
                    La columna <strong>Total (Bruto)</strong> debe servirte para confirmar que la suma de tus facturas físicas o bancarias cuadra perfectamente con lo registrado en el sistema.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
