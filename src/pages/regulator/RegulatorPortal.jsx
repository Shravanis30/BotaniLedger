import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { ShieldCheck, FileText, Search, Download, History, Database, Map as MapIcon, Flag, Globe, Loader2, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const RegulatorPortal = () => {
    const { data: auditLogs, isLoading: logsLoading } = useQuery({
        queryKey: ['regulatorAudit'],
        queryFn: async () => {
            const resp = await api.get('/regulator/audit-trail');
            return resp.data;
        }
    });

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['regulatorStats'],
        queryFn: async () => {
            const resp = await api.get('/admin/stats'); // Shared stats for now
            return resp.data;
        }
    });

    const sidebarItems = [
        { label: 'Compliance Audit', to: '/regulator', icon: ShieldCheck, end: true },
        { label: 'Audit Trail', to: '/regulator/audit', icon: History },
        { label: 'Regional Trends', to: '/regulator/trends', icon: MapIcon },
        { label: 'Anomaly Reports', to: '/regulator/reports', icon: Flag },
    ];

    const complianceCards = [
        { label: "Compliance Rate", value: "99.2%", color: "text-primary", icon: ShieldCheck },
        { label: "Active Audits", value: stats?.activeUsers || "0", color: "text-blue-600", icon: History },
        { label: "Alerted Batches", value: stats?.openAnomalies || "0", color: "text-red-500", icon: Flag },
        { label: "Digital Certificates", value: stats?.totalBatches || "0", color: "text-emerald-600", icon: FileText }
    ];

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            <Sidebar portalName="AYUSH / Regulator" items={sidebarItems} />

            <main className="flex-1 ml-64 p-10">
                <header className="mb-12 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-900/10">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Regulator Control</h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Ministry of AYUSH • Compliance Node #741</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {complianceCards.map((s, i) => (
                        <Card key={i} className="p-8 border-none shadow-sm relative overflow-hidden">
                            {statsLoading && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                                    <Loader2 className="animate-spin text-primary" size={20} />
                                </div>
                            )}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[100px] -mr-12 -mt-12"></div>
                            <s.icon size={20} className={cn("mb-6 relative z-10", s.color)} />
                            <div className="text-3xl font-black text-gray-900 mb-1 relative z-10">{s.value}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] relative z-10">{s.label}</div>
                        </Card>
                    ))}
                </div>

                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">State Ledger Snapshot</h3>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input className="pl-10 pr-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-medium" placeholder="Search Audit Ref..." />
                        </div>
                    </div>

                    <Card className="border-none shadow-sm overflow-hidden p-0 bg-white">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 border-b border-gray-50">
                                <tr>
                                    <th className="px-8 py-6">Audit Reference</th>
                                    <th className="px-8 py-6">Operation</th>
                                    <th className="px-8 py-6">Blockchain TX</th>
                                    <th className="px-8 py-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logsLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-12 text-center">
                                            <Loader2 className="animate-spin text-primary mx-auto mb-2" size={24} />
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Querying System Logs...</span>
                                        </td>
                                    </tr>
                                ) : auditLogs?.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">No audit records found</td>
                                    </tr>
                                ) : auditLogs?.map((log, i) => (
                                    <tr key={i} className="hover:bg-primary/5 transition-colors cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-gray-900">{log._id.slice(-8).toUpperCase()}</div>
                                            <div className="text-[10px] text-gray-400 italic">{new Date(log.timestamp).toLocaleString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-primary italic uppercase tracking-wider">{log.action}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-mono text-[10px] text-gray-400 truncate w-32 bg-gray-50 px-2 py-1 rounded">
                                                {log.transactionId || '0x742...8f91a2bc'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                                                <span className="text-[10px] font-bold text-success uppercase">LEDGER_SYNCED</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </section>
            </main>
        </div>
    );
};

export default RegulatorPortal;
