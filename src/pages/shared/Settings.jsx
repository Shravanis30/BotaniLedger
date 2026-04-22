import React, { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, Button, Input } from '@/components/shared/UI';
import { 
  User, Bell, Shield, Wallet, Smartphone, 
  ChevronRight, Save, Camera, Globe,
  LayoutDashboard, PlusCircle, List, RefreshCw, Settings as SettingsIcon,
  Microscope, FileCheck, FlaskConical, BarChart3,
  Factory, Package, QrCode
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('PROFILE');

  const getSidebarConfig = () => {
    switch (user?.role) {
      case 'lab':
        return {
          name: "Lab Tester Node",
          items: [
            { label: 'Analyzer', to: '/lab', icon: Microscope },
            { label: 'Consensus Log', to: '/lab/certificates', icon: FileCheck },
            { label: 'Quality Hub', to: '/lab/analytics', icon: BarChart3 },
            { label: 'Settings', to: '/lab/settings', icon: SettingsIcon },
          ]
        };
      case 'manufacturer':
        return {
          name: "Manufacturer Node",
          items: [
              { label: 'Hub', to: '/manufacturer', icon: LayoutDashboard },
              { label: 'Inbound Verify', to: '/manufacturer/verify', icon: FileCheck },
              { label: 'Synthesis', to: '/manufacturer/products', icon: Factory },
              { label: 'Ledger Audit', to: '/manufacturer/production', icon: List },
              { label: 'Truth Labels', to: '/manufacturer/qr', icon: QrCode },
              { label: 'Node Config', to: '/manufacturer/settings', icon: SettingsIcon },
          ]
        };
      case 'farmer':
      default:
        return {
          name: "Farmer Portal",
          items: [
            { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard },
            { label: 'Record Collection', to: '/farmer/record', icon: PlusCircle },
            { label: 'My Batches', to: '/farmer/batches', icon: List },
            { label: 'Sync Status', to: '/farmer/sync', icon: RefreshCw },
            { label: 'Settings', to: '/farmer/settings', icon: SettingsIcon },
          ]
        };
    }
  };

  const config = getSidebarConfig();

  const tabs = [
    { id: 'PROFILE', label: 'Profile Identity', icon: User },
    { label: 'Security & Access', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'Blockchain Node', icon: Globe },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar portalName={config.name} items={config.items} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10">
          <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">Protocol Configuration</div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none italic uppercase">
            System <span className="text-primary font-light not-italic">Settings</span>
          </h1>
          <p className="text-gray-500 font-medium mt-3 italic text-sm">Configure your node preferences and security parameters.</p>
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
                                : "bg-white border border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary shadow-sm"
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
                <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white rounded-[2.5rem] h-full overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
                    
                    {activeTab === 'PROFILE' && (
                        <div className="space-y-12 relative z-10">
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
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">{user?.organization || user?.name || 'Ayush Entity'}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10">Authorized {user?.role}</span>
                                        <span className="text-[10px] font-bold text-gray-300 italic font-mono uppercase tracking-tighter">NODE_ID: {user?._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <Input 
                                    label="Sovereign Entity Name"
                                    defaultValue={user?.organization || user?.name}
                                />
                                <Input 
                                    label="Digital Identity (DID)"
                                    readOnly
                                    className="font-mono text-[10px] bg-gray-50/50"
                                    value={`did:botaniledger:${user?.role}:0x` + user?._id?.slice(-16)}
                                />
                                <Input 
                                    label="Communication Endpoint"
                                    defaultValue={user?.email}
                                />
                                <Input 
                                    label="Geographic Zone"
                                    defaultValue="South-Asia Hub, District-4"
                                />
                            </div>

                            <div className="flex justify-end pt-8">
                                <Button variant="primary" className="px-12 py-6 rounded-3xl shadow-2xl shadow-green-900/20">
                                    <Save size={18} />
                                    Commit Synchronized Data
                                </Button>
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
