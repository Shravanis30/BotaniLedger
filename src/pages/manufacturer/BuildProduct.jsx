import React, { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card } from '@/components/shared/UI';
import { Factory, List, CheckCircle2, QrCode, PlusCircle, Database, Package, Calendar, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const BuildProduct = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        productName: '',
        productType: 'HERBAL_SUPPLEMENT',
        linkedHerbBatches: [],
        manufacturingDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        quantity: ''
    });

    const sidebarItems = [
        { label: 'Inventory Hub', to: '/manufacturer', icon: List },
        { label: 'Verify Arrivals', to: '/manufacturer/verify', icon: CheckCircle2 },
        { label: 'Build Product', to: '/manufacturer/products', icon: Factory, end: true },
        { label: 'QR Management', to: '/manufacturer/qr', icon: QrCode },
    ];

    const { data: inventory = [] } = useQuery({
        queryKey: ['manufacturerInventory'],
        queryFn: async () => {
            const resp = await api.get('/manufacturer/inventory');
            return resp.data || [];
        }
    });

    const availableBatches = inventory.filter(b => 
        ['RECEIVED', 'MANUFACTURER_APPROVED'].includes(b.blockchainRecord?.status)
    );

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/manufacturer/product-batch', data),
        onSuccess: () => {
            alert('Production batch anchor success! QR codes generated.');
            queryClient.invalidateQueries(['manufacturerProducts']);
            setFormData({
                productName: '',
                productType: 'HERBAL_SUPPLEMENT',
                linkedHerbBatches: [],
                manufacturingDate: new Date().toISOString().split('T')[0],
                expiryDate: '',
                quantity: ''
            });
        },
        onError: (error) => alert(error.message)
    });

    const toggleBatchSelection = (id) => {
        setFormData(prev => ({
            ...prev,
            linkedHerbBatches: prev.linkedHerbBatches.includes(id)
                ? prev.linkedHerbBatches.filter(bId => bId !== id)
                : [...prev.linkedHerbBatches, id]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.linkedHerbBatches.length === 0) {
            return alert('Please select at least one source herb batch');
        }
        createMutation.mutate(formData);
    };

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            <Sidebar portalName="Manufacturer Hub" items={sidebarItems} />

            <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Production Line</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic">Converting verified biological assets into consumer formulations.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Card className="p-10 border-none shadow-xl bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16"></div>
                        <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                            <PlusCircle className="text-primary" size={24} /> New Production Batch
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Product Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold text-sm"
                                        placeholder="e.g. Immunity Formula v4"
                                        value={formData.productName}
                                        onChange={e => setFormData({...formData, productName: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Quantity (Units)</label>
                                        <input 
                                            type="number" 
                                            required 
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold text-sm"
                                            placeholder="5000"
                                            value={formData.quantity}
                                            onChange={e => setFormData({...formData, quantity: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Expiry Date</label>
                                        <input 
                                            type="date" 
                                            required 
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold text-sm"
                                            value={formData.expiryDate}
                                            onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10 border-t border-gray-50">
                                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Select Source Batches</h4>
                                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                    {availableBatches.length > 0 ? (
                                        availableBatches.map((batch) => (
                                            <div 
                                                key={batch._id}
                                                onClick={() => toggleBatchSelection(batch.batchId)}
                                                className={cn(
                                                    "p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group",
                                                    formData.linkedHerbBatches.includes(batch.batchId)
                                                        ? "border-primary bg-primary/[0.03] shadow-md shadow-green-900/5 scale-[1.01]"
                                                        : "border-gray-50 bg-white hover:border-gray-200"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                        formData.linkedHerbBatches.includes(batch.batchId) ? "bg-primary text-white" : "bg-gray-50 text-gray-400"
                                                    )}>
                                                        <Database size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-gray-900">{batch.batchId}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 italic">{batch.herbSpecies?.common}</div>
                                                    </div>
                                                </div>
                                                {formData.linkedHerbBatches.includes(batch.batchId) && (
                                                    <CheckCircle2 size={20} className="text-primary" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-2xl italic text-xs font-bold text-gray-400">
                                            No verified herb inventory available for production.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={createMutation.isPending || availableBatches.length === 0}
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-green-900/20 hover:bg-primary-mid transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {createMutation.isPending ? (
                                    <Loader2 size={24} className="animate-spin mx-auto" />
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        <Package size={20} className="group-hover:translate-y-[-2px] transition-transform" />
                                        Initialize Batch Anchor
                                    </span>
                                )}
                            </button>
                        </form>
                    </Card>

                    <div className="space-y-8">
                        <Card className="p-8 border-none shadow-sm bg-gray-900 text-white min-h-[300px] flex flex-col justify-between">
                            <h3 className="text-lg font-black italic text-emerald-400">Ledger Transparency Protocol</h3>
                            <p className="text-sm font-medium leading-relaxed opacity-60">
                                "Every production batch created here is cryptographically linked to its source biological assets. The Hyperledger fabric maintains a permanent, immutable record of this transformation, ensuring full upstream tracebility for regulators and consumers."
                            </p>
                            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Blockchain Sync Active
                                </div>
                                <div className="text-[10px] font-bold text-gray-500">v1.2.0-STABLE</div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BuildProduct;
