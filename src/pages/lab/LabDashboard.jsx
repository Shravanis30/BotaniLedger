import React from 'react';
import { Link } from 'react-router-dom';
import LabLayout from '@/components/shared/LabLayout';
import { Card, Skeleton } from '@/components/shared/UI';
import { Microscope, FileCheck, AlertTriangle, List, FlaskConical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const LabDashboard = () => {
    const { data: batches = [], isLoading } = useQuery({
        queryKey: ['labPending'],
        queryFn: async () => {
            const resp = await api.get('/lab/pending');
            return resp.data || [];
        }
    });

    const stats = [
        { label: "Pending Queue", value: batches.length.toString().padStart(2, '0'), color: "text-amber-600", icon: List },
        { label: "Operational Labs", value: "04", color: "text-primary", icon: FileCheck },
        { label: "Pass Rate", value: "98.4%", color: "text-success", icon: Microscope },
        { label: "Alerts Issued", value: "00", color: "text-red-500", icon: AlertTriangle },
    ];

    return (
        <LabLayout portalName="Lab Tester Node">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Test Queue</h1>
                <p className="text-gray-500 font-medium">Authorizing chemical signatures and heavy metal compliance.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((s, i) => (
                    <Card key={i} className="p-6">
                        <s.icon size={18} className={cn("mb-4", s.color)} />
                        {isLoading ? (
                            <Skeleton className="h-8 w-16 mb-2" />
                        ) : (
                            <div className="text-2xl font-bold">{s.value}</div>
                        )}
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
                    </Card>
                ))}
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest font-black text-gray-400">
                            <tr>
                                <th className="px-8 py-5">Batch Identity</th>
                                <th className="px-8 py-5">Herb Species</th>
                                <th className="px-8 py-5">Origin Zone</th>
                                <th className="px-8 py-5 text-center">Protocol</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-8 py-6"><Skeleton className="h-12 w-full" /></td>
                                    </tr>
                                ))
                            ) : batches.length > 0 ? (
                                batches.map((batch, i) => (
                                    <tr key={batch._id || i} className="group hover:bg-primary/[0.02] transition-colors">
                                        <td className="px-8 py-7 font-mono text-xs font-bold text-primary whitespace-nowrap">
                                            {batch.batchId}
                                        </td>
                                        <td className="px-8 py-7 min-w-[200px]">
                                            <div className="font-black text-gray-900 text-sm mb-0.5">{batch.herbSpecies?.common}</div>
                                            <div className="text-[10px] text-gray-400 font-medium italic lowercase">{batch.herbSpecies?.scientific}</div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg w-fit whitespace-nowrap">
                                                {batch.location?.zone || 'Assigned Belt'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <span className={cn(
                                                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                                i === 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                            )}>
                                                {i === 0 ? "URGENT" : "STANDARD"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <Link 
                                                to={`/lab/test/${batch.batchId}`}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-mid transition-all shadow-xl shadow-green-900/10 active:scale-95 whitespace-nowrap"
                                            >
                                                <FlaskConical size={14} /> Perform Test
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                                                <FileCheck size={32} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-gray-800 uppercase tracking-widest">Queue Clear</p>
                                                <p className="text-xs font-medium text-gray-400">All herbal batches have been processed and certified.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </LabLayout>
    );
};

export default LabDashboard;
