import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Database, Search, Filter, Download, Activity, Shield, Users, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const AdminBatchExplorer = () => {
  const { data: batches, isLoading } = useQuery({
    queryKey: ['adminBatches'],
    queryFn: async () => {
        const resp = await api.get('/admin/batches');
        return resp.data;
    }
  });

  const sidebarItems = [
    { label: 'Network Overview', to: '/admin', icon: Activity },
    { label: 'Pending Approvals', to: '/admin/approvals', icon: Shield },
    { label: 'Batch Explorer', to: '/admin/batches', icon: Database, end: true },
    { label: 'Farmer Registry', to: '/admin/farmers', icon: Users },
    { label: 'Anomaly Alerts', to: '/admin/alerts', icon: AlertCircle },
  ];

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen">
      <Sidebar portalName="Admin Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-10 animate-in fade-in duration-500">
        <header className="mb-10 flex justify-between items-end">
            <div>
                <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Database size={14} /> Global Ledger
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Batch Explorer</h1>
                <p className="text-gray-500 font-bold mt-2 italic">Real-time audit log of every botanical asset registered on the blockchain.</p>
            </div>
            <div className="flex gap-4">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-bold shadow-sm" placeholder="Search Batch ID..." />
                </div>
                <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm">
                    <Filter size={20} />
                </button>
                <button className="px-5 py-3 sidebar-gradient text-white rounded-xl font-bold text-sm shadow-xl shadow-green-900/20 flex items-center gap-2">
                    <Download size={18} /> Export CSV
                </button>
            </div>
        </header>

        <Card className="border-none shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch ID / Hash</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Botanical Name</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Origin Node</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ledger Status</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="px-8 py-20 text-center">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Accessing Supply Chain Ledger...</p>
                            </td>
                        </tr>
                    ) : batches?.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">No botanical batches discovered on network.</td>
                        </tr>
                    ) : batches?.map((batch, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-8 py-5">
                                <div className="text-sm font-black text-gray-900">{batch.batchId}</div>
                                <div className="text-[10px] font-mono text-gray-400 truncate w-32">{batch.blockchainRecord?.txId || 'pending_sync'}</div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="text-sm font-bold text-gray-900">{batch.herbSpecies?.common}</div>
                                <div className="text-xs text-primary font-medium italic">{batch.herbSpecies?.scientific}</div>
                            </td>
                            <td className="px-8 py-5">
                                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">{batch.farmerId?.slice(-6).toUpperCase()}</span>
                            </td>
                            <td className="px-8 py-5 font-bold text-gray-900 text-sm">
                                {batch.quantity} {batch.unit}
                            </td>
                            <td className="px-8 py-5">
                                <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                            </td>
                            <td className="px-8 py-5">
                                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                    <ExternalLink size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing 10 of 8,241 Batches</span>
                <div className="flex gap-2">
                    {[1, 2, 3, '...', 824].map((p, i) => (
                        <button key={i} className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                            p === 1 ? "bg-primary text-white shadow-lg shadow-green-900/20" : "bg-white text-gray-400 hover:bg-gray-100"
                        )}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </Card>
      </main>
    </div>
  );
};

export default AdminBatchExplorer;
