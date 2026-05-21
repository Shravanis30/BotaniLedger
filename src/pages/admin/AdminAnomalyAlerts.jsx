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
        <header className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Threat Intelligence Response
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Anomaly Intelligence
                </h1>
                <p className="text-sm text-gray-500 max-w-xl">Automated satellite monitoring and blockchain integrity alerts. View and resolve potential supply chain deviations in real-time.</p>
            </div>
            
            <div className="flex gap-4 w-full xl:w-auto overflow-x-auto no-scrollbar pb-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-lg border border-red-100 text-red-700">
                    <ShieldAlert size={18} />
                    <span className="text-sm font-semibold">{anomalies?.filter(a => a.status === 'OPEN').length || 0} Active Alerts</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-700">
                    <CheckCircle size={18} />
                    <span className="text-sm font-semibold">{anomalies?.filter(a => a.status === 'RESOLVED').length || 0} Resolved</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
                <div className="h-[300px] flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-sm font-medium text-gray-500">Scanning for Anomalies...</p>
                </div>
            ) : anomalies?.length === 0 ? (
                <div className="h-[300px] flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Systems Nominal</h3>
                    <p className="text-sm text-gray-500">No supply chain deviations detected.</p>
                </div>
            ) : anomalies?.map((alert) => (
                <Card key={alert._id} className={cn(
                    "group transition-all bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border",
                    alert.status === 'OPEN' ? "border-red-200" : "border-gray-200 opacity-90"
                )}>
                    <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
                        {/* Severity Indicator */}
                        <div className={cn(
                            "w-full xl:w-48 p-6 flex items-center justify-center gap-3",
                            alert.status === 'OPEN' 
                                ? (alert.severity === 'HIGH' ? "bg-red-50/50 text-red-700" : "bg-amber-50/50 text-amber-700")
                                : "bg-emerald-50/50 text-emerald-700"
                        )}>
                            {alert.status === 'OPEN' ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
                            <span className="text-sm font-bold uppercase tracking-wider">{alert.severity} Risk</span>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600 uppercase border border-gray-200">{alert.type}</span>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                        <Clock size={14} /> {new Date(alert.createdAt).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-primary font-medium text-sm bg-primary/5 px-3 py-1 rounded border border-primary/20">
                                        <Info size={14} /> Batch: {alert.batchId}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">{alert.description}</h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-500 mb-1">Impacted Entity</span>
                                        <div className="flex items-center gap-2">
                                            <UserIcon size={16} className="text-gray-400" />
                                            <span className="text-sm font-semibold text-gray-900">{alert.affectedUserId?.organization || alert.affectedUserId?.name || 'Network Node'}</span>
                                        </div>
                                    </div>
                                    {alert.resolvedAt && (
                                        <div className="flex flex-col pl-6 border-l border-gray-200">
                                            <span className="text-xs font-medium text-gray-500 mb-1">Resolution</span>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-emerald-500" />
                                                <span className="text-sm font-medium text-emerald-700">"{alert.resolution}"</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {alert.status === 'OPEN' && (
                                    <button 
                                        onClick={() => handleResolve(alert._id)}
                                        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                                    >
                                        Mitigate <ArrowRight size={16} />
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
