import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { 
  Users, Plus, Trash2, Search, Edit, Zap, 
  AlertTriangle, CheckCircle2, Mail, Phone, User, Loader2
} from 'lucide-react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', contact_email: '', phone_number: '' });
  const [error, setError] = useState('');
  
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success'); 

  const API_URL = `${import.meta.env.VITE_API_URL}/suppliers`;
  const MAX_NAME = 25;
  const MAX_EMAIL = 35;
  const MAX_PHONE = 15;

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setSuppliers(response.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  useEffect(() => {
    if (modalType) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [modalType]);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    if (modalType === 'add' && (!formData.name.trim() || !formData.contact_email.trim() || !formData.phone_number.trim())) {
      setError("All entity credentials (NAME, EMAIL, PHONE) are required.");
      setIsSubmitting(false);
      return;
    }

    if (modalType === 'put') {
      const isNameSame = formData.name.trim() === selectedSupplier.name;
      const isEmailSame = formData.contact_email.trim() === selectedSupplier.contact_email;
      const isPhoneSame = formData.phone_number.trim() === selectedSupplier.phone_number;
      if (isNameSame || isEmailSame || isPhoneSame) {
        setError("Both fields must be modified for a Full Sync ( PUT ) operation.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      let actionLabel = "";
      let currentToastType = 'success';

      if (modalType === 'add') { 
        await axios.post(API_URL, formData); 
        actionLabel = "Supplier Registered Successfully!"; 
      } else if (modalType === 'put') { 
        await axios.put(`${API_URL}/${selectedSupplier.id}`, formData); 
        actionLabel = "FULL SYNC ( PUT ) Complete!"; 
      } else if (modalType === 'patch') { 
        await axios.patch(`${API_URL}/${selectedSupplier.id}`, formData); 
        actionLabel = "Quick Patch Applied!"; 
      } else if (modalType === 'delete') { 
        await axios.delete(`${API_URL}/${selectedSupplier.id}`); 
        actionLabel = "Supplier Deleted Successfully!"; 
        currentToastType = 'danger'; 
      }
      
      closeModals(); 
      await fetchSuppliers(); 
      triggerToast(actionLabel, currentToastType);
    } catch (err) { 
      setError(err.response?.data?.detail || "Transaction Error: Integrity check failed."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    if (isSubmitting) return;
    setModalType(null); 
    setSelectedSupplier(null); 
    setError('');
    setFormData({ name: '', contact_email: '', phone_number: '' });
  };

  const openModal = (type, supplier = null) => {
    setModalType(type);
    if (supplier) {
      setSelectedSupplier(supplier);
      setFormData({ name: supplier.name, contact_email: supplier.contact_email, phone_number: supplier.phone_number });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    if (value.length <= MAX_PHONE) {
      setFormData({...formData, phone_number: value});
    }
  };

  const filtered = suppliers.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    return s.id.toString().includes(q) || s.name.toLowerCase().includes(q) || 
           s.contact_email.toLowerCase().includes(q) || s.phone_number.includes(q);
  });

  return (
    <div className="animate-fade-in space-y-10 relative pb-16">
      {showToast && ReactDOM.createPortal(
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[99999] animate-in slide-in-from-top-10 fade-in duration-300">
            <div className={`px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${
                toastType === 'danger' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-500/90 text-slate-950 border-emerald-400'
            }`}>
                {toastType === 'danger' ? <Trash2 size={18} /> : <CheckCircle2 size={18} />}
                {toastMsg}
            </div>
        </div>, document.body
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between relative z-30">
        <div className="flex items-center space-x-4 w-full lg:w-auto justify-center lg:justify-start">
          <div className="p-4 bg-sky-500/10 rounded-3xl border border-sky-500/20 shadow-lg">
            <Users className="h-8 w-8 text-sky-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter text-center lg:text-left leading-tight whitespace-normal lg:whitespace-nowrap">
            Supplier Management
          </h2>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
            <input 
              type="text" 
              placeholder="FILTER BY ANYTHING.." 
              className="w-full bg-slate-950/90 border border-sky-500/30 rounded-xl py-3 pl-11 pr-4 text-xs text-white font-mono focus:border-sky-500 outline-none transition-all uppercase placeholder:text-slate-600 shadow-[0_0_15px_rgba(14,165,233,0.05)]" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => openModal('add')} 
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="font-bold tracking-tight">ADD SUPPLIER</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-32 flex flex-col items-center justify-center gap-5">
           <div className="relative">
             <Loader2 className="h-16 w-16 text-sky-500 animate-spin stroke-[1.5]" />
             <div className="absolute inset-0 blur-xl bg-sky-500/20 animate-pulse rounded-full" />
           </div>
           <p className="text-[10px] font-black text-sky-500/60 uppercase tracking-[0.4em] animate-pulse">Synchronizing with Cloud</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="w-full py-20 bg-slate-900/20 border border-slate-800/80 rounded-3xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
           <AlertTriangle className="h-12 w-12 text-slate-600 stroke-[1.5]" />
           <p className="text-sm font-black text-slate-500 uppercase tracking-widest font-mono">ENTITY NOT FOUND</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((s) => (
            <div key={s.id} className="group relative bg-slate-900/30 border border-slate-800/80 rounded-[3rem] p-8 hover:border-sky-500/40 transition-all duration-300 backdrop-blur-sm min-h-[300px] flex flex-col justify-between hover:scale-[1.03] hover:shadow-2xl hover:shadow-sky-500/5">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-sky-500/30 transition-all shadow-inner">
                    <User className="h-6 w-6 text-sky-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex gap-2">
                    <button disabled={isSubmitting} onClick={() => openModal('put', s)} className="group/btn relative p-2.5 bg-slate-950 text-sky-500 hover:bg-sky-500 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer">
                      <Edit size={14}/>
                      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-sky-400 border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">FULL SYNC ( PUT )</span>
                    </button>
                    <button disabled={isSubmitting} onClick={() => openModal('patch', s)} className="group/btn relative p-2.5 bg-slate-950 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer">
                      <Zap size={14}/>
                      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-emerald-400 border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">Quick Patch</span>
                    </button>
                    <button disabled={isSubmitting} onClick={() => openModal('delete', s)} className="group/btn relative p-2.5 bg-slate-950 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer">
                      <Trash2 size={14}/>
                      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-red-400 border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">Delete</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 group-hover:text-sky-400 transition-colors leading-[0.9] break-words line-clamp-2 min-h-[4.5rem]">{s.name}</h3>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] uppercase tracking-widest bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/50 w-full">
                    <Mail size={12} className="text-sky-500 shrink-0" /> <span className="line-clamp-1 break-all">{s.contact_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] uppercase tracking-widest bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/50 w-fit">
                    <Phone size={12} className="text-sky-500 shrink-0" /> <span>{s.phone_number}</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-6 border-t border-slate-800/50 flex items-center justify-between mt-6">
                 <div className="flex items-center bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-1.5">
                    <span className="font-mono text-[10px] text-sky-500 font-black tracking-[0.2em] leading-none text-center">ID-{s.id}</span>
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
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Confirm Deletion?</h2>
                <div className="flex gap-3 max-w-xs mx-auto pt-2">
                  <button disabled={isSubmitting} onClick={closeModals} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-black uppercase text-[10px] tracking-widest cursor-pointer disabled:opacity-50">Cancel</button>
                  <button disabled={isSubmitting} onClick={handleAction} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest cursor-pointer shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                    {isSubmitting ? 'DELETING...' : 'DELETE'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAction} className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">
                    {modalType === 'add' ? 'ADD SUPPLIER' : modalType === 'put' ? 'FULL SYNC ( PUT )' : 'QUICK PATCH'}
                  </h2>
                  <Users size={20} className="text-sky-500" />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-2.5 rounded-lg tracking-widest uppercase flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" /> {error}
                  </div>
                )}
                <div className="space-y-3 font-mono">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-sky-500/50 transition-all relative">
                    <label className="text-[9px] text-slate-500 block mb-1 font-bold">NAME</label>
                    <input disabled={isSubmitting} type="text" maxLength={MAX_NAME} className="w-full bg-transparent border-none text-white font-bold p-0 outline-none text-xs font-sans disabled:opacity-50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] font-mono text-slate-700">{formData.name.length}/{MAX_NAME}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-sky-500/50 transition-all relative">
                    <label className="text-[9px] text-slate-500 block mb-1 font-bold">CONTACT_EMAIL</label>
                    <input disabled={isSubmitting} type="text" maxLength={MAX_EMAIL} className="w-full bg-transparent border-none text-white font-bold p-0 outline-none text-xs font-sans disabled:opacity-50" value={formData.contact_email} onChange={(e) => setFormData({...formData, contact_email: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] font-mono text-slate-700">{formData.contact_email.length}/{MAX_EMAIL}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-sky-500/50 transition-all relative">
                    <label className="text-[9px] text-slate-500 block mb-1 font-bold">PHONE_NUMBER</label>
                    <input disabled={isSubmitting} type="text" className="w-full bg-transparent border-none text-white font-bold p-0 outline-none text-xs font-sans disabled:opacity-50" value={formData.phone_number} onChange={handlePhoneChange} />
                    <span className="absolute right-3 top-3 text-[8px] font-mono text-slate-700">{formData.phone_number.length}/{MAX_PHONE}</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-3 font-sans">
                   <button disabled={isSubmitting} type="button" onClick={closeModals} className="flex-1 py-3 text-slate-500 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-white transition-colors disabled:opacity-50">Cancel</button>
                   <button disabled={isSubmitting} type="submit" className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-800 text-slate-500' : modalType === 'patch' ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-sky-500 text-slate-950 hover:bg-sky-400'}`}>
                     {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                     {isSubmitting ? 'PROCESSING...' : 'CONFIRM'}
                   </button>
                </div>
              </form>
            )}
          </div>
        </div>, document.body
      )}
    </div>
  );
}