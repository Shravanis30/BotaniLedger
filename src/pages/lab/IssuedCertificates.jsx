import React from 'react';
import LabLayout from '@/components/shared/LabLayout';
import FarmerLayout from '@/components/shared/FarmerLayout';
import AdminLayout from '@/components/shared/AdminLayout';
import { Card, Skeleton } from '@/components/shared/UI';
import { FileCheck, Download, Search, Microscope, FlaskConical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const IssuedCertificates = () => {
  const { user } = useAuthStore();
  
  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['labCertificates'],
    queryFn: async () => {
        const resp = await api.get('/lab/certificates');
        return resp.data || [];
    }
  });

  const getBranding = () => {
      if (user?.role === 'farmer') return {
          title: "My Botanical Certificates",
          desc: "Legal molecular proof of your farm's batch integrity."
      };
      if (user?.role === 'admin') return {
          title: "Global Certification Ledger",
          desc: "Comprehensive audit log of every certificate issued on the network."
      };
      return {
          title: "Certification Archive",
          desc: "Historical record of all botanical purity certificates issued by this node."
      };
  };

  const branding = getBranding();
  const Layout = user?.role === 'farmer' ? FarmerLayout : (user?.role === 'admin' ? AdminLayout : LabLayout);

  return (
    <Layout portalName={user?.role === 'farmer' ? "Farmer Portal" : (user?.role === 'admin' ? "Admin Portal" : "Lab Tester Node")}>
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{branding.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{branding.desc}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full" placeholder="Search Hash/Batch..." />
          </div>
        </div>
      </header>

      <Card className="shadow-sm border border-gray-200 overflow-hidden bg-white rounded-lg p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Cert ID / Batch</th>
                <th className="px-6 py-3">Herb Identity</th>
                <th className="px-6 py-3">Issued Timestamp</th>
                <th className="px-6 py-3">Purity Signature</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                      <td colSpan={5} className="px-6 py-6"><Skeleton className="h-8 w-full" /></td>
                  </tr>
                ))
              ) : certificates.length > 0 ? (
                certificates.map((cert, i) => (
                  <tr key={cert._id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium text-primary">AYUSH::{cert.referenceNumber || cert._id?.slice(-8).toUpperCase()}</div>
                      <div className="text-xs text-gray-500 mt-1">Batch Ref: <span className="font-mono text-gray-600">#{cert.batchId}</span></div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="font-semibold text-gray-900">{cert.batch?.herbSpecies?.common || 'Botanical Unit'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{cert.batch?.herbSpecies?.botanical}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex flex-col">
                            <span>{new Date(cert.testDate || cert.createdAt).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-400 mt-0.5">{new Date(cert.testDate || cert.createdAt).toLocaleTimeString()}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-md border",
                          cert.results?.overallResult === 'PASS' 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-red-50 text-red-700 border-red-200"
                        )}>
                           {cert.results?.overallResult || 'N/A'} QUOTIENT :: {cert.results?.purityScore || cert.results?.activeIngredient?.measured}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {cert.document?.ipfsUrl ? (
                         <a 
                           href={cert.document.ipfsUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-600 hover:text-primary hover:border-primary rounded-md text-sm font-medium transition-colors"
                         >
                           <Download size={14} /> Download Proof
                         </a>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">No Digital Entry</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4 border border-gray-100">
                        <FileCheck size={32} />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Archive empty. No certificates discovered.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default IssuedCertificates;
