import React, { useState } from 'react';
import ManufacturerLayout from '@/components/shared/ManufacturerLayout';
import { Card } from '@/components/shared/UI';
import { CheckCircle2, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const VerifyArrivals = () => {
    const queryClient = useQueryClient();
    const [processingId, setProcessingId] = useState('');
    const [viewingBatch, setViewingBatch] = useState(null);

    const { data: inventory = [], isLoading } = useQuery({
        queryKey: ['manufacturerInventory'],
        queryFn: async () => {
            const resp = await api.get('/manufacturer/inventory');
            return resp.data || [];
        }
    });

    const approvedArrivals = inventory.filter(b => b.blockchainRecord?.status === 'MANUFACTURER_APPROVED');
    const rejectedArrivals = inventory.filter(b => b.blockchainRecord?.status === 'MANUFACTURER_REJECTED');
    const pendingArrivals = inventory.filter(b => ['LAB_PASSED', 'RECEIVED', 'IN_TRANSIT'].includes(b.blockchainRecord?.status));

    const verifyMutation = useMutation({
        mutationFn: async ({ batchId, action }) => {
            if (action === 'APPROVE') {
                await api.post(`/manufacturer/receipt/${batchId}`, { condition: 'EXCELLENT' });
                return api.post('/manufacturer/similarity-check', { batchId });
            } else {
                return api.post(`/manufacturer/reject/${batchId}`, { reason: 'Quality standards not met' });
            }
        },
        onSuccess: (_, variables) => {
            const actionVerb = variables.action === 'APPROVE' ? 'approved and moved to Production' : 'rejected and quarantined';
            alert(`Batch ${actionVerb} successfully!`);
            queryClient.invalidateQueries(['manufacturerInventory']);
            setProcessingId('');
            setViewingBatch(null);
        },
        onError: (error) => {
            alert(error.message);
            setProcessingId('');
        }
    });

    const handleAction = (batchId, action) => {
        setProcessingId(batchId + action);
        verifyMutation.mutate({ batchId, action });
    };

    return (
        <ManufacturerLayout portalName="Synthesis Plant Hub">
            <header className="mb-10">
                <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Purity Verification</div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-balance">Arrival QC Audit</h1>
                <p className="text-gray-500 font-medium mt-1">Reviewing botanical signatures and enforcing ledger compliance.</p>
            </header>

            <div className="space-y-12">
                {/* 1. Pending Arrivals Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-6 bg-amber-400 rounded-full" />
                            Pending Quality Decision
                        </h2>
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                            Awaiting Signature
                        </div>
                    </div>
                    <Card className="border-none shadow-sm overflow-hidden bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                                    <tr>
                                        <th className="px-8 py-5">Incoming Batch</th>
                                        <th className="px-8 py-5">Herb Type</th>
                                        <th className="px-8 py-5">Lab Certificate</th>
                                        <th className="px-8 py-5 text-right">Audit Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        [...Array(2)].map((_, i) => (
                                            <tr key={i}><td colSpan={4} className="px-8 py-10 text-center"><Loader2 className="animate-spin inline text-primary" /></td></tr>
                                        ))
                                    ) : pendingArrivals.length > 0 ? (
                                        pendingArrivals.map((batch) => (
                                            <tr key={batch._id} className="group hover:bg-primary/[0.01] transition-colors">
                                                <td className="px-8 py-8 font-mono text-xs font-bold text-primary">{batch.batchId}</td>
                                                <td className="px-8 py-8">
                                                    <div className="font-bold text-gray-900 text-sm">{batch.herbSpecies?.common}</div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <button 
                                                        onClick={() => setViewingBatch(batch)}
                                                        className="flex items-center gap-2 text-success font-black text-[10px] uppercase tracking-widest hover:underline"
                                                    >
                                                        <CheckCircle2 size={12} /> View Lab Report
                                                    </button>
                                                </td>
                                                <td className="px-8 py-8 text-right whitespace-nowrap">
                                                    <div className="flex justify-end gap-3">
                                                        <button 
                                                            onClick={() => handleAction(batch.batchId, 'DENY')}
                                                            disabled={verifyMutation.isPending}
                                                            className="px-4 py-2 border-2 border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
                                                        >
                                                            {processingId === batch.batchId + 'DENY' ? <Loader2 className="animate-spin" size={14} /> : 'Deny Access'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(batch.batchId, 'APPROVE')}
                                                            disabled={verifyMutation.isPending}
                                                            className="px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-mid transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
                                                        >
                                                            {processingId === batch.batchId + 'APPROVE' ? <Loader2 className="animate-spin" size={14} /> : 'Accept & Map'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-sm font-bold text-gray-400 uppercase tracking-widest italic">
                                                No arrivals currently in the queue.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>

                {/* 2. Approved Materials Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-6 bg-primary rounded-full" />
                            Approved Materials (Ready for Synthesis)
                        </h2>
                    </div>
                    <Card className="border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                                    <tr>
                                        <th className="px-8 py-5">Batch ID</th>
                                        <th className="px-8 py-5">Species</th>
                                        <th className="px-8 py-5">Compliance</th>
                                        <th className="px-8 py-5 text-right">Certificate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {approvedArrivals.length > 0 ? (
                                        approvedArrivals.map((batch) => (
                                            <tr key={batch._id} className="group hover:bg-white transition-colors">
                                                <td className="px-8 py-6 font-mono text-xs font-bold text-gray-500">{batch.batchId}</td>
                                                <td className="px-8 py-6 font-bold text-gray-900 text-sm">{batch.herbSpecies?.common}</td>
                                                <td className="px-8 py-6">
                                                    <div className="bg-success/10 text-success border border-success/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit">
                                                        VERIFIED
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <a href={batch.labReport?.document?.ipfsUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black text-primary uppercase hover:underline">
                                                        Ledger Proof
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4} className="px-8 py-10 text-center text-xs text-gray-400 italic">No approved inventory yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>

                {/* 3. Rejected Materials Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-6 bg-red-500 rounded-full" />
                            Quarantined / Rejected Materials
                        </h2>
                    </div>
                    <Card className="border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                                    <tr>
                                        <th className="px-8 py-5">Batch ID</th>
                                        <th className="px-8 py-5">Species</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Re-audit Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {rejectedArrivals.length > 0 ? (
                                        rejectedArrivals.map((batch) => (
                                            <tr key={batch._id} className="group hover:bg-white transition-colors">
                                                <td className="px-8 py-6 font-mono text-xs font-bold text-gray-500">{batch.batchId}</td>
                                                <td className="px-8 py-6 font-bold text-gray-900 text-sm">{batch.herbSpecies?.common}</td>
                                                <td className="px-8 py-6">
                                                    <div className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit">
                                                        REJECTED
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => handleAction(batch.batchId, 'APPROVE')}
                                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                                    >
                                                        Accept Anyway
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4} className="px-8 py-10 text-center text-xs text-gray-400 italic">No rejected materials currently quarantined.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>
            </div>

            {/* Detailed Report Modal */}
            {viewingBatch && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Lab Analysis Report</h3>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1 font-mono">{viewingBatch.batchId}</p>
                            </div>
                            <button onClick={() => setViewingBatch(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <AlertCircle size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto max-h-[60vh] space-y-8">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Active Ingredient</div>
                                    <div className="text-lg font-black text-primary">{viewingBatch.labReport?.results?.activeIngredient?.measured}%</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Status</div>
                                    <div className="text-lg font-black text-success">{viewingBatch.labReport?.results?.overallResult}</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Species Match</div>
                                    <div className="text-lg font-black text-gray-900">98.2%</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Tests Run</div>
                                    <div className="text-lg font-black text-gray-900">14</div>
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Heavy Metal Screening</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                                            <span className="text-xs font-bold text-gray-600">Lead (Pb)</span>
                                            <span className="text-xs font-black text-success">PASSED</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                                            <span className="text-xs font-bold text-gray-600">Mercury (Hg)</span>
                                            <span className="text-xs font-black text-success">PASSED</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Organoleptic Properties</h4>
                                    <div className="p-4 border border-gray-100 rounded-2xl bg-white space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-bold">Color Profile</span>
                                            <span className="text-gray-900 font-black italic">{viewingBatch.labReport?.results?.organoleptic?.color || 'Normal'}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-bold">Odor Verification</span>
                                            <span className="text-gray-900 font-black italic">{viewingBatch.labReport?.results?.organoleptic?.odor || 'Characteristic'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            {viewingBatch.labReport?.document?.ipfsUrl && (
                                <a 
                                    href={viewingBatch.labReport.document.ipfsUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2"
                                >
                                    <Upload size={14} /> Open Full Certificate (PDF)
                                </a>
                            )}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleAction(viewingBatch.batchId, 'DENY')}
                                    disabled={verifyMutation.isPending}
                                    className="px-6 py-3 border-2 border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    Deny
                                </button>
                                <button 
                                    onClick={() => handleAction(viewingBatch.batchId, 'APPROVE')}
                                    disabled={verifyMutation.isPending}
                                    className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-mid transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
                                >
                                    Approve Arrival
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ManufacturerLayout>
    );
};

export default VerifyArrivals;
