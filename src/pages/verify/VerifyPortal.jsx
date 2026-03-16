import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, MapPin, Microscope, Truck, Factory, Package, 
  ChevronRight, ArrowLeft, Download, AlertTriangle, CheckCircle2,
  TreeDeciduous, ExternalLink, Globe
} from 'lucide-react';
import { demoProducts, demoBatches } from '../../lib/mockData';
import { Card, StatusBadge } from '../../components/shared/UI';
import { cn } from '../../lib/utils';

const TruthNode = ({ icon: Icon, title, date, status, children, isFirst = false, isLast = false, color = "bg-primary" }) => (
    <div className="relative pl-12 pb-12 group last:pb-0">
        {!isLast && <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-100 group-hover:bg-primary-light transition-colors duration-500"></div>}
        <div className={cn(
            "absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 z-10",
            color
        )}>
            <Icon size={20} />
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-light/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</div>
                </div>
                {status && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-bold border border-success/20 w-fit">
                        <CheckCircle2 size={12} />
                        {status}
                    </div>
                )}
            </div>
            <div className="text-sm text-gray-600 space-y-3">
                {children}
            </div>
        </div>
    </div>
);

const VerifyPortal = () => {
  const { batchId } = useParams();
  const product = demoProducts.find(p => p.id === batchId) || (demoProducts.length > 0 ? demoProducts[0] : null);
  const sourceBatch = demoBatches.length > 0 ? demoBatches[0] : null;

  if (!product || !sourceBatch) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
          <Package size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 max-w-sm mb-8">
            The product verification ID you entered does not exist in the BotaniLedger blockchain registry.
        </p>
        <Link to="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all">
          Return to Registry
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Dynamic Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2 text-primary font-bold">
              <TreeDeciduous size={24} />
              <span className="hidden md:inline">BotaniLedger Authenticity</span>
           </Link>
           <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full font-mono text-xs font-bold text-gray-500">
               ID: {batchId}
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Verification Banner */}
        <section className="animate-fade-in">
            <div className="sidebar-gradient rounded-3xl p-1 aspect-[21/9] md:aspect-[21/6] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540439862563-3dc462725a3a?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-10 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center p-8 text-white z-10">
                    <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center text-primary mb-6 shadow-2xl animate-pulse">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">AUTHENTIC PRODUCT</h2>
                    <p className="text-green-100/60 font-medium uppercase tracking-widest text-xs">Verified via 6-Phase Immutable Supply Chain</p>
                </div>
            </div>
        </section>

        {/* Product Identity */}
        <section className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <Card className="md:col-span-2 p-8 flex flex-col md:flex-row gap-8 items-start">
                 <div className="w-full md:w-32 aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 shrink-0 overflow-hidden group">
                     <img src="https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&w=300&q=80" alt="Ashwa" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{product.name}</h1>
                        <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                            <Factory size={14} />
                            {product.manufacturer}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Manufactured</span>
                            <span className="text-sm font-bold text-gray-700">{product.mfgDate}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expiry Date</span>
                            <span className="text-sm font-bold text-gray-700">{product.expDate}</span>
                        </div>
                    </div>
                 </div>
            </Card>
            
            <Card className="p-8 sidebar-gradient text-white flex flex-col justify-between">
                <div>
                   <h4 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6">Trust Index</h4>
                   <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 * (1 - product.trustScore/100)} className="text-accent-light" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{product.trustScore}</span>
                            <span className="text-[10px] font-bold uppercase">Points</span>
                        </div>
                   </div>
                </div>
                <p className="text-[10px] text-center italic text-green-100/40 mt-4 leading-relaxed">
                    Score based on verified on-chain analytics and partner compliance.
                </p>
            </Card>
        </section>

        {/* The Truth Timeline */}
        <section className="space-y-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-end justify-between border-b pb-4 border-gray-200">
                <h2 className="text-2xl font-bold text-primary-dark">Full Traceability Truth Timeline</h2>
                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Globe size={14} />
                    GEOSPATIAL AUDIT ACTIVE
                </div>
            </div>

            <div className="py-8">
                <TruthNode 
                    icon={TreeDeciduous} 
                    title="Phase I: Farm Collection & AI Fingerprinting" 
                    date="JAN 12, 2025 • 09:14 AM" 
                    status="VERIFIED"
                    color="bg-primary"
                    isFirst
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <span className="font-bold text-gray-400 text-[10px] uppercase block mb-1">Herb Species</span>
                                <span className="font-bold text-gray-900">{sourceBatch.herb}</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-400 text-[10px] uppercase block mb-1">Collector / Farmer</span>
                                <span className="font-bold text-gray-700">{sourceBatch.farmer}</span>
                            </div>
                            <div className="flex items-center gap-2 text-success font-bold text-xs ring-1 ring-success/20 px-3 py-1.5 rounded-lg bg-success/5 w-fit">
                                <CheckCircle2 size={14} />
                                AI Species Match: {sourceBatch.aiConfidence}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                             {sourceBatch.photos.slice(0, 3).map((p, i) => (
                                 <img key={i} src={p} className="aspect-square rounded-xl object-cover border border-gray-100 hover:scale-105 transition-transform" />
                             ))}
                        </div>
                    </div>
                </TruthNode>

                <TruthNode 
                    icon={Microscope} 
                    title="Phase II: Laboratory Certification" 
                    date="JAN 18, 2025 • 03:45 PM" 
                    status="COMPLIANT"
                    color="bg-accent-mid"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-gray-800">
                            <span className="text-gray-400">Lab:</span> NABL Certified Lab, Pune
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                             {[
                                 { l: "Actives", v: "3.2%", s: "PASS" },
                                 { l: "Heavy Metals", v: "ND", s: "PASS" },
                                 { l: "Pesticides", v: "ND", s: "PASS" },
                                 { l: "Microbial", v: "SAFE", s: "PASS" }
                             ].map((m, i) => (
                                 <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                     <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{m.l}</div>
                                     <div className="font-bold text-sm text-primary">{m.v}</div>
                                 </div>
                             ))}
                        </div>
                        <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline bg-primary/5 px-4 py-2 rounded-lg">
                            <FileText size={14} />
                            View Digital Lab Certificate (IPFS CID: QmR...Xz)
                        </button>
                    </div>
                </TruthNode>

                <TruthNode 
                    icon={Truck} 
                    title="Phase III: Custody & Logistics" 
                    date="JAN 22, 2025 • 08:00 AM" 
                    status="SECURE"
                    color="bg-primary-light"
                >
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-800">Mutual Non-Repudiation Signed</div>
                                <div className="text-[10px] text-gray-400 italic font-medium truncate max-w-[200px]">Hash: 0x82...f9a anchored to Hyperledger</div>
                            </div>
                         </div>
                         <StatusBadge status="APPROVED" />
                    </div>
                </TruthNode>

                <TruthNode 
                    icon={Factory} 
                    title="Phase IV: Manufacturing Verification" 
                    date="JAN 25, 2025 • 11:30 AM" 
                    status="AUTHENTICATED"
                    color="bg-accent-mid"
                >
                    <div className="space-y-4">
                        <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-primary-dark">Visual Similarity Analysis Score</span>
                                <span className="text-xl font-bold text-primary">{product.similarityScore}%</span>
                            </div>
                            <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner flex">
                                <div className="h-full bg-primary" style={{ width: `${product.similarityScore}%` }}></div>
                                <div className="flex-1 bg-gray-100"></div>
                            </div>
                        </div>
                    </div>
                </TruthNode>

                <TruthNode 
                    icon={Package} 
                    title="Phase V: Product Serialization" 
                    date="JAN 28, 2025 • 04:00 PM" 
                    status="FINALIZED"
                    color="bg-gold"
                    isLast
                >
                    <p className="text-sm italic text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 inline-block">
                        Product Batch serialized and unique QR code bound to Batch Heirarchy (BL-2025-00847).
                    </p>
                </TruthNode>
            </div>
        </section>

        {/* Social Sharing & Report */}
        <section className="flex flex-col md:flex-row gap-4 pt-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-mid transition-all shadow-xl shadow-green-900/10">
                <Globe size={18} />
                Share Verification Proof
            </button>
            <button className="flex-1 py-4 border-2 border-red-100 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 transition-all">
                <AlertTriangle size={18} />
                Report Suspicious Product
            </button>
        </section>

        <footer className="text-center text-xs text-gray-400 pt-12">
            This verification is cryptographically cryptographically signed and anchored to a private-permissioned blockchain network. 
            All timestamps reflect UTC+5:30 (India Standard Time).
        </footer>
      </main>
    </div>
  );
};

export default VerifyPortal;
