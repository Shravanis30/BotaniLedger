import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Shield, Clock, CheckCircle, XCircle, Building2, MapPin, FileSearch, Search, Activity, Database, Users, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const AdminApprovals = () => {
  const queryClient = useQueryClient();

  // Fetch real pending users from backend
  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ['pendingUsers'],
    queryFn: async () => {
      const resp = await api.get('/admin/pending-users');
      return resp.data;
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ userId, status }) => {
      return api.post(`/admin/verify/${userId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
    }
  });

  const sidebarItems = [
    { label: 'Network Overview', to: '/admin', icon: Activity },
    { label: 'Pending Approvals', to: '/admin/approvals', icon: Shield, end: true },
    { label: 'Batch Explorer', to: '/admin/batches', icon: Database },
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
                    <Shield size={14} /> Ministry Gateway
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">System Access Approvals</h1>
                <p className="text-gray-500 font-bold mt-2 italic">Verifying credentials and authorizing new blockchain node operators.</p>
            </div>
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-bold shadow-sm" placeholder="Search by Entity ID..." />
            </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-400 animate-pulse">Synchronizing with Registration Ledger...</p>
                </div>
            ) : pendingUsers?.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                    <p className="text-sm font-bold text-gray-900">Queue is Clear</p>
                    <p className="text-xs text-gray-400 mt-1">All stakeholder applications have been processed.</p>
                </div>
            ) : pendingUsers?.map((stk, i) => (
                <Card key={stk._id} className="group hover:shadow-2xl transition-all duration-500 border-none overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Status Strip */}
                        <div className={cn(
                            "w-2",
                            stk.role === 'FARMER' ? 'bg-emerald-500' : stk.role === 'LABORATORY' ? 'bg-blue-500' : 'bg-orange-500'
                        )}></div>

                        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                            {/* Entity Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stk._id.slice(-8).toUpperCase()}</div>
                                        <div className="text-xl font-black text-gray-900 leading-tight">{stk.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                        Role: {stk.role}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin size={16} className="text-primary" />
                                    <span className="text-sm font-bold">{stk.location || 'Remote Node'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock size={16} className="text-primary" />
                                    <span className="text-sm font-bold">Joined: {new Date(stk.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certification Attached</span>
                                    <FileSearch size={14} className="text-primary" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-primary group-hover:shadow-lg transition-all">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-xs font-bold text-gray-700 truncate">{stk.verificationDoc || 'identity_cert.jpg'}</div>
                                </div>
                                <button className="mt-3 w-full py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase text-primary hover:bg-primary hover:text-white transition-all">
                                    View Credential
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => verifyMutation.mutate({ userId: stk._id, status: 'approve' })}
                                    disabled={verifyMutation.isPending}
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-green-900/10 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {verifyMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Approve</>}
                                </button>
                                <button 
                                    onClick={() => verifyMutation.mutate({ userId: stk._id, status: 'reject' })}
                                    disabled={verifyMutation.isPending}
                                    className="w-full py-3 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    <XCircle size={16} /> Reject Access
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

export default AdminApprovals;
