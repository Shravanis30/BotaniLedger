import React from 'react';
import LabLayout from '@/components/shared/LabLayout';
import { Card } from '@/components/shared/UI';
import { 
    Microscope, TrendingUp, BarChart3, PieChart as PieChartIcon, Loader2, FileX
} from 'lucide-react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const LabAnalytics = () => {
    const { data: analytics = {}, isLoading } = useQuery({
        queryKey: ['labAnalytics'],
        queryFn: async () => {
            const resp = await api.get('/lab/analytics');
            return resp.data;
        }
    });

    const qualityData = analytics?.qualityData || [];
    const passFailData = analytics?.passFailData || [];
    const trendData = analytics?.trendData || [];

    const COLORS = ['#1B4332', '#DC2626'];

    if (isLoading) {
        return (
            <LabLayout portalName="Lab Tester Node">
                <div className="h-[60vh] flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-primary mb-4" size={48} />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Aggregating Cryptographic Proofs...</p>
                </div>
            </LabLayout>
        );
    }

    const hasData = qualityData.length > 0 || passFailData.some(d => d.value > 0);

    return (
        <LabLayout portalName="Lab Tester Node">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <TrendingUp size={14} /> Performance Hub
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none italic">
                        Quality <span className="text-primary font-light not-italic">Analytics</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-3 italic text-sm">Aggregated laboratory insights and botanical purity trends.</p>
                </div>
            </header>

            {!hasData ? (
                <div className="h-[50vh] bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 text-center shadow-2xl shadow-black/5">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
                        <FileX size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Insufficient Audit Data</h3>
                    <p className="text-gray-500 text-sm max-w-sm">No laboratory certificates have been anchored to the ledger from this node yet. Visual trends will populate as audits are completed.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Main Bar Chart */}
                        <Card className="lg:col-span-2 p-10 border-none shadow-2xl shadow-black/5 bg-white relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-lg font-black text-gray-900 italic tracking-tight uppercase">Herb Purity Index (%)</h3>
                                <BarChart3 className="text-gray-300" size={20} />
                            </div>
                            <div className="h-[350px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={qualityData}>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="herb" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} domain={[0, 100]} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: 800, fontSize: '10px' }}
                                        />
                                        <Bar dataKey="purity" fill="#2D6A4F" radius={[12, 12, 0, 0]} barSize={40} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Pie Chart */}
                        <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white flex flex-col group overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-lg font-black text-gray-900 italic tracking-tight uppercase">Audit Status</h3>
                                <PieChartIcon className="text-gray-300" size={20} />
                            </div>
                            <div className="flex-1 h-[250px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={passFailData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                            animationBegin={200}
                                            animationDuration={1500}
                                        >
                                            {passFailData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 800, fontSize: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-4">
                                    <ShieldCheck size={28} className="text-primary/10 mb-1" />
                                    <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Consensus</div>
                                </div>
                            </div>
                            <div className="space-y-4 mt-8">
                                {passFailData.map((entry, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full shadow-lg group-hover/item:scale-125 transition-transform" style={{ backgroundColor: COLORS[i] }}></div>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{entry.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Trend Chart */}
                    <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 italic tracking-tight uppercase">Testing Volume Velocity</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Daily Ledger Activity (Rolling 7D Window)</p>
                            </div>
                            <Loader2 className="text-primary/20 animate-spin-slow" size={24} />
                        </div>
                        <div className="h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: 800, fontSize: '10px' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#2D6A4F" 
                                        strokeWidth={5} 
                                        dot={{ r: 8, fill: '#2D6A4F', strokeWidth: 4, stroke: '#fff', shadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                                        activeDot={{ r: 10, shadow: '0 0 20px rgba(45,106,79,0.3)' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </>
            )}
        </LabLayout>
    );
};

export default LabAnalytics;
