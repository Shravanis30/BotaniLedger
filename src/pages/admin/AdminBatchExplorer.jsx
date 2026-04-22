import React from 'react';
import AdminLayout from '@/components/shared/AdminLayout';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Database, Search, Filter, Download, ExternalLink, Loader2, ChevronLeft, ChevronRight, Hash, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const AdminBatchExplorer = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
  const farmerId = searchParams.get('farmerId');

  const { data: batches, isLoading } = useQuery({
    queryKey: ['adminBatches', farmerId],
    queryFn: async () => {
        const resp = await api.get(`/admin/batches${farmerId ? `?farmerId=${farmerId}` : ''}`);
        return resp.data;
    }
  });

  return (
    <AdminLayout portalName="Admin Portal">
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div>
                <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <div className="w-10 h-[1px] bg-primary/20" /> Distributed Ledger Audit
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                    Batch <span className="text-primary font-light not-italic underline decoration-primary/20 underline-offset-4">Explorer</span>
                </h1>
                <p className="text-gray-400 font-bold mt-2 italic max-w-xl text-[11px]">Real-time cryptographic audit log of every botanical asset registered and synchronized on the global AYUSH blockchain.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                <div className="relative group flex-1 xl:w-80">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input className="w-full pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 shadow-xl shadow-black/5 text-sm font-black tracking-tight" placeholder="Search by Batch ID or Hash..." />
                </div>
                <div className="flex gap-4">
                    <button className="p-5 bg-white border border-gray-100 rounded-3xl text-gray-400 hover:text-primary hover:shadow-xl transition-all shadow-sm">
                        <Filter size={20} />
                    </button>
                    <button className="flex-1 sm:flex-none px-8 py-5 sidebar-gradient text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                        <Download size={18} /> Export Data
                    </button>
                </div>
            </div>
        </header>

        <Card className="border-none shadow-2xl shadow-black/5 overflow-hidden bg-white rounded-[3rem] p-0">
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Identity / Hash</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Botanical Profile</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic text-center">Origin</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Yield Metric</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Ledger Status</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-10 py-32 text-center">
                                    <div className="relative inline-block mb-6">
                                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                                        <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10 mx-auto" />
                                    </div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.5em] italic animate-pulse">Syncing Blockchain Data...</p>
                                </td>
                            </tr>
                        ) : batches?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-10 py-32 text-center">
                                    <Database size={60} className="text-gray-100 mx-auto mb-6 opacity-30" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">No botanical assets discovered on the current ledger cluster.</p>
                                </td>
                            </tr>
                        ) : batches?.map((batch, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-all group cursor-default">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                            <Hash size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-mono font-black text-primary tracking-tighter uppercase mb-1">{batch.batchId}</div>
                                            <div className="text-[9px] font-mono text-gray-400 truncate w-32 uppercase opacity-60">TX::0x{batch.blockchainRecord?.txId?.slice(0, 16) || 'pending_sync'}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="text-lg font-black text-gray-900 leading-none tracking-tighter uppercase group-hover:text-primary transition-colors italic">{batch.herbSpecies?.common}</div>
                                    <div className="text-[10px] text-primary/60 font-black uppercase tracking-widest mt-1.5 flex items-center gap-2 pl-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20" /> {batch.herbSpecies?.botanical}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-2xl border border-emerald-100 uppercase tracking-widest italic group-hover:bg-emerald-500 group-hover:text-white transition-all">NODE::{batch.farmerId?.slice(-6).toUpperCase()}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-end gap-1.5">
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{batch.quantity}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-0.5 opacity-60">{batch.unit}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex flex-col gap-2">
                                        <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                        <div className="flex items-center gap-1.5 pl-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Live On Chain</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button 
                                        onClick={() => navigate(`/verify/${batch.batchId}`)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 rounded-2xl transition-all group/btn"
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover/btn:opacity-100 transition-opacity translate-x-4 group-hover/btn:translate-x-0 transition-transform">Audit Proof</span>
                                        <ExternalLink size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Standard Amazon-style Pagination Footer */}
            <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">
                    Displaying Assets <span className="text-gray-900 mx-1">{batches?.length || 0}</span> of <span className="text-gray-900 mx-1">12,842</span> Registered on Ledger
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-300 hover:text-primary transition-all shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    {[1, 2, 3, '...', '1284'].map((p, i) => (
                        <button key={i} className={cn(
                            "min-w-[44px] h-11 rounded-xl flex items-center justify-center text-[10px] font-black transition-all",
                            p === 1 ? "bg-primary text-white shadow-xl shadow-green-900/20 scale-110" : "bg-white text-gray-400 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                        )}>
                            {p}
                        </button>
                    ))}
                    <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-300 hover:text-primary transition-all shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="hidden xl:flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest text-primary/60 italic">
                    <Globe size={14} className="text-emerald-500 animate-[spin_5s_linear_infinite]" /> Global Satellite Sync v4.1
                </div>
            </div>
        </Card>
    </AdminLayout>
  );
};

export default AdminBatchExplorer;
