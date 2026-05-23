import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { 
  Users, Plus, Trash2, Search, Edit, Zap, 
  AlertTriangle, CheckCircle2, Mail, Phone, User, Loader2
} from 'lucide-react';

export default function Suppliers({ lang = 'ro' }) {
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

  const isEmailStructureValid = (email) => {
    return email.trim().includes('@');
  };

  const isPhoneStructureValid = (phone) => {
    const cleaned = phone.trim();
    return cleaned.length >= 10 && /^\+?\d+$/.test(cleaned);
  };

  const isFormValid = () => {
    if (formData.contact_email.trim().length > 0 && !isEmailStructureValid(formData.contact_email)) {
      return false;
    }

    if (formData.phone_number.trim().length > 0 && !isPhoneStructureValid(formData.phone_number)) {
      return false;
    }

    if (modalType === 'put') {
      const isNameChanged = formData.name.trim() !== selectedSupplier?.name;
      const isEmailChanged = formData.contact_email.trim() !== selectedSupplier?.contact_email;
      const isPhoneChanged = formData.phone_number.trim() !== selectedSupplier?.phone_number;
      const isBothNotEmpty = formData.name.trim().length > 0 && formData.contact_email.trim().length > 0 && formData.phone_number.trim().length > 0;
      return (isNameChanged && isEmailChanged && isPhoneChanged) && isBothNotEmpty;
    }
    if (modalType === 'patch') {
      const isChanged = formData.name.trim() !== selectedSupplier?.name || formData.contact_email.trim() !== selectedSupplier?.contact_email || formData.phone_number.trim() !== selectedSupplier?.phone_number;
      const isNotEmpty = formData.name.trim() !== "" || formData.contact_email.trim() !== "" || formData.phone_number.trim() !== "";
      return isChanged && isNotEmpty;
    }
    return formData.name.trim().length > 0 && formData.contact_email.trim().length > 0 && formData.phone_number.trim().length > 0;
  };

 const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      const [suppliersRes, productsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${import.meta.env.VITE_API_URL}/warehouses/products/all`)
      ]);

      const suppliersData = suppliersRes.data;
      const productsData = productsRes.data;


      const suppliersWithProducts = suppliersData.map((s) => {
        const count = productsData.filter((p) => p.supplier_id === s.id).length;
        return { ...s, productCount: count };
      });

      setSuppliers(suppliersWithProducts);
    } catch (err) { 
      console.error(err);
    } finally { 
      setLoading(false);
    }
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
    if (isSubmitting || (modalType !== 'delete' && !isFormValid())) return;

    setError('');
    setIsSubmitting(true);

    try {
      let actionLabel = "";
      let currentToastType = 'success';

      if (modalType === 'add') { 
        await axios.post(API_URL, formData); 
        actionLabel = lang === 'ro' ? "Furnizor înregistrat cu succes!" : "Supplier registered successfully!"; 
      } else if (modalType === 'put') { 
        await axios.put(`${API_URL}/${selectedSupplier.id}`, formData); 
        actionLabel = lang === 'ro' ? "Sincronizare completă ( PUT ) finalizată!" : "Full sync ( PUT ) completed!"; 
      } else if (modalType === 'patch') { 
        await axios.patch(`${API_URL}/${selectedSupplier.id}`, formData); 
        actionLabel = lang === 'ro' ? "Patch rapid aplicat!" : "Quick patch applied!"; 
      } else if (modalType === 'delete') { 
        await axios.delete(`${API_URL}/${selectedSupplier.id}`); 
        actionLabel = lang === 'ro' ? "Furnizor șters cu succes!" : "Supplier deleted successfully!"; 
        currentToastType = 'danger'; 
      }
      
      closeModals(); 
      await fetchSuppliers(); 
      triggerToast(actionLabel, currentToastType);
    } catch (err) { 
      const backendError = err.response?.data?.detail || "";
      const errLower = backendError.toLowerCase();

      if (errLower.includes("already exists") || errLower.includes("already used")) {
        setError(lang === 'ro' 
          ? "Eroare: Adresa de email este deja utilizată de un alt furnizor." 
          : "Error: Email address is already used by another supplier."
        );
      } else if (errLower.includes("assigned to it") || errLower.includes("product")) {
        setError(lang === 'ro' 
          ? "Nu se poate șterge furnizorul: există produse active legate de acesta." 
          : "Cannot delete supplier: active products are currently assigned to it."
        );
      } else {
        setError(backendError || (lang === 'ro' ? "Eroare de tranzacție: Verificarea integrității a eșuat." : "Transaction error: Integrity check failed.")); 
      }
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
    } else {
      setFormData({ name: '', contact_email: '', phone_number: '' });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9+]*$/.test(value) && value.length <= MAX_PHONE) {
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
            {lang === 'ro' ? 'Management furnizori' : 'Supplier management'}
          </h2>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
            <input 
              type="text" 
              placeholder={lang === 'ro' ? 'Caută orice...' : 'Search anything...'}
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
            <span className="font-bold tracking-tight uppercase">
              {lang === 'ro' ? 'Adaugă furnizor' : 'Add supplier'}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-32 flex flex-col items-center justify-center gap-5">
           <div className="relative">
             <Loader2 className="h-16 w-16 text-sky-500 animate-spin stroke-[1.5]" />
             <div className="absolute inset-0 blur-xl bg-sky-500/20 animate-pulse rounded-full" />
           </div>
           <p className="text-[10px] font-black text-sky-500/60 uppercase tracking-[0.4em] animate-pulse">
             {lang === 'ro' ? 'Se sincronizează cu cloud-ul' : 'Synchronizing with cloud'}
           </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="w-full py-20 bg-slate-900/20 border border-slate-800/80 rounded-3xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
           <AlertTriangle className="h-12 w-12 text-slate-600 stroke-[1.5]" />
           <p className="text-sm font-black text-slate-500 uppercase tracking-widest font-mono">
             {lang === 'ro' ? 'Nu a fost găsit niciun furnizor' : 'No supplier found'}
           </p>
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
                    {[
                      {type: 'put', icon: Edit, label: 'Sincronizare completă ( PUT )', clr: 'text-sky-400'},
                      {type: 'patch', icon: Zap, label: 'Patch rapid', clr: 'text-emerald-400'},
                      {type: 'delete', icon: Trash2, label: 'Șterge', clr: 'text-red-400'}
                    ].map((btn) => (
                      <div key={btn.type} className="relative group/btn flex flex-col items-center">
                        <button 
                          disabled={isSubmitting} 
                          onClick={() => openModal(btn.type, s)} 
                          className={`relative p-2.5 bg-slate-950 rounded-xl border border-slate-800 transition-all cursor-pointer ${
                            btn.type === 'put' ? 'text-sky-500 hover:bg-sky-500 hover:text-white' :
                            btn.type === 'patch' ? 'text-emerald-500 hover:bg-emerald-500 hover:text-white' :
                            'text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          <btn.icon size={14}/>
                        </button>
                        <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-current border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20 ${btn.clr}`}>
                          {lang === 'ro' ? btn.label : btn.type === 'put' ? 'Full sync ( PUT )' : btn.type === 'patch' ? 'Quick patch' : 'Delete'}
                        </span>
                      </div>
                    ))}
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
                 
                 <div className="flex items-center bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-1.5">
                    <span className="font-mono text-[10px] text-sky-500 font-black tracking-[0.2em] leading-none text-center">
                       {lang === 'ro' ? 'PRODUSE:' : 'PRODUCTS:'} {s.productCount || 0}
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
                  <button disabled={isSubmitting} onClick={handleAction} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest cursor-pointer shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                    {isSubmitting ? (lang === 'ro' ? 'SE ȘTERGE...' : 'DELETING...') : (lang === 'ro' ? 'ȘTERGE' : 'DELETE')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAction} className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">
                    {modalType === 'add' ? (lang === 'ro' ? 'Furnizor nou' : 'New supplier') : modalType === 'put' ? (lang === 'ro' ? 'Sincronizare completă ( PUT )' : 'Full sync ( PUT )') : (lang === 'ro' ? 'Patch rapid' : 'Quick patch')}
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
                    <label className="text-[9px] text-slate-500 block mb-1 font-bold uppercase">
                      {lang === 'ro' ? 'Nume' : 'Name'} {(modalType === 'add' || modalType === 'put') && <span className="text-sky-500">*</span>}
                    </label>
                    <input disabled={isSubmitting} type="text" maxLength={MAX_NAME} placeholder={lang === 'ro' ? 'NUME' : 'NAME'} className="w-full bg-transparent border-none text-white font-bold p-0 outline-none focus:ring-0 text-xs font-sans disabled:opacity-50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] font-mono text-slate-700">{formData.name.length}/{MAX_NAME}</span>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-sky-500/50 transition-all relative">
                    <label className="text-[9px] text-slate-500 block mb-1 font-bold uppercase">
                      {lang === 'ro' ? 'Adresă de email' : 'Contact email'} {(modalType === 'add' || modalType === 'put') && <span className="text-sky-500">*</span>}
                    </label>
                    <input disabled={isSubmitting} type="text" maxLength={MAX_EMAIL} placeholder={lang === 'ro' ? 'EMAIL' : 'EMAIL'} className="w-full bg-transparent border-none text-white font-bold p-0 outline-none focus:ring-0 text-xs font-sans disabled:opacity-50" value={formData.contact_email} onChange={(e) => setFormData({...formData, contact_email: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] font-mono text-slate-700">{formData.contact_email.length}/{MAX_EMAIL}</span>
                    
                    {formData.contact_email.trim().length > 0 && !isEmailStructureValid(formData.contact_email) && (
                      <span className="text-[9px] text-red-500 block mt-1 font-sans font-bold uppercase tracking-wider animate-pulse">
                        {lang === 'ro' ? 'Adresa trebuie să conțină caracterul "@"' : 'Address must contain the "@" character'}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-sky-500/50 transition-all relative">
                    <label className="text-[9px] text-slate-500 block mb-1 font-bold uppercase">
                      {lang === 'ro' ? 'Număr de telefon' : 'Phone number'} {(modalType === 'add' || modalType === 'put') && <span className="text-sky-500">*</span>}
                    </label>
                    <input disabled={isSubmitting} type="text" placeholder={lang === 'ro' ? 'TELEFON' : 'PHONE'} className="w-full bg-transparent border-none text-white font-bold p-0 outline-none focus:ring-0 text-xs font-sans disabled:opacity-50" value={formData.phone_number} onChange={handlePhoneChange} />
                    <span className="absolute right-3 top-3 text-[8px] font-mono text-slate-700">{formData.phone_number.length}/{MAX_PHONE}</span>
                    
                    {formData.phone_number.trim().length > 0 && !isPhoneStructureValid(formData.phone_number) && (
                      <span className="text-[9px] text-red-500 block mt-1 font-sans font-bold uppercase tracking-wider animate-pulse">
                        {lang === 'ro' ? 'Format invalid (doar cifre, opțional începând cu "+", minim 10 cifre)' : 'Invalid format (only digits, optionally starting with "+", minimum 10 digits)'}
                      </span>
                    )}
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
                       modalType === 'patch' ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                     }`}
                   >
                     {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                     {isSubmitting ? (lang === 'ro' ? 'SE PROCESEAZĂ...' : 'PROCESSING...') : (lang === 'ro' ? 'CONFIRMĂ' : 'CONFIRM')}
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