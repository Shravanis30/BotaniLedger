import React, { useState } from 'react';
import ManufacturerLayout from '@/components/shared/ManufacturerLayout';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Factory, Eye, Filter, Search, Loader2, QrCode, Download, X, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ProductionLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['manufacturerProducts'],
    queryFn: async () => {
      const resp = await api.get('/manufacturer/products');
      return resp.data || [];
    }
  });

  const generateQRMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await api.post(`/manufacturer/generate-qr/${id}`);
      return resp.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['manufacturerProducts'] });
      toast.success('QR Code generated and registered successfully');
      if (selectedQR && selectedQR._id === response.data?._id) {
        setSelectedQR(response.data);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to generate QR code');
    }
  });

  const filteredProducts = products.filter(p => 
    p.productBatchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQRAction = (product) => {
    if (product.qrCode?.data) {
      setSelectedQR(product);
    } else {
      generateQRMutation.mutate(product._id);
    }
  };

  return (
    <ManufacturerLayout portalName="Synthesis Plant Hub">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Production & <span className="text-primary font-light">Batch Log</span></h1>
            <p className="text-gray-500 font-medium mt-2 text-sm">Comprehensive history of all finished goods produced and serialized on-chain.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
              <Filter size={18} />
            </button>
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                className="w-full pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/20 text-xs font-bold shadow-sm" 
                placeholder="Search Production ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="group hover:shadow-md transition-all duration-500 border border-gray-200 p-0 overflow-hidden bg-white rounded-xl">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                      <Factory size={28} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Batch #{product.productBatchId}</div>
                      <StatusBadge status="ACTIVE" />
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-primary transition-colors">{product.productName}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span>Quantity: <span className="text-primary">{product.quantity} Units</span></span>
                      <span>•</span>
                      <span>{product.productType}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-50 mb-8">
                    <div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Produced</div>
                      <div className="text-xs font-bold text-gray-800">
                        {format(new Date(product.manufacturingDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Source Assets</div>
                      <div className="text-xs font-bold text-gray-800">
                        {product.linkedHerbBatches?.length || 0} Batches
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleQRAction(product)}
                      disabled={generateQRMutation.isPending && generateQRMutation.variables === product._id}
                      className={cn(
                        "flex-1 py-4 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95",
                        product.qrCode?.data 
                          ? "bg-green-50 border-green-100 text-green-600 hover:bg-green-100" 
                          : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                      )}
                    >
                      {generateQRMutation.isPending && generateQRMutation.variables === product._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : product.qrCode?.data ? (
                        <><CheckCircle2 size={14} /> View QR</>
                      ) : (
                        <><QrCode size={14} /> Generate QR</>
                      )}
                    </button>
                    <a 
                      href={`/verify/${product.productBatchId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all"
                    >
                      <Eye size={18} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
            <Factory className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No production records found</p>
          </div>
        )}

        {/* QR Modal */}
        {selectedQR && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <Card className="max-w-md w-full bg-white border border-gray-200 shadow-sm overflow-hidden relative rounded-xl">
              <button 
                onClick={() => setSelectedQR(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="p-10 text-center">
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Secure Product Identity</div>
                <h3 className="text-2xl font-black text-gray-900 mb-8">{selectedQR.productName}</h3>
                
                <div className="w-64 h-64 mx-auto bg-white p-4 rounded-xl border border-gray-200 mb-10">
                  <img 
                    src={selectedQR.qrCode?.data} 
                    alt="Product QR" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <a 
                    href={selectedQR.qrCode?.data}
                    download={`${selectedQR.productBatchId}-QR.png`}
                    className="w-full py-5 bg-primary text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm hover:bg-primary-mid transition-all"
                  >
                    <Download size={20} /> Download for Printing
                  </a>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Unique Production ID: {selectedQR.productBatchId}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
    </ManufacturerLayout>
  );
};

export default ProductionLog;
