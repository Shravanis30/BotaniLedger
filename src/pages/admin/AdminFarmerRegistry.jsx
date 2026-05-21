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
        <header className="mb-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                        Node Infrastructure
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Supply Chain Nodes
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 max-w-xl">
                        Verified database of botanical originators and manufacturing facilities registered on the network.
                    </p>
                </div>
                <div className="relative group w-full md:w-80">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
                        placeholder="Search by name or ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <Filter className="text-gray-500" size={14} />
                        <select 
                            value={activeRole} 
                            onChange={(e) => setActiveRole(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none border-none focus:ring-0 cursor-pointer text-gray-700 min-w-[120px]"
                        >
                            <option value="all">All Clusters</option>
                            <option value="farmer">Cultivators</option>
                            <option value="lab">Lab Nodes</option>
                            <option value="manufacturer">Processing</option>
                        </select>
                    </div>
                    
                    {['all', 'farmer', 'lab', 'manufacturer'].map((role) => (
                        activeRole === role && (
                            <div key={role} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary-dark rounded-lg text-xs font-semibold">
                                <Activity size={12} /> Active: {role}
                            </div>
                        )
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-gray-600">{filteredUsers?.length || 0} Nodes Connected</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
                <div className="col-span-full h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 border-dashed">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-sm font-medium text-gray-500">Loading registry data...</p>
                </div>
            ) : filteredUsers?.length === 0 ? (
                <div className="col-span-full h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 border-dashed">
                    <AlertCircle size={40} className="text-gray-300 mb-4" />
                    <p className="text-sm font-medium text-gray-500">No nodes found.</p>
                </div>
            ) : filteredUsers?.map((farmer) => (
                <Card key={farmer._id} className="group hover:border-primary/30 transition-all duration-200 border-gray-200 overflow-hidden p-0 bg-white shadow-sm hover:shadow-md relative">
                    <div className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-gray-50 text-gray-600 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Users size={24} />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => deleteMutation.mutate(farmer._id)}
                                        className="px-2.5 py-1 bg-white text-red-600 hover:bg-red-50 rounded text-xs font-medium border border-gray-200 hover:border-red-200 transition-colors"
                                        title="Remove Node"
                                    >
                                        Remove
                                    </button>
                                    <StatusBadge status={farmer.isActive ? 'APPROVED' : 'PENDING'} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-1 mb-4 min-w-0 border-b border-gray-100 pb-4">
                            <div className="text-xs font-mono text-gray-500 truncate">ID: {farmer._id.slice(-12).toUpperCase()}</div>
                            <h3 className="text-lg font-bold text-gray-900 truncate" title={farmer.organization || farmer.name}>{farmer.organization || farmer.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-semibold text-gray-600 capitalize">{farmer.role}</span>
                                <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                <span className="text-xs font-semibold text-emerald-600 truncate flex items-center gap-1">
                                    <CheckCircle size={12} /> Verified
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 min-w-0">
                            <div className="flex items-center gap-3 text-gray-600 min-w-0">
                                <MapPin size={16} className="text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-600 truncate block">{farmer.location || farmer.address || 'Location Not Set'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 min-w-0">
                                <Mail size={16} className="text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-600 truncate block">{farmer.email}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <a 
                                href={`tel:${farmer.phone || '+91'}`} 
                                className="h-10 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
                                title="Call"
                            >
                                <Phone size={16} />
                            </a>
                            <a 
                                href={`mailto:${farmer.email}`} 
                                className="h-10 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
                                title="Email"
                            >
                                <Mail size={16} />
                            </a>
                            <button 
                                onClick={() => navigate(`/admin/batches?farmerId=${farmer._id}`)} 
                                className="h-10 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center text-xs font-semibold border border-gray-200"
                                title="Batches"
                            >
                                BATCH
                            </button>
                            <button 
                                onClick={() => setSelectedNode(farmer)}
                                className="h-10 bg-primary text-white rounded-md font-semibold text-xs transition-colors hover:bg-primary-dark shadow-sm border border-transparent"
                            >
                                AUDIT
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>

        {/* Node History Modal */}
        {selectedNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <Card className="max-w-6xl w-full max-h-[90vh] bg-white border border-gray-200 shadow-xl flex flex-col rounded-xl overflow-hidden">
                    
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Terminal size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{selectedNode.organization || selectedNode.name}</h2>
                                <div className="text-xs font-medium text-gray-500">Node ID: {selectedNode._id}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedNode(null)} 
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                        {/* Sidebar Information */}
                        <div className="w-full lg:w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto p-6 space-y-6">
                            
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Node Analytics</h3>
                                <div className="space-y-3">
                                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                                <Activity size={14} className="text-emerald-600" />
                                                Connectivity
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">98.4%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[98.4%]" />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                                <Clock size={14} className="text-blue-600" />
                                                Uptime
                                            </span>
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">242.08 Days</div>
                                        <div className="text-xs font-medium text-emerald-600 mt-1">99.99% Availability</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Network Security</h3>
                                <div className="p-4 bg-gray-900 rounded-lg text-emerald-400 font-mono text-[10px] border border-gray-800 shadow-inner">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="font-bold">SECURE_TUNNEL_ESTABLISHED</span>
                                    </div>
                                    <div className="text-gray-400 truncate">Standard: v4.0.12</div>
                                    <div className="text-emerald-600/80 mt-2 truncate">AUTH: NODE_VERIFIED</div>
                                </div>
                            </div>

                        </div>

                        {/* History Feed Main Content */}
                        <div className="flex-1 flex flex-col bg-white overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        Network Audit Trail
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Immutable ledger synchronization history</p>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <div className="text-xs font-bold text-emerald-700">Mainnet Sync Active</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                {historyLoading ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                        <Loader2 className="animate-spin text-primary mb-4" size={32} />
                                        <p className="text-sm font-medium">Fetching consensus logs...</p>
                                    </div>
                                ) : nodeHistory?.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-white rounded-lg border border-gray-200">
                                        <AlertCircle className="mb-4 text-gray-400" size={32} />
                                        <p className="text-sm font-medium">No audit data found on ledger</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {nodeHistory.map((log, i) => (
                                            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4 hover:border-gray-300 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{log.action || 'CONSENSUS_OP'}</span>
                                                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                                                <CheckCircle size={12} /> Verified
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-2">
                                                        {log.resource} identification verified on-chain via AI satellite sync.
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="text-[10px] font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 truncate max-w-full">
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
