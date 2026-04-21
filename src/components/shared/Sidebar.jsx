import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LogOut, TreeDeciduous, X, ChevronRight, Activity, 
  ShieldCheck, Database, Users, AlertCircle, LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { useOfflineStore } from '../../lib/offlineStore';
import { cn } from '../../lib/utils';

const Sidebar = ({ portalName, items, isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const { isOnline } = useOfflineStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen sidebar-gradient text-white flex flex-col z-40 transition-all duration-500 ease-in-out w-72 lg:translate-x-0 overflow-hidden",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        {/* Brand */}
        <div className="p-8 pb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shrink-0 shadow-xl shadow-black/20 transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <TreeDeciduous className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h1 className="text-xl font-black tracking-tighter leading-none italic">Botani<span className="text-secondary font-light not-italic">Ledger</span></h1>
                <div className="mt-1 text-[10px] uppercase font-black text-secondary tracking-widest opacity-80">{portalName}</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Nav Section */}
        <div className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-none py-4">
            <div>
                <div className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Core Ledger</div>
                <nav className="space-y-1.5">
                    {items.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.to}
                        end={item.end}
                        onClick={() => window.innerWidth < 1024 && onClose()}
                        className={({ isActive }) => cn(
                        "flex items-center justify-between px-5 py-4 rounded-[1.25rem] transition-all duration-300 font-bold group",
                        isActive 
                            ? "bg-white/15 text-white shadow-[0_0_30px_rgba(0,0,0,0.15)] ring-1 ring-white/10" 
                            : "text-green-100/40 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-4">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-secondary" : "group-hover:scale-110 transition-transform")} />
                                    <span className="text-xs uppercase tracking-widest leading-none">{item.label}</span>
                                </div>
                                <ChevronRight size={14} className={cn("transition-transform duration-300", isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2")} />
                            </>
                        )}
                    </NavLink>
                    ))}
                </nav>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6">
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck size={60} />
                </div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black text-lg shadow-xl shadow-black/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-black truncate text-white">{user?.name || 'Ayush Admin'}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-emerald-400 animate-pulse" : "bg-orange-400")} />
                        <span className="text-[10px] uppercase font-black text-white/30 truncate tracking-tight">
                            {isOnline ? "Ledger Sync Active" : "Offline Mode"}
                        </span>
                        </div>
                    </div>
                </div>
                
                <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-red-500/10 hover:text-red-300 text-white/60 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5"
                >
                <LogOut size={14} />
                <span>Logout Session</span>
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
