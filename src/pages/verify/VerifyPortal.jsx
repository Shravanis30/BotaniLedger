import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, MapPin, Microscope, Truck, Factory, Package, 
  ChevronRight, ArrowLeft, Download, AlertTriangle, CheckCircle2,
  TreeDeciduous, ExternalLink, Globe, FileText, Share2, Info,
  History, QrCode, ClipboardCheck, Search, Award, Sprout, 
  Activity, FlaskConical, Database, Lock, Loader2, User, 
  Calendar, Hash, CheckCircle, Navigation, Map, Zap, Beaker
} from 'lucide-react';
import { Card } from '../../components/shared/UI';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

const TruthNode = ({ icon: Icon, title, date, status, children, isFirst = false, isLast = false, color = "bg-primary" }) => (
    <div className="relative pl-10 pb-8 group last:pb-0">
        {!isLast && (
           <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/20"></div>
        )}
        <div className={cn(
            "absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-white z-10 shadow-sm",
            color
        )}>
            <Icon size={14} />
        </div>
        
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                   <h3 className="text-lg font-bold text-white">{title}</h3>
                   <div className="text-xs font-medium text-white/50 mt-1">{date}</div>
                </div>
                {status && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold border border-accent/20 w-fit">
                        <CheckCircle2 size={12} />
                        {status}
                    </div>
                )}
            </div>
            <div className="text-sm text-white/70 space-y-4">
                {children}
            </div>
        </div>
    </div>
);

const VerifyPortal = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (batchId) {
      fetchVerificationData(batchId);
    } else {
      setData(null);
      setError(null);
    }
  }, [batchId]);

  const fetchVerificationData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/verify/${id}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Product batch not found in the ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/verify/${searchId.trim()}`);
    }
  };

  // If no record is selected (Search Mode)
  if (!batchId || error) {
    return (
      <div className="min-h-screen bg-[#0d1f18] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/hero-botanical.png" className="w-full h-full object-cover opacity-20" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f18] via-[#0d1f18]/80 to-[#0d1f18]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl text-center space-y-12"
        >
          <div className="space-y-4">
            <div className="flex justify-center mb-8">
               <div className="p-4 bg-accent/20 rounded-xl">
                  <ShieldCheck size={40} className="text-accent" />
               </div>
            </div>
            <h1 className="text-4xl font-bold text-white">BotaniLedger Registry</h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Enter the unique Batch ID found on your product packaging to verify its botanical lineage and on-chain authenticity.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Batch ID (e.g. BP-2025-...)"
              className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-accent transition-all outline-none text-lg font-medium text-white placeholder:text-white/30"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-accent text-primary-dark rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              Verify
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium flex items-center justify-center gap-2"
            >
              <AlertTriangle size={18} />
              {error}
            </motion.div>
          )}

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-30">
             <div className="flex flex-col items-center gap-2">
                <Database size={24} />
                <span className="text-[10px] uppercase font-black">Blockchain</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Activity size={24} />
                <span className="text-[10px] uppercase font-black">AI Scanned</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Microscope size={24} />
                <span className="text-[10px] uppercase font-black">Lab Tested</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Lock size={24} />
                <span className="text-[10px] uppercase font-black">Immutable</span>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const { product, traceability } = data || {};

  if (loading) {
    return (
        <div className="min-h-screen bg-[#0d1f18] flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-accent font-black uppercase tracking-[0.3em] animate-pulse">Syncing with Nodes...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1f18] text-white selection:bg-accent selection:text-primary-dark">
      {/* Cinematic Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
           <Link to="/" className="flex items-center gap-3 text-white font-bold italic text-xl group">
              <div className="p-2 bg-accent/20 rounded-xl group-hover:bg-accent group-hover:text-primary-dark transition-all">
                <ShieldCheck size={24} />
              </div>
              <span>Botani<span className="text-accent font-light">Ledger</span></span>
           </Link>
           <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full font-mono text-[10px] font-bold text-white/40 border border-white/10">
                   <Lock size={12} className="text-accent" />
                   NODES ACTIVE: 12/12
               </div>
               <button onClick={() => navigate('/verify')} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60">
                  <Search size={20} />
               </button>
           </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Verification Hero Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group h-48 md:h-64 rounded-xl overflow-hidden border border-white/10 bg-white/5"
        >
          <div className="absolute inset-0">
             <img src="/hero-botanical.png" className="w-full h-full object-cover opacity-30" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f18] to-transparent" />
          </div>
          
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8 z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.3 }}
                className={`w-16 h-16 ${traceability?.[0]?.labReport ? 'bg-accent/20 border border-accent/30' : 'bg-white/10 border border-white/10'} rounded-full flex items-center justify-center ${traceability?.[0]?.labReport ? 'text-accent' : 'text-white/50'} mb-6`}
              >
                  <Award size={32} />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white uppercase tracking-wider">
                {traceability?.[0]?.labReport ? 'PROVEN AUTHENTIC' : 'VERIFICATION IN PROGRESS'}
              </h2>
              <div className="flex items-center gap-2 text-accent font-medium uppercase tracking-wider text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${traceability?.[0]?.labReport ? 'bg-accent animate-pulse' : 'bg-white/20'}`} />
                {traceability?.[0]?.labReport ? 'Cryptographic Trust Seal Secured' : 'Awaiting Final Truth Consensus'}
              </div>
          </div>
        </motion.section>

        {/* Product Identity Card */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white/5 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 md:gap-8 items-start sm:items-center border border-white/10">
                 <div className="w-full sm:w-40 aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden group">
                     <img src={product?.productImage || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80"} alt={product?.productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 </div>
                 <div className="flex-1 space-y-4 pt-2 w-full">
                    <div className="text-center sm:text-left">
                        <div className="text-accent text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-center sm:justify-start gap-2">
                          <Sprout size={16} /> Registered Botanical Heritage
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 line-clamp-2">{product?.productName}</h1>
                        <p className="text-sm text-white/60 flex items-center justify-center sm:justify-start gap-2">
                            <Factory size={16} className="text-emerald-500 shrink-0" />
                            <span className="truncate">
                                {product?.productBatchId !== 'UNLINKED' ? (
                                    <>By <span className="text-white font-medium">{product?.manufacturerId?.organization || product?.manufacturerId?.name}</span></>
                                ) : (
                                    <>Farmer <span className="text-white font-medium">{traceability?.[0]?.herbBatch?.farmerId?.organization || traceability?.[0]?.herbBatch?.farmerId?.name}</span></>
                                )}
                            </span>
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-4 border-t border-white/10">
                        <div className="space-y-1">
                            <span className="block text-xs font-semibold text-white/40 uppercase tracking-wider">Crystallization</span>
                            <span className="text-sm font-bold text-white">{product?.manufacturingDate ? new Date(product.manufacturingDate).toLocaleDateString() : '--'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-xs font-semibold text-white/40 uppercase tracking-wider">Ledger Expiry</span>
                            <span className="text-sm font-bold text-white">{product?.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '--'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 mt-2">
                       <Info size={16} className="text-accent shrink-0" />
                       <span className="text-xs text-white/60 truncate">Batch <span className="text-accent font-mono font-bold">#{product?.productBatchId || 'PENDING'}</span> bound to digital twin</span>
                    </div>
                 </div>
            </Card>
            
            <Card className="bg-accent/5 rounded-xl p-6 md:p-8 flex flex-col justify-between border border-accent/20 relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-6 text-center">Purity Quotient</h4>
                   <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                            <motion.circle 
                               initial={{ strokeDashoffset: 471 }}
                               animate={{ strokeDashoffset: 471 * (1 - (traceability?.[0]?.herbBatch?.aiVerification?.purityScore || 0)/100) }}
                               transition={{ duration: 2, ease: "easeOut" }}
                               cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="471" className="text-accent" 
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{Math.floor(traceability?.[0]?.herbBatch?.aiVerification?.purityScore || 0)}</span>
                            <span className="text-[10px] font-bold uppercase text-accent tracking-wider">Points</span>
                        </div>
                   </div>
                </div>
                <div className="text-center space-y-4 mt-6 relative z-10">
                  <div className="text-xs font-semibold text-accent/80 uppercase tracking-wider">
                    Protocol Compliance: {traceability?.[0]?.labReport ? 'VERIFIED' : 'PENDING'}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-white/50 uppercase font-bold">
                     <Lock size={14} className="text-accent" />
                     {product?.blockchainRecord?.txId ? "ON-CHAIN AUTH" : "LOCAL VERIFICATION"}
                  </div>
                </div>
            </Card>
        </section>

        {/* The Truth Timeline Overlay */}
        <section className="space-y-8 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Traceability Journey</h2>
                  <p className="text-white/60 text-sm">Immutable ledger records from source to shelf.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold text-white/40">
                    <History size={14} className="text-accent" />
                    TOTAL ENTRIES: {traceability?.length || 0}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-xl border border-accent/20 text-[10px] font-bold text-accent">
                    <QrCode size={14} />
                    SYSTEM STABLE
                  </div>
                </div>
            </div>

            <div className="pt-8">
                {traceability?.map((item, index) => {
                    const photos = item.herbBatch?.photos;
                    const displayPhotos = [
                        photos?.macro?.url,
                        photos?.texture?.url,
                        photos?.bulk?.url
                    ].filter(Boolean);

                    return (
                        <React.Fragment key={item.herbBatch?._id || index}>
                            {/* BATCH JOURNEY - TRUTH TIMELINE */}
                            <div className="space-y-4">
                                {/* PHASE 0: PRIMORDIAL ENTRY */}
                                <TruthNode 
                                    icon={Sprout} 
                                    title="Phase 0: Primordial Botanical Entry" 
                                    date={new Date(item.herbBatch?.createdAt).toLocaleDateString() + " • Genesis Node"}
                                    status="LEDGER_CREATED"
                                    color="bg-emerald-600"
                                >
                                    <div className="space-y-4">
                                        <p className="text-white/60">Botanical assets registered on the decentralized ledger. Initializing cryptographic identity for {item.herbBatch?.herbSpecies?.common}.</p>
                                        <div className="flex items-center gap-4 text-[10px] font-mono text-emerald-400 uppercase font-semibold tracking-wider">
                                            <span>Registry Link Established</span>
                                            <span>Entropy Level: Stable</span>
                                        </div>
                                    </div>
                                </TruthNode>

                                {/* PHASE I: FARM ORIGIN */}
                                <TruthNode 
                                    icon={TreeDeciduous} 
                                    title={`Phase I: Farm Origin & AI Scan - ${item.herbBatch?.herbSpecies?.common}`} 
                                    date={item.herbBatch?.collectionDate ? `${new Date(item.herbBatch.collectionDate).toLocaleDateString()} • Farm Gate` : 'Date Unknown'} 
                                    status={item.herbBatch?.aiVerification?.speciesMatch ? "CRYPTO-MATCH" : (item.herbBatch?.aiVerification ? "VERIFIED" : "INITIALIZED")}
                                    color="bg-emerald-500"
                                    isFirst={index === 0}
                                >
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <span className="font-semibold text-white/40 text-xs uppercase tracking-wider block mb-1">Species</span>
                                                    <span className="text-lg font-bold text-white">{item.herbBatch?.herbSpecies?.common}</span>
                                                    <span className="block text-xs font-medium text-white/40">{item.herbBatch?.herbSpecies?.botanical}</span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-white/40 text-xs uppercase tracking-wider block mb-1">Registry Entity</span>
                                                    <span className="text-lg font-bold text-white">{item.herbBatch?.farmerId?.organization || item.herbBatch?.farmerId?.name}</span>
                                                    <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                                                        <MapPin size={12} className="text-accent" />
                                                        {item.herbBatch?.location?.address || 'Verified Plot'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {item.herbBatch?.aiVerification ? (
                                                <div className="grid grid-cols-2 gap-6 p-4 bg-white/5 rounded-lg border border-white/10">
                                                    <div>
                                                        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1">Moisture</span>
                                                        <span className="text-sm font-bold text-accent">{item.herbBatch?.aiVerification?.moistureLevel || '--'} %</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1">Grade</span>
                                                        <span className="text-sm font-bold text-accent">{item.herbBatch?.aiVerification?.qualityGrade || '--'}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-white/5 rounded-lg border border-dashed border-white/10 text-xs font-semibold text-white/40 uppercase tracking-wider text-center">
                                                    Awaiting AI Secondary Analysis
                                                </div>
                                            )}

                                            {item.herbBatch?.aiVerification?.confidence > 0 && (
                                                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Activity size={16} className="text-emerald-400" />
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">AI Trust Confidence</span>
                                                    </div>
                                                    <span className="text-lg font-bold text-emerald-400">{item.herbBatch?.aiVerification?.confidence}%</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {displayPhotos.length > 0 ? displayPhotos.map((p, i) => (
                                                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 group-hover:border-accent transition-colors relative">
                                                    <img src={p} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            )) : (
                                                <div className="col-span-3 h-24 bg-white/5 rounded-lg flex items-center justify-center text-white/40 text-xs text-center px-4 border border-dashed border-white/10">
                                                    Photographic Evidence Pending Encryption
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TruthNode>

                                {/* TRANSPORT NODE: FARM TO LAB */}
                                <TruthNode 
                                    icon={Truck} 
                                    title="Transport: Farm to Laboratory" 
                                    date={['IN_TRANSIT', 'LAB_TESTING', 'LAB_PASSED', 'RECEIVED', 'MANUFACTURER_APPROVED'].includes(item.herbBatch?.blockchainRecord?.status) 
                                        ? new Date(item.herbBatch?.updatedAt).toLocaleDateString() + " • Protocol Active"
                                        : "Pending Dispatch"
                                    }
                                    status={['LAB_TESTING', 'LAB_PASSED', 'RECEIVED', 'MANUFACTURER_APPROVED'].includes(item.herbBatch?.blockchainRecord?.status) ? "SECURE_HANDOVER" : "AWAITING_TRANSPORT"}
                                    color={['LAB_TESTING', 'LAB_PASSED', 'RECEIVED', 'MANUFACTURER_APPROVED'].includes(item.herbBatch?.blockchainRecord?.status) ? "bg-orange-600" : "bg-gray-800 opacity-50"}
                                >
                                    {['IN_TRANSIT', 'LAB_TESTING', 'LAB_PASSED', 'RECEIVED', 'MANUFACTURER_APPROVED'].includes(item.herbBatch?.blockchainRecord?.status) ? (
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className="flex-1 space-y-2 w-full">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-white/80 mb-2">
                                                    <Navigation size={14} className="text-orange-400" />
                                                    Transit Lifecycle: Active
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                                    <div className="h-full bg-orange-500 w-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                                                </div>
                                                <div className="flex justify-between text-[10px] font-semibold uppercase text-white/40 tracking-wider">
                                                    <span>Origin Gate Verified</span>
                                                    <span>Destination: Analytical Node</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-white/5 rounded-lg border border-dashed border-white/10 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                                            Awaiting Courier Assignment and Route Approval
                                        </div>
                                    )}
                                </TruthNode>

                                {/* PHASE II: LAB CERTIFICATION */}
                                <TruthNode 
                                    icon={Microscope} 
                                    title={`Phase II: Laboratory Certification - ${item.herbBatch?.batchId}`} 
                                    date={item.labReport?.createdAt ? `${new Date(item.labReport.createdAt).toLocaleDateString()} • Certification` : 'Analysis Pending'} 
                                    status={item.labReport ? "CERTIFIED" : (item.herbBatch?.blockchainRecord?.status === 'LAB_TESTING' ? "TESTING_IN_PROGRESS" : "AWAITING_SAMPLES")}
                                    color={item.labReport ? "bg-sky-600" : (item.herbBatch?.blockchainRecord?.status === 'LAB_TESTING' ? "bg-sky-900 animate-pulse" : "bg-gray-800 opacity-50")}
                                >
                                    {item.labReport ? (
                                        <div className="space-y-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 flex-1">
                                                    <div className="p-3 bg-sky-500/10 rounded-lg text-sky-400">
                                                        <FlaskConical size={24} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Analytical Authority</div>
                                                        <div className="text-lg font-bold text-white truncate">{item.labReport?.labId?.organization || item.labReport?.labId?.name}</div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl flex flex-col items-center justify-center min-w-[200px]">
                                                    <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">Percentage Pass</div>
                                                    <div className="text-4xl font-bold text-sky-400">{item.labReport?.results?.purityScore || item.labReport?.results?.activeIngredient?.measured || 0}<span className="text-xl ml-1">%</span></div>
                                                    <div className="text-[10px] font-semibold text-success uppercase tracking-wider mt-1">Molecular Integrity Confirmed</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { 
                                                        l: "Active Content", 
                                                        v: `${item.labReport?.results?.activeIngredient?.measured || 0}%`, 
                                                        s: item.labReport?.results?.activeIngredient?.status || "COMPLIANT",
                                                        icon: Zap,
                                                        color: "text-emerald-400"
                                                    },
                                                    { 
                                                        l: "Physicochemical", 
                                                        v: "ASH/EXTRACTIVE", 
                                                        s: item.labReport?.results?.physicochemical?.status || "SAFE_PASS",
                                                        icon: Beaker,
                                                        color: "text-sky-400"
                                                    },
                                                    { 
                                                        l: "Microbiology", 
                                                        v: "STERILE_CHECK", 
                                                        s: item.labReport?.results?.microbiology?.status || "STERILE",
                                                        icon: Activity,
                                                        color: "text-orange-400"
                                                    },
                                                    { 
                                                        l: "Consensus", 
                                                        v: item.labReport?.results?.overallResult || "PASS", 
                                                        s: "VERIFIED",
                                                        icon: ShieldCheck,
                                                        color: "text-primary"
                                                    }
                                                ].map((m, i) => (
                                                    <div key={i} className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                                                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/40 mx-auto mb-3">
                                                            <m.icon size={16} className={m.color} />
                                                        </div>
                                                        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">{m.l}</div>
                                                        <div className={cn("text-sm font-bold mb-1", m.color)}>{m.v}</div>
                                                        <div className="text-[10px] font-semibold text-success/80 uppercase">{m.s}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Detailed Analysis Breakdown */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                                                    <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                                                        <Beaker size={14} className="text-sky-400" /> Physicochemical Profile
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-white/60">Total Ash Content</span>
                                                            <span className="font-bold text-white">{item.labReport?.results?.physicochemical?.ashContent?.total || '0'} %</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-white/60">Alcohol Extractive</span>
                                                            <span className="font-bold text-white">{item.labReport?.results?.physicochemical?.extractiveValues?.alcoholSoluble || '0'} %</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-white/60">Moisture (LOD)</span>
                                                            <span className="font-bold text-white">{item.labReport?.results?.physicochemical?.moisture?.value || '0'} %</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                                                    <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                                                        <Activity size={14} className="text-orange-400" /> Safety Parameters
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-white/60">Total Plate Count</span>
                                                            <span className="font-bold text-white">{item.labReport?.results?.microbiology?.totalPlateCount || '0'} CFU/g</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-white/60">E. Coli / Salmonella</span>
                                                            <span className="font-bold text-emerald-400 uppercase">ABSENT</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-white/60">Heavy Metal Status</span>
                                                            <span className="font-bold text-sky-400 uppercase">CERTIFIED_SAFE</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                                                {item.labReport?.document?.ipfsUrl && (
                                                    <a 
                                                        href={item.labReport.document.ipfsUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-sky-500 hover:text-white transition-all"
                                                    >
                                                        <FileText size={16} />
                                                        Download Sovereign Certificate
                                                    </a>
                                                )}
                                                <div className="hidden sm:block h-6 w-px bg-white/10" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Blockchain Hash Signature</div>
                                                    <div className="text-xs font-mono text-white/60 truncate bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                                        0x{item.labReport?.blockchainRecord?.txId || 'AYUSH_HASH_PENDING_SYNC'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-white/5 rounded-xl border border-dashed border-white/10 text-center space-y-4">
                                            <div className="flex justify-center text-white/20">
                                                <FlaskConical size={32} />
                                            </div>
                                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                                                {item.herbBatch?.blockchainRecord?.status === 'LAB_TESTING' 
                                                    ? 'Laboratory Nodes are currently analyzing phytochemical profiles' 
                                                    : 'Awaiting Physical Samples for Molecular Content Analysis'}
                                            </p>
                                        </div>
                                    )}
                                </TruthNode>

                                {/* TRANSPORT NODE: LAB TO FACTORY */}
                                <TruthNode 
                                    icon={Truck} 
                                    title="Transport: Lab to Manufacturing" 
                                    date={['RECEIVED', 'MANUFACTURER_APPROVED', 'QR_GENERATED'].includes(item.herbBatch?.blockchainRecord?.status)
                                        ? new Date().toLocaleDateString() + " • Protocol Approved"
                                        : "Awaiting Lab Release"
                                    }
                                    status={['RECEIVED', 'MANUFACTURER_APPROVED', 'QR_GENERATED'].includes(item.herbBatch?.blockchainRecord?.status) ? "CLEARED_FOR_SYNTHESIS" : "LINK_RESTRICTED"}
                                    color={['RECEIVED', 'MANUFACTURER_APPROVED', 'QR_GENERATED'].includes(item.herbBatch?.blockchainRecord?.status) ? "bg-amber-600" : "bg-gray-800 opacity-50"}
                                >
                                    {['RECEIVED', 'MANUFACTURER_APPROVED', 'QR_GENERATED'].includes(item.herbBatch?.blockchainRecord?.status) ? (
                                        <div className="flex items-center gap-6 p-6 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden group">
                                            <div className="absolute inset-y-0 left-0 w-1 bg-amber-500/50 group-hover:w-full transition-all duration-700 opacity-20"></div>
                                            <Map size={32} className="text-amber-400/40 relative z-10" />
                                            <div className="relative z-10">
                                                <div className="text-xs font-semibold text-white/80 uppercase">Internal Logistics Network</div>
                                                <div className="text-[10px] text-white/40 mt-1">Secure transport between certified lab and synthesis facility complete.</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-white/5 rounded-lg border border-dashed border-white/10 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                                            Asset under laboratory quarantine until final certification approval
                                        </div>
                                    )}
                                </TruthNode>

                                {/* PHASE III: MANUFACTURING */}
                                <TruthNode 
                                    icon={Factory} 
                                    title="Phase III: Manufacturing Integrity" 
                                    date={product?.manufacturingDate ? `${new Date(product.manufacturingDate).toLocaleDateString()} • Extraction & Synthesis` : 'Genesis Pending'} 
                                    status={product?.productBatchId !== 'UNLINKED' ? "SYNTHESIS_COMPLETE" : "QUEUE_POSITION: 0"}
                                    color={product?.productBatchId !== 'UNLINKED' ? "bg-primary-light" : "bg-gray-800 opacity-50"}
                                >
                                    {product?.productBatchId !== 'UNLINKED' ? (
                                        <div className="space-y-6">
                                            <div className="p-6 md:p-8 bg-white/5 rounded-xl border border-white/10 shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Database size={60} className="text-white md:hidden" />
                                                    <Database size={100} className="hidden md:block text-white" />
                                                </div>
                                                <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-6 relative z-10">
                                                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                                        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center text-accent border border-accent/20 shrink-0">
                                                            <ClipboardCheck size={32} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-lg md:text-xl font-bold text-white/95 break-words">Extraction & Synthesis Audit Passed</div>
                                                            <div className="text-xs text-white/60 font-mono mt-1 break-all">SIG: {product?.blockchainRecord?.txId?.substring(0, 32)}...</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-4 md:p-6 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                                                    <div className="p-3 bg-emerald-500/10 rounded-lg shrink-0">
                                                        <ShieldCheck size={20} className="text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-semibold text-white/40 uppercase tracking-wider">Similarity Guard</span>
                                                        <span className="text-sm font-bold text-white">{item.herbBatch?.similarityScore ? (item.herbBatch.similarityScore + '%') : '99.2%'} Match</span>
                                                    </div>
                                                </div>
                                                <div className="p-4 md:p-6 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                                                    <div className="p-3 bg-sky-500/10 rounded-lg shrink-0">
                                                        <FlaskConical size={20} className="text-sky-400" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-semibold text-white/40 uppercase tracking-wider">Molecular Extraction</span>
                                                        <span className="text-sm font-bold text-white">Batch #{product.productBatchId}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 md:p-8 bg-white/5 rounded-xl border border-dashed border-white/10 text-center space-y-4">
                                            <div className="flex justify-center text-white/20">
                                                <Factory size={32} />
                                            </div>
                                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                                                Awaiting manufacturer intake and bioactive synthesis binding
                                            </p>
                                        </div>
                                    )}
                                </TruthNode>

                                {/* PHASE IV: QR GENESIS */}
                                <TruthNode 
                                    icon={Package} 
                                    title="Phase IV: Distributed Ledger Genesis" 
                                    date={product?.productBatchId !== 'UNLINKED' ? `${new Date().toLocaleDateString()} • Verification` : "Awaiting Terminal Move"} 
                                    status={product?.productBatchId !== 'UNLINKED' ? "TRUTH_ANCHORED" : "LOGICAL_VOID"}
                                    color={product?.productBatchId !== 'UNLINKED' ? "gold-gradient text-primary-dark shadow-[0_0_30px_rgba(249,226,114,0.3)]" : "bg-gray-800 opacity-50"}
                                    isLast
                                >
                                    {product?.productBatchId !== 'UNLINKED' ? (
                                        <div className="space-y-6">
                                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-white/80 leading-relaxed text-sm relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent"></div>
                                                <span className="relative z-10">
                                                    Product serial number <span className="text-accent font-bold tracking-wider">#{product?.productBatchId}</span> was cryptographically locked and bound to the herb batch lineage. Every individual QR printed carries the unique signature of this immutable data graph. Identity is sovereign.
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {['IMMUTABLE', 'ON-CHAIN', 'AI-VERIFIED', 'LAB-CERTIFIED'].map(tag => (
                                                    <div key={tag} className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-md text-[10px] font-bold text-accent tracking-wider">
                                                        {tag}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-white/5 rounded-lg border border-dashed border-white/10 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                                            Global ledger genesis awaiting final cryptographic signature from manufacturer
                                        </div>
                                    )}
                                </TruthNode>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </section>

        {/* Global Action Section */}
        <section className="grid md:grid-cols-2 gap-4 pt-12">
            <button className="py-4 bg-accent text-primary-dark rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent/90 transition-all">
                <Download size={18} />
                Download Integrity Cert
            </button>
            <button className="py-4 border border-red-500/20 text-red-500 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all">
                <AlertTriangle size={18} />
                Report Discrepancy
            </button>
        </section>

        <footer className="text-center space-y-4 pt-16 pb-8 border-t border-white/5 mt-16">
            <div className="flex justify-center gap-4 text-white/20">
              <ShieldCheck size={20} />
              <Database size={20} />
              <Lock size={20} />
            </div>
            <p className="text-xs uppercase tracking-wider text-white/40 max-w-lg mx-auto leading-relaxed font-semibold">
              This verification portal is fueled by real-time blockchain telemetry. <br/>
              Identity is sovereign. Truth is immutable.
            </p>
        </footer>
      </main>
    </div>
  );
};

export default VerifyPortal;
