import React from 'react';
import ManufacturerLayout from '@/components/shared/ManufacturerLayout';
import { Card } from '@/components/shared/UI';
import { QrCode, Download, ExternalLink, Search, LayoutGrid, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const QRManagement = () => {
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['manufacturerProducts'],
        queryFn: async () => {
            const resp = await api.get('/manufacturer/products');
            return resp.data || [];
        }
    });

    return (
        <ManufacturerLayout portalName="Synthesis Plant Hub">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Consumer Transparency</div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">QR Registry Hub</h1>
                    <p className="text-gray-500 font-medium mt-1">Managing secure cryptographic QR codes for consumer batch verification.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gray-50/10">
                            <h3 className="font-bold text-lg text-gray-800">Active QR Assets</h3>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input className="w-full pl-10 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/20 text-xs font-bold shadow-sm" placeholder="Search Batch ID..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-6 md:gap-8">
                            {isLoading ? (
                                <div className="col-span-1 md:col-span-2 py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                            ) : products.filter(p => p.qrCode?.data).length > 0 ? (
                                products.filter(p => p.qrCode?.data).map((product) => (
                                    <div key={product._id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:border-primary-light transition-all flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                                        <div className="w-32 h-32 bg-white p-3 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow relative shrink-0">
                                            <img src={product.qrCode?.data} alt="QR Code" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                                                <Download size={24} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.productBatchId}</div>
                                            <h4 className="text-lg font-black text-gray-900 mb-1 leading-tight">{product.productName}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-4 italic">{product.productType}</p>
                                            
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                <a 
                                                    href={product.qrCode?.data} 
                                                    download={`${product.productBatchId}-QR.png`}
                                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2"
                                                >
                                                    <Download size={14} /> Download
                                                </a>
                                                <button 
                                                    onClick={() => window.open(`/verify/${product.productBatchId}`, '_blank')}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-primary hover:border-primary transition-all"
                                                >
                                                    <ExternalLink size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-1 md:col-span-2 py-20 text-center">
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
        </ManufacturerLayout>
    );
};

export default QRManagement;
