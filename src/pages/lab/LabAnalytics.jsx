import React from 'react';
import LabLayout from '@/components/shared/LabLayout';
import { Card } from '@/components/shared/UI';
import { 
    Microscope, TrendingUp, BarChart3, PieChart as PieChartIcon 
} from 'lucide-react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const LabAnalytics = () => {
    const qualityData = [
        { herb: 'Ashwagandha', purity: 98.4, content: 2.5 },
        { herb: 'Brahmi', purity: 96.2, content: 1.8 },
        { herb: 'Tulsi', purity: 99.1, content: 3.2 },
        { herb: 'Neem', purity: 94.8, content: 1.5 },
        { herb: 'Amla', purity: 97.6, content: 2.1 },
    ];

    const passFailData = [
        { name: 'Passed', value: 420 },
        { name: 'Failed', value: 15 },
    ];

    const COLORS = ['#1B4332', '#DC2626'];

    const trendData = [
        { date: '04-08', count: 12 },
        { date: '04-09', count: 18 },
        { date: '04-10', count: 15 },
        { date: '04-11', count: 22 },
        { date: '04-12', count: 28 },
        { date: '04-13', count: 35 },
    ];

    return (
        <LabLayout portalName="Lab Tester Node">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <TrendingUp size={14} /> Performance Hub
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Quality Analytics</h1>
                    <p className="text-gray-500 font-medium mt-1">Aggregated laboratory insights and botanical purity trends.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Bar Chart */}
                <Card className="lg:col-span-2 p-8 border-none shadow-sm min-w-0">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-gray-800">Herb Purity Index (%)</h3>
                        <BarChart3 className="text-gray-300" size={20} />
                    </div>
                    <div className="h-[300px] w-full min-h-[300px]">
                        <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                            <BarChart data={qualityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="herb" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} domain={[90, 100]} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="purity" fill="#2D6A4F" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Pie Chart */}
                <Card className="p-8 border-none shadow-sm min-w-0">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-gray-800">Audit Status</h3>
                        <PieChartIcon className="text-gray-300" size={20} />
                    </div>
                    <div className="h-[250px] w-full min-h-[250px]">
                        <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={passFailData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {passFailData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-6">
                        {passFailData.map((entry, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{entry.name}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Trend Chart */}
            <Card className="p-8 border-none shadow-sm h-full min-w-0">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-lg font-black text-gray-800">Testing Volume Velocity</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Daily Throughput (7 Days)</p>
                    </div>
                </div>
                <div className="h-[300px] w-full min-h-[300px]">
                    <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#2D6A4F" strokeWidth={4} dot={{ r: 6, fill: '#2D6A4F', strokeWidth: 3, stroke: '#fff' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </LabLayout>
    );
};

export default LabAnalytics;
