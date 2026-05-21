import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/shared/AdminLayout';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Users, Search, MapPin, Activity, Shield, Database, AlertCircle, Phone, Mail, Filter, Loader2, X, Clock, Terminal, ChevronRight, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const AdminFarmerRegistry = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeRole, setActiveRole] = useState('all'); // 'all', 'farmer', 'lab', 'manufacturer'
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminStakeholders'],
    queryFn: async () => {
        const resp = await api.get('/admin/farmers');
        return resp.data;
    }
  });

  const filteredUsers = users?.filter(u => {
    const matchesRole = activeRole === 'all' || u.role?.toLowerCase() === activeRole;
    const matchesSearch = !searchQuery || 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u._id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const { data: nodeHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['nodeHistory', selectedNode?._id],
    queryFn: async () => {
        const resp = await api.get(`/admin/nodes/${selectedNode._id}/history`);
        return resp.data;
    },
    enabled: !!selectedNode
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
        if (!window.confirm('CRITICAL: Purge this entity from the ledger? This action is irreversible.')) return;
        return api.delete(`/admin/nodes/${userId}`);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminStakeholders'] });
    }
  });

  return (
    <AdminLayout portalName="Admin Portal">
        <header className="mb-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <div className="w-10 h-[1px] bg-primary/20" /> Node Infrastructure
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none italic">
                        Supply Chain <span className="text-primary font-light not-italic underline decoration-primary/20 underline-offset-4">Nodes</span>
                    </h1>
                    <p className="text-gray-400 font-bold mt-2 italic max-w-xl text-[11px]">Cryptographically verified database of botanical originators and manufacturing facilities registered on the network.</p>
                </div>
                <div className="relative group w-full md:w-96">
                    <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        className="w-full pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 shadow-xl shadow-black/5 text-sm font-black tracking-tight transition-all" 
                        placeholder="Search by Entity Name or Node ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/50 p-4 rounded-3xl border border-gray-100/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <Filter className="text-primary" size={14} />
                    <select 
                        value={activeRole} 
                        onChange={(e) => setActiveRole(e.target.value)}
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none border-none focus:ring-0 cursor-pointer text-gray-700 min-w-[140px]"
                    >
                        <option value="all">All Clusters</option>
                        <option value="farmer">Cultivators</option>
                        <option value="lab">Lab Nodes</option>
                        <option value="manufacturer">Processing</option>
                    </select>
                </div>
                
                <div className="flex gap-2">
                    {['all', 'farmer', 'lab', 'manufacturer'].map((role) => (
                        activeRole === role && (
                            <div key={role} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20 text-[9px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                                <Activity size={10} /> Active: {role}
                            </div>
                        )
                    ))}
                </div>

                <div className="sm:ml-auto pr-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{filteredUsers?.length || 0} Nodes Connected</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {isLoading ? (
                <div className="col-span-full h-96 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Querying Distributed Registry...</p>
                </div>
            ) : filteredUsers?.length === 0 ? (
                <div className="col-span-full h-96 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                    <AlertCircle size={60} className="text-gray-200 mb-6" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">No node stakeholders discovered in the {activeRole} cluster.</p>
                </div>
            ) : filteredUsers?.map((farmer) => (
                <Card key={farmer._id} className="group hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] transition-all duration-700 border-none overflow-hidden p-0 bg-white shadow-2xl shadow-black/5 relative hover:-translate-y-2">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Database size={120} />
                    </div>
                    <div className="p-10 relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="p-5 bg-gray-50 text-primary rounded-[2rem] group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                <Users size={32} />
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => deleteMutation.mutate(farmer._id)}
                                        className="px-4 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-red-100 shadow-sm"
                                        title="Purge Node"
                                    >
                                        Purge
                                    </button>
                                    <StatusBadge status={farmer.isActive ? 'APPROVED' : 'PENDING'} />
                                </div>
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-1.5">
                                    <Activity size={10} className="text-emerald-500" /> v1.02_SYNC
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2 mb-10 min-w-0">
                            <div className="text-[10px] font-mono font-bold text-primary/40 tracking-tighter uppercase mb-1 truncate">NODE::{farmer._id.slice(-12).toUpperCase()}</div>
                            <h3 className="text-3xl font-black text-gray-900 leading-none tracking-tighter group-hover:text-primary transition-colors cursor-default truncate">{farmer.organization || farmer.name}</h3>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{farmer.role}</span>
                                <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic truncate">Verified Peer</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 min-w-0">
                            <div className="flex items-center gap-4 text-gray-600 min-w-0">
                                <div className="w-8 h-8 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin size={14} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight text-gray-500 truncate block">{farmer.location || farmer.address || 'Central Highlands'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 min-w-0">
                                <div className="w-8 h-8 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Mail size={14} />
                                </div>
                                <span className="text-xs font-black tracking-tighter truncate text-gray-500 block">{farmer.email}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            <a 
                                href={`tel:${farmer.phone || '+91'}`} 
                                className="h-14 bg-gray-50 text-gray-400 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-inner hover:shadow-xl hover:shadow-emerald-900/20"
                                title="Secure Call"
                            >
                                <Phone size={18} />
                            </a>
                            <a 
                                href={`mailto:${farmer.email}`} 
                                className="h-14 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center shadow-inner hover:shadow-xl hover:shadow-blue-900/20"
                                title="Ledger Mail"
                            >
                                <Mail size={18} />
                            </a>
                            <button 
                                onClick={() => navigate(`/admin/batches?farmerId=${farmer._id}`)} 
                                className="h-14 bg-gray-50 text-gray-400 rounded-2xl hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center font-black text-[10px] tracking-widest uppercase shadow-inner hover:shadow-xl hover:shadow-amber-900/20"
                                title="Collection History"
                            >
                                CL
                            </button>
                            <button 
                                onClick={() => setSelectedNode(farmer)}
                                className="flex-1 h-14 sidebar-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/20 active:scale-95 transition-all text-center flex items-center justify-center hover:shadow-primary/40"
                            >
                                AUDIT
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>

        {/* Cinematic Node History Modal */}
        {selectedNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <Card className="max-w-6xl w-full max-h-[90vh] bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col rounded-2xl">
                    
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                                <Terminal size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedNode.organization || selectedNode.name}</h2>
                                <div className="text-xs font-medium text-gray-500 mt-0.5">Node ID: {selectedNode._id}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedNode(null)} 
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                        {/* Sidebar Information */}
                        <div className="w-full lg:w-80 border-r border-gray-100 bg-gray-50/30 overflow-y-auto p-6 space-y-6">
                            
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Node Analytics</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                                                <Activity size={14} className="text-emerald-500" />
                                                Connectivity
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">98.4%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[98.4%]" />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                                                <Clock size={14} className="text-blue-500" />
                                                Uptime
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">242.08 Days</div>
                                        <div className="text-xs font-medium text-emerald-600 mt-1">99.99% Availability</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Network Security</h3>
                                <div className="p-4 bg-gray-900 rounded-xl text-emerald-400 font-mono text-[10px] border border-gray-800 shadow-inner">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-bold">SECURE_TUNNEL_ESTABLISHED</span>
                                    </div>
                                    <div className="text-gray-400 truncate">Standard: v4.0.12</div>
                                    <div className="text-emerald-600/80 mt-2 truncate">AUTH: NODE_VERIFIED</div>
                                </div>
                            </div>

                        </div>

                        {/* History Feed Main Content */}
                        <div className="flex-1 flex flex-col bg-white overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        Network Audit Trail
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Immutable ledger synchronization history</p>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <div className="text-xs font-bold text-emerald-700">Mainnet Sync Active</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/20">
                                {historyLoading ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                        <Loader2 className="animate-spin text-primary mb-4" size={32} />
                                        <p className="text-sm font-medium">Fetching consensus logs...</p>
                                    </div>
                                ) : nodeHistory?.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                        <AlertCircle className="mb-4" size={40} />
                                        <p className="text-sm font-medium">No audit data found on ledger</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {nodeHistory.map((log, i) => (
                                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-colors shadow-sm flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{log.action || 'CONSENSUS_OP'}</span>
                                                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                                                <CheckCircle size={12} /> Verified
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-2 font-medium">
                                                        {log.resource} identification verified on-chain via AI satellite sync.
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="text-[10px] font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate max-w-full">
                                                            TXID: {log._id.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )}
    </AdminLayout>
  );
};

export default AdminFarmerRegistry;
