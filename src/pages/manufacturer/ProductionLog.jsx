import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { List, Factory, QrCode, ClipboardList, Search, Eye, Filter } from 'lucide-react';
import { demoProducts } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ProductionLog = () => {
  const sidebarItems = [
    { label: 'Inventory Hub', to: '/manufacturer', icon: List },
    { label: 'Production Log', to: '/manufacturer/production', icon: ClipboardList, end: true },
    { label: 'Build Product', to: '/manufacturer/products', icon: Factory },
    { label: 'QR Management', to: '/manufacturer/qr', icon: QrCode },
  ];

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar portalName="Manufacturer Hub" items={sidebarItems} />

      <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Production & Batch Log</h1>
            <p className="text-gray-500 font-medium mt-2 italic">Comprehensive history of all finished goods produced and serialized on-chain.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
              <Filter size={18} />
            </button>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-bold shadow-sm" placeholder="Search Production ID..." />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {demoProducts.map((product, i) => (
            <Card key={i} className="group hover:shadow-2xl transition-all duration-500 border-none">
              <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Factory size={28} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Batch #{product.id}</div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-bold italic">
                      <span>Inc: 4 Verified Ingredients</span>
                      <span>•</span>
                      <span>Consensus: Standard</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Produced</div>
                    <div className="text-xs font-bold text-gray-800">{product.mfgDate}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Trust Score</div>
                    <div className="text-xs font-black text-primary">{product.trustScore}/100</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                    <StatusBadge status="QR_GENERATED" />
                  </div>
                </div>

                <button className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all flex items-center gap-2">
                  <Eye size={14} /> Full Details
                </button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductionLog;
