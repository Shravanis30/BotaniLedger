import React, { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card } from '@/components/shared/UI';
import { 
  User, Bell, Shield, Wallet, Smartphone, 
  ChevronRight, Save, Camera, Globe,
  LayoutDashboard, PlusCircle, List, RefreshCw, Settings as SettingsIcon
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('PROFILE');

  const sidebarItems = [
    { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard },
    { label: 'Record Collection', to: '/farmer/record', icon: PlusCircle },
    { label: 'My Batches', to: '/farmer/batches', icon: List },
    { label: 'Sync Status', to: '/farmer/sync', icon: RefreshCw },
    { label: 'Settings', to: '/farmer/settings', icon: SettingsIcon },
  ];

  const tabs = [
    { id: 'PROFILE', label: 'Profile Identity', icon: User },
    { label: 'Security & Access', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'Blockchain Node', icon: Globe },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar portalName="Farmer Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Configure your portal preferences and security parameters.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.id || 'PROFILE')}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                            activeTab === (tab.id || 'PROFILE') 
                                ? "bg-primary text-white shadow-xl shadow-green-900/10" 
                                : "bg-white border border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                activeTab === (tab.id || 'PROFILE') ? "bg-white/10" : "bg-gray-50"
                            )}>
                                <tab.icon size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                        </div>
                        <ChevronRight size={16} className={cn(
                            "transition-transform",
                            activeTab === (tab.id || 'PROFILE') ? "translate-x-1" : "opacity-0"
                        )} />
                    </button>
                ))}
            </div>

            <div className="lg:col-span-3 space-y-8 animate-fade-in">
                <Card className="p-10 border-none shadow-sm h-full">
                    {activeTab === 'PROFILE' && (
                        <div className="space-y-12">
                            <div className="flex items-center gap-10 border-b border-gray-50 pb-12">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-[40px] bg-primary/10 flex items-center justify-center text-primary-dark border-4 border-white shadow-xl overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-colors border border-gray-100">
                                        <Camera size={18} />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name || 'Ramesh Kumar'}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10">Authorized Farmer</span>
                                        <span className="text-xs font-medium text-gray-400 italic font-mono uppercase">ID: BRX-9941</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                                    <input 
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent border-gray-50 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                        defaultValue={user?.name || 'Ramesh Kumar'}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Digital Identity (DID)</label>
                                    <input 
                                        readOnly
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-mono text-gray-400 text-xs"
                                        value="did:botaniledger:eth:0x8fd...2b5c"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Endpoint</label>
                                    <input 
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent border-gray-50 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                        defaultValue={user?.email || 'ramesh@botanifarmer.in'}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Associated Farm Cluster</label>
                                    <input 
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent border-gray-50 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                        defaultValue="North-West Herb Belt, Pune"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-8">
                                <button className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-mid transition-all shadow-xl shadow-green-900/20">
                                    <Save size={18} />
                                    Commit Changes
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
