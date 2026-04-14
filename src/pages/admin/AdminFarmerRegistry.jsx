import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Users, Search, MapPin, Activity, Shield, Database, AlertCircle, Phone, Mail, MoreVertical, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const AdminFarmerRegistry = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminStakeholders'],
    queryFn: async () => {
        const resp = await api.get('/admin/farmers');
        return resp.data;
    }
  });

  const sidebarItems = [
    { label: 'Network Overview', to: '/admin', icon: Activity },
    { label: 'Pending Approvals', to: '/admin/approvals', icon: Shield },
    { label: 'Batch Explorer', to: '/admin/batches', icon: Database },
    { label: 'Farmer Registry', to: '/admin/farmers', icon: Users, end: true },
    { label: 'Anomaly Alerts', to: '/admin/alerts', icon: AlertCircle },
  ];

  const demoFarmers = [
    { id: 'FRM-2021', name: 'Valley Organic Farms', location: 'Solan, Pradesh', area: '12.5 Acres', crops: ['Ashwagandha', 'Tulsi'], status: 'APPROVED' },
    { id: 'FRM-2022', name: 'Himalayan Herbal Collective', location: 'Manali, Pradesh', area: '45.0 Acres', crops: ['Ginseng', 'Brahmi'], status: 'APPROVED' },
    { id: 'FRM-2023', name: 'Nilgiri Green Estate', location: 'Ooty, Tamil Nadu', area: '28.2 Acres', crops: ['Amla'], status: 'APPROVED' },
  ];

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen">
      <Sidebar portalName="Admin Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-10 animate-in fade-in duration-500">
        <header className="mb-10 flex justify-between items-end">
            <div>
                <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Users size={14} /> Stakeholder Management
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Verified Farmer Registry</h1>
                <p className="text-gray-500 font-bold mt-2 italic">Database of all certified botanical originators authorized on the network.</p>
            </div>
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-bold shadow-sm" placeholder="Search by Farmer Name..." />
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
                <div className="col-span-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Querying Identity Registry...</p>
                </div>
            ) : users?.length === 0 ? (
                <div className="col-span-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-sm font-bold text-gray-400">No stakeholders found on the network.</p>
                </div>
            ) : users?.map((farmer, i) => (
                <Card key={farmer._id} className="group hover:shadow-2xl transition-all duration-500 border-none overflow-hidden p-0 bg-white">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <Users size={28} />
                            </div>
                            <StatusBadge status={farmer.isActive ? 'APPROVED' : 'PENDING'} />
                        </div>
                        
                        <div className="space-y-1 mb-6">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{farmer._id.slice(-8).toUpperCase()}</div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">{farmer.name}</h3>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{farmer.role}</div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin size={16} className="text-primary" />
                                <span className="text-sm font-bold">{farmer.location || 'Distributed Node'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Shield size={16} className="text-primary" />
                                <span className="text-sm font-bold">{farmer.email}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-50">
                            <button className="flex-1 p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                                <Phone size={16} />
                            </button>
                            <button className="flex-1 p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                                <Mail size={16} />
                            </button>
                            <button className="flex-[2] py-3 sidebar-gradient text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-900/10 active:scale-95 transition-all">
                                Node History
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
};

export default AdminFarmerRegistry;
