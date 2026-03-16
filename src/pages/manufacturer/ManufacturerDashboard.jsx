import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { Factory, PackageSearch, RefreshCw, Smartphone, List, CheckCircle2, QrCode, ArrowRight, PlusCircle } from 'lucide-react';
import { demoBatches, demoProducts } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ManufacturerDashboard = () => {
  const sidebarItems = [
    { label: 'Inventory Hub', to: '/manufacturer', icon: List, end: true },
    { label: 'Verify Arrivals', to: '/manufacturer/verify', icon: CheckCircle2 },
    { label: 'Build Product', to: '/manufacturer/products', icon: Factory },
    { label: 'QR Management', to: '/manufacturer/qr', icon: QrCode },
  ];

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar portalName="Manufacturer Hub" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Formulation Inventory</h1>
            <p className="text-gray-500 font-medium">Managing verified herbal ingredients for production batches.</p>
          </div>
          <button className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-mid transition-all shadow-lg shadow-green-900/10">
              <PlusCircle size={18} /> New Product Batch
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
                { l: "Available Verified", v: "12", c: "text-primary", i: PackageSearch },
                { l: "In Production", v: "04", c: "text-blue-600", i: RefreshCw },
                { l: "Similarity Pass", v: "92.8%", c: "text-success", i: CheckCircle2 },
                { l: "QR Codes Active", v: "2,105", c: "text-orange-600", i: QrCode },
            ].map((s, i) => (
                <Card key={i} className="p-6">
                    <s.i size={18} className={cn("mb-4", s.c)} />
                    <div className="text-2xl font-bold">{s.v}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.l}</div>
                </Card>
            ))}
        </div>

        <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-800">Available Verified Herb Batches</h3>
            <Card>
                <table className="w-full text-left table-zebra">
                    <thead className="bg-gray-50 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Batch ID</th>
                            <th className="px-6 py-4">Herb</th>
                            <th className="px-6 py-4">Lab Status</th>
                            <th className="px-6 py-4">Similarity</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {demoBatches.filter(b => b.status === 'LAB_PASSED' || b.status === 'APPROVED').map((batch, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{batch.id}</td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-sm text-gray-800">{batch.herb.split(' (')[0]}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status="LAB_PASSED" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-success" style={{ width: '92%' }}></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-success">92%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                        Verify Arrival <ArrowRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default ManufacturerDashboard;
