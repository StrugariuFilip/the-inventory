import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { 
  Database, Share2, Terminal, ArrowRight, Key, Link2, Truck, 
  Package, Warehouse, ShieldCheck, Activity, Layers, Globe, 
  Cpu, Zap, Boxes, Layout, Code2
} from 'lucide-react';
import Products from './components/Products';
import Warehouses from './components/Warehouses';
import Suppliers from './components/Suppliers';
import Stock from './components/Stock';

export default function App() {
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
              <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-slate-900/50 border border-indigo-500/20 mb-8 shadow-[0_0_20px_rgba(79,70,229,0.1)] backdrop-blur-md">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">ASSIST Learning Platform Project</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[1.1] text-center">
                The <br />
                <span className="relative inline-block bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent py-2 pr-10">Inventory</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-12 italic">Advanced logistics tracking with FastAPI, React, and PostgreSQL.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
                <button onClick={() => setActiveTab('warehouses')} className="group hover:cursor-pointer w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-base hover:bg-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
                  <span>ACCESS CONSOLE</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <a href="https://the-inventory-v520.onrender.com/docs" target="_blank" rel="noreferrer" className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-400 font-bold text-base backdrop-blur-sm transition-all duration-300 shadow-lg">
                  <Terminal className="h-5 w-5 text-sky-400" />
                  <span>API SCHEMATICS</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-4">
              <div className="space-y-6">
                <h3 className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs">Motivation</h3>
                <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">Learning Full-Stack <br /> <span className="text-slate-500">Step by Step</span></h2>
                <p className="text-slate-400 leading-relaxed text-justify font-medium">
                  I chose this topic to learn how to manage a real database through an API and to understand how to develop a Full-Stack application. The Inventory is a digital solution designed to optimize logistics workflows in medium-sized warehouses.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Relational Tables', val: '3', color: 'emerald' },
                  { label: 'Main API Routes', val: '4', color: 'sky' },
                  { label: 'Production Ready', val: 'Live', color: 'indigo' },
                  { label: 'Full-Stack Logic', val: '100%', color: 'amber' }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800 text-center">
                    <div className={`text-3xl font-black text-${stat.color}-400 mb-1`}>{stat.val}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-4">System Architecture</h2>
                <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-6" />
                <p className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.6em] font-mono">Schema Mapping & Rational Logic</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto px-4">
                <div className="group rounded-3xl bg-slate-900/40 border border-sky-500/20 overflow-hidden hover:border-sky-500/40 transition-all duration-500 shadow-2xl hover:-translate-y-2">
                  <div className="bg-sky-500/5 px-6 py-5 flex items-center justify-between border-b border-sky-500/10">
                    <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-sky-500/20 text-sky-400"><Truck size={18} /></div><span className="font-mono font-black text-xs text-sky-100 tracking-[0.2em] uppercase">Suppliers</span></div>
                  </div>
                  <div className="p-6 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-sky-400 bg-sky-500/5 p-2.5 rounded-lg border border-sky-500/10"><span className="flex items-center gap-2 font-bold"><Key size={12} /> id</span><span className="opacity-70 text-[9px] font-black uppercase tracking-widest">SERIAL, PK</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-2"><span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-2"><span>contact_email</span><span className="text-[9px] text-slate-600 font-bold italic uppercase tracking-wider text-indigo-400">Unique</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 pb-1"><span>phone_number</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                  </div>
                </div>
                <div className="group rounded-[2rem] bg-slate-900/60 border border-emerald-500/30 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 transition-all duration-500 md:-translate-y-6 scale-105 z-10">
                  <div className="bg-emerald-500/10 px-6 py-5 flex items-center justify-between border-b border-emerald-500/20">
                    <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><Package size={18} /></div><span className="font-mono font-black text-xs text-emerald-100 tracking-[0.2em] uppercase">Products</span></div>
                  </div>
                  <div className="p-6 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-emerald-400 bg-emerald-500/5 p-2.5 rounded-lg border border-sky-500/10"><span className="flex items-center gap-2 font-bold"><Key size={12} /> id</span><span className="opacity-70 text-[9px] font-black uppercase tracking-widest">SERIAL, PK</span></div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-2"><span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                    <div className="flex items-center justify-between text-slate-300 px-1 border-b border-slate-800/50 pb-2"><span>sku</span><span className="text-[9px] text-slate-600 font-bold italic uppercase tracking-wider text-indigo-400">Unique</span></div>
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
                    <div className="flex items-center justify-between text-amber-400 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20"><span className="flex items-center gap-2 font-bold"><Key size={12} /> id</span><span className="opacity-70 text-[9px] font-black uppercase tracking-widest">SERIAL, PK</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 border-b border-slate-800/50 pb-2"><span>name</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                    <div className="flex items-center justify-between text-slate-400 px-1 pb-1"><span>location</span><span className="text-[9px] text-slate-600 font-bold uppercase">VARCHAR</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Technologies & <span className="text-indigo-500">Tools</span></h2>
                <p className="text-slate-500 font-mono text-[10px] mt-2 uppercase tracking-[0.4em]">Integrated Stack for High Performance</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', color: 'text-sky-400' },
                  { name: 'FastAPI', logo: 'https://cdn.simpleicons.org/fastapi/009688', color: 'text-cyan-400' },
                  { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql/4169E1', color: 'text-indigo-400' },
                  { name: 'Swagger', logo: 'https://cdn.simpleicons.org/swagger/85EA2D', color: 'text-emerald-400' },
                  { name: 'SQLAlchemy', logo: 'https://cdn.simpleicons.org/sqlalchemy/D71F00', color: 'text-amber-500' },
                  { name: 'Pydantic', logo: 'https://cdn.simpleicons.org/pydantic/E92063', color: 'text-indigo-400' },
                  { name: 'Supabase', logo: 'https://cdn.simpleicons.org/supabase/3ECF8E', color: 'text-emerald-500' },
                  { name: 'Render', logo: 'https://cdn.simpleicons.org/render/EF4444', color: 'text-red-500' }, 
                  { name: 'React.js', logo: 'https://cdn.simpleicons.org/react/61DAFB', color: 'text-sky-400' },
                  { name: 'Tailwind', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', color: 'text-cyan-400' },
                  { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/FFFFFF', color: 'text-white' },
                  { name: 'Hostinger', logo: 'https://cdn.simpleicons.org/hostinger/673DE6', color: 'text-indigo-500' }
                ].map((tech, i) => (
                  <div key={i} className="group px-4 py-8 rounded-2xl bg-slate-900/20 border border-slate-800/50 text-center hover:bg-slate-900/50 transition-all hover:border-slate-700">
                    <img src={tech.logo} alt={`${tech.name} logo`} className="h-10 w-10 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <span className={`text-[11px] font-black uppercase tracking-widest ${tech.color}`}>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
              <div className="mb-12"><h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">REST API Architecture</h2><div className="h-1 w-12 bg-sky-500 rounded-full" /></div>
              <div className="space-y-4 font-mono text-sm">
                {[
                  { path: '/products', method: 'CRUD', desc: 'Product catalog management - SKU, name, price, stock' },
                  { path: '/warehouses', method: 'CRUD', desc: 'Warehouse administration - location and capacity' },
                  { path: '/suppliers', method: 'CRUD', desc: 'Supplier database - contact and commercial details' },
                  { path: '/inventory', method: 'POST', desc: 'Product transfer and quantity adjustment' }
                ].map((route, i) => (
                  <div key={i} className="group p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <span className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 text-[10px] font-black uppercase">{route.method}</span>
                      <span className="text-slate-200 font-bold">{route.path}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{route.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-3"><Terminal className="text-indigo-400" size={20} /> <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Backend Setup</h3></div>
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-indigo-300 space-y-2">
                  <p className="text-slate-600"># Start virtual environment</p>
                  <p>.\venv\Scripts\activate</p>
                  <p className="text-slate-600"># Install dependencies</p>
                  <p>pip install -r requirements.txt</p>
                  <p className="text-slate-600"># Start server</p>
                  <p>uvicorn app.main:app --reload</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3"><Cpu className="text-emerald-400" size={20} /> <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Frontend Setup</h3></div>
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-emerald-300 space-y-2">
                  <p className="text-slate-600"># Install Node modules</p>
                  <p>npm install</p>
                  <p className="text-slate-600"># Start dev environment</p>
                  <p>npm run dev</p>
                  <p className="text-slate-600"># Build project</p>
                  <p>npm run build</p>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Development <span className="text-amber-500">Workflow</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { 
                    id: '01', t: 'Environment Setup', 
                    d: 'Project initialization using Python and FastAPI framework for async development.', 
                    logos: ['https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', 'https://cdn.simpleicons.org/fastapi/009688'] 
                  },
                  { 
                    id: '02', t: 'Backend Dev', 
                    d: 'Integrating SQLAlchemy ORM and Pydantic validation for data integrity.', 
                    logos: ['https://cdn.simpleicons.org/sqlalchemy/D71F00', 'https://cdn.simpleicons.org/pydantic/E92063'] 
                  },
                  { 
                    id: '03', t: 'Data Management', 
                    d: 'Designing PostgreSQL schema and generating Swagger documentation.', 
                    logos: ['https://cdn.simpleicons.org/postgresql/4169E1', 'https://cdn.simpleicons.org/swagger/85EA2D'] 
                  },
                  { 
                    id: '04', t: 'React Interface', 
                    d: 'Building UI components with Tailwind CSS and REST API integration.', 
                    logos: ['https://cdn.simpleicons.org/react/61DAFB', 'https://cdn.simpleicons.org/tailwindcss/06B6D4'] 
                  },
                  { 
                    id: '05', t: 'Git & Cloud Sync', 
                    d: 'Source control via GitHub and database configuration in Supabase.', 
                    logos: ['https://cdn.simpleicons.org/github/FFFFFF', 'https://cdn.simpleicons.org/supabase/3ECF8E'] 
                  },
                  { 
                    id: '06', t: 'Cloud Launch', 
                    d: 'Final deployment on Hostinger and backend microservice on Render.', 
                    logos: ['https://cdn.simpleicons.org/hostinger/673DE6', 'https://cdn.simpleicons.org/render/EF4444'] 
                  }
                ].map((step, i) => (
                  <div key={i} className="relative p-8 rounded-3xl bg-slate-900/30 border border-slate-800 hover:border-amber-500/20 transition-all group overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-4 py-1 rounded-full bg-slate-950 border border-amber-500/50 text-amber-400 text-xs font-black font-mono">
                        {step.id}
                      </span>
                      <div className="flex gap-2">
                        {step.logos.map((logo, idx) => (
                          <img key={idx} src={logo} className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" alt="tech-logo" />
                        ))}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{step.t}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-20">
              <div className="text-center mb-16"><h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Conclusions</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { t: 'Data Modeling', d: 'Relational structure in PostgreSQL ensures zero redundancy.', icon: Boxes, color: 'indigo' },
                  { t: 'FastAPI Async', d: 'Asynchronous API with strict validation ensures data integrity.', icon: Zap, color: 'sky' },
                  { t: 'Cloud DevOps', d: 'Supabase + Render + Hostinger for a distributed environment.', icon: Globe, color: 'emerald' },
                  { t: 'Full-Stack Dev', d: 'Seamless integration between React hooks and REST endpoints.', icon: Layout, color: 'amber' }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800 flex flex-col items-center text-center">
                    <item.icon className={`text-${item.color}-400 mb-4`} size={36} />
                    <h4 className="text-xs font-black text-white uppercase mb-2 tracking-widest">{item.t}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.d}</p>
                  </div>
                ))}
              </div>
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