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
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                        <div className="w-8 h-[1px] bg-primary/20" /> System Control Hub
                    </div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter leading-none italic">
                        Network <span className="text-primary font-light not-italic underline decoration-primary/20 underline-offset-4 tracking-normal">Intelligence</span>
                    </h1>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-5 py-3.5 bg-white border border-gray-100 rounded-2xl font-black text-gray-600 text-[9px] uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-3 shadow-xl shadow-black/5 active:scale-95 transition-all">
                        <Download size={14} /> Export JSON
                    </button>
                    <button className="flex-1 md:flex-none px-7 py-3.5 sidebar-gradient text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                        <Activity size={14} /> Network Audit
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
                {statCards.map((stat, i) => (
                    <Card key={i} className="p-6 border-none shadow-xl shadow-black/5 hover:shadow-primary/10 transition-all group overflow-hidden relative">
                        {statsLoading && i < 4 && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 animate-pulse">
                                <Loader2 className="animate-spin text-primary" size={20} />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                <stat.icon size={20} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-0.5",
                                stat.diff.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                            )}>
                                {stat.diff.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {stat.diff}
                            </span>
                        </div>
                        <div className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-12">
                <Card className="xl:col-span-2 p-10 border-none shadow-2xl shadow-black/5 bg-white relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <div>
                            <h3 className="font-black text-xl text-gray-900 italic tracking-tight uppercase">Batch Registration Volume</h3>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global supply chain throughput (30D)</div>
                        </div>
                        <select className="text-[10px] font-black uppercase tracking-widest border-2 border-gray-50 rounded-xl px-4 py-2 outline-none focus:border-primary/20 cursor-pointer">
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.batchVolume || []}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: 800, fontSize: '12px' }}
                                    cursor={{ stroke: '#4CAF50', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white flex flex-col">
                    <h3 className="font-black text-xl text-gray-900 italic tracking-tight uppercase mb-2">Ledger Status</h3>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Network-wide batch verification state</div>
                    <div className="flex-1 h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.statusDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationBegin={200}
                                    animationDuration={1500}
                                >
                                    {(stats?.statusDistribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 800 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <Database size={32} className="text-gray-100" />
                        </div>
                    </div>
                    <div className="space-y-3 mt-8">
                        {(stats?.statusDistribution || []).map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-lg group-hover:scale-125 transition-transform" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{entry.name}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">{entry.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white overflow-hidden relative">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-black text-xl text-gray-900 italic tracking-tight uppercase">Anomaly Intelligence</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live threat detection feed</p>
                        </div>
                        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-2 border-primary/10 px-4 py-2 rounded-xl hover:bg-primary/5 transition-all">View Full Registry</button>
                    </div>
                    <div className="space-y-6">
                        {anomaliesLoading ? (
                            <div className="h-64 flex flex-col items-center justify-center">
                                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Querying Anomaly DB...</div>
                            </div>
                        ) : anomalies?.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-200 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                <CheckCircle className="mb-4 text-emerald-400 opacity-50" size={60} />
                                <p className="text-xs font-black uppercase tracking-widest">Integrity Check: Success</p>
                            </div>
                        ) : anomalies?.slice(0, 3).map((alert, i) => (
                            <div key={i} className="group p-6 bg-gray-50/50 rounded-3xl border-2 border-transparent hover:border-red-100 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-red-900/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            alert.severity === 'HIGH' ? "bg-red-500 animate-pulse outline outline-8 outline-red-500/10" : "bg-amber-500"
                                        )}></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{alert.type}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold bg-white px-3 py-1 rounded-full border border-gray-100">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <h4 className="text-lg font-black text-gray-900 italic leading-tight mb-6">{alert.description}</h4>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                    <span className="text-[9px] font-mono font-black text-primary/60 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/5">TXREF: {alert.batchId}</span>
                                    <div className="flex gap-4">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Dismiss</button>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-2">
                                            Investigate <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-10 border-none shadow-2xl shadow-black/5 flex flex-col relative overflow-hidden group min-h-[500px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="font-black text-xl text-gray-900 italic tracking-tight uppercase">Global Traffic</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Satellite ledger propagation map</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Telemetry Live</span>
                            </div>
                        </div>
                        <div className="flex-1 relative bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden flex items-center justify-center p-4 group-hover:bg-white transition-colors duration-500">
                            {/* Cinematic Dot Grid Map */}
                            <svg viewBox="0 0 800 400" className="w-full h-full opacity-[0.15]">
                                {Array.from({ length: 48 }).map((_, i) => 
                                    Array.from({ length: 24 }).map((_, j) => (
                                        <circle 
                                            key={`${i}-${j}`}
                                            cx={i * 16 + 8} 
                                            cy={j * 16 + 8} 
                                            r="1" 
                                            fill="#2D6A4F"
                                        />
                                    ))
                                )}
                            </svg>
                            
                            {/* Animated Pings */}
                            <div className="absolute inset-0">
                                {[
                                    { top: '60%', left: '72%', label: 'India Hub' },
                                    { top: '35%', left: '82%', label: 'Tokyo Axis' },
                                    { top: '45%', left: '25%', label: 'Americas' },
                                    { top: '40%', left: '50%', label: 'EU Core' }
                                ].map((hub, i) => (
                                    <div key={i} className="absolute" style={{ top: hub.top, left: hub.left }}>
                                        <div className="relative group/ping">
                                            <div className="absolute -inset-6 bg-primary/20 rounded-full animate-ping" />
                                            <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_20px_#2D6A4F] ring-4 ring-white" />
                                            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/ping:opacity-100 transition-opacity">
                                                <span className="text-[9px] font-black text-white uppercase tracking-tighter bg-gray-900 px-3 py-1.5 rounded-xl shadow-2xl">
                                                    {hub.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <Globe className="w-16 h-16 text-primary/[0.03] mb-4 animate-[spin_30s_linear_infinite]" />
                                <div className="text-[10px] font-black text-primary/[0.08] uppercase tracking-[1em] translate-x-[0.5em] italic">Network Latency: 42ms</div>
                            </div>
                        </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
