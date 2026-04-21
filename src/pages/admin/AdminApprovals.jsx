import React, { useState } from 'react';
import AdminLayout from '@/components/shared/AdminLayout';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Shield, Clock, CheckCircle, XCircle, Building2, MapPin, FileSearch, Loader2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const AdminApprovals = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'all'

  // Fetch real users from backend with filter
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers', filter],
    queryFn: async () => {
      const resp = await api.get(`/admin/farmers?status=${filter}`);
      return resp.data;
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ userId, status }) => {
      return api.post(`/admin/verify/${userId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const filterTabs = [
    { id: 'pending', label: 'Pending Review', icon: Clock },
    { id: 'approved', label: 'Authorized Nodes', icon: CheckCircle },
    { id: 'all', label: 'Total Registry', icon: Filter },
  ];

  return (
    <AdminLayout portalName="Admin Portal">
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div>
                <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <div className="w-10 h-[1px] bg-primary/20" /> Governance & Identity
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                    Access <span className="text-primary font-light not-italic underline decoration-primary/20 underline-offset-4">Approvals</span>
                </h1>
                <p className="text-gray-400 font-bold mt-2 italic max-w-xl text-[11px] leading-relaxed">Ministry gateway for authorizing new blockchain node operators and verifying laboratory credentials for high-trust certification.</p>
            </div>
            
            <div className="relative group w-full xl:w-72">
                <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={16} />
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-xl shadow-black/5 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer"
                >
                    {filterTabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                            {tab.label.toUpperCase()}
                        </option>
                    ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Clock size={14} />
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
            {isLoading ? (
                <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                        <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                    </div>
                    <p className="text-xs font-black text-gray-400 animate-pulse uppercase tracking-[0.4em] italic">Accessing Registration Ledger...</p>
                </div>
            ) : users?.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/5 group-hover:scale-110 transition-transform duration-1000">
                        <Shield size={240} strokeWidth={1} />
                    </div>
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-6 opacity-30 relative z-10" />
                    <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter relative z-10">Queue is Clear</h3>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest italic font-bold relative z-10">All {filter} stakeholder nodes have been synchronized.</p>
                </div>
            ) : users?.map((stk) => (
                <Card key={stk._id} className="group hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-700 border-none overflow-hidden bg-white shadow-2xl shadow-black/5 relative hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row min-h-[220px]">
                        {/* Status Strip */}
                        <div className={cn(
                            "w-full md:w-3 min-h-[10px] md:min-h-full transition-colors duration-500",
                            stk.isActive ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                        )}></div>

                        <div className="flex-1 p-10 grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
                            {/* Entity Info */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-5">
                                    <div className="p-5 bg-gray-50 text-primary rounded-[2rem] group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                        <Building2 size={32} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-mono font-black text-primary/40 uppercase tracking-tighter mb-1">REG-ID::{stk._id.slice(-8).toUpperCase()}</div>
                                        <div className="text-3xl font-black text-gray-900 leading-none tracking-tighter italic uppercase group-hover:text-primary transition-colors">{stk.organization || stk.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 group-hover:bg-white transition-colors">
                                        Role: {stk.role}
                                    </span>
                                    <StatusBadge status={stk.isActive ? 'APPROVED' : 'PENDING'} />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-6 lg:pl-8 lg:border-l border-gray-50">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin size={14} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-tight text-gray-500">{stk.location || 'Distributed Cluster'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Clock size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Joined: {new Date(stk.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 group-hover:bg-white group-hover:shadow-2xl transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                    <FileSearch size={100} />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Audit Evidence</span>
                                    <FileSearch size={16} className="text-primary mb-1" />
                                </div>
                                <div className="flex items-center gap-4 mb-6 pt-4 border-t border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-primary group-hover:shadow-xl transition-all transform group-hover:rotate-6">
                                        <Shield size={24} />
                                    </div>
                                    <div className="text-xs font-black text-gray-700 italic truncate uppercase tracking-tighter">{stk.verificationDoc || 'identity_ledger_v1.pdf'}</div>
                                </div>
                                <button className="w-full py-3.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                                    View Node Credential
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 lg:pl-8">
                                {!stk.isActive && (
                                    <>
                                        <button 
                                            onClick={() => verifyMutation.mutate({ userId: stk._id, status: 'approve' })}
                                            disabled={verifyMutation.isPending}
                                            className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-green-900/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {verifyMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Authorize Node</>}
                                        </button>
                                        <button 
                                            onClick={() => verifyMutation.mutate({ userId: stk._id, status: 'reject' })}
                                            disabled={verifyMutation.isPending}
                                            className="w-full py-4 bg-white border-2 border-red-50 text-red-500 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-50 transition-all disabled:opacity-50 italic"
                                        >
                                            <XCircle size={18} /> Block Entry
                                        </button>
                                    </>
                                )}
                                {stk.isActive && (
                                    <div className="text-center p-8 bg-emerald-50 text-emerald-700 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] border-2 border-emerald-100/50 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 flex flex-col items-center gap-3 italic">
                                        <CheckCircle size={28} />
                                        Verified Network Peer
                                    </div>
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

export default AdminApprovals;
