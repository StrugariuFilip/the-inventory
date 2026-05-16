import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { 
  Package, Plus, Trash2, Search, Edit, Zap, 
  AlertTriangle, CheckCircle2, Box, Warehouse, User, Tag, FileText, ChevronDown, Loader2
} from 'lucide-react';

export default function Products({ lang = 'ro' }) {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterNode, setSelectedFilterNode] = useState(''); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSupplierSelectOpen, setIsSupplierSelectOpen] = useState(false);
  const [isWarehouseSelectOpen, setIsWarehouseSelectOpen] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', price: '', category: '', supplier_id: '', stockQuantity: '', warehouse_id: ''
  });

  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const MAX_NAME = 25;
  const MAX_SKU = 15;
  const MAX_CAT = 20;
  const MAX_DESC = 150;
  const MAX_PRICE_LEN = 10;
  const MAX_STOCK_LEN = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resWare, resSupp] = await Promise.all([
        axios.get(`${API_BASE}/warehouses`),
        axios.get(`${API_BASE}/suppliers`)
      ]);
      setWarehouses(resWare.data);
      setSuppliers(resSupp.data);
      const allProducts = [];
      for (const w of resWare.data) {
        try {
          const resProd = await axios.get(`${API_BASE}/warehouses/${w.id}/products`);
          allProducts.push(...resProd.data);
        } catch (e) { }
      }
      allProducts.sort((a, b) => a.id - b.id);
      setProducts(allProducts);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

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

    if (modalType === 'add') {
      const { name, sku, description, category, price, stockQuantity, supplier_id, warehouse_id } = formData;
      if (!name.trim() || !sku.trim() || !description.trim() || !category.trim() || price === '' || stockQuantity === '') {
        setError(lang === 'ro' ? "Toate câmpurile trebuie completate." : "All fields must be completed.");
        setIsSubmitting(false);
        return;
      }
      if (!supplier_id || !warehouse_id) {
        setError(lang === 'ro' ? "Selectarea furnizorului și a depozitului este obligatorie." : "Supplier and Warehouse selections are required.");
        setIsSubmitting(false);
        return;
      }
    }

    if (modalType === 'put') {
      const isNameSame = formData.name.trim() === selectedProduct.name;
      const isDescSame = formData.description.trim() === (selectedProduct.description || '');
      const isSkuSame = formData.sku.trim() === selectedProduct.sku;
      const isCatSame = formData.category.trim() === (selectedProduct.category || '');
      const isPriceSame = Number(formData.price) === Number(selectedProduct.price);
      const isSuppSame = Number(formData.supplier_id) === Number(selectedProduct.supplier_id);
      if (isNameSame && isDescSame && isSkuSame && isCatSame && isPriceSame && isSuppSame) {
        setError(lang === 'ro' ? "Toate câmpurile trebuie modificate pentru o sincronizare completă (PUT)." : "All fields must be modified for a full sync (PUT).");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const targetWarehouseId = modalType === 'add' ? formData.warehouse_id : selectedProduct.warehouse_id;
      const url = `${API_BASE}/warehouses/${targetWarehouseId}/products`;
      let actionLabel = ""; 
      let currentToastType = 'success';

      if (modalType === 'add') { 
        await axios.post(url, formData); 
        actionLabel = lang === 'ro' ? "Produs adăugat cu succes!" : "Product added successfully!"; 
      } else if (modalType === 'put') { 
        const { stockQuantity, ...putData } = formData;
        await axios.put(`${url}/${selectedProduct.id}`, putData); 
        actionLabel = lang === 'ro' ? "Sincronizare completă (PUT) finalizată!" : "Full sync (PUT) completed!"; 
      } else if (modalType === 'patch') { 
        const patchData = {};
        if (formData.name.trim() !== selectedProduct.name) patchData.name = formData.name;
        if (formData.sku.trim() !== selectedProduct.sku) patchData.sku = formData.sku;
        if (formData.description.trim() !== (selectedProduct.description || '')) patchData.description = formData.description;
        if (formData.category.trim() !== (selectedProduct.category || '')) patchData.category = formData.category;
        if (Number(formData.price) !== Number(selectedProduct.price)) patchData.price = Number(formData.price);
        if (Number(formData.supplier_id) !== Number(selectedProduct.supplier_id)) patchData.supplier_id = Number(formData.supplier_id);

        if (Object.keys(patchData).length === 0) {
          setError(lang === 'ro' ? "Nu s-au detectat modificări pentru patch rapid." : "No changes detected for quick patch.");
          setIsSubmitting(false);
          return;
        }
        await axios.patch(`${url}/${selectedProduct.id}`, patchData); 
        actionLabel = lang === 'ro' ? "Patch rapid aplicat!" : "Quick patch applied!"; 
      } else if (modalType === 'delete') { 
        await axios.delete(`${url}/${selectedProduct.id}`); 
        actionLabel = lang === 'ro' ? "Produs șters cu succes!" : "Product deleted successfully!"; 
        currentToastType = 'danger'; 
      }
      
      closeModals(); await fetchData(); triggerToast(actionLabel, currentToastType);
    } catch (err) { 
      setError(err.response?.data?.detail || (lang === 'ro' ? "Tranzacție întreruptă. Verifică constrângerile bazei de date." : "Transaction interrupted. Verify database constraints.")); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    if (isSubmitting) return;
    setModalType(null); setSelectedProduct(null); setError('');
    setIsSupplierSelectOpen(false); setIsWarehouseSelectOpen(false);
    setFormData({ name: '', sku: '', description: '', price: '', category: '', supplier_id: '', stockQuantity: '', warehouse_id: '' });
  };

  const openModal = (type, prod = null) => {
    setModalType(type);
    setIsSupplierSelectOpen(false); setIsWarehouseSelectOpen(false);
    if (prod) {
      setSelectedProduct(prod);
      setFormData({ 
        name: prod.name, sku: prod.sku, description: prod.description || '',
        price: prod.price.toString(), category: prod.category || '', 
        supplier_id: prod.supplier_id, warehouse_id: prod.warehouse_id,
        stockQuantity: prod.stockQuantity.toString()
      });
    } else {
      setFormData({
        name: '', sku: '', description: '', price: '', category: '', 
        supplier_id: suppliers.length > 0 ? suppliers[0].id : '', 
        stockQuantity: '', warehouse_id: warehouses.length > 0 ? warehouses[0].id : ''
      });
    }
  };

  const filtered = products.filter(p => {
    const query = searchQuery.toLowerCase();
    const supplierName = suppliers.find(s => s.id === p.supplier_id)?.name || '';
    const matchesSearch = p.id.toString().includes(query) || p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query) || (p.category && p.category.toLowerCase().includes(query)) || (p.description && p.description.toLowerCase().includes(query)) || p.price.toString().includes(query) || supplierName.toLowerCase().includes(query);
    const matchesWarehouse = !selectedFilterNode || p.warehouse_id.toString() === selectedFilterNode.toString();
    return matchesSearch && matchesWarehouse;
  });

  const currentFilterName = selectedFilterNode ? warehouses.find(w => w.id.toString() === selectedFilterNode.toString())?.name || (lang === 'ro' ? 'NOD' : 'NODE') : (lang === 'ro' ? 'AFIȘEAZĂ TOT' : 'DISPLAY ALL');
  const currentFormSupplierName = formData.supplier_id ? suppliers.find(s => s.id.toString() === formData.supplier_id.toString())?.name || '' : '';
  const currentFormWarehouseName = formData.warehouse_id ? warehouses.find(w => w.id.toString() === formData.warehouse_id.toString())?.name || '' : '';

  return (
    <div className="animate-fade-in space-y-8 relative pb-16 text-white font-sans">
      {showToast && ReactDOM.createPortal(
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[99999] animate-in slide-in-from-top-10 fade-in duration-300">
          <div className={`px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${toastType === 'danger' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-500/90 text-slate-950 border-emerald-400'}`}>
            {toastType === 'danger' ? <Trash2 size={18} /> : <CheckCircle2 size={18} />}
            {toastMsg}
          </div>
        </div>, document.body
      )}

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between relative z-30">
        <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-start">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-lg">
            <Package className="h-6 w-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter text-center lg:text-left leading-tight whitespace-normal lg:whitespace-nowrap">
            {lang === 'ro' ? 'Management produse' : 'Products management'}
          </h2>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          <div className="relative w-full sm:w-48">
            <button 
              type="button" 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className="w-full bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all shadow-inner cursor-pointer"
            >
              <span className="truncate uppercase font-mono text-[11px] text-emerald-400/90">{currentFilterName}</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-emerald-500' : ''}`} />
            </button>
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in fade-in-50">
                  <div className="p-1.5 max-h-60 overflow-y-auto custom-scrollbar font-mono text-[10px] uppercase">
                    <div onClick={() => { setSelectedFilterNode(''); setIsFilterOpen(false); }} className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${!selectedFilterNode ? 'bg-emerald-500/10 text-emerald-400 font-black' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><span>{lang === 'ro' ? 'Afișează tot' : 'Display all'}</span>{!selectedFilterNode && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}</div>
                    <div className="h-[1px] bg-slate-800/50 my-1 mx-2" />
                    {warehouses.map(w => (<div key={w.id} onClick={() => { setSelectedFilterNode(w.id); setIsFilterOpen(false); }} className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between mt-0.5 ${selectedFilterNode.toString() === w.id.toString() ? 'bg-emerald-500/10 text-emerald-400 font-black' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><span className="truncate">{w.name}</span>{selectedFilterNode.toString() === w.id.toString() && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}</div>))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-500" />
            <input 
              type="text" 
              placeholder={lang === 'ro' ? 'Caută orice...' : 'Search anything...'}
              className="w-full bg-slate-950/90 border border-emerald-500/30 rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono focus:border-emerald-500 outline-none uppercase placeholder:text-slate-600 shadow-[0_0_15px_rgba(16,185,129,0.05)] text-white" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>

          <button 
            onClick={() => openModal('add')} 
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            <span className="font-bold tracking-tight uppercase">{lang === 'ro' ? 'Adaugă produs' : 'Add product'}</span>
          </button>
        </div>
      </div>
      {loading ? (
        <div className="w-full py-32 flex flex-col items-center justify-center gap-5">
           <div className="relative"><Loader2 className="h-16 w-16 text-emerald-500 animate-spin stroke-[1.5]" /><div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse rounded-full" /></div>
           <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] animate-pulse">
             {lang === 'ro' ? 'Se sincronizează inventarul' : 'Synchronizing inventory'}
           </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="w-full py-20 bg-slate-900/20 border border-slate-800/80 rounded-3xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm"><Package className="h-12 w-12 text-slate-600 stroke-[1.5]" /><p className="text-sm font-black text-slate-500 uppercase tracking-widest font-mono">{lang === 'ro' ? 'Nu a fost găsit niciun produs' : 'No products found'}</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div key={p.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between min-h-[350px] hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-500/5">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl font-mono text-[10px] text-emerald-400 uppercase font-black tracking-widest shadow-inner">{p.category || (lang === 'ro' ? 'ACTIV' : 'ASSET')}</div>  
                  <div className="flex gap-2">
                    <button disabled={isSubmitting} onClick={() => openModal('put', p)} className="group/btn relative p-2.5 bg-slate-950 text-sky-500 hover:bg-sky-500 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"><Edit size={14}/><span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-sky-400 border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">{lang === 'ro' ? 'Sincronizare completă (PUT)' : 'Full sync (PUT)'}</span></button>
                    <button disabled={isSubmitting} onClick={() => openModal('patch', p)} className="group/btn relative p-2.5 bg-slate-950 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"><Zap size={14}/><span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-emerald-400 border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">{lang === 'ro' ? 'Patch rapid' : 'Quick patch'}</span></button>
                    <button disabled={isSubmitting} onClick={() => openModal('delete', p)} className="group/btn relative p-2.5 bg-slate-950 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"><Trash2 size={14}/><span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-red-400 border border-slate-800 rounded text-[9px] font-black uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">{lang === 'ro' ? 'Șterge' : 'Delete'}</span></button>
                  </div>
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-emerald-400 transition-colors leading-[0.9] break-words line-clamp-2 min-h-[4.5rem]">{p.name}</h3>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 tracking-widest uppercase mb-2"><Tag size={10} className="text-emerald-600" /> SKU: {p.sku}</div>
                <p className="text-xs text-slate-400/90 italic line-clamp-2 mb-4 h-8 leading-tight font-medium break-words">{p.description || (lang === 'ro' ? 'Nu a fost oferită o descriere.' : 'No system description provided.')}</p>
                <div className="mb-5 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-bold truncate"><User size={12} className="text-emerald-500 shrink-0" /><span className="truncate uppercase line-clamp-1 break-all">{suppliers.find(s => s.id === p.supplier_id)?.name || (lang === 'ro' ? 'NEVERIFICAT' : 'UNVERIFIED')}</span></div>
                  <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-0.5 shrink-0"><span className="font-mono text-[9px] text-emerald-400 font-black tracking-widest leading-none">ID-{p.supplier_id}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80"><span className="text-[8px] text-slate-600 block uppercase font-black tracking-widest mb-0.5">{lang === 'ro' ? 'Valoare piață' : 'Market value'}</span><span className="text-lg font-black text-white leading-none">${p.price}</span></div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80"><span className="text-[8px] text-slate-600 block uppercase font-black tracking-widest mb-0.5">{lang === 'ro' ? 'Volum stoc' : 'Stock volume'}</span><span className="text-lg font-black text-white leading-none flex items-center gap-1"><Box size={12} className="text-emerald-500" /> {p.stockQuantity}</span></div>
                </div>
              </div>
              <div className="relative z-10 pt-5 border-t border-slate-800/50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate"><Warehouse size={12} className="text-emerald-500 shrink-0" /><span className="truncate italic leading-none line-clamp-1 break-all">{warehouses.find(w => w.id === p.warehouse_id)?.name || (lang === 'ro' ? 'NOD' : 'NODE')}</span></div>
                <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-2.5 py-1"><span className="font-mono text-[10px] text-emerald-400 font-black tracking-[0.2em] leading-none">ID-{p.id}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalType && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/90 p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={closeModals} />
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            {modalType === 'delete' ? (
              <div className="text-center space-y-5 py-2">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto animate-pulse" /><h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{lang === 'ro' ? 'Confirmi ștergerea?' : 'Confirm deletion?'}</h2>
                <div className="flex gap-3 max-w-xs mx-auto pt-2">
                  <button disabled={isSubmitting} onClick={closeModals} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-black uppercase text-[10px] tracking-widest cursor-pointer disabled:opacity-50">{lang === 'ro' ? 'Anulează' : 'Cancel'}</button>
                  <button disabled={isSubmitting} onClick={handleAction} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">{isSubmitting && <Loader2 size={12} className="animate-spin" />}{isSubmitting ? (lang === 'ro' ? 'SE ȘTERGE...' : 'DELETING...') : (lang === 'ro' ? 'ȘTERGE' : 'DELETE')}</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAction} className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800"><h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">{modalType === 'add' ? (lang === 'ro' ? 'Produs nou' : 'New product') : modalType === 'put' ? (lang === 'ro' ? 'Sincronizare completă (PUT)' : 'Full sync (PUT)') : (lang === 'ro' ? 'Patch rapid' : 'Quick patch')}</h2><Package size={20} className="text-emerald-500" /></div>
                {error && <div className="bg-red-500/10 text-red-500 text-[10px] font-black p-2.5 rounded-lg border border-red-500/20 flex items-center gap-2 uppercase tracking-widest"><AlertTriangle size={14}/> {error}</div>}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-emerald-500/50 transition-all relative">
                    <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">{lang === 'ro' ? 'Nume' : 'Name'}</label>
                    <input disabled={isSubmitting} maxLength={MAX_NAME} className="w-full bg-transparent text-white font-bold outline-none text-xs font-sans disabled:opacity-50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] text-slate-700">{formData.name.length}/{MAX_NAME}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 relative">
                    <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">{lang === 'ro' ? 'Furnizor' : 'Supplier_id'}</label>
                    <button disabled={isSubmitting} type="button" onClick={() => setIsSupplierSelectOpen(!isSupplierSelectOpen)} className="w-full bg-transparent text-left font-bold text-xs flex items-center justify-between outline-none cursor-pointer text-white uppercase font-sans disabled:opacity-50"><span className="truncate">{formData.supplier_id ? `ID: ${formData.supplier_id} — ${currentFormSupplierName}` : (lang === 'ro' ? 'Selectează furnizor' : 'Select supplier')}</span><ChevronDown size={12} className={`text-slate-500 transition-transform ${isSupplierSelectOpen ? 'rotate-180 text-emerald-500' : ''}`} /></button>
                    {isSupplierSelectOpen && !isSubmitting && (
                      <><div className="fixed inset-0 z-30" onClick={() => setIsSupplierSelectOpen(false)} /><div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40 max-h-40 overflow-y-auto custom-scrollbar text-[10px]">{suppliers.map(s => (<div key={s.id} onClick={() => { setFormData({...formData, supplier_id: s.id}); setIsSupplierSelectOpen(false); }} className={`px-3 py-2 cursor-pointer flex items-center justify-between border-b border-slate-900/50 last:border-none font-sans ${formData.supplier_id.toString() === s.id.toString() ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:bg-slate-900'}`}><span className="truncate">ID: {s.id} — {s.name}</span>{formData.supplier_id.toString() === s.id.toString() && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}</div>))}</div></>
                    )}
                  </div>
                  <div className={`bg-slate-950 border border-slate-800 rounded-xl p-2.5 relative ${(modalType !== 'add' || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">{lang === 'ro' ? 'Depozit' : 'Warehouse_id'}</label>
                    <button type="button" disabled={modalType !== 'add' || isSubmitting} onClick={() => setIsWarehouseSelectOpen(!isWarehouseSelectOpen)} className={`w-full bg-transparent text-left font-bold text-xs flex items-center justify-between outline-none uppercase font-sans ${(modalType !== 'add' || isSubmitting) ? 'cursor-not-allowed text-slate-600' : 'cursor-pointer text-white'}`}><span className="truncate">{formData.warehouse_id ? `ID: ${formData.warehouse_id} — ${currentFormWarehouseName}` : (lang === 'ro' ? 'Selectează depozit' : 'Select node')}</span>{modalType === 'add' && <ChevronDown size={12} className={`text-slate-500 transition-transform ${isWarehouseSelectOpen ? 'rotate-180 text-emerald-500' : ''}`} />}</button>
                    {isWarehouseSelectOpen && modalType === 'add' && !isSubmitting && (
                      <><div className="fixed inset-0 z-30" onClick={() => setIsWarehouseSelectOpen(false)} /><div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40 max-h-40 overflow-y-auto custom-scrollbar text-[10px]">{warehouses.map(w => (<div key={w.id} onClick={() => { setFormData({...formData, warehouse_id: w.id}); setIsWarehouseSelectOpen(false); }} className={`px-3 py-2 cursor-pointer flex items-center justify-between border-b border-slate-900/50 last:border-none font-sans ${formData.warehouse_id.toString() === w.id.toString() ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:bg-slate-900'}`}><span className="truncate">ID: {w.id} — {w.name}</span>{formData.warehouse_id.toString() === w.id.toString() && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}</div>))}</div></>
                    )}
                  </div>
                  <div className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus-within:border-emerald-500/50 transition-all relative">
                    <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold flex items-center gap-1 uppercase"><FileText size={10}/> {lang === 'ro' ? 'Descriere' : 'Description'}</label>
                    <textarea disabled={isSubmitting} maxLength={MAX_DESC} rows="2" className="w-full bg-transparent text-slate-300 font-medium outline-none resize-none text-xs font-sans disabled:opacity-50" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] text-slate-700">{formData.description.length}/{MAX_DESC}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 relative focus-within:border-emerald-500/50 transition-all">
                    <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">SKU</label>
                    <input disabled={isSubmitting} maxLength={MAX_SKU} className="w-full bg-transparent text-white font-bold outline-none uppercase text-xs disabled:opacity-50" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] text-slate-700">{formData.sku.length}/{MAX_SKU}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 relative focus-within:border-emerald-500/50 transition-all">
                    <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">{lang === 'ro' ? 'Categorie' : 'Category'}</label>
                    <input disabled={isSubmitting} maxLength={MAX_CAT} className="w-full bg-transparent text-white font-bold outline-none uppercase text-xs font-sans disabled:opacity-50" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                    <span className="absolute right-3 top-3 text-[8px] text-slate-700">{formData.category.length}/{MAX_CAT}</span>
                  </div>
                  <div className={`bg-slate-950 border border-slate-800 rounded-xl p-2.5 relative focus-within:border-emerald-500/50 transition-all ${modalType === 'add' ? '' : 'col-span-2'}`}>
                    <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">{lang === 'ro' ? 'Preț' : 'Price'}</label>
                    <input disabled={isSubmitting} type="number" step="0.01" className="w-full bg-transparent text-white font-bold outline-none no-spinner text-xs disabled:opacity-50" value={formData.price} onChange={(e) => { if(e.target.value.length <= MAX_PRICE_LEN) setFormData({...formData, price: e.target.value})}} />
                    <span className="absolute right-3 top-3 text-[8px] text-slate-700">{formData.price.length}/{MAX_PRICE_LEN}</span>
                  </div>
                  {modalType === 'add' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 relative">
                      <label className="text-[9px] text-slate-500 block mb-1 tracking-wider font-bold uppercase">{lang === 'ro' ? 'Cantitate stoc' : 'Stock quantity'}</label>
                      <input disabled={isSubmitting} type="number" className="w-full bg-transparent text-white font-bold outline-none no-spinner text-xs disabled:opacity-50" value={formData.stockQuantity} onChange={(e) => { if(e.target.value.length <= MAX_STOCK_LEN) setFormData({...formData, stockQuantity: e.target.value})}} />
                      <span className="absolute right-3 top-3 text-[8px] text-slate-700">{formData.stockQuantity.length}/{MAX_STOCK_LEN}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-3 font-sans">
                  <button disabled={isSubmitting} type="button" onClick={closeModals} className="flex-1 py-3 text-slate-500 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-white transition-colors disabled:opacity-50">{lang === 'ro' ? 'Anulează' : 'Cancel'}</button>
                  <button disabled={isSubmitting} type="submit" className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}>{isSubmitting && <Loader2 size={12} className="animate-spin" />}{isSubmitting ? (lang === 'ro' ? 'SE PROCESEAZĂ...' : 'PROCESSING...') : (lang === 'ro' ? 'CONFIRMĂ' : 'CONFIRM')}</button>
                </div>
              </form>
            )}
          </div>
        </div>, document.body
      )}
      <style>{`.no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }.no-spinner { -moz-appearance: textfield; }.custom-scrollbar::-webkit-scrollbar { width: 4px; }.custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }`}</style>
    </div>
  );
}