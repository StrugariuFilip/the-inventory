import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import * as LucideIcons from 'lucide-react';
import Products from './components/Products'; 
import Warehouses from './components/Warehouses'; 
import Suppliers from './components/Suppliers'; 
import Stock from './components/Stock'; 

const { 
  Database, Code2, Share2, Terminal, 
  ArrowRight, Key, Link2, Truck, 
  Package2, Warehouse, ShieldCheck 
} = LucideIcons;

function App() {
  const [activeTab, setActiveTab] = useState('intro');


  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  const GitHubLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-sky-500 selection:text-white overflow-x-hidden flex flex-col">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full flex-grow">
        {activeTab === 'intro' ? (
          <div className="animate-fade-in space-y-24">
            
            <div className="flex flex-col items-center justify-center text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  ASSIST Learning Platform Project
                </span>
              </div>

              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                THE <br />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  INVENTORY
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed">
                An Inventory Management Microservice designed to keep track of products, stock levels, warehouses, suppliers, and inventory movements. Built with <strong>FastAPI</strong> and <strong>React</strong> within the <strong>ASSIST Software</strong> framework.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('warehouses')}
                  className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-5 rounded-2xl bg-white text-slate-950 font-bold text-lg hover:bg-slate-200 transition-all duration-300 shadow-xl shadow-white/5 cursor-pointer"
                >
                  <span>Enter Management Console</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold text-lg transition-all cursor-pointer"
                >
                  <Terminal className="h-5 w-5 text-sky-400" />
                  <span>API Documentation</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'PostgreSQL Engine', desc: 'Robust relational schema with strict foreign key constraints and ACID compliance.', icon: Database },
                { title: 'Inventory Movements', desc: 'Real-time workflows for stock-in, stock-out, and secure inter-facility transfers.', icon: Share2 },
                { title: 'Pydantic Safety', desc: 'Strict schema validation and data serialization ensuring absolute system consistency.', icon: Code2 },
                { title: 'FastAPI Microservice', desc: 'High-speed REST endpoints optimized for low latency and transactional integrity.', icon: Terminal }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur hover:border-indigo-500/50 transition-all group shadow-sm hover:shadow-indigo-500/5">
                  <f.icon className="h-8 w-8 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-slate-900/80">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase mb-2">
                  Database Architecture
                </h2>
                <p className="text-sm text-slate-500">
                  Relational PostgreSQL Schema Mapping & Data Integrity
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
            <div className="group rounded-2xl bg-slate-900/40 border border-sky-500/20 overflow-hidden hover:border-sky-500/50 transition-all duration-500 shadow-2xl">
                  <div className="bg-sky-500/10 px-4 py-4 flex items-center justify-between border-b border-sky-500/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                        <Truck className="h-4 w-4" />
                      </div>
                      <span className="font-mono font-bold text-sm text-sky-100 tracking-wider uppercase">suppliers</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-sky-400 bg-sky-500/5 p-2 rounded-lg border border-sky-500/10">
                      <span className="flex items-center gap-2 font-bold"><Key className="h-3 w-3" /> id</span>
                      <span className="opacity-70 text-[9px] font-black uppercase">SERIAL, PK</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-1.5">
                      <span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-1.5 group/row">
                      <span className="flex items-center gap-1.5">
                        contact_email 
                        <span className="text-[8px] bg-indigo-500/20 text-indigo-300 px-1 rounded font-black border border-indigo-500/20">*</span>
                      </span>
                      <span className="text-[9px] text-slate-600 font-bold italic uppercase">Unique</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 px-1 pb-0.5">
                      <span>phone_number</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl bg-slate-900/60 border border-emerald-500/30 overflow-hidden shadow-2xl hover:border-emerald-500/60 transition-all duration-500 md:-translate-y-4 scale-105 z-10">
                  <div className="bg-emerald-500/10 px-4 py-4 flex items-center justify-between border-b border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Package2 className="h-4 w-4" />
                      </div>
                      <span className="font-mono font-bold text-sm text-emerald-100 tracking-wider uppercase">products</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                      <span className="flex items-center gap-2 font-bold"><Key className="h-3 w-3" /> id</span>
                      <span className="opacity-70 text-[9px] font-black uppercase">SERIAL, PK</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-1.5">
                      <span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-1.5 group/row">
                      <span className="flex items-center gap-1.5">
                        sku 
                        <span className="text-[8px] bg-indigo-500/20 text-indigo-300 px-1 rounded font-black border border-indigo-500/20">*</span>
                      </span>
                      <span className="text-[9px] text-slate-600 font-bold italic uppercase">Unique</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-1.5">
                      <span>price</span><span className="text-[9px] text-slate-600 font-bold uppercase">DECIMAL</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-1.5">
                      <span>stockQuantity</span><span className="text-[9px] text-slate-600 font-bold uppercase">INT</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-amber-400 bg-amber-500/5 p-2 rounded-lg border border-amber-500/20 group-hover:bg-amber-500/10 transition-colors cursor-help">
                      <span className="flex items-center gap-2 font-bold"><Link2 className="h-3 w-3" /> warehouse_id</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">FK</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-400 bg-sky-500/5 p-2 rounded-lg border border-sky-500/20 group-hover:bg-sky-500/10 transition-colors cursor-help">
                      <span className="flex items-center gap-2 font-bold"><Link2 className="h-3 w-3" /> supplier_id</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">FK</span>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl bg-slate-900/40 border border-amber-500/20 overflow-hidden hover:border-amber-500/50 transition-all duration-500 shadow-2xl">
                  <div className="bg-amber-500/10 px-4 py-4 flex items-center justify-between border-b border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                        <Warehouse className="h-4 w-4" />
                      </div>
                      <span className="font-mono font-bold text-sm text-amber-100 tracking-wider uppercase">warehouses</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-amber-400 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                      <span className="flex items-center gap-2 font-bold"><Key className="h-3 w-3" /> id</span>
                      <span className="opacity-70 text-[9px] font-black uppercase">SERIAL, PK</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-1.5">
                      <span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 px-1 last:border-0 pb-0.5">
                      <span>location</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          
          <div className="bg-slate-900/80 rounded-[2.5rem] border border-slate-800 shadow-2xl p-6 sm:p-10 backdrop-blur-xl animate-fade-in min-h-[600px]">
             {activeTab === 'products' ? (
                <Products />
             ) : activeTab === 'warehouses' ? (
                <Warehouses />
             ) : activeTab === 'suppliers' ? (
                <Suppliers />
             ) : activeTab === 'stock' ? (
                <Stock /> 
             ) : (
                <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center">
                   <GitHubLogo className="h-12 w-12 text-slate-700 mb-4 animate-pulse" />
                   <p className="text-slate-500 font-medium italic">Navigating to secure module...</p>
                </div>
             )}
          </div>
        )}
      </main>

      <Footer />

    </div>
  );
}

export default App;