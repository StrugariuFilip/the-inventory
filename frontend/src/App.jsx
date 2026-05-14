import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import * as LucideIcons from 'lucide-react';
import Products from './components/Products';
import Warehouses from './components/Warehouses';
import Suppliers from './components/Suppliers';
import Stock from './components/Stock';

const { Database, Share2, Terminal, ArrowRight, Key, Link2, Truck, Package2, Warehouse, ShieldCheck, Activity, FileText } = LucideIcons;

function App() {
  const [activeTab, setActiveTab] = useState('intro');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full overflow-hidden">
        {activeTab === 'intro' ? (
          <div className="animate-fade-in space-y-32">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-slate-900/50 border border-indigo-500/20 mb-8 shadow-[0_0_20px_rgba(79,70,229,0.1)] backdrop-blur-md hover:border-indigo-500/40 transition-colors">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">ASSIST Learning Platform Project</span>
              </div>
              <div className="w-full flex justify-center py-2 overflow-visible">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[1.1] text-center">
                  The <br />
                  <span className="relative inline-block bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl py-2 pr-10 sm:pr-14">Inventory</span>
                </h1>
              </div>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium">An Inventory Management Microservice designed to keep track of products, stock levels, warehouses, and suppliers. Built with <span className="text-indigo-400 font-bold">FastAPI</span> and <span className="text-sky-400 font-bold">React</span>.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
                <button onClick={() => setActiveTab('warehouses')} className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-base hover:cursor-pointer hover:bg-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
                  <span>ACCESS CONSOLE</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="flex flex-col gap-3">
                  <a href="https://the-inventory-v520.onrender.com/docs" target="_blank" rel="noreferrer" className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900/90 text-slate-300 hover:text-sky-400 font-bold text-base backdrop-blur-sm transition-all duration-300 shadow-lg">
                    <Terminal className="h-5 w-5 text-sky-400 group-hover:rotate-12 transition-transform" />
                    <span>API SCHEMATICS</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-4 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">System Architecture</h2>
                <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-6" />
                <p className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.6em] font-mono">Schema Mapping & Relational Logic</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto px-4">
                <div className="group rounded-3xl bg-slate-900/40 border border-sky-500/20 overflow-hidden hover:border-sky-500/40 transition-all duration-500 shadow-2xl hover:-translate-y-2">
                  <div className="bg-sky-500/5 px-6 py-5 flex items-center justify-between border-b border-sky-500/10">
                    <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-sky-500/20 text-sky-400"><Truck size={18} /></div><span className="font-mono font-black text-xs text-sky-100 tracking-[0.2em] uppercase">Suppliers</span></div>
                  </div>
                  <div className="p-6 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-sky-400 bg-sky-500/5 p-2.5 rounded-lg border border-sky-500/10"><span className="flex items-center gap-2 font-bold"><Key size={12} /> id</span><span className="opacity-70 text-[9px] font-black uppercase tracking-widest">SERIAL, PK</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-2"><span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-2"><span className="flex items-center gap-1.5">contact_email <span className="text-indigo-400">*</span></span><span className="text-[9px] text-slate-600 font-bold italic uppercase tracking-wider">Unique</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 pb-1"><span>phone_number</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                  </div>
                </div>
                <div className="group rounded-[2rem] bg-slate-900/60 border border-emerald-500/30 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 transition-all duration-500 md:-translate-y-6 scale-105 z-10">
                  <div className="bg-emerald-500/10 px-6 py-5 flex items-center justify-between border-b border-emerald-500/20">
                    <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><Package2 size={18} /></div><span className="font-mono font-black text-xs text-emerald-100 tracking-[0.2em] uppercase">Products</span></div>
                  </div>
                  <div className="p-6 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-emerald-400 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10"><span className="flex items-center gap-2 font-bold"><Key size={12} /> id</span><span className="opacity-70 text-[9px] font-black uppercase tracking-widest">SERIAL, PK</span></div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-2"><span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-2"><span className="flex items-center gap-1.5">sku <span className="text-indigo-400">*</span></span><span className="text-[9px] text-slate-600 font-bold italic uppercase tracking-wider">Unique</span></div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-2"><span>price</span><span className="text-[9px] text-slate-600 font-bold uppercase">DECIMAL</span></div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-2"><span>stockQuantity</span><span className="text-[9px] text-slate-600 font-bold uppercase">INT</span></div>
                    <div className="flex items-center justify-between text-amber-400 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20"><span className="flex items-center gap-2 font-bold"><Link2 size={12} /> warehouse_id</span><span className="text-[9px] font-black uppercase tracking-widest">FK</span></div>
                    <div className="flex items-center justify-between text-sky-400 bg-sky-500/5 p-2.5 rounded-lg border border-sky-500/20"><span className="flex items-center gap-2 font-bold"><Link2 size={12} /> supplier_id</span><span className="text-[9px] font-black uppercase tracking-widest">FK</span></div>
                  </div>
                </div>
                <div className="group rounded-3xl bg-slate-900/40 border border-amber-500/20 overflow-hidden hover:border-amber-500/40 transition-all duration-500 shadow-2xl hover:-translate-y-2">
                  <div className="bg-amber-500/5 px-6 py-5 flex items-center justify-between border-b border-amber-500/10">
                    <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><Warehouse size={18} /></div><span className="font-mono font-black text-xs text-amber-100 tracking-[0.2em] uppercase">Warehouses</span></div>
                  </div>
                  <div className="p-6 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-amber-400 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10"><span className="flex items-center gap-2 font-bold"><Key size={12} /> id</span><span className="opacity-70 text-[9px] font-black uppercase tracking-widest">SERIAL, PK</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-2"><span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 last:border-0 pb-1"><span>location</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              {[
                { title: 'PostgreSQL Engine', desc: 'Robust relational schema with strict foreign key constraints.', icon: Database },
                { title: 'Inventory Movements', desc: 'Real-time workflows for stock-in, stock-out, and transfers.', icon: Share2 },
                { title: 'Pydantic Safety', desc: 'Strict schema validation ensuring absolute system consistency.', icon: ShieldCheck },
                { title: 'FastAPI Microservice', desc: 'High-speed REST endpoints optimized for low latency.', icon: Activity }
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 backdrop-blur-xl hover:border-indigo-500/40 transition-all group shadow-2xl">
                  <div className="p-3 bg-slate-950 w-fit rounded-xl border border-slate-800 mb-5 group-hover:border-indigo-500/30 transition-colors">
                    <f.icon className="h-6 w-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/80 rounded-[2.5rem] border border-slate-800 shadow-2xl p-6 sm:p-10 backdrop-blur-xl animate-fade-in min-h-[600px] relative">
             {activeTab === 'products' ? <Products /> : activeTab === 'warehouses' ? <Warehouses /> : activeTab === 'suppliers' ? <Suppliers /> : <Stock />}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;