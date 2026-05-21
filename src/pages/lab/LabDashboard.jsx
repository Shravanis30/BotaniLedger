import React from 'react';
import { Link } from 'react-router-dom';
import LabLayout from '@/components/shared/LabLayout';
import { Card, Skeleton } from '@/components/shared/UI';
import { Microscope, FileCheck, AlertTriangle, List, FlaskConical, Search, Filter } from 'lucide-react';
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
            <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Active Test Queue</h1>
                    <p className="text-sm text-gray-500 mt-1">Authorizing chemical signatures and heavy metal compliance.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((s, i) => (
                    <Card key={i} className="p-4 border border-gray-200 shadow-sm bg-white rounded-lg flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16 mb-1" />
                            ) : (
                                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                            )}
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <s.icon size={24} className={s.color} />
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-lg">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search batches..." 
                            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-64"
                        />
                    </div>
                    <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <Filter size={16} /> Filter
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Batch Identity</th>
                                <th className="px-6 py-3">Herb Species</th>
                                <th className="px-6 py-3">Origin Zone</th>
                                <th className="px-6 py-3 text-center">Protocol</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                                    </tr>
                                ))
                            ) : batches.length > 0 ? (
                                batches.map((batch, i) => (
                                    <tr key={batch._id || i} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-medium text-primary whitespace-nowrap">
                                            {batch.batchId}
                                        </td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="font-bold text-gray-900 text-sm mb-0.5">{batch.herbSpecies?.common}</div>
                                            <div className="text-xs text-gray-500 font-medium">{batch.herbSpecies?.scientific}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200 w-fit whitespace-nowrap">
                                                {batch.location?.zone || 'Assigned Belt'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded text-xs font-semibold",
                                                i === 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                            )}>
                                                {i === 0 ? "URGENT" : "STANDARD"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                to={`/lab/test/${batch.batchId}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors shadow-sm whitespace-nowrap"
                                            >
                                                <FlaskConical size={14} /> Perform Test
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                                <FileCheck size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-700">Queue Clear</p>
                                                <p className="text-xs text-gray-500">All herbal batches have been processed and certified.</p>
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
