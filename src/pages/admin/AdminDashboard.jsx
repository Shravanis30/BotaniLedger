import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { 
  BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Shield, Users, Database, AlertCircle, Scan, Activity, 
  ArrowUpRight, ArrowDownRight, Search, Filter, Download, Globe
} from 'lucide-react';
import { demoAlerts, demoBatches } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const data = [
  { name: 'W1', value: 400 },
  { name: 'W2', value: 300 },
  { name: 'W3', value: 600 },
  { name: 'W4', value: 800 },
  { name: 'W5', value: 500 },
  { name: 'W6', value: 900 },
];

const pieData = [
  { name: 'Approved', value: 65 },
  { name: 'Testing', value: 20 },
  { name: 'Rejected', value: 15 },
];

const COLORS = ['#1B4332', '#52B788', '#DC2626'];

const AdminDashboard = () => {
  const sidebarItems = [
    { label: 'Network Overview', to: '/admin', icon: Activity, end: true },
    { label: 'Batch Explorer', to: '/admin/batches', icon: Database },
    { label: 'Farmer Registry', to: '/admin/farmers', icon: Users },
    { label: 'Anomaly Alerts', to: '/admin/alerts', icon: AlertCircle },
  ];

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen">
      <Sidebar portalName="Admin Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-end mb-10">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">System Control</div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Network Intelligence</h1>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:bg-gray-50 flex items-center gap-2">
                <Download size={18} /> Export Reports
             </button>
             <button className="px-5 py-3 sidebar-gradient text-white rounded-xl font-bold text-sm shadow-xl shadow-green-900/20 flex items-center gap-2">
                <Activity size={18} /> Network Audit
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
            {[
                { label: "Total Batches", value: "8,241", diff: "+4.2%", icon: Database, color: "text-blue-600" },
                { label: "Active Farmers", value: "1,402", diff: "+2", icon: Users, color: "text-emerald-600" },
                { label: "Lab Thruput", value: "98.2%", diff: "-0.4%", icon: Shield, color: "text-purple-600" },
                { label: "Anomalies", value: "04", diff: "-1", icon: AlertCircle, color: "text-red-500" },
                { label: "Public Scans", value: "24.1k", diff: "+18%", icon: Scan, color: "text-amber-500" },
                { label: "Nodes Alive", value: "12/12", diff: "100%", icon: Activity, color: "text-success" },
            ].map((stat, i) => (
                <Card key={i} className="p-5 border-none shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <stat.icon size={18} className={stat.color} />
                        <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                            stat.diff.startsWith('+') ? "bg-success/10 text-success" : "bg-red-50 text-red-500"
                        )}>
                            {stat.diff.startsWith('+') ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />} {stat.diff}
                        </span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </Card>
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <Card className="lg:col-span-2 p-8 border-none shadow-sm">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-lg text-gray-800">Batch Registration Volume (30D)</h3>
                    <select className="text-xs font-bold border rounded-lg px-2 py-1 outline-none">
                        <option>Last 30 Days</option>
                        <option>Last Quarter</option>
                    </select>
                 </div>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#2D6A4F', strokeWidth: 2 }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#2D6A4F" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </Card>

            <Card className="p-8 border-none shadow-sm">
                <h3 className="font-bold text-lg text-gray-800 mb-8">Status Distribution</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                    {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{entry.value}%</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        {/* Anomaly Alerts Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 border-none shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-800">Operational Anomaly Alerts</h3>
                    <StatusBadge status="PENDING" />
                </div>
                <div className="space-y-4">
                    {demoAlerts.map((alert, i) => (
                        <div key={i} className="group p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-100 hover:bg-white transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        alert.severity === 'HIGH' ? "bg-red-500 animate-pulse" : "bg-amber-500"
                                    )}></div>
                                    <span className="text-xs font-bold uppercase tracking-widest">{alert.type}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{alert.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-primary italic">BATCH REF: {alert.batchId}</span>
                                <div className="flex gap-2">
                                    <button className="text-[10px] font-bold uppercase text-gray-400 hover:text-gray-600">Dismiss</button>
                                    <button className="text-[10px] font-bold uppercase text-red-500 hover:text-red-700">Investigate</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-8 border-none shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-gray-800 mb-6">Global Scan Traffic</h3>
                <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="text-center">
                        <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-sm italic text-gray-400 font-medium">World map visualization rendering...</p>
                    </div>
                </div>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
