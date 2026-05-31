import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { 
  Warehouse, Plus, Trash2, MapPin, 
  Building2, Search, Edit, Zap, AlertTriangle, CheckCircle2, Loader2
} from 'lucide-react';

export default function Warehouses({ lang = 'ro' }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [modalType, setModalType] = useState(null); 
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success'); 

  const API_URL = `${import.meta.env.VITE_API_URL}/warehouses`;
  const MAX_NAME = 25;
  const MAX_LOC = 30;

  const isFormValid = () => {
    if (modalType === 'put') {
      const isNameChanged = formData.name.trim() !== selectedWarehouse?.name;
      const isLocationChanged = formData.location.trim() !== selectedWarehouse?.location;
      const isBothNotEmpty = formData.name.trim().length > 0 && formData.location.trim().length > 0;
      return isNameChanged && isLocationChanged && isBothNotEmpty;
    }
    if (modalType === 'patch') {
      const isChanged = formData.name.trim() !== selectedWarehouse?.name || formData.location.trim() !== selectedWarehouse?.location;
      const isNotEmpty = formData.name.trim() !== "" || formData.location.trim() !== "";
      return isChanged && isNotEmpty;
    }
    return formData.name.trim().length > 0 && formData.location.trim().length > 0;
  };

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      const warehousesData = response.data;

      const warehousesWithProducts = await Promise.all(
        warehousesData.map(async (w) => {
          try {
            const resProd = await axios.get(`${API_URL}/${w.id}/products`);
            return { ...w, productCount: resProd.data.length };
          } catch (e) {
            return { ...w, productCount: 0 };
          }
        })
      );

      setWarehouses(warehousesWithProducts);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchWarehouses(); }, []);

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [modalType]);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (isSubmitting || (modalType !== 'delete' && !isFormValid())) return;

    setError('');
    setIsSubmitting(true);

    try {
      let actionLabel = "";
      let currentToastType = 'success';

      if (modalType === 'add') {
          await axios.post(API_URL, formData);
          actionLabel = lang === 'ro' ? "Depozit înregistrat cu succes!" : "Warehouse registered successfully!";
      } else if (modalType === 'put') {
          await axios.put(`${API_URL}/${selectedWarehouse.id}`, formData);
          actionLabel = lang === 'ro' ? "Sincronizare completă ( PUT ) finalizată!" : "Full sync ( PUT ) completed!";
      } else if (modalType === 'patch') {
          await axios.patch(`${API_URL}/${selectedWarehouse.id}`, formData);
          actionLabel = lang === 'ro' ? "Patch rapid aplicat!" : "Quick patch applied!";
      } else if (modalType === 'delete') {
          await axios.delete(`${API_URL}/${selectedWarehouse.id}`);
          actionLabel = lang === 'ro' ? "Depozit șters cu succes!" : "Warehouse deleted successfully!";
          currentToastType = 'danger';
      }
      
      closeModals();
      await fetchWarehouses();
      triggerToast(actionLabel, currentToastType);
    } catch (err) { 
      const backendError = err.response?.data?.detail || "";
      if (backendError.toLowerCase().includes("product")) {
        setError(lang === 'ro' 
          ? "Nu se poate șterge depozitul: există produse asociate acestuia." 
          : "Cannot delete warehouse: products are currently assigned to it."
        );
      } else {
        setError(backendError || (lang === 'ro' ? "Eroare server sau bază de date." : "Server or database error."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    if (isSubmitting) return;
    setModalType(null);
    setSelectedWarehouse(null);
    setFormData({ name: '', location: '' });
    setError('');
  };

  const openModal = (type, warehouse = null) => {
    setModalType(type);
    if (warehouse) {
      setSelectedWarehouse(warehouse);
      setFormData({ name: warehouse.name, location: warehouse.location });
    } else {
      setFormData({ name: '', location: '' });
    }
  };

  const filtered = warehouses.filter(w => {
    const query = searchQuery.toLowerCase().trim();
    return (
      w.id.toString().includes(query) ||
      w.name.toLowerCase().includes(query) ||
      w.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="animate-fade-in space-y-10 relative pb-16">
      
      {showToast && ReactDOM.createPortal(
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[99999] animate-in slide-in-from-top-10 fade-in duration-300">
            <div className={`px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${
                toastType === 'danger' 
                ? 'bg-red-500/90 text-white border-red-400' 
                : 'bg-emerald-500/90 text-slate-950 border-emerald-400'
            }`}>
                {toastType === 'danger' ? <Trash2 size={18} /> : <CheckCircle2 size={18} />}
                {toastMsg}
            </div>
        </div>,
        document.body
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between relative z-30">
        <div className="flex items-center space-x-4 w-full lg:w-auto justify-center lg:justify-start">
          <div className="p-4 bg-amber-500/10 rounded-3xl border border-amber-500/20 shadow-lg">
            <Warehouse className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter whitespace-normal lg:whitespace-nowrap text-center lg:text-left leading-tight">
            {lang === 'ro' ? 'Management depozite' : 'Warehouse management'}
          </h2>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder={lang === 'ro' ? 'Caută orice...' : 'Search anything...'}
              className="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl py-3 pl-11 pr-4 text-xs text-white font-mono focus:border-amber-500 outline-none transition-all uppercase placeholder:text-slate-600 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => openModal('add')}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="font-bold tracking-tight uppercase">{lang === 'ro' ? 'Adaugă depozit' : 'Add warehouse'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-32 flex flex-col items-center justify-center gap-5">
           <div className="relative">
             <Loader2 className="h-16 w-16 text-amber-500 animate-spin stroke-[1.5]" />
             <div className="absolute inset-0 blur-xl bg-amber-500/20 animate-pulse rounded-full" />
           </div>
           <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.4em] animate-pulse">
             {lang === 'ro' ? 'Se sincronizează cu cloud-ul' : 'Synchronizing with cloud'}
           </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="w-full py-20 bg-slate-900/20 border border-slate-800/80 rounded-3xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
           <AlertTriangle className="h-12 w-12 text-slate-600 stroke-[1.5]" />
           <p className="text-sm font-black text-slate-500 uppercase tracking-widest font-mono">
             {lang === 'ro' ? 'Nu a fost găsit niciun depozit' : 'No warehouse found'}
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((w) => (
            <div key={w.id} className="group relative bg-slate-900/30 border border-slate-800/80 rounded-[3rem] p-8 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-sm min-h-[300px] flex flex-col justify-between hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/5">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-amber-500/30 transition-all shadow-inner">
                    <Building2 className="h-6 w-6 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
              
                  <div className="flex gap-2">
                     {[
                        {type: 'put', icon: Edit, label: 'Sincronizare completă ( PUT )'}, 
                        {type: 'patch', icon: Zap, label: 'Patch rapid'}, 
                        {type: 'delete', icon: Trash2, label: 'Șterge'}
                     ].map((btn) => (
                       <div key={btn.type} className="relative group/btn flex flex-col items-center">
                         <button 
                           disabled={isSubmitting}
                           onClick={() => openModal(btn.type, w)} 
                           className={`relative p-2.5 bg-slate-950 rounded-xl border border-slate-800 transition-all cursor-pointer ${
                             btn.type === 'put' ? 'text-sky-500 hover:bg-sky-500 hover:text-white' :
                             btn.type === 'patch' ? 'text-emerald-500 hover:bg-emerald-500 hover:text-white' :
                             'text-red-500 hover:bg-red-500 hover:text-white'
                           }`}
                         >
                           <btn.icon size={14}/>
                         </button>
                         <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-current border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20 ${
                           btn.type === 'put' ? 'text-sky-400' : btn.type === 'patch' ? 'text-emerald-400' : 'text-red-400'
                         }`}>
                           {lang === 'ro' ? btn.label : btn.type === 'put' ? 'Full sync ( PUT )' : btn.type === 'patch' ? 'Quick patch' : 'Delete'}
                         </span>
                       </div>
                     ))}
                  </div>
                </div>

                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 group-hover:text-amber-400 transition-colors leading-[0.9] break-words">
                   {w.name}
                </h3>
                
                <div className="flex items-start gap-2 text-slate-400 font-mono text-[11px] uppercase tracking-widest bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/50 w-full mt-4">
                  <MapPin size={12} className="text-amber-500 shrink-0 mt-0.5" /> 
                  <span className="line-clamp-2 break-all leading-tight">{w.location}</span>
                </div>
              </div>

              <div className="relative z-10 pt-6 border-t border-slate-800/50 flex items-center justify-between mt-6">
                 <div className="flex items-center bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5">
                    <span className="font-mono text-[10px] text-amber-500 font-black tracking-[0.2em] leading-none text-center">
                      ID-{w.id}
                    </span>
                 </div>

                 <div className="flex items-center bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5">
                    <span className="font-mono text-[10px] text-amber-500 font-black tracking-[0.2em] leading-none text-center">
                       {lang === 'ro' ? 'PRODUSE:' : 'PRODUCTS:'} {w.productCount || 0}
                    </span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalType && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/90 p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={closeModals} />
          
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl z-10">
            
            {modalType === 'delete' ? (
              <div className="text-center space-y-5 py-2">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {lang === 'ro' ? 'Confirmi ștergerea?' : 'Confirm deletion?'}
                </h2>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase p-2.5 rounded-lg tracking-widest flex items-center justify-center gap-2">
                    <AlertTriangle size={14} /> {error}
                  </div>
                )}
                <div className="flex gap-3 max-w-xs mx-auto pt-2">
                  <button disabled={isSubmitting} onClick={closeModals} className="flex-1 py-3 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all rounded-xl font-black uppercase text-[10px] tracking-widest cursor-pointer disabled:opacity-50">
                    {lang === 'ro' ? 'Anulează' : 'Cancel'}
                  </button>
                  <button disabled={isSubmitting} onClick={handleAction} className="flex-1 py-3 bg-red-600 hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer duration-200">
                    {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                    {isSubmitting ? (lang === 'ro' ? 'SE ȘTERGE...' : 'DELETING...') : (lang === 'ro' ? 'ȘTERGE' : 'DELETE')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAction} className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">
                    {modalType === 'add' ? (lang === 'ro' ? 'Depozit nou' : 'New warehouse') : modalType === 'put' ? (lang === 'ro' ? 'SINCRONIZARE COMPLETĂ ( PUT )' : 'FULL SYNC ( PUT )') : (lang === 'ro' ? 'Patch rapid' : 'Quick patch')}
                  </h2>
                  <Warehouse size={20} className="text-amber-500" />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase p-2.5 rounded-lg tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" /> {error}
                  </div>
                )}

                <div className="space-y-3 font-mono">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-amber-500/50 transition-all relative">
                     <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">
                       {lang === 'ro' ? 'Nume' : 'Name'} {(modalType === 'add' || modalType === 'put' || modalType === 'patch' ) && <span className="text-amber-500">*</span>}
                     </label>
                     <input 
                      disabled={isSubmitting}
                      type="text"
                        maxLength={MAX_NAME}
                      placeholder={lang === 'ro' ? 'NUME' : 'NAME'}
                      className="w-full bg-transparent border-none text-white font-bold p-0 outline-none focus:ring-0 text-xs font-sans disabled:opacity-50"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-amber-500/50 transition-all relative">
                     <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">
                       {lang === 'ro' ? 'Locație' : 'Location'} {(modalType === 'add' || modalType === 'put' || modalType === 'patch') && <span className="text-amber-500">*</span>}
                     </label>
                     <input 
                      disabled={isSubmitting}
                      type="text"
                        maxLength={MAX_LOC}
                         placeholder={lang === 'ro' ? 'LOCAȚIE' : 'LOCATION'}
                      className="w-full bg-transparent border-none text-white font-bold p-0 outline-none focus:ring-0 text-xs font-sans disabled:opacity-50"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                     />
                  </div>
                </div>

                <div className="flex gap-3 pt-3 font-sans">
                   <button disabled={isSubmitting} type="button" onClick={closeModals} className="flex-1 py-3 text-slate-500 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-white transition-colors disabled:opacity-50">
                     {lang === 'ro' ? 'Anulează' : 'Cancel'}
                   </button>
                   <button 
                     disabled={isSubmitting || !isFormValid()} 
                     type="submit" 
                     className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                       (isSubmitting || !isFormValid()) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' :
                       modalType === 'patch' ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                     }`}>
                     {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                     {isSubmitting ? (lang === 'ro' ? 'SE PROCESEAZĂ...' : 'PROCESSING...') : (lang === 'ro' ? 'CONFIRMĂ' : 'CONFIRM')}
                   </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}