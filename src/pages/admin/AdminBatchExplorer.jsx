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
        <header className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Distributed Ledger Audit
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Batch Explorer
                </h1>
                <p className="text-gray-500 mt-1 max-w-xl text-sm">Real-time cryptographic audit log of every botanical asset registered and synchronized on the global AYUSH blockchain.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                <div className="relative group flex-1 xl:w-80">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm" placeholder="Search by Batch ID or Hash..." />
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>
        </header>

        <Card className="shadow-sm border border-gray-200 overflow-hidden bg-white rounded-xl p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Identity / Hash</th>
                            <th className="px-6 py-4">Botanical Profile</th>
                            <th className="px-6 py-4 text-center">Origin Node</th>
                            <th className="px-6 py-4">Yield Metric</th>
                            <th className="px-6 py-4">Ledger Status</th>
                            <th className="px-6 py-4 text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-24 text-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-sm font-medium text-gray-500">Syncing Blockchain Data...</p>
                                </td>
                            </tr>
                        ) : batches?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-24 text-center">
                                    <Database size={40} className="text-gray-300 mx-auto mb-4" />
                                    <p className="text-sm font-medium text-gray-500">No botanical assets discovered on the current ledger cluster.</p>
                                </td>
                            </tr>
                        ) : batches?.map((batch, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                            <Hash size={16} />
                                        </div>
                                        <div>
                                            <div className="font-mono text-primary font-medium">{batch.batchId}</div>
                                            <div className="text-xs font-mono text-gray-500 mt-1">TX: 0x{batch.blockchainRecord?.txId?.slice(0, 16) || 'pending_sync'}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{batch.herbSpecies?.common}</div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" /> {batch.herbSpecies?.botanical}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                        {batch.farmerId?.slice(-6).toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-gray-900">{batch.quantity}</span>
                                        <span className="text-xs font-medium text-gray-500">{batch.unit}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Live On Chain</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => navigate(`/verify/${batch.batchId}`)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                    >
                                        Audit Proof <ExternalLink size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{batches?.length || 0}</span> of <span className="font-semibold text-gray-900">12,842</span> assets
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-primary disabled:opacity-50 transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    {[1, 2, 3, '...', 1284].map((p, i) => (
                        <button key={i} className={cn(
                            "min-w-[32px] h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                            p === 1 ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-200"
                        )} disabled={p === '...'}>
                            {p}
                        </button>
                    ))}
                    <button className="p-2 text-gray-400 hover:text-primary disabled:opacity-50 transition-colors">
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Globe size={14} className="text-emerald-500" /> Global Sync
                </div>
            </div>
        </Card>
    </AdminLayout>
  );
};

export default AdminBatchExplorer;
