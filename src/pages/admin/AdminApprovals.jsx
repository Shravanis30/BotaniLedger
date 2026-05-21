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
        <header className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Governance & Identity
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Access Approvals
                </h1>
                <p className="text-gray-500 mt-1 max-w-xl text-sm">Ministry gateway for authorizing new blockchain node operators and verifying laboratory credentials for high-trust certification.</p>
            </div>
            
            <div className="relative group w-full xl:w-64">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                    {filterTabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                            {tab.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Clock size={14} />
                </div>
            </div>
        </header>

        <div className="flex flex-col gap-4">
            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-200">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-sm font-medium text-gray-500">Loading registrations...</p>
                </div>
            ) : users?.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-200">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mb-4 opacity-50" />
                    <h3 className="text-lg font-bold text-gray-900">Queue is Clear</h3>
                    <p className="text-sm text-gray-500 mt-1">All {filter} stakeholders have been processed.</p>
                </div>
            ) : users?.map((stk) => (
                <Card key={stk._id} className="group hover:border-primary/30 transition-all duration-200 border-gray-200 bg-white shadow-sm hover:shadow-md relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Status Strip */}
                        <div className={cn(
                            "w-full lg:w-2 h-2 lg:h-auto transition-colors",
                            stk.isActive ? 'bg-emerald-500' : 'bg-amber-500'
                        )}></div>

                        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-center">
                            {/* Entity Info */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 text-gray-600 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-mono text-gray-500 mb-1 truncate">ID: {stk._id.slice(-8).toUpperCase()}</div>
                                    <div className="text-lg font-bold text-gray-900 truncate" title={stk.organization || stk.name}>{stk.organization || stk.name}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs font-semibold text-gray-600 capitalize">Role: {stk.role}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                        <StatusBadge status={stk.isActive ? 'APPROVED' : 'PENDING'} />
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600 min-w-0">
                                    <MapPin size={16} className="text-gray-400 shrink-0" />
                                    <span className="text-sm text-gray-600 truncate">{stk.location || 'Distributed Cluster'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 min-w-0">
                                    <Clock size={16} className="text-gray-400 shrink-0" />
                                    <span className="text-sm text-gray-600 truncate">Joined: {new Date(stk.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Audit Evidence</span>
                                    <FileSearch size={14} className="text-gray-400" />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-primary shrink-0">
                                        <Shield size={16} />
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 truncate">{stk.verificationDoc || 'identity_ledger.pdf'}</div>
                                </div>
                                <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-primary hover:bg-gray-50 transition-colors">
                                    View Credential
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                {!stk.isActive ? (
                                    <>
                                        <button 
                                            onClick={() => verifyMutation.mutate({ userId: stk._id, status: 'approve' })}
                                            disabled={verifyMutation.isPending}
                                            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
                                        >
                                            {verifyMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle size={16} /> Authorize</>}
                                        </button>
                                        <button 
                                            onClick={() => verifyMutation.mutate({ userId: stk._id, status: 'reject' })}
                                            disabled={verifyMutation.isPending}
                                            className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-semibold gap-2">
                                        <CheckCircle size={20} />
                                        Verified Peer
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
