import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card } from '@/components/shared/UI';
import { ShieldCheck, History, Map as MapIcon, Flag, Globe, Info, Activity, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const data = [
    { name: 'Solan', vol: 450, qual: 98 },
    { name: 'Ooty', vol: 320, qual: 95 },
    { name: 'Haridwar', vol: 600, qual: 99 },
    { name: 'Shimla', vol: 280, qual: 97 },
    { name: 'Rishikesh', vol: 510, qual: 96 },
];

const RegulatorTrends = () => {
  const sidebarItems = [
    { label: 'Compliance Audit', to: '/regulator', icon: ShieldCheck },
    { label: 'Audit Trail', to: '/regulator/audit', icon: History },
    { label: 'Regional Trends', to: '/regulator/trends', icon: MapIcon, end: true },
    { label: 'Anomaly Reports', to: '/regulator/reports', icon: Flag },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar portalName="AYUSH / Regulator" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-10 animate-in fade-in duration-500">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <MapIcon size={14} /> Geospatial Intelligence
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Regional Yield Trends</h1>
                <p className="text-gray-500 font-bold mt-2 italic">Predictive analytics and quality mapping across Indian botanical clusters.</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 p-8 border-none shadow-sm relative overflow-hidden bg-gray-900 text-white min-h-[400px]">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h3 className="text-xl font-black mb-1">Live Cultivation Map</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global Supply Chain Hotspots</p>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border border-emerald-500/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div> Live Monitoring
                    </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                    <Globe size={300} className="text-emerald-500/20" />
                </div>

                <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-6 relative z-10">
                    {[
                        { l: 'High Yield', v: 'North India', d: '+12%' },
                        { l: 'Purest Grade', v: 'Himalayan Range', d: '99.2%' },
                        { l: 'New Nodes', v: 'Western Ghats', d: '42 Active' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{s.l}</div>
                            <div className="text-lg font-black">{s.v}</div>
                            <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1">
                                <ArrowUpRight size={10} className="text-emerald-500" /> {s.d} WoW Growth
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-8 border-none shadow-sm bg-white">
                <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
                    Quality Index <Info size={14} className="text-gray-400" />
                </h3>
                <div className="h-[250px] w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="qual" fill="#2D6A4F" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-[11px] text-gray-500 font-medium leading-relaxed">
                        "Regional trends indicate a massive surge in Himalayan Ashwagandha quality, likely due to recent soil conservation initiatives."
                    </div>
                </div>
            </Card>
        </div>

        <Card className="p-8 border-none shadow-sm bg-white">
            <h3 className="text-xl font-black text-gray-900 mb-8">Supply Volume Analysis</h3>
            <div className="h-[300px] w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="vol" stroke="#2D6A4F" strokeWidth={4} fillOpacity={1} fill="url(#colorVol)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </main>
    </div>
  );
};

export default RegulatorTrends;
