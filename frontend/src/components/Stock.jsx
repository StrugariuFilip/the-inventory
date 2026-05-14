import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { 
  ArrowLeftRight, AlertTriangle, CheckCircle2, ChevronDown, Zap, TrendingUp, TrendingDown, Loader2
} from 'lucide-react';

export default function Stock() {
  const [warehouses, setWarehouses] = useState([]);
  const [sourceProducts, setSourceProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState('transfer'); 
  const [sourceWarehouseId, setSourceWarehouseId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [targetWarehouseId, setTargetWarehouseId] = useState('');
  const [transferQuantity, setTransferQuantity] = useState('');
  const [isSourceWareOpen, setIsSourceWareOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isTargetWareOpen, setIsTargetWareOpen] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const API_BASE = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    axios.get(`${API_BASE}/warehouses`)
      .then(res => setWarehouses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!sourceWarehouseId) {
      setSourceProducts([]);
      setSelectedProductId('');
      return;
    }
    axios.get(`${API_BASE}/warehouses/${sourceWarehouseId}/products`)
      .then(res => setSourceProducts(res.data))
      .catch(() => setSourceProducts([]));
    setSelectedProductId('');
  }, [sourceWarehouseId]);

  const triggerToast = (msg) => {
    setToastMsg(msg); setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const currentProduct = sourceProducts.find(p => p.id.toString() === selectedProductId.toString());

  const handleQuickAdd = (amount) => {
    if (!currentProduct) return;
    if (amount === 'MAX') {
      setTransferQuantity(currentProduct.stockQuantity.toString());
      return;
    }
    const currentQty = transferQuantity === '' ? 0 : parseInt(transferQuantity, 10);
    const newQty = currentQty + amount;
    if ((mode === 'transfer' || mode === 'decrease') && newQty > currentProduct.stockQuantity) {
      setTransferQuantity(currentProduct.stockQuantity.toString());
    } else {
      setTransferQuantity(newQty.toString());
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    if (!sourceWarehouseId || !selectedProductId) {
      setError("Source facility and asset selection are required.");
      return;
    }
    if (mode === 'transfer' && !targetWarehouseId) {
      setError("Target hub is required for transfer execution.");
      return;
    }

    const qty = parseInt(transferQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError("Quantity must be a positive integer.");
      return;
    }

    if ((mode === 'transfer' || mode === 'decrease') && qty > currentProduct?.stockQuantity) {
      setError(`Insufficient stock. Available volume: ${currentProduct.stockQuantity}`);
      return;
    }

    if (mode === 'transfer' && sourceWarehouseId.toString() === targetWarehouseId.toString()) {
      setError("Source and target nodes cannot be identical.");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = `${API_BASE}/warehouses/${sourceWarehouseId}/inventory/${selectedProductId}`;
      let url = ''; let payload = {}; let successLabel = '';

      if (mode === 'transfer') {
        url = `${baseUrl}/transfer`;
        payload = { quantity: qty, targetWarehouseId: parseInt(targetWarehouseId, 10) };
        successLabel = `TRANSFER SUCCESSFUL: ${qty}x ${currentProduct.name}`;
      } else if (mode === 'increase') {
        url = `${baseUrl}/increase`;
        payload = { quantity: qty, supplierId: currentProduct.supplier_id };
        successLabel = `STOCK INCREASED: +${qty}x ${currentProduct.name}`;
      } else if (mode === 'decrease') {
        url = `${baseUrl}/decrease`;
        payload = { quantity: qty };
        successLabel = `STOCK DEDUCTED: -${qty}x ${currentProduct.name}`;
      }

      await axios.post(url, payload);
      triggerToast(successLabel);
      setTransferQuantity('');
      const res = await axios.get(`${API_BASE}/warehouses/${sourceWarehouseId}/products`);
      setSourceProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Transaction failed. Verify database integrity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceWareName = warehouses.find(w => w.id.toString() === sourceWarehouseId.toString())?.name || 'SELECT SOURCE';
  const targetWareName = warehouses.find(w => w.id.toString() === targetWarehouseId.toString())?.name || 'SELECT TARGET';

  const inputQty = transferQuantity === '' ? 0 : parseInt(transferQuantity, 10);
  const calculatedStock = mode === 'increase' 
    ? (currentProduct ? currentProduct.stockQuantity + inputQty : 0)
    : (currentProduct ? Math.max(0, currentProduct.stockQuantity - inputQty) : 0);

  return (
    <div className="animate-fade-in space-y-10 relative pb-16 text-slate-100 font-sans">
      {showToast && ReactDOM.createPortal(
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[99999] animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3 border backdrop-blur-xl bg-emerald-500/90 text-slate-950 border-emerald-400">
            <CheckCircle2 size={18} />
            {toastMsg}
          </div>
        </div>, document.body
      )}

     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-30">
        <div className="flex items-center space-x-4 justify-center lg:justify-start w-full lg:w-auto text-center lg:text-left">
          <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 shadow-lg shrink-0">
            <ArrowLeftRight className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter leading-none whitespace-normal lg:whitespace-nowrap">
              Stock Transfer Console
            </h2>
            <p className="text-[10px] sm:text-xs font-mono text-indigo-400/80 tracking-widest uppercase mt-1">
              SECURE INTER-FACILITY ROUTING
            </p>
          </div>
        </div>
        <div className="flex justify-center w-full lg:w-auto">
          <div className="flex items-center bg-slate-950 border border-slate-800/80 p-1.5 rounded-2xl shadow-inner overflow-x-auto max-w-full no-scrollbar">
            {[
              { id: 'transfer', label: 'TRANSFER', icon: ArrowLeftRight },
              { id: 'increase', label: 'INCREASE', icon: TrendingUp },
              { id: 'decrease', label: 'DECREASE', icon: TrendingDown },
            ].map((t) => {
              const Icon = t.icon;
              const active = mode === t.id;
              return (
                <button 
                  key={t.id} 
                  type="button" 
                  onClick={() => { if(!isSubmitting){setMode(t.id); setTransferQuantity(''); setError('');} }} 
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap ${active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Icon size={12} className={active ? 'text-indigo-400' : 'text-slate-600'} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase p-3 rounded-xl tracking-widest flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch pt-2">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative backdrop-blur-sm shadow-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-slate-950 border border-slate-800 rounded-full font-mono text-[9px] text-indigo-400 font-black tracking-widest uppercase shadow-md">SOURCE HUB</div>
          <div className="space-y-5 mt-2">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 relative">
              <label className="text-[9px] text-slate-500 block mb-1 font-bold tracking-wider font-mono uppercase">FROM WAREHOUSE</label>
              <button disabled={isSubmitting} type="button" onClick={() => setIsSourceWareOpen(!isSourceWareOpen)} className="w-full bg-transparent text-left font-bold text-xs flex items-center justify-between outline-none cursor-pointer text-white uppercase font-sans disabled:opacity-50">
                <span className="truncate">{sourceWarehouseId ? `ID: ${sourceWarehouseId} — ${sourceWareName}` : 'SELECT FACILITY'}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isSourceWareOpen ? 'rotate-180 text-indigo-500' : ''}`} />
              </button>
              {isSourceWareOpen && (
                <><div className="fixed inset-0 z-30" onClick={() => setIsSourceWareOpen(false)} /><div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40 max-h-40 overflow-y-auto text-[10px]">{warehouses.map(w => (<div key={w.id} onClick={() => { setSourceWarehouseId(w.id); if(targetWarehouseId === w.id.toString()) setTargetWarehouseId(''); setIsSourceWareOpen(false); }} className={`px-3 py-2.5 cursor-pointer flex items-center justify-between border-b border-slate-900/50 last:border-none font-sans ${sourceWarehouseId.toString() === w.id.toString() ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-900'}`}><span className="truncate">ID: {w.id} — {w.name}</span></div>))}</div></>
              )}
            </div>
            <div className={`bg-slate-950 border border-slate-800 rounded-xl p-3 relative ${(!sourceWarehouseId || isSubmitting) ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-[9px] text-slate-500 block mb-1 font-bold tracking-wider font-mono uppercase">SELECT ASSET</label>
              <button disabled={isSubmitting} type="button" onClick={() => setIsProductOpen(!isProductOpen)} className="w-full bg-transparent text-left font-bold text-xs flex items-center justify-between outline-none cursor-pointer text-white uppercase font-sans">
                <span className="truncate">{currentProduct ? `${currentProduct.name} (SKU: ${currentProduct.sku})` : sourceProducts.length === 0 ? 'NO ASSETS AVAILABLE' : 'CHOOSE PRODUCT'}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProductOpen ? 'rotate-180 text-indigo-500' : ''}`} />
              </button>
              {isProductOpen && sourceProducts.length > 0 && (
                <><div className="fixed inset-0 z-30" onClick={() => setIsProductOpen(false)} /><div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40 max-h-48 overflow-y-auto text-[10px]">{sourceProducts.map(p => (<div key={p.id} onClick={() => { setSelectedProductId(p.id); setTransferQuantity(''); setIsProductOpen(false); }} className={`px-3 py-2 cursor-pointer flex justify-between items-center border-b border-slate-900/50 last:border-none font-sans ${selectedProductId.toString() === p.id.toString() ? 'bg-indigo-500/10' : 'hover:bg-slate-900'}`}><span className="truncate font-bold text-white uppercase">{p.name}</span><span className="text-[9px] font-mono text-indigo-400 font-bold shrink-0">QTY: {p.stockQuantity}</span></div>))}</div></>
              )}
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-slate-800/60 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/40 text-center">
            <span className="text-[8px] font-mono text-slate-600 block uppercase tracking-widest mb-1 font-bold">AVAILABLE STOCK VOLUME</span>
            <span className={`text-3xl font-black font-mono leading-none ${currentProduct ? 'text-white' : 'text-slate-700'}`}>{currentProduct ? currentProduct.stockQuantity : '0'}</span>
            <span className="text-[9px] font-bold text-indigo-500/80 uppercase block mt-1">UNITS VERIFIED</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative backdrop-blur-sm shadow-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-slate-950 border border-slate-800 rounded-full font-mono text-[9px] text-emerald-400 font-black tracking-widest uppercase shadow-md">TRADE QUANTITY</div>
          <div className="flex flex-col items-center justify-center h-full space-y-6 my-auto">
            <div className="w-full text-center">
              <label className="text-[9px] text-slate-500 block mb-2 font-bold tracking-wider font-mono uppercase">ENTER AMOUNT</label>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 focus-within:border-emerald-500/50 transition-all max-w-xs mx-auto">
                <input disabled={isSubmitting} type="number" placeholder="0" className="w-full bg-transparent text-center text-4xl font-black font-mono text-white outline-none no-spinner placeholder:text-slate-800 disabled:opacity-50" value={transferQuantity} onChange={(e) => setTransferQuantity(e.target.value)} />
              </div>
            </div>
            <div className="w-full max-w-xs">
              <span className="text-[8px] font-mono text-slate-600 block text-center uppercase tracking-widest mb-2 font-bold">QUICK INVENTORY STACK</span>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 'MAX'].map((val) => {
                  let displayLabel = val;
                  if (typeof val === 'number') { displayLabel = mode === 'decrease' ? `-${val}` : `+${val}`; }
                  return (<button key={val} disabled={isSubmitting} type="button" onClick={() => handleQuickAdd(val)} className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-xl font-mono text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-30">{displayLabel}</button>);
                })}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/50 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 uppercase"><Zap size={12} className="text-emerald-500" /><span>INSTANT PIPELINE ROUTING</span></div>
        </div>
              
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative backdrop-blur-sm shadow-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-slate-950 border border-slate-800 rounded-full font-mono text-[9px] text-amber-500 font-black tracking-widest uppercase shadow-md">{mode === 'transfer' ? 'TARGET HUB' : 'EXECUTION HUB'}</div>
          {mode === 'transfer' ? (
            <div className="space-y-5 mt-2">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 relative">
                <label className="text-[9px] text-slate-500 block mb-1 font-bold tracking-wider font-mono uppercase">DESTINATION WAREHOUSE</label>
                <button disabled={isSubmitting} type="button" onClick={() => setIsTargetWareOpen(!isTargetWareOpen)} className="w-full bg-transparent text-left font-bold text-xs flex items-center justify-between outline-none cursor-pointer text-white uppercase font-sans disabled:opacity-50">
                  <span className="truncate">{targetWarehouseId ? `ID: ${targetWarehouseId} — ${targetWareName}` : 'SELECT DESTINATION'}</span>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isTargetWareOpen ? 'rotate-180 text-amber-500' : ''}`} />
                </button>
                {isTargetWareOpen && (
                  <><div className="fixed inset-0 z-30" onClick={() => setIsTargetWareOpen(false)} /><div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40 max-h-40 overflow-y-auto text-[10px]">{warehouses.map(w => { const isDisabled = w.id.toString() === sourceWarehouseId.toString(); return (<div key={w.id} onClick={() => { if(isDisabled) return; setTargetWarehouseId(w.id); setIsTargetWareOpen(false); }} className={`px-3 py-2.5 flex items-center justify-between border-b border-slate-900/50 last:border-none font-sans ${isDisabled ? 'opacity-30 cursor-not-allowed text-slate-600' : 'cursor-pointer text-slate-300 hover:bg-slate-900'}`}><span className="truncate">ID: {w.id} — {w.name}</span></div>); })}</div></>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center h-full space-y-4 my-auto text-center">
              <span className="text-[9px] font-mono font-bold text-slate-500 tracking-widest block uppercase">OPERATION PREVIEW</span>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center gap-4">
                <div className="text-right"><span className="text-[8px] text-slate-600 block uppercase font-mono">CURRENT</span><span className="text-xl font-black font-mono text-slate-400">{currentProduct ? currentProduct.stockQuantity : 0}</span></div>
                <ArrowLeftRight size={16} className="text-slate-600 shrink-0" />
                <div className="text-left"><span className="text-[8px] text-indigo-400 block uppercase font-mono font-bold">CALCULATED</span><span className={`text-xl font-black font-mono ${mode === 'increase' ? 'text-emerald-400' : 'text-amber-400'}`}>{calculatedStock}</span></div>
              </div>
              <p className="text-[10px] text-slate-500 italic">{mode === 'increase' ? 'Units will be added to source facility.' : 'Units will be deducted permanently.'}</p>
            </div>
          )}
          <div className="mt-auto pt-6">
            <button disabled={isSubmitting} type="submit" className={`w-full py-4 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-white/10 ${isSubmitting ? 'bg-slate-800' : mode === 'transfer' ? 'bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500' : mode === 'increase' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? 'PROCESSING...' : mode === 'transfer' ? 'EXECUTE TRANSFER' : mode === 'increase' ? 'COMMIT INCREASE' : 'COMMIT DECREASE'}
            </button>
          </div>
        </div>
      </form>
      <style>{`.no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }.no-spinner { -moz-appearance: textfield; }`}</style>
    </div>
  );
}