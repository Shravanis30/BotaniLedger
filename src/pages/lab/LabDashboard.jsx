import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Microscope, Database, FileCheck, AlertTriangle, List, Upload, ArrowRight } from 'lucide-react';
import { demoBatches } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const LabDashboard = () => {
    const sidebarItems = [
        { label: 'Pending Tests', to: '/lab', icon: List, end: true },
        { label: 'Issued Certs', to: '/lab/certificates', icon: FileCheck },
        { label: 'Quality Analytics', to: '/lab/analytics', icon: Microscope },
    ];

    return (
        <div className="flex bg-background min-h-screen">
            <Sidebar portalName="Laboratory Portal" items={sidebarItems} />

            <main className="flex-1 ml-64 p-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Test Queue</h1>
                    <p className="text-gray-500 font-medium">Authorizing chemical signatures and heavy metal compliance.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { l: "Pending", v: "14", c: "text-amber-600", i: List },
                        { l: "Certified (Today)", v: "08", c: "text-primary", i: FileCheck },
                        { l: "Pass Rate", v: "98.4%", c: "text-success", i: Microscope },
                        { l: "Alerts Issued", v: "01", c: "text-red-500", i: AlertTriangle },
                    ].map((s, i) => (
                        <Card key={i} className="p-6">
                            <s.i size={18} className={cn("mb-4", s.c)} />
                            <div className="text-2xl font-bold">{s.v}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.l}</div>
                        </Card>
                    ))}
                </div>

                <Card>
                    <table className="w-full text-left table-zebra">
                        <thead className="bg-gray-50 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Batch ID</th>
                                <th className="px-6 py-4">Herb Name</th>
                                <th className="px-6 py-4">Submitted By</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {demoBatches.filter(b => b.status === 'LAB_TESTING').concat(demoBatches[0]).map((batch, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{batch.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-sm text-gray-800">{batch.herb.split(' (')[0]}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{batch.farmer}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-bold",
                                            i === 0 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {i === 0 ? "URGENT" : "STANDARD"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-mid transition-all shadow-md">
                                            <Upload size={14} /> Upload Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </main>
        </div>
    );
};

export default LabDashboard;
