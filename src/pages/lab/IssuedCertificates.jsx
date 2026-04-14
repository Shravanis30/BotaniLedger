import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge, Skeleton } from '@/components/shared/UI';
import { FileCheck, Download, Search, LayoutDashboard, List, Microscope, History, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const IssuedCertificates = () => {
  const sidebarItems = [
    { label: 'Pending Tests', to: '/lab', icon: List },
    { label: 'Issued Certs', to: '/lab/certificates', icon: FileCheck, end: true },
    { label: 'Quality Analytics', to: '/lab/analytics', icon: Microscope },
  ];

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['labCertificates'],
    queryFn: async () => {
        const resp = await api.get('/lab/certificates');
        return resp.data || [];
    }
  });

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

        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                <tr>
                  <th className="px-8 py-6">Cert ID / Batch</th>
                  <th className="px-8 py-6">Herb Identity</th>
                  <th className="px-8 py-6">Issued Timestamp</th>
                  <th className="px-8 py-6">Purity Signature</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                        <td colSpan={5} className="px-8 py-6"><Skeleton className="h-12 w-full" /></td>
                    </tr>
                  ))
                ) : certificates.length > 0 ? (
                  certificates.map((cert, i) => (
                    <tr key={cert._id || i} className="hover:bg-primary/[0.02] transition-all group">
                      <td className="px-8 py-7">
                        <div className="font-mono text-xs font-black text-primary uppercase">{cert.referenceNumber || `AYUSH-${cert._id.slice(-6)}`}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref: {cert.batchId?.batchId || 'N/A'}</div>
                      </td>
                      <td className="px-8 py-7">
                        <span className="font-black text-sm text-gray-800 tracking-tight">{cert.batchId?.herbSpecies?.common || 'Unlabeled Batch'}</span>
                      </td>
                      <td className="px-8 py-7 text-xs font-bold text-gray-500 italic">
                        {new Date(cert.testDate || cert.createdAt).toLocaleDateString()} | {new Date(cert.testDate || cert.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex gap-2">
                          <span className={cn(
                            "text-[9px] font-black px-2 py-1 rounded border",
                            cert.results?.overallResult === 'PASS' 
                                ? "bg-success/10 text-success border-success/10" 
                                : "bg-red-50 text-red-500 border-red-100"
                          )}>
                             RESULT: {cert.results?.overallResult || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-right">
                        <a 
                          href={cert.document?.ipfsUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline inline-flex items-center gap-2"
                        >
                          <Download size={14} /> PDF Report
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Archive empty. No certificates issued yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default IssuedCertificates;
