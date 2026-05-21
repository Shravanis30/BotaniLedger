import React from 'react';
import AdminLayout from '@/components/shared/AdminLayout';
import { Card } from '@/components/shared/UI';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, Database, AlertCircle, Scan, Activity, Shield,
    ArrowUpRight, ArrowDownRight, Download, Globe, Loader2, CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const COLORS = ['#1B4332', '#4CAF50', '#BF953F', '#DC2626', '#3B82F6'];

const AdminDashboard = () => {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const resp = await api.get('/admin/stats');
            return resp.data;
        }
    });

    const { data: anomalies, isLoading: anomaliesLoading } = useQuery({
        queryKey: ['adminAnomalies'],
        queryFn: async () => {
            const resp = await api.get('/admin/anomalies');
            return resp.data;
        }
    });

    const statCards = [
        { label: "Total Batches", value: stats?.totalBatches || "0", diff: "+4.2%", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Farmers", value: stats?.activeUsers || "0", diff: "+2", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Lab Thruput", value: "98.2%", diff: "-0.4%", icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Anomalies", value: stats?.openAnomalies || "0", diff: "-1", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
        { label: "Public Scans", value: "24.1k", diff: "+18%", icon: Scan, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Nodes Alive", value: "12/12", diff: "100%", icon: Activity, color: "text-success", bg: "bg-green-50" },
    ];

    return (
        <AdminLayout portalName="Admin Portal">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                        System Control Hub
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Network Intelligence
                    </h1>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg font-semibold text-gray-600 text-sm hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-colors">
                        <Download size={16} /> Export
                    </button>
                    <button className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark shadow-sm transition-colors">
                        <Activity size={16} /> Audit
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat, i) => (
                    <Card key={i} className="p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative rounded-xl bg-white">
                        {statsLoading && i < 4 && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 animate-pulse">
                                <Loader2 className="animate-spin text-primary" size={20} />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-3">
                            <div className={cn("p-2.5 rounded-lg", stat.bg, stat.color)}>
                                <stat.icon size={20} />
                            </div>
                            <span className={cn(
                                "text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1",
                                stat.diff.startsWith('+') ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                            )}>
                                {stat.diff.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {stat.diff}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-500">{stat.label}</div>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <Card className="xl:col-span-2 p-6 border border-gray-200 shadow-sm bg-white rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">Batch Registration Volume</h3>
                            <div className="text-sm text-gray-500 mt-1">Global supply chain throughput (30D)</div>
                        </div>
                        <select className="text-sm font-medium border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer bg-white">
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={stats?.batchVolume || []}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '13px' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 border border-gray-200 shadow-sm bg-white flex flex-col rounded-xl">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Ledger Status</h3>
                    <div className="text-sm text-gray-500 mb-8">Network-wide batch verification state</div>
                    <div className="flex-1 min-h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={stats?.statusDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={800}
                                >
                                    {(stats?.statusDistribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <Database size={24} className="text-gray-300" />
                        </div>
                    </div>
                    <div className="space-y-2 mt-6">
                        {(stats?.statusDistribution || []).map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-sm font-medium text-gray-600 capitalize">{entry.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{entry.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>


        </AdminLayout>
    );
};

export default AdminDashboard;
