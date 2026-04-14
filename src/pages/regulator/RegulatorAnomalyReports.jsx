import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card } from '@/components/shared/UI';
import { ShieldCheck, History, Map as MapIcon, Flag, Search, Filter, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const RegulatorAnomalyReports = () => {
  const sidebarItems = [
    { label: 'Compliance Audit', to: '/regulator', icon: ShieldCheck },
    { label: 'Audit Trail', to: '/regulator/audit', icon: History },
    { label: 'Regional Trends', to: '/regulator/trends', icon: MapIcon },
    { label: 'Anomaly Reports', to: '/regulator/reports', icon: Flag, end: true },
  ];

  const { data: anomalies, isLoading } = useQuery({
    queryKey: ['regulatorAnomalies'],
    queryFn: async () => {
        const resp = await api.get('/admin/anomalies'); // Using shared endpoint
        return resp.data;
    }
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar portalName="AYUSH / Regulator" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-10 animate-in fade-in duration-500">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <div className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Flag size={14} /> Enforcement Dashboard
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Active Anomaly Reports</h1>
                <p className="text-gray-500 font-bold mt-2 italic">Official compliance violations and data discrepancies requiring regulatory intervention.</p>
            </div>
            <div className="flex gap-4">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-bold shadow-sm" placeholder="Search by Violation ID..." />
                </div>
                <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
                    <Filter size={20} />
                </button>
            </div>
        </header>

        <div className="space-y-6">
            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-400">Scanning ledger for compliance violations...</p>
                </div>
            ) : anomalies?.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="p-6 bg-emerald-50 rounded-full text-emerald-500 mb-6">
                        <ShieldCheck size={48} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">Zero Violations Detected</h3>
                    <p className="text-sm text-gray-400 mt-2 font-medium">The ecosystem is currently 100% compliant with Ministry regulations.</p>
                </div>
            ) : anomalies?.map((alert, i) => (
                <Card key={i} className="group hover:shadow-2xl transition-all duration-500 border-none overflow-hidden p-0 bg-white">
                    <div className="flex min-h-[160px]">
                        <div className={cn(
                            "w-3",
                            alert.severity === 'HIGH' ? "bg-red-500" : "bg-amber-500"
                        )}></div>

                        <div className="flex-1 p-8 flex items-center gap-10">
                            <div className={cn(
                                "p-6 rounded-3xl shrink-0",
                                alert.severity === 'HIGH' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                            )}>
                                <AlertCircle size={40} />
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white",
                                        alert.severity === 'HIGH' ? "bg-red-500" : "bg-amber-500"
                                    )}>
                                        {alert.severity} SEVERITY
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Incident: {alert.type}</span>
                                    <span className="text-[10px] text-gray-400 font-bold ml-auto">{new Date(alert.createdAt).toLocaleString()}</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{alert.description}</h3>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="text-[10px] font-mono font-bold text-primary italic px-3 py-1 bg-primary/5 rounded-lg border border-primary/10 tracking-wider">
                                        BATCH_REF: {alert.batchId}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div> Owner Node: {alert.affectedUserId?.name || 'Authorized Farmer'}
                                    </div>
                                </div>
                            </div>

                            <div className="w-64 space-y-4">
                                <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all active:scale-95">
                                    Take Action <ArrowRight size={18} />
                                </button>
                                <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-gray-600 transition-all">
                                    Lodge Official Inquiry
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

export default RegulatorAnomalyReports;
