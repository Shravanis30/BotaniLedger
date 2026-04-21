import React from 'react';
import { Search, Bell, User, Menu, Settings, Globe, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../lib/store';

const Header = ({ onMenuClick, portalName }) => {
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white border-b border-gray-100 z-10 flex items-center justify-between px-6 md:px-10 transition-all duration-300">
      {/* Search Bar - Amazon Style */}
      <div className="flex-1 max-w-2xl hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search batches, stakeholders, or alerts..." 
            className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl py-3 pl-12 pr-6 text-sm font-medium outline-none"
          />
        </div>
      </div>

      {/* Mobile Menu Trigger */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-4 mr-4 pr-4 border-r border-gray-100 uppercase tracking-widest text-[10px] font-black text-gray-400 italic">
          <div className="flex items-center gap-1.5">
            <Globe size={12} className="text-emerald-500" />
            <span className="text-emerald-600">Mainnet v1.02</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings size={12} />
            <span>Node: IN-DEL-01</span>
          </div>
        </div>

        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-white hover:text-primary hover:shadow-xl hover:shadow-primary/5 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden xl:block">
                <div className="text-xs font-black text-gray-900 leading-none mb-1">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{user?.role || 'AYUSH ADMIN'}</div>
            </div>
            <button className="w-11 h-11 rounded-2xl bg-primary shadow-lg shadow-green-900/20 flex items-center justify-center text-white ring-2 ring-white hover:scale-105 active:scale-95 transition-all">
                <User size={20} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
