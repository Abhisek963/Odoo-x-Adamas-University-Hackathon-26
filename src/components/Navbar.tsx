import React from 'react';
import { Bell, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      
      {/* Search block mockup */}
      <div className="relative hidden md:block w-72">
        <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search HR portal..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none placeholder-slate-500 text-slate-200"
          disabled
        />
      </div>

      {/* Spacing for mobile layout */}
      <div className="md:hidden w-10 h-10" />

      {/* Actions and profile placeholders */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Mock Button */}
        <button 
          className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-slate-400 hover:text-white transition-all relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500"></span>
        </button>

        {/* Profile Card Mockup */}
        <div className="flex items-center gap-2.5 border-l border-slate-800/80 pl-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
            HR
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-200 leading-tight">HR Manager</span>
            <span className="block text-[10px] text-slate-500">Admin Account</span>
          </div>
        </div>

      </div>
    </header>
  );
};
