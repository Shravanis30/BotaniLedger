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
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Formulation Inventory</h1>
                    <p className="text-sm text-gray-500">Managing verified herbal ingredients for production batches.</p>
                </div>
                <Link to="/manufacturer/products" className="w-full md:w-auto px-5 py-2.5 bg-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-sm">
                    <PlusCircle size={16} /> New Product Batch
                </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <Card key={i} className="p-5 border border-gray-200 shadow-sm bg-white rounded-xl">
                        <div className="p-2.5 bg-gray-50 rounded-lg w-max mb-4">
                            <s.i size={20} className={s.c} />
                        </div>
                        {inventoryLoading || productsLoading ? (
                            <Skeleton className="h-8 w-16 mb-1" />
                        ) : (
                            <div className="text-2xl font-bold text-gray-900 mb-1">{s.v}</div>
                        )}
                        <div className="text-xs font-medium text-gray-500">{s.l}</div>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Available Verified Herb Batches</h3>
                <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">Batch ID</th>
                                    <th className="px-6 py-4">Herb Species</th>
                                    <th className="px-6 py-4">Lab Status</th>
                                    <th className="px-6 py-4">Receipt</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {inventoryLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={5} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                                        </tr>
                                    ))
                                ) : inventory.length > 0 ? (
                                    inventory.map((batch, i) => (
                                        <tr key={batch._id || i} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-medium text-primary whitespace-nowrap">{batch.batchId}</td>
                                            <td className="px-6 py-4 min-w-[150px]">
                                                <div className="font-bold text-gray-900 text-sm mb-0.5">{batch.herbSpecies?.common}</div>
                                                <div className="text-xs text-gray-500 font-medium">{batch.herbSpecies?.scientific}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs font-semibold text-primary">
                                                        {batch.blockchainRecord?.status === 'RECEIVED' ? 'Confirmed ✓' : 'In Transit'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Link to="/manufacturer/verify" className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center justify-end gap-1 transition-colors">
                                                    Process <ArrowRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="text-sm font-medium text-gray-500">
                                                Inventory Empty. No verified herb batches available.
                                            </div>
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
