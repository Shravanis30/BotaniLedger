import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { AlertCircle, Search, Filter, Activity, Shield, Database, Users, Trash2, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const AdminAnomalyAlerts = () => {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['adminAnomalies'],
    queryFn: async () => {
        const resp = await api.get('/admin/anomalies');
        return resp.data;
    }
  });

  const sidebarItems = [
    { label: 'Network Overview', to: '/admin', icon: Activity },
    { label: 'Pending Approvals', to: '/admin/approvals', icon: Shield },
    { label: 'Batch Explorer', to: '/admin/batches', icon: Database },
    { label: 'Farmer Registry', to: '/admin/farmers', icon: Users },
    { label: 'Anomaly Alerts', to: '/admin/alerts', icon: AlertCircle, end: true },
  ];

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen">
      <Sidebar portalName="Admin Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-10 animate-in fade-in duration-500">
        <header className="mb-10 flex justify-between items-end">
            <div>
                <div className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> Threat Intelligence
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Anomaly Alerts</h1>
                <p className="text-gray-500 font-bold mt-2 italic">Automated AI detection of supply chain inconsistencies and security violations.</p>
            </div>
            <div className="flex gap-4">
                <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:bg-gray-50 shadow-sm flex items-center gap-2">
                    <Trash2 size={18} /> Clear All
                </button>
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-bold shadow-sm" placeholder="Search Alerts..." />
                </div>
            </div>
        </header>

        <div className="space-y-6">
            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-400">Scanning ledger for inconsistencies...</p>
                </div>
            ) : alerts?.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-black text-gray-900">System Healthy</h3>
                    <p className="text-sm text-gray-400 mt-2">No anomalies detected in the current epoch.</p>
                </div>
            ) : alerts?.map((alert, i) => (
                <Card key={alert._id} className="group hover:shadow-2xl transition-all duration-500 border-none overflow-hidden p-0 bg-white">
                    <div className="flex divide-x divide-gray-50">
                        {/* Severity Indicator */}
                        <div className={cn(
                            "w-4 min-h-full",
                            alert.severity === 'HIGH' ? "bg-red-500 animate-pulse" : "bg-amber-500"
                        )}></div>

                        <div className="flex-1 p-8 flex items-center gap-10">
                            <div className="shrink-0">
                                <div className={cn(
                                    "p-5 rounded-2xl",
                                    alert.severity === 'HIGH' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                                )}>
                                    <AlertCircle size={32} />
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                        alert.severity === 'HIGH' ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                                    )}>
                                        {alert.severity} SEVERITY
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Type: {alert.type}</span>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-widest ml-auto">{new Date(alert.createdAt).toLocaleString()}</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900">{alert.description}</h3>
                                <div className="text-[10px] font-mono font-bold text-primary italic">AFFECTED BATCH: {alert.batchId}</div>
                            </div>

                            <div className="w-48 space-y-3">
                                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all">
                                    Investigate <ArrowRight size={16} />
                                </button>
                                <button className="w-full py-3 bg-white border border-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-gray-600 transition-all">
                                    Mark Resolved
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
};

export default AdminAnomalyAlerts;
