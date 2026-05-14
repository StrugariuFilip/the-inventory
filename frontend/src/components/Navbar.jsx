import React from 'react';
import * as LucideIcons from 'lucide-react';
const { Package, Truck, Home, ArrowLeftRight } = LucideIcons;

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'warehouses', name: 'WAREHOUSES', icon: Home },
    { id: 'suppliers', name: 'SUPPLIERS', icon: Truck },
    { id: 'products', name: 'PRODUCTS', icon: Package },
    { id: 'stock', name: 'STOCK', icon: ArrowLeftRight },
  ];

  const GitHubLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full backdrop-blur-lg bg-slate-950/80 border-b border-slate-800/50 shadow-2xl shadow-indigo-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <button 
            onClick={() => setActiveTab('intro')}
            className="flex items-center space-x-3 group cursor-pointer transition-all active:scale-95 border-none bg-transparent outline-none"
          >
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all duration-300 group-hover:rotate-6">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <span className="block font-black text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
                THE INVENTORY
              </span>
              <span className="block text-[10px] font-black text-indigo-400 tracking-[0.25em] uppercase leading-none mt-0.5 group-hover:text-white transition-colors duration-300">
                By Strugariu Filip
              </span>
            </div>
          </button>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer text-sm font-bold
                      ${isActive 
                        ? 'bg-slate-900/60 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)] scale-105' 
                        : 'bg-slate-900/40 border-sky-500/20 text-slate-400 hover:border-sky-400 hover:text-white hover:shadow-[0_0_12px_rgba(56,189,248,0.15)] hover:scale-105'}
                    `}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-sky-400' : 'group-hover:text-sky-300'}`} />
                    <span className="hidden md:inline-block tracking-tight">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
            
            <a 
              href="https://github.com/StrugariuFilip/the-inventory" 
              target="_blank" 
              rel="noreferrer"
              className="relative group block p-2.5 rounded-xl bg-slate-900/40 border border-sky-500/20 hover:border-sky-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)] transition-all duration-300 hover:scale-110 cursor-pointer"
              title="View on GitHub"
            >
              <GitHubLogo className="h-5 w-5 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </a>
          </div>
          
        </div>
      </div>
    </header>
  );
}