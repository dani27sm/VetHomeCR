
import React, { useState } from 'react';
// Added X to the lucide-react imports
import { Package, Plus, Search, Filter, Edit3, Trash2, AlertCircle, Zap, Tag, X } from 'lucide-react';
import { ProductService, ItemType } from '../types';
import { MOCK_CABYS } from '../constants';

const InventoryManager: React.FC = () => {
  const [items, setItems] = useState<ProductService[]>(MOCK_CABYS.map(c => ({...c, description: '', stock: 10, category: 'Salud'})) as any);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<ProductService>>({
    type: 'product',
    taxRate: 0.13,
    stock: 0
  });

  const handleSave = () => {
    const newItem = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    } as ProductService;
    setItems([newItem, ...items]);
    setIsAdding(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Catálogo e Inventario</h2>
          <p className="text-slate-400 font-medium">Gestiona tus insumos y servicios médicos con códigos CABYS.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-sky-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-100 hover:scale-105 transition-all flex items-center gap-2">
          <Plus size={18} /> Nuevo Ítem
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Buscar por nombre o CABYS..." className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs" />
           </div>
           <div className="flex gap-2">
              <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                 <AlertCircle size={14}/> 2 Stock Bajo
              </span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Descripción / CABYS</th>
                <th className="px-8 py-5">Tipo</th>
                <th className="px-8 py-5">Precio Unitario</th>
                <th className="px-8 py-5">Impuesto (IVA)</th>
                <th className="px-8 py-5">Existencias</th>
                <th className="px-8 py-5 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 text-sm group-hover:text-sky-600 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-tighter mt-1">{item.code}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      item.type === 'service' ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {item.type === 'service' ? 'Servicio' : 'Producto'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-700">₡{item.price.toLocaleString()}</td>
                  <td className="px-8 py-6 text-slate-400 font-bold">{(item.taxRate * 100)}%</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <span className={`font-black text-sm ${item.stock && item.stock < 5 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
                         {item.type === 'service' ? '∞' : item.stock}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors"><Edit3 size={16}/></button>
                      <button className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nuevo Item de Inventario</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configuración CABYS / Tributaria</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-3 bg-white rounded-2xl text-slate-300 hover:text-slate-500 shadow-sm"><X size={20}/></button>
             </div>
             <div className="p-10 grid grid-cols-2 gap-6">
                <div className="col-span-2 flex gap-4 p-1 bg-slate-100 rounded-2xl">
                   {(['product', 'service', 'bundle'] as ItemType[]).map(t => (
                      <button 
                         key={t}
                         onClick={() => setFormData({...formData, type: t})}
                         className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.type === t ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}
                      >
                         {t === 'product' ? 'Producto' : t === 'service' ? 'Servicio' : 'Kit/Combo'}
                      </button>
                   ))}
                </div>
                <div className="col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                   <input type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código CABYS (13 Dígitos)</label>
                   <input type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold font-mono text-sm" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio Venta (₡)</label>
                   <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tasa IVA Costa Rica</label>
                   <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})}>
                      <option value={0.13}>13% (General)</option>
                      <option value={0.04}>4% (Salud Veterinaria)</option>
                      <option value={0.01}>1% (Canasta Básica)</option>
                      <option value={0}>0% (Exento)</option>
                   </select>
                </div>
                {formData.type === 'product' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Inicial</label>
                     <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                  </div>
                )}
                <div className="col-span-2 pt-6">
                   <button onClick={handleSave} className="w-full py-5 bg-sky-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-sky-100 hover:scale-[1.02] transition-all">Crear Registro Maestro</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
