import React from 'react';
import { Card, StatusBadge, Skeleton } from '@/components/shared/UI';
import { 
  PlusCircle, Database, RefreshCw, 
  List, PackageCheck, SignalHigh, 
  ChevronRight, ArrowUpRight, MapPin, Smartphone, Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useOfflineStore } from '@/lib/offlineStore';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import FarmerLayout from '@/components/shared/FarmerLayout';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { isOnline, pendingBatches } = useOfflineStore();

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['farmerBatches'],
    queryFn: async () => {
        const resp = await api.get('/farmer/batches');
        return resp.data || [];
    }
  });


  const stats = [
    { 
        label: "Total Batches", 
        value: batches.length.toString().padStart(2, '0'), 
        color: "text-blue-600", 
        icon: Database 
    },
    { 
        label: "Pending Lab", 
        value: batches.filter(b => ['PENDING', 'LAB_TESTING'].includes(b.blockchainRecord?.status)).length.toString().padStart(2, '0'), 
        color: "text-amber-600", 
        icon: Smartphone 
    },
    { 
        label: "Passed & Approved", 
        value: batches.filter(b => ['LAB_PASSED', 'MANUFACTURER_APPROVED', 'QR_GENERATED'].includes(b.blockchainRecord?.status)).length.toString().padStart(2, '0'), 
        color: "text-success", 
        icon: PackageCheck 
    },
    { 
        label: "Sync Queue", 
        value: pendingBatches.length.toString().padStart(2, '0'), 
        color: "text-orange-600", 
        icon: RefreshCw 
    }
  ];

  return (
    <FarmerLayout portalName="Farmer Portal">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
            <p className="text-sm text-gray-500">Monitoring your herbal batch integrity and network sync status.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               {pendingBatches.length > 0 && (
                   <button className="flex items-center justify-center gap-2 px-5 py-2.5 border border-warning text-warning rounded-lg font-semibold text-sm hover:bg-warning/5 transition-colors">
                       <RefreshCw size={16} />
                       Sync Drafts ({pendingBatches.length})
                   </button>
               )}
               <Link to="/farmer/record" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm">
                   <PlusCircle size={16} />
                   Record New Batch
               </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl">
              <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-gray-50 rounded-lg">
                       <stat.icon className={stat.color} size={20} />
                   </div>
                   {isLoading ? (
                       <Skeleton className="h-5 w-10 rounded" />
                   ) : stat.trend && (
                       <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-md border border-success/20">
                           <ArrowUpRight size={12} /> {stat.trend}
                       </span>
                   )}
              </div>
              {isLoading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              )}
              <div className="text-xs font-medium text-gray-500">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Table */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6 min-w-0">
            <Card className="border border-gray-200 shadow-sm p-0 overflow-hidden bg-white rounded-xl">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-lg text-gray-900">Recent Herb Collections</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-50 text-xs font-semibold text-gray-600 rounded-md hover:bg-gray-100 border border-gray-200 transition-colors">Filters</button>
                    <Link to="/farmer/batches" className="flex-1 sm:flex-none px-3 py-1.5 bg-primary/10 text-xs font-semibold text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center justify-center gap-1">
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                   <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                      <tr>
                        <th className="px-6 py-4">Batch Registry</th>
                        <th className="px-6 py-4">Origin Metadata</th>
                        <th className="px-6 py-4 text-center">AI Confidence</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {isLoading ? (
                          [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                  <td colSpan={5} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                              </tr>
                          ))
                      ) : batches.length > 0 ? (
                        batches.slice(0, 5).map((batch, i) => (
                            <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs font-medium text-primary mb-1">NODE::{batch.batchId?.slice(-12)}</div>
                                    <div className="font-bold text-gray-900 text-sm">{batch.herbSpecies?.common}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1.5">
                                        <Activity size={14} className="text-gray-400" />
                                        {new Date(batch.collectionDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200 w-fit">
                                        <MapPin size={12} className="text-gray-500" />
                                        {batch.location?.zone || 'Central Forest'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs font-bold text-success mb-1">{batch.aiVerification?.confidence || 0}%</div>
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-success" style={{ width: `${batch.aiVerification?.confidence || 0}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button 
                                          onClick={() => navigate(`/verify/${batch.batchId}`)}
                                          className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded hover:text-primary hover:border-primary/50 transition-colors shadow-sm"
                                        >
                                            Audit
                                        </button>
                                        <button 
                                          onClick={() => navigate(`/verify/${batch.batchId}`)}
                                          className="p-1.5 bg-gray-50 border border-gray-200 text-gray-500 rounded hover:bg-gray-100 hover:text-gray-700 transition-colors shadow-sm"
                                          title="View Trace"
                                        >
                                            <Activity size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={5} className="px-6 py-12 text-center">
                                  <div className="flex flex-col items-center justify-center text-gray-400">
                                      <Database size={32} className="mb-3 opacity-50" />
                                      <p className="text-sm font-medium">No blockchain records found</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                   </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs font-medium text-gray-500 bg-gray-50">
                  <span>Distributed Ledger Synchronization Established</span>
                  <div className="flex gap-2">
                       <button className="p-1.5 bg-white border border-gray-200 rounded text-gray-400 opacity-50 cursor-not-allowed">
                          <ChevronRight className="rotate-180" size={14} />
                       </button>
                       <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors">
                          <ChevronRight size={14} />
                       </button>
                  </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
             <Card className="p-6 bg-gray-900 text-white border border-gray-800 shadow-lg rounded-xl flex flex-col">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <SignalHigh size={18} className="text-emerald-400" />
                    Sync Intelligence
                </h3>
                <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                        <div className="text-xs font-medium text-gray-400">Pending Synced</div>
                        <div className="text-xl font-bold">{pendingBatches.length}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                        <div className="text-xs font-medium text-gray-400">Node Identity</div>
                        <div className="text-sm font-mono font-medium text-gray-300">PR_NODE_048</div>
                    </div>
                </div>
                <div className="mt-6">
                    <button className={cn(
                        "w-full py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm",
                        isOnline 
                            ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    )}>
                        <RefreshCw size={16} className={cn(isOnline && pendingBatches.length > 0 && "animate-spin")} />
                        {isOnline ? (pendingBatches.length > 0 ? "Sync Consensus" : "Ledger In Sync ✓") : "Protocol Awaiting Link"}
                    </button>
                </div>
             </Card>

             <Card className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                 <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                    Infrastructure Guides <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 </h4>
                 <div className="space-y-3">
                     {[
                         "5-point macro photo protocol",
                         "Syncing in low-signal zones",
                         "Lab compliance standards"
                     ].map((guide, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-white transition-colors cursor-pointer group shadow-sm">
                             <div className="text-gray-400 group-hover:text-primary transition-colors">
                                 <PlusCircle size={16} />
                             </div>
                             <span className="text-xs font-semibold text-gray-700">{guide}</span>
                         </div>
                     ))}
                 </div>
             </Card>
          </div>
        </div>
    </FarmerLayout>
  );
};

export default FarmerDashboard;
