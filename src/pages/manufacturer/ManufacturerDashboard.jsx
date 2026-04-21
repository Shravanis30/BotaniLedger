import React from 'react';
import ManufacturerLayout from '@/components/shared/ManufacturerLayout';
import { Card, StatusBadge, Skeleton } from '@/components/shared/UI';
import { Factory, PackageSearch, RefreshCw, List, CheckCircle2, QrCode, ArrowRight, PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const ManufacturerDashboard = () => {
    const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
        queryKey: ['manufacturerInventory'],
        queryFn: async () => {
            const resp = await api.get('/manufacturer/inventory');
            return resp.data || [];
        }
    });

    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ['manufacturerProducts'],
        queryFn: async () => {
            const resp = await api.get('/manufacturer/products');
            return resp.data || [];
        }
    });

    const stats = [
        { l: "Available Verified", v: inventory.filter(b => b.blockchainRecord?.status === 'LAB_PASSED' || b.blockchainRecord?.status === 'RECEIVED').length.toString().padStart(2, '0'), c: "text-primary", i: PackageSearch },
        { l: "In Production", v: products.length.toString().padStart(2, '0'), c: "text-blue-600", i: RefreshCw },
        { l: "Similarity Pass", v: "92.8%", c: "text-success", i: CheckCircle2 },
        { l: "QR Codes Active", v: products.length.toString(), c: "text-orange-600", i: QrCode },
    ];

    return (
        <ManufacturerLayout portalName="Synthesis Plant Hub">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Formulation Inventory</h1>
                    <p className="text-gray-500 font-medium mt-1">Managing verified herbal ingredients for production batches.</p>
                </div>
                <Link to="/manufacturer/products" className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-mid transition-all shadow-lg shadow-green-900/10 active:scale-95">
                    <PlusCircle size={18} /> New Product Batch
                </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((s, i) => (
                    <Card key={i} className="p-6">
                        <s.i size={18} className={cn("mb-4", s.c)} />
                        {inventoryLoading || productsLoading ? (
                            <Skeleton className="h-8 w-16 mb-2" />
                        ) : (
                            <div className="text-2xl font-bold">{s.v}</div>
                        )}
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.l}</div>
                    </Card>
                ))}
            </div>

            <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-800">Available Verified Herb Batches</h3>
                <Card className="overflow-hidden border-none shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest font-black text-gray-400">
                                <tr>
                                    <th className="px-8 py-5">Batch ID</th>
                                    <th className="px-8 py-5">Herb Species</th>
                                    <th className="px-8 py-5">Lab Status</th>
                                    <th className="px-8 py-5">Receipt</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {inventoryLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={5} className="px-8 py-6"><Skeleton className="h-12 w-full" /></td>
                                        </tr>
                                    ))
                                ) : inventory.length > 0 ? (
                                    inventory.map((batch, i) => (
                                        <tr key={batch._id || i} className="group hover:bg-primary/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-mono text-xs font-bold text-primary whitespace-nowrap">{batch.batchId}</td>
                                            <td className="px-8 py-6 min-w-[150px]">
                                                <div className="font-bold text-gray-900 text-sm mb-0.5">{batch.herbSpecies?.common}</div>
                                                <div className="text-[10px] text-gray-400 font-medium italic lowercase">{batch.herbSpecies?.scientific}</div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-[10px] font-bold text-primary italic uppercase tracking-widest">
                                                        {batch.blockchainRecord?.status === 'RECEIVED' ? 'Confirmed ✓' : 'In Transit'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right whitespace-nowrap">
                                                <Link to="/manufacturer/verify" className="text-xs font-bold text-primary hover:underline flex items-center justify-end gap-1">
                                                    Process <ArrowRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                            Inventory Empty. No verified herb batches available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </ManufacturerLayout>
    );
};

export default ManufacturerDashboard;
