import React from 'react';
import ManufacturerLayout from '@/components/shared/ManufacturerLayout';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Factory, Eye, Filter, Search, Loader2 } from 'lucide-react';
import { demoProducts } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ProductionLog = () => {
  return (
    <ManufacturerLayout portalName="Synthesis Plant Hub">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none italic">Production & <span className="text-primary font-light not-italic">Batch Log</span></h1>
            <p className="text-gray-500 font-medium mt-2 italic text-sm">Comprehensive history of all finished goods produced and serialized on-chain.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
              <Filter size={18} />
            </button>
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/20 text-xs font-bold shadow-sm" placeholder="Search Production ID..." />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {demoProducts.map((product, i) => (
            <Card key={i} className="group hover:shadow-2xl transition-all duration-500 border-none p-0 overflow-hidden bg-white">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                    <Factory size={28} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Batch #{product.id}</div>
                    <StatusBadge status="QR_GENERATED" />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                    <span>Truth Score: <span className="text-primary">{product.trustScore}/100</span></span>
                    <span>•</span>
                    <span>Verified</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-50 mb-8">
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Produced</div>
                    <div className="text-xs font-bold text-gray-800">{product.mfgDate}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ingredients</div>
                    <div className="text-xs font-bold text-gray-800 italic">4 Verified</div>
                  </div>
                </div>

                <button className="w-full py-4 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all flex items-center justify-center gap-2 active:scale-95">
                  <Eye size={14} /> Full Audit Trail
                </button>
              </div>
            </Card>
          ))}
        </div>
    </ManufacturerLayout>
  );
};

export default ProductionLog;
