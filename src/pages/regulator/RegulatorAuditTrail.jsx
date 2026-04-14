import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card } from '@/components/shared/UI';
import { ShieldCheck, History, Map as MapIcon, Flag, Search, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const RegulatorAuditTrail = () => {
  const sidebarItems = [
    { label: 'Compliance Audit', to: '/regulator', icon: ShieldCheck },
    { label: 'Audit Trail', to: '/regulator/audit', icon: History, end: true },
    { label: 'Regional Trends', to: '/regulator/trends', icon: MapIcon },
    { label: 'Anomaly Reports', to: '/regulator/reports', icon: Flag },
  ];

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['auditTrail'],
    queryFn: async () => {
        const resp = await api.get('/regulator/audit-trail');
        return resp.data;
    }
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar portalName="AYUSH / Regulator" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-10 animate-in fade-in duration-500">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <History size={14} /> System Forensics
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Immutable Audit Trail</h1>
                <p className="text-gray-500 font-bold mt-2 italic">Cryptographically linked history of all system state changes.</p>
            </div>
            <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 text-gray-700 shadow-sm transition-all">
                <Download size={18} /> Export Audit Archive
            </button>
        </header>

        <Card className="border-none shadow-sm overflow-hidden p-0 bg-white">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/20 w-80 text-sm font-bold shadow-sm" placeholder="Filter by Transaction ID..." />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing Last 100 Transactions</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 border-b border-gray-50">
                        <tr>
                            <th className="px-8 py-6">Timestamp</th>
                            <th className="px-8 py-6">Operator ID</th>
                            <th className="px-8 py-6">Action Event</th>
                            <th className="px-8 py-6">Ledger Block</th>
                            <th className="px-8 py-6">Integrity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-16 text-center">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Querying Blockchain Ledger...</p>
                                </td>
                            </tr>
                        ) : auditLogs?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-16 text-center">
                                    <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-4 opacity-20" />
                                    <p className="text-xs font-bold text-gray-400">No cryptographical events recorded yet.</p>
                                </td>
                            </tr>
                        ) : auditLogs?.map((log, i) => (
                            <tr key={i} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="text-sm font-bold text-gray-900">{new Date(log.timestamp).toLocaleDateString()}</div>
                                    <div className="text-[10px] text-gray-400 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-sm font-bold text-primary">{log.userId?.slice(-6).toUpperCase() || 'SYS-NODE'}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-black text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                        {log.action || 'TRANSACTION_EXEC'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-mono text-[10px] text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        {log.transactionId?.slice(0, 16) || 'blk_7428f91a2bc...'}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <button className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase hover:text-emerald-700">
                                        Verified <ExternalLink size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
      </main>
    </div>
  );
};

export default RegulatorAuditTrail;
