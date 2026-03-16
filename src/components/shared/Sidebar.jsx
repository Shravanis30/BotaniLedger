import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, PlusCircle, Database, RefreshCw, 
  Settings, LogOut, Shield, Map, Microscope, Factory, 
  Search, FileText, TreeDeciduous
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { useOfflineStore } from '../../lib/offlineStore';
import { cn } from '../../lib/utils';

const Sidebar = ({ portalName, items }) => {
  const { user, logout } = useAuthStore();
  const { isOnline } = useOfflineStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 h-screen fixed left-0 top-0 sidebar-gradient text-white flex flex-col z-20 transition-all duration-300">
      {/* Brand */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-1.5 rounded-lg shrink-0">
            <TreeDeciduous className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">BotaniLedger</h1>
        </div>
        <div className="px-1 text-[10px] uppercase tracking-widest font-bold text-accent-light opacity-80">
          {portalName}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-none">
        {items.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end={item.end}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium group text-green-100/70 hover:text-white hover:bg-white/10",
              isActive && "bg-white/20 text-white shadow-lg shadow-black/10"
            )}
          >
            <item.icon className={cn("w-5 h-5", "group-hover:scale-110 transition-transform")} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center gap-3 mb-6 p-2">
          <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-primary-dark font-bold text-sm shadow-inner ring-2 ring-white/20">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold truncate">{user?.name || 'User'}</div>
            <div className="flex items-center gap-1.5">
               <div className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-success" : "bg-warning")} />
               <span className="text-[10px] uppercase font-bold text-green-100/60 truncate">
                 {isOnline ? "Network Connected" : "Local Sync Only"}
               </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-200 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={16} />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
