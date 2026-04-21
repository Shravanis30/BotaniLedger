import React, { useState } from 'react';
import ManufacturerLayout from '@/components/shared/ManufacturerLayout';
import { Card } from '@/components/shared/UI';
import { CheckCircle2, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const VerifyArrivals = () => {
    const queryClient = useQueryClient();
    const [selectedBatchId, setSelectedBatchId] = useState('');

    const { data: inventory = [], isLoading } = useQuery({
        queryKey: ['manufacturerInventory'],
        queryFn: async () => {
            const resp = await api.get('/manufacturer/inventory');
            return resp.data || [];
        }
    });

    const pendingArrivals = inventory.filter(b => b.blockchainRecord?.status === 'LAB_PASSED' || b.blockchainRecord?.status === 'IN_TRANSIT');

    const verifyMutation = useMutation({
        mutationFn: async (batchId) => {
            await api.post(`/manufacturer/receipt/${batchId}`, { condition: 'EXCELLENT' });
            return api.post('/manufacturer/similarity-check', { batchId });
        },
        onSuccess: () => {
            alert('Batch verified and similarity score recorded!');
            queryClient.invalidateQueries(['manufacturerInventory']);
            setSelectedBatchId('');
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    const handleVerify = (batchId) => {
        setSelectedBatchId(batchId);
        verifyMutation.mutate(batchId);
    };

    return (
        <ManufacturerLayout portalName="Synthesis Plant Hub">
            <header className="mb-10">
                <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Purity Verification</div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-balance">Arrival QC Audit</h1>
                <p className="text-gray-500 font-medium mt-1">Confirming laboratory signatures and AI similarity mapping for incoming herb clusters.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                    <Card className="border-none shadow-sm overflow-hidden bg-white">
                        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="font-bold text-lg text-gray-800">Pending Receipt Confirmation</h3>
                            <div className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-black uppercase border border-amber-100 italic">
                                Required: Cryptographic Signature
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                                    <tr>
                                        <th className="px-8 py-5">Batch Identity</th>
                                        <th className="px-8 py-5">Species</th>
                                        <th className="px-8 py-5">Lab Result</th>
                                        <th className="px-8 py-5 text-right">Audit Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        [...Array(3)].map((_, i) => (
                                            <tr key={i}><td colSpan={4} className="px-8 py-6 text-xs text-gray-400 italic">Decrypting signatures...</td></tr>
                                        ))
                                    ) : pendingArrivals.length > 0 ? (
                                        pendingArrivals.map((batch, i) => (
                                            <tr key={batch._id} className="group hover:bg-primary/[0.02] transition-colors">
                                                <td className="px-8 py-7 font-mono text-xs font-bold text-primary whitespace-nowrap">{batch.batchId}</td>
                                                <td className="px-8 py-7 min-w-[150px]">
                                                    <div className="font-bold text-gray-900 text-sm mb-0.5">{batch.herbSpecies?.common}</div>
                                                </td>
                                                <td className="px-8 py-7 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-success font-black text-[10px] uppercase tracking-widest bg-success/5 px-2 py-1 rounded w-fit border border-success/10">
                                                        Authenticated ✓
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7 text-right whitespace-nowrap">
                                                    <button 
                                                        onClick={() => handleVerify(batch.batchId)}
                                                        disabled={verifyMutation.isPending}
                                                        className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-mid transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
                                                    >
                                                        {selectedBatchId === batch.batchId && verifyMutation.isPending ? (
                                                            <Loader2 className="animate-spin mx-auto" size={14} />
                                                        ) : (
                                                            'Verify & Map'
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-sm font-bold text-gray-400 uppercase tracking-widest italic">
                                                No pending arrivals requiring verification.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-8 sidebar-gradient text-white border-none shadow-xl">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <AlertCircle size={18} className="text-secondary" />
                            QC Protocol 
                        </h3>
                        <div className="space-y-4 text-xs leading-relaxed text-green-50 font-medium opacity-90">
                            <p>Verification protocol includes:</p>
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Anchoring physical receipt to Hyperledger Core.</li>
                                <li>AI variety similarity mapping (85% min threshold).</li>
                                <li>Unlocking herb batches for synthesis plant access.</li>
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>
        </ManufacturerLayout>
    );
};

export default VerifyArrivals;
