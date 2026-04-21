import React, { useState } from 'react';
import AdminLayout from '@/components/shared/AdminLayout';
import { Card } from '@/components/shared/UI';
import { AlertCircle, Clock, CheckCircle, Search, Filter, ShieldAlert, Zap, ArrowRight, User as UserIcon, Calendar, Loader2, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const AdminAnomalyAlerts = () => {
  const queryClient = useQueryClient();
  const [resolvingId, setResolvingId] = useState(null);

  const { data: anomalies, isLoading } = useQuery({
    queryKey: ['adminAnomalies'],
    queryFn: async () => {
        const resp = await api.get('/admin/anomalies');
        return resp.data;
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, resolution }) => {
        return api.post(`/admin/anomalies/${id}/resolve`, { resolution });
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminAnomalies'] });
        setResolvingId(null);
    }
  });

  const handleResolve = (id) => {
    const resolution = window.prompt("Enter resolution details for the ledger:");
    if (resolution) {
        resolveMutation.mutate({ id, resolution });
    }
  };

  return (
    <AdminLayout portalName="Admin Portal">
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div>
                <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <div className="w-10 h-[1px] bg-primary/20" /> Threat Intelligence Response
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                    Anomaly <span className="text-red-500 font-light not-italic underline decoration-red-500/20 underline-offset-4">Intelligence</span>
                </h1>
                <p className="text-gray-400 font-bold mt-2 italic max-w-xl text-[11px] leading-relaxed">Automated satellite monitoring and blockchain integrity alerts. View and resolve potential supply chain deviations in real-time.</p>
            </div>
            
            <div className="flex gap-4 w-full xl:w-auto overflow-x-auto no-scrollbar pb-2">
                <div className="flex items-center gap-3 px-6 py-4 bg-red-50 rounded-2xl border border-red-100 text-red-600">
                    <ShieldAlert size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{anomalies?.filter(a => a.status === 'OPEN').length || 0} Active Alerts</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
                    <CheckCircle size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{anomalies?.filter(a => a.status === 'RESOLVED').length || 0} Resolved</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
            {isLoading ? (
                <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" />
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin relative z-10" />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] italic animate-pulse">Scanning Global Nodes for Anomalies...</p>
                </div>
            ) : anomalies?.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500/5 group-hover:scale-110 transition-transform duration-1000">
                        <CheckCircle size={240} strokeWidth={1} />
                    </div>
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10 relative z-10">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter relative z-10">Systems Nominal</h3>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest italic opacity-60 relative z-10">No supply chain deviations detected on current cluster.</p>
                </div>
            ) : anomalies?.map((alert) => (
                <Card key={alert._id} className={cn(
                    "group transition-all duration-700 border-none overflow-hidden bg-white shadow-2xl shadow-black/5 relative hover:-translate-y-1",
                    alert.status === 'OPEN' ? "hover:shadow-red-500/10 shadow-red-500/5 ring-1 ring-red-500/20" : "opacity-80 grayscale-[0.5] hover:grayscale-0"
                )}>
                    <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-gray-50 h-full min-h-[280px]">
                        {/* Severity Indicator */}
                        <div className={cn(
                            "w-full xl:w-24 p-8 flex xl:flex-col items-center justify-center gap-6 transition-all duration-500",
                            alert.status === 'OPEN' 
                                ? (alert.severity === 'HIGH' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500")
                                : "bg-emerald-50 text-emerald-500"
                        )}>
                            <div className="text-[10px] font-black uppercase tracking-widest writing-mode-vertical xl:rotate-180 xl:vertical-text mb-2">{alert.severity} Risk</div>
                            <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm transform group-hover:scale-110 transition-transform">
                                {alert.status === 'OPEN' ? <ShieldAlert size={28} /> : <CheckCircle size={28} />}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-10 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <Zap size={150} />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <span className="px-5 py-2 bg-gray-50 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border border-gray-100">{alert.type}</span>
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                        <Clock size={12} /> {new Date(alert.createdAt).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10 italic">
                                        <Info size={12} /> BATCH::{alert.batchId}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none uppercase mb-6">{alert.description}</h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-gray-50 relative z-10">
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Impacted Entity</span>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 transition-colors group-hover:bg-primary group-hover:text-white">
                                                <UserIcon size={14} />
                                            </div>
                                            <span className="text-xs font-black uppercase text-gray-700 tracking-tight">{alert.affectedUserId?.organization || alert.affectedUserId?.name || 'Network Node'}</span>
                                        </div>
                                    </div>
                                    {alert.resolvedAt && (
                                        <div className="flex flex-col border-l border-gray-100 pl-8">
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Resolution</span>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                    <CheckCircle size={14} />
                                                </div>
                                                <span className="text-xs font-black text-emerald-600 truncate max-w-[200px] italic">"{alert.resolution}"</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {alert.status === 'OPEN' && (
                                    <button 
                                        onClick={() => handleResolve(alert._id)}
                                        className="px-10 py-5 bg-gray-950 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-primary shadow-2xl shadow-black/10 hover:shadow-primary/30 active:scale-95 transition-all text-center group/btn"
                                    >
                                        Initiate Mitigation <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </AdminLayout>
  );
};

export default AdminAnomalyAlerts;
