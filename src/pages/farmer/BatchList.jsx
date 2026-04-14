import React, { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge, EmptyState } from '@/components/shared/UI';
import { 
  PlusCircle, LayoutDashboard, List, RefreshCw, 
  Search, Filter, Download, ArrowRight, MapPin, 
  Activity, Calendar, ChevronLeft, ChevronRight, Settings, Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const BatchList = () => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data: batches, isLoading } = useQuery({
    queryKey: ['farmerBatches'],
    queryFn: async () => {
        const resp = await api.get('/farmer/batches');
        return resp.data;
    }
  });

  const sidebarItems = [
    { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard },
    { label: 'Record Collection', to: '/farmer/record', icon: PlusCircle },
    { label: 'My Batches', to: '/farmer/batches', icon: List },
    { label: 'Sync Status', to: '/farmer/sync', icon: RefreshCw },
    { label: 'Settings', to: '/farmer/settings', icon: Settings },
  ];

  const filteredBatches = (batches || []).filter(batch => {
    const matchesSearch = batch.batchId.toLowerCase().includes(search.toLowerCase()) || 
                         batch.herbSpecies?.common.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || batch.blockchainRecord?.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar portalName="Farmer Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Batches</h1>
            <p className="text-gray-500 font-medium mt-1">Manage and track all your recorded herbal collections.</p>
          </div>
          
          <Link to="/farmer/record" className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-mid transition-all shadow-xl shadow-green-900/20">
            <PlusCircle size={18} />
            New Collection
          </Link>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder="Search by Batch ID or Herb..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-gray-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                {['ALL', 'PENDING', 'IN_TRANSIT', 'LAB_TESTING', 'CERTIFIED'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                            filter === f ? "bg-primary text-white shadow-lg shadow-green-900/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>
            <button className="flex items-center gap-2 px-5 py-4 bg-white border border-gray-100 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm">
                <Download size={18} />
                Export
            </button>
        </div>

        {/* Batch List */}
        <Card className="border-none shadow-sm overflow-hidden">
            {isLoading ? (
                <div className="p-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading from Private Subscriptions...</p>
                </div>
            ) : filteredBatches.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                <tr>
                                    <th className="px-8 py-5">Batch Identity</th>
                                    <th className="px-8 py-5">Origin Details</th>
                                    <th className="px-8 py-5">AI Verification</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredBatches.map((batch) => (
                                    <tr key={batch._id} className="group hover:bg-primary/[0.02] transition-colors">
                                        <td className="px-8 py-7">
                                            <div className="font-mono text-xs font-bold text-primary mb-1">{batch.batchId}</div>
                                            <div className="text-sm font-black text-gray-900">{batch.herbSpecies?.common}</div>
                                            <div className="text-[10px] text-gray-400 font-medium italic lowercase">{batch.herbSpecies?.scientific}</div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(batch.collectionDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg w-fit">
                                                <MapPin size={12} className="text-primary" />
                                                {batch.location?.name || 'Assigned Farm'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confidence</span>
                                                    <span className="text-xs font-black text-success">{batch.aiVerification?.confidence}%</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-success transition-all duration-1000 shadow-[0_0_8px_rgba(22,163,74,0.4)]" 
                                                        style={{ width: `${batch.aiVerification?.confidence}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button className="px-4 py-2 bg-white border border-gray-200 text-[10px] font-black text-gray-600 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest">
                                                    View Trace
                                                </button>
                                                <button className="p-2 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                                                    <Activity size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Showing {filteredBatches.length} of {batches?.length || 0} results</span>
                        <div className="flex gap-3">
                            <button className="p-2 bg-white border border-gray-200 rounded-xl opacity-50 cursor-not-allowed">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-primary transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState 
                    title="No Batches Found" 
                    description="We couldn't find any batches matching your search or filter. Try a different query."
                    icon={List}
                />
            )}
        </Card>
      </main>
    </div>
  );
};

export default BatchList;
