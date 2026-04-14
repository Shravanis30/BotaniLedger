import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card } from '@/components/shared/UI';
import { QrCode, List, CheckCircle2, Factory, Download, ExternalLink, Search, LayoutGrid, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const QRManagement = () => {
    const sidebarItems = [
        { label: 'Inventory Hub', to: '/manufacturer', icon: List },
        { label: 'Verify Arrivals', to: '/manufacturer/verify', icon: CheckCircle2 },
        { label: 'Build Product', to: '/manufacturer/products', icon: Factory },
        { label: 'QR Management', to: '/manufacturer/qr', icon: QrCode, end: true },
    ];

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['manufacturerProducts'],
        queryFn: async () => {
            const resp = await api.get('/manufacturer/products');
            return resp.data || [];
        }
    });

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            <Sidebar portalName="Manufacturer Hub" items={sidebarItems} />

            <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Consumer Transparency</div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">QR Registry Hub</h1>
                        <p className="text-gray-500 font-medium mt-1">Managing secure cryptographic QR codes for consumer batch verification.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-sm bg-white overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-bold text-lg text-gray-800">Active QR Assets</h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input className="pl-10 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/20 text-xs font-bold" placeholder="Search Batch ID..." />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
                                {isLoading ? (
                                    <div className="col-span-2 py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                                ) : products.length > 0 ? (
                                    products.map((product) => (
                                        <div key={product._id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:border-primary-light transition-all flex items-center gap-8">
                                            <div className="w-32 h-32 bg-white p-3 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow relative">
                                                <img src={product.qrCode} alt="QR Code" className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                                                    <Download size={24} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.productBatchId}</div>
                                                <h4 className="text-lg font-black text-gray-900 mb-1">{product.productName}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-4 italic italic">{product.productType}</p>
                                                
                                                <div className="flex gap-2">
                                                    <a 
                                                        href={product.qrCode} 
                                                        download={`${product.productBatchId}-QR.png`}
                                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2"
                                                    >
                                                        <Download size={14} /> Download
                                                    </a>
                                                    <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-primary hover:border-primary transition-all">
                                                        <ExternalLink size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-20 text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                            <QrCode size={40} />
                                        </div>
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Registry Empty</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-8 border-none shadow-sm bg-white">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <LayoutGrid size={14} /> Scan Intelligence
                            </h4>
                            <div className="space-y-8">
                                <div className="pb-6 border-b border-gray-50">
                                    <div className="text-3xl font-black text-gray-900">2.4k</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Consumer Scans</div>
                                </div>
                                <div className="pb-6 border-b border-gray-50">
                                    <div className="text-3xl font-black text-gray-900">98%</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verification Confidence</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-gray-900">12s</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Verification Speed</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QRManagement;
