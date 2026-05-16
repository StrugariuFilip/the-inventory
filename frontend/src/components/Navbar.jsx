import React, { useState, useEffect } from 'react';
import { Package, Truck, Home, ArrowLeftRight, Menu, X, Globe } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, lang = 'ro', setLang }) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'warehouses', name: lang === 'ro' ? 'Depozite' : 'Warehouses', icon: Home },
    { id: 'suppliers', name: lang === 'ro' ? 'Furnizori' : 'Suppliers', icon: Truck },
    { id: 'products', name: lang === 'ro' ? 'Produse' : 'Products', icon: Package },
    { id: 'stock', name: lang === 'ro' ? 'Stocuri' : 'Stock', icon: ArrowLeftRight },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const GitHubLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );

  const toggleLang = () => {
    if (setLang) {
      setLang(lang === 'ro' ? 'en' : 'ro');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-sky-500/10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full">
          
          <button 
            onClick={() => { setActiveTab('intro'); setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer active:scale-95 transition-all border-none bg-transparent outline-none flex-shrink min-w-0"
          >
            <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:rotate-6 transition-all duration-300 shrink-0">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="text-left overflow-hidden min-w-0">
              <span className="block font-black text-xs sm:text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors uppercase leading-none truncate">
                THE INVENTORY
              </span>
              <span className="block text-[7px] sm:text-[10px] font-black text-indigo-400 tracking-[0.15em] sm:tracking-[0.25em] uppercase leading-none mt-1 group-hover:text-white transition-colors duration-300 truncate font-sans">
                By Strugariu Filip
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center space-x-4 shrink-0">
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer text-sm font-bold ${isActive ? 'bg-slate-900/60 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)] scale-105' : 'bg-slate-900/40 border-sky-500/20 text-slate-400 hover:border-sky-400 hover:text-white hover:shadow-[0_0_12px_rgba(56,189,248,0.15)] hover:scale-105'}`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-sky-400' : 'group-hover:text-sky-300'}`} />
                    <span className="tracking-tight">{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="w-px h-8 bg-slate-800 mx-2"></div>

            <button 
              onClick={toggleLang}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/40 border border-sky-500/20 text-xs font-black text-sky-400 hover:border-sky-400 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer uppercase tracking-widest min-w-[65px] justify-center select-none"
            >
              <Globe className="h-3.5 w-3.5 text-sky-400 group-hover:text-white" />
              <span>{lang === 'ro' ? 'RO' : 'EN'}</span>
            </button>

            <a href="https://github.com/StrugariuFilip/the-inventory" target="_blank" rel="noreferrer" className="relative group block p-2.5 rounded-xl bg-slate-900/40 border border-sky-500/20 hover:border-sky-400 hover:text-white transition-all cursor-pointer">
              <GitHubLogo className="h-5 w-5 text-sky-400 group-hover:text-white" />
            </a>
          </div>

          <div className="xl:hidden flex items-center shrink-0 ml-2 gap-3">
            <button 
              onClick={toggleLang}
              className="flex items-center space-x-1.5 hover:cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-900/40 border border-sky-500/20 text-xs font-black hover:border-sky-400 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer  text-sky-400 uppercase tracking-wider min-w-[55px] justify-center select-none"
            >
              <Globe className="h-3.5 w-3.5 text-sky-400 group-hover:text-white" />
              <span>{lang === 'ro' ? 'RO' : 'EN'}</span>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-sky-400 hover:text-white transition-colors cursor-pointer">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-slate-950/98 border-b border-sky-500/20 backdrop-blur-2xl animate-in slide-in-from-top duration-300 h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsOpen(false); }} className={`group flex items-center space-x-4 px-6 py-5 rounded-xl border transition-all duration-300 cursor-pointer ${isActive ? 'bg-slate-900 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]' : 'bg-slate-900/40 border-sky-500/10 text-slate-400 hover:border-sky-400/50 hover:bg-slate-900/80 hover:text-white hover:translate-x-2'}`}>
                  <Icon size={20} className={`${isActive ? 'text-sky-400' : 'group-hover:text-sky-400 transition-colors'}`} />
                  <span className="font-bold text-base tracking-widest uppercase">{tab.name}</span>
                </button>
              );
            })}
            <a href="https://github.com/StrugariuFilip/the-inventory" target="_blank" rel="noreferrer" className="flex items-center space-x-4 px-6 py-5 rounded-xl bg-slate-900/40 border border-sky-500/10 text-sky-400 font-bold hover:bg-slate-900/80 hover:border-sky-400 transition-all duration-300">
              <GitHubLogo className="h-6 w-6" />
              <span className="text-base tracking-widest uppercase font-sans">{lang === 'ro' ? 'Cod sursă (GitHub)' : 'GitHub repository'}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}