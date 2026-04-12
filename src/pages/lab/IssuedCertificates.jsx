import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { FileCheck, Download, Search, LayoutDashboard, List, Microscope, History } from 'lucide-react';
import { demoBatches } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const IssuedCertificates = () => {
  const sidebarItems = [
    { label: 'Pending Tests', to: '/lab', icon: List },
    { label: 'Issued Certs', to: '/lab/certificates', icon: FileCheck, end: true },
    { label: 'Quality Analytics', to: '/lab/analytics', icon: Microscope },
  ];

  const certifiedBatches = demoBatches.filter(b => b.status === 'LAB_PASSED' || b.status === 'APPROVED');

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar portalName="Laboratory Portal" items={sidebarItems} />

      <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Certification Archive</h1>
            <p className="text-gray-500 font-medium mt-2 italic">Historical record of all botanical purity certificates issued by this node.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/20 w-64 text-sm font-bold shadow-sm" placeholder="Search Hash/Batch..." />
            </div>
          </div>
        </header>

        <Card className="border-none shadow-2xl shadow-green-900/5">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
              <tr>
                <th className="px-8 py-6">Cert ID</th>
                <th className="px-8 py-6">Product Identity</th>
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6">Results</th>
                <th className="px-8 py-6 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {certifiedBatches.map((batch, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-mono text-xs font-black text-primary">AYUSH-CERT-{2000 + i}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref: {batch.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-sm text-gray-800 tracking-tight">{batch.herb.split(' (')[0]}</span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-500 italic">
                    2025-04-{12 - i} | 14:20 IST
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <span className="text-[9px] font-black bg-success/10 text-success px-2 py-1 rounded border border-success/10">PURITY: 98%</span>
                      <span className="text-[9px] font-black bg-success/10 text-success px-2 py-1 rounded border border-success/10">METAL: ND</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline flex items-center justify-end gap-2 ml-auto">
                      <Download size={14} /> PDF Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
};

export default IssuedCertificates;
