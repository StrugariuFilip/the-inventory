import React from 'react';
import { Package, Code2, FileText } from 'lucide-react';
import customLogo from '../assets/site.png';
import assistLogo from '../assets/Assist.png';

export default function Footer({ lang = 'ro' }) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-auto relative selection:bg-pink-500 selection:text-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8">
          
          <div className="flex md:flex-1 justify-center md:justify-start items-center space-x-2.5 opacity-50 hover:opacity-100 transition-opacity w-full">
            <Package className="h-5 w-5 text-sky-400 shrink-0" />
            <span className="text-sm font-bold tracking-tighter text-white">
              THE INVENTORY v1.0
            </span>
          </div>
           <div className="flex shrink-0 flex-wrap justify-center items-center gap-x-8 gap-y-6 text-base font-semibold text-slate-400">
            
            <a 
              href="https://github.com/StrugariuFilip/the-inventory" 
              target="_blank" 
              rel="noreferrer" 
              className="group flex items-center space-x-2 hover:text-white transition-all duration-300"
            >
              <Code2 className="h-5 w-5 text-sky-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              <span className="group-hover:drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]">
                {lang === 'ro' ? 'Cod sursă' : 'Source code'}
              </span>
            </a>
          
            <a 
              href="https://learning.assist.ro/" 
              target="_blank" 
              rel="noreferrer" 
              className="flex flex-col items-center justify-center space-y-1.5 px-4 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 hover:bg-gradient-to-b hover:from-slate-900 hover:to-orange-950/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-300 group cursor-pointer"
              title={lang === 'ro' ? 'Inspirat de ASSIST Software Dashboard' : 'Inspired by ASSIST Software Dashboard'}
            >
              <img 
                src={assistLogo} 
                alt="Assist Logo" 
                className="h-5 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-orange-400 transition-colors leading-none">
                {lang === 'ro' ? 'Inspirat de ASSIST' : 'Inspired by ASSIST'}
              </span>
            </a>
                      
            <a 
              href={lang === 'ro' ? '/The-inventory/The-Inventory.pdf' : '/The-inventory/The-Inventory-EN.pdf'}
              download={lang === 'ro' ? 'The-Inventory.pdf' : 'The-Inventory-EN.pdf'}
              className="group flex items-center space-x-2 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-indigo-400 group-hover:-translate-y-1 group-hover:text-indigo-300 transition-all duration-300" />
              <span className="group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
                {lang === 'ro' ? 'Documentație' : 'Documentation'}
              </span>
            </a>

          </div>
          
          <div className="flex md:flex-1 justify-center md:justify-end items-center space-x-4 w-full">
            
            <a 
              href="https://fermo.top/cv/" 
              target="_blank" 
              rel="noreferrer" 
              className="group flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all duration-300"
            >
              <img 
                src={customLogo} 
                alt="SF Custom Logo" 
                className="h-5 w-5 object-contain group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="text-sm font-semibold bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-white group-hover:to-slate-200 bg-clip-text text-transparent transition-all">
                {lang === 'ro' ? 'Site-ul meu' : 'My website'}
              </span>
            </a>

            <a 
              href="https://www.instagram.com/filipstrugariu/" 
              target="_blank" 
              rel="noreferrer" 
              className="relative group block p-2.5 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer text-pink-500 hover:text-pink-400"
              title={lang === 'ro' ? 'Instagram-ul meu' : 'My Instagram'}
            >
              <div className="absolute inset-0 bg-pink-500/0 rounded-xl group-hover:bg-pink-500/10 transition-all duration-300" />
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="relative h-5 w-5 transition-all duration-300 filter drop-shadow-[0_0_4px_rgba(236,72,153,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a 
              href="https://github.com/StrugariuFilip" 
              target="_blank" 
              rel="noreferrer" 
              className="relative group block p-2.5 rounded-xl bg-slate-900/40 border border-sky-500/20 hover:border-sky-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)] transition-all duration-300 hover:scale-110 cursor-pointer"
              title={lang === 'ro' ? 'Profilul meu GitHub' : 'My GitHub profile'}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5 text-sky-400 group-hover:text-sky-300 transition-colors"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

          </div>  
        </div>

        <div className="pt-8 border-t border-slate-900/80 text-center">
          <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
            &copy; 2026 Strugariu Filip-Daniel. {lang === 'ro' ? 'Toate drepturile rezervate.' : 'All rights reserved.'}
          </p>
        </div>

      </div>
    </footer>
  );
}