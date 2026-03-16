import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge } from '@/components/shared/UI';
import { 
  PlusCircle, LayoutDashboard, List, RefreshCw, Settings, 
  ChevronRight, ChevronLeft, Camera, MapPin, CheckCircle, 
  Upload, Info, AlertCircle, Loader2, Search, Smartphone, Clock
} from 'lucide-react';
import { useOfflineStore } from '@/lib/offlineStore';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Herb Details', icon: Info },
  { id: 2, label: 'Photo Capture', icon: Camera },
  { id: 3, label: 'GPS Verification', icon: MapPin },
  { id: 4, label: 'Review & Submit', icon: CheckCircle },
];

const HERB_OPTIONS = [
    "Ashwagandha (Withania somnifera)",
    "Tulsi (Ocimum sanctum)",
    "Neem (Azadirachta indica)",
    "Turmeric (Curcuma longa)",
    "Brahmi (Bacopa monnieri)",
    "Amla (Phyllanthus emblica)",
    "Guduchi (Tinospora cordifolia)",
    "Shatavari (Asparagus racemosus)",
    "Gotu Kola (Centella asiatica)",
    "Arjuna (Terminalia arjuna)",
    "Bhumyamalaki (Phyllanthus niruri)",
    "Triphala (Polyherbal)",
    "Shilajit (Asphaltum punjabianum)",
    "Guggul (Commiphora wightii)",
    "Boswellia (Boswellia serrata)",
    "Licorice (Glycyrrhiza glabra)",
    "Ginger (Zingiber officinale)",
    "Moringa (Moringa oleifera)",
    "Aloe Vera (Aloe barbadensis)",
    "Safed Musli (Chlorophytum borivilianum)"
];

const RecordCollection = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHerbList, setShowHerbList] = useState(false);
  
  const [formData, setFormData] = useState({
    species: 'Ashwagandha (Withania somnifera)',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    collector: user?.name || 'Ramesh Kumar',
    zone: 'North-West Herb Belt',
    notes: '',
    photos: { macro: null, texture: null, bulk: null, packaging: null, context: null },
    location: { lat: 22.7196, lng: 75.8577, accuracy: 12 },
    timestamp: new Date().toLocaleString()
  });

  const [scanning, setScanning] = useState({});
  const navigate = useNavigate();
  const addPendingBatch = useOfflineStore(state => state.addPendingBatch);

  const sidebarItems = [
    { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard },
    { label: 'Record Collection', to: '/farmer/record', icon: PlusCircle },
    { label: 'My Batches', to: '/farmer/batches', icon: List },
    { label: 'Sync Status', to: '/farmer/sync', icon: RefreshCw },
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handlePhotoUpload = (key) => {
    setScanning(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
        setFormData(prev => ({
            ...prev,
            photos: { ...prev.photos, [key]: 'uploaded' }
        }));
        setScanning(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  const handleSubmit = (type) => {
      setIsSubmitting(true);
      
      if (type === 'BLOCKCHAIN') {
          // Simulate multi-phase submission
          setTimeout(() => setSubmitPhase(1), 1000); // Uploading to IPFS
          setTimeout(() => setSubmitPhase(2), 2500); // Committing to Fabric
          setTimeout(() => {
              addPendingBatch({ ...formData, id: `BL-2025-${Math.floor(Math.random() * 90000) + 10000}` });
              setSubmitPhase(3); // Success
              setTimeout(() => navigate('/farmer'), 1500);
          }, 4000);
      } else {
          addPendingBatch(formData);
          navigate('/farmer');
      }
  };

  const filteredHerbs = HERB_OPTIONS.filter(h => 
      h.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar portalName="Farmer Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">New Herb Collection</h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 bg-primary/5 w-fit px-3 py-1 rounded-full border border-primary/10">
                Phase {currentStep} of 4: {STEPS[currentStep-1].label}
            </p>
          </div>
          <div className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Protocol v1.4.2 Active
          </div>
        </header>

        {/* Progress Bar */}
        <div className="mb-16 max-w-4xl mx-auto px-12">
            <div className="flex justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_15px_rgba(45,106,79,0.3)]"
                        style={{ width: `${(currentStep - 1) * 33.33}%` }}
                    ></div>
                </div>
                
                {STEPS.map((step) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                            "w-14 h-14 rounded-[20px] flex items-center justify-center border-4 transition-all duration-500",
                            currentStep > step.id ? "bg-primary border-primary text-white scale-90" : 
                            currentStep === step.id ? "bg-white border-primary text-primary shadow-2xl shadow-green-900/20 scale-110" : 
                            "bg-white border-gray-100 text-gray-300"
                        )}>
                            {currentStep > step.id ? <CheckCircle size={24} strokeWidth={2.5} /> : <step.icon size={22} />}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-6 px-[-20px]">
                {STEPS.map((step) => (
                    <span key={step.id} className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] w-20 text-center",
                        currentStep === step.id ? "text-primary" : "text-gray-400"
                    )}>
                        {step.label}
                    </span>
                ))}
            </div>
        </div>

        {/* Step Content */}
        <Card className={cn(
            "max-w-5xl mx-auto border-none shadow-2xl shadow-green-900/5 mb-12 p-0 overflow-hidden transition-all duration-500",
            isSubmitting && "opacity-50 pointer-events-none scale-[0.98]"
        )}>
            <div className="p-12 min-h-[500px]">
                {currentStep === 1 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-3 relative">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Herb Species</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search size={18} />
                                    </div>
                                    <input 
                                        className="w-full pl-12 pr-5 py-5 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                        placeholder="Search species..."
                                        value={searchTerm || formData.species}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowHerbList(true);
                                        }}
                                        onFocus={() => setShowHerbList(true)}
                                    />
                                    {showHerbList && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-gray-50 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
                                            {filteredHerbs.map(h => (
                                                <button 
                                                    key={h}
                                                    className="w-full text-left px-4 py-3 hover:bg-primary/5 rounded-xl font-bold text-gray-700 text-sm transition-colors"
                                                    onClick={() => {
                                                        setFormData({...formData, species: h});
                                                        setSearchTerm(h);
                                                        setShowHerbList(false);
                                                    }}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Quantity (kg)</label>
                                <input 
                                    type="number"
                                    className="w-full px-6 py-5 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary transition-all outline-none font-black text-gray-800"
                                    placeholder="0.00"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-10">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Collector Name</label>
                                <input 
                                    readOnly
                                    className="w-full px-6 py-5 border-2 border-gray-50 rounded-2xl bg-gray-100 font-bold text-gray-500 cursor-not-allowed"
                                    value={formData.collector}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Collection Zone</label>
                                <input 
                                    className="w-full px-6 py-5 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                    value={formData.zone}
                                    onChange={(e) => setFormData({...formData, zone: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                                <input 
                                    type="date"
                                    className="w-full px-6 py-5 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800 appearance-none"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Collector Notes</label>
                            <textarea 
                                rows={4}
                                className="w-full px-6 py-5 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                placeholder="Describe weather conditions, soil moisture or visible quality..."
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="p-8 bg-primary/5 rounded-[32px] flex items-center gap-6 border border-primary/10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
                                <Camera size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-gray-900 mb-1">5-Point Protocol Authentication</h4>
                                <p className="text-sm text-gray-600 leading-relaxed italic opacity-70">AI botanical fingerprinting requires all 5 macro-perspectives. Protocol v1.4.2 active.</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {Object.entries(formData.photos).map(([key, value]) => (
                                <div key={key} className="space-y-4">
                                    <button 
                                        onClick={() => handlePhotoUpload(key)}
                                        className={cn(
                                            "w-full aspect-square rounded-[32px] border-4 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-300 group overflow-hidden relative",
                                            value ? "bg-success/5 border-success/20" : "bg-gray-50 border-gray-100 hover:border-primary hover:bg-white hover:shadow-xl"
                                        )}
                                    >
                                        {scanning[key] ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Inference...</span>
                                            </div>
                                        ) : value ? (
                                            <>
                                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&w=300&q=80')] bg-cover opacity-30"></div>
                                                <div className="relative z-10 w-12 h-12 bg-success rounded-xl flex items-center justify-center text-white shadow-lg">
                                                    <CheckCircle size={24} />
                                                </div>
                                                <span className="text-[10px] font-black text-success relative z-10 uppercase mt-4 tracking-widest">Verified ✓</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-gray-300 group-hover:text-primary mb-3 group-hover:scale-110 transition-transform" />
                                                <span className="text-[9px] font-black text-gray-400 uppercase text-center leading-tight tracking-widest group-hover:text-primary">Click to<br/>Upload</span>
                                            </>
                                        )}
                                    </button>
                                    <div className="text-[10px] text-center font-black text-gray-400 uppercase tracking-[0.2em]">{key}</div>
                                    {value && (
                                        <div className="bg-success/10 px-2 py-1.5 rounded-lg text-[9px] font-bold text-success text-center animate-slide-up">
                                            ✓ {formData.species.split(' (')[0]}: 94.2%
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {Object.values(formData.photos).every(Boolean) ? (
                            <div className="p-6 bg-success text-white rounded-[24px] flex items-center justify-center gap-4 shadow-xl shadow-success/20 animate-bounce-subtle">
                                <CheckCircle size={24} />
                                <span className="text-sm font-black uppercase tracking-widest">
                                    Protocol Success: All 5 Photos Verified as {formData.species.split(' (')[0]}
                                </span>
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center justify-center gap-4 text-gray-400">
                                <AlertCircle size={24} />
                                <span className="text-sm font-bold uppercase tracking-widest italic tracking-wider">
                                    Awaiting Photos for AI Fingerprinting...
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-10 animate-fade-in text-center py-12">
                        <div className="inline-flex w-32 h-32 bg-primary/5 rounded-[40px] items-center justify-center text-primary mb-10 shadow-inner relative group">
                            <MapPin className="w-14 h-14 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-[40px] animate-ping opacity-20"></div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-success rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
                                <PlusCircle size={18} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Cryptographic GPS Tagging</h3>
                        <p className="text-gray-500 max-w-lg mx-auto mb-12 leading-relaxed font-medium">
                            Securing batch origin through device-level geolocated timestamps. 
                            Anchored to current cluster: <span className="text-primary font-bold">{formData.zone}</span>.
                        </p>
                        
                        <div className="max-w-xl mx-auto grid grid-cols-2 gap-6 mb-12">
                            <div className="p-8 bg-gray-50 rounded-[32px] border-2 border-white shadow-sm flex flex-col items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Coordinates</span>
                                <div className="space-y-1">
                                    <div className="text-xl font-mono font-black text-primary">{formData.location.lat}° N</div>
                                    <div className="text-xl font-mono font-black text-primary">{formData.location.lng}° E</div>
                                </div>
                                <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                    <span className="text-[9px] font-black text-success uppercase">Accuracy ±{formData.location.accuracy}m</span>
                                </div>
                            </div>
                            <div className="p-8 bg-gray-50 rounded-[32px] border-2 border-white shadow-sm flex flex-col items-center justify-between">
                                <div className="space-y-4 w-full">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Timestamp</span>
                                        <div className="flex items-center justify-center gap-2 font-black text-gray-800">
                                            <Clock size={16} className="text-primary" />
                                            {formData.timestamp}
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-white border-2 border-primary/20 text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                        Update Position
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-3 px-8 py-3 bg-success/10 text-success rounded-full text-xs font-black border-2 border-success/20 shadow-xl shadow-success/5">
                            <CheckCircle size={18} />
                            <span className="uppercase tracking-widest">Origin Validated: Within Forest-Belt Cluster #84</span>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-10 animate-fade-in">
                         <div className="grid md:grid-cols-3 gap-10">
                            <div className="md:col-span-2 space-y-8">
                                <div className="p-10 bg-gray-50 rounded-[40px] border-2 border-white shadow-sm space-y-8">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-black text-2xl text-primary-dark tracking-tight">Batch Manifest</h4>
                                        <div className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                            ID: BL-2025-XXXXX
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                        <div>
                                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Herb Species</span>
                                            <span className="font-black text-lg text-gray-800">{formData.species}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantity</span>
                                            <span className="font-black text-lg text-gray-800">{formData.quantity} kg</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Origin Zone</span>
                                            <span className="font-black text-lg text-gray-800">{formData.zone}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Certified On</span>
                                            <span className="font-black text-lg text-gray-800">{formData.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-4">
                                     {Object.keys(formData.photos).map((k) => (
                                         <div key={k} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                             <img src="https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover opacity-60" />
                                         </div>
                                     ))}
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="aspect-[4/5] bg-white rounded-[40px] border-4 border-gray-50 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-green-900/5">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80')] bg-cover opacity-10"></div>
                                    <MapPin className="w-16 h-16 text-primary mb-6 relative z-10" />
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] relative z-10">Blockchain Anchor</span>
                                    <span className="text-xl font-black text-primary italic mt-4 relative z-10">READY TO COMMIT</span>
                                    
                                    <div className="mt-8 bg-success/10 px-4 py-2 rounded-full relative z-10">
                                        <div className="text-[10px] font-black text-success uppercase tracking-widest">Accuracy Verified</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-primary-dark/5 rounded-[24px] text-[10px] leading-relaxed italic text-gray-500 text-center font-bold">
                                    Verification Protocol v1.4.2: Records are cryptographically signed and immutable post-submission.
                                </div>
                            </div>
                         </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-50/50 p-10 border-t border-gray-50 flex justify-between items-center gap-6">
                <button 
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={cn(
                        "px-10 py-5 rounded-2xl font-black flex items-center gap-3 transition-all uppercase text-[11px] tracking-widest",
                        currentStep === 1 ? "bg-gray-100 text-gray-300" : "bg-white border-2 border-gray-100 text-gray-600 hover:border-primary hover:text-primary shadow-sm"
                    )}
                >
                    <ChevronLeft size={20} />
                    Back
                </button>
                
                <div className="flex gap-4">
                    {currentStep < 4 ? (
                        <button 
                            onClick={handleNext}
                            className="px-12 py-5 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-primary-mid transition-all shadow-xl shadow-green-900/20 uppercase text-[11px] tracking-widest"
                        >
                            Next Step
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={() => handleSubmit('OFFLINE')}
                                className="px-10 py-5 border-2 border-primary text-primary rounded-2xl font-black transition-all hover:bg-primary/5 uppercase text-[11px] tracking-widest"
                            >
                                Save Offline
                            </button>
                            <button 
                                onClick={() => handleSubmit('BLOCKCHAIN')}
                                className="px-12 py-5 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-primary-mid transition-all shadow-2xl shadow-green-900/30 uppercase text-[11px] tracking-[0.1em]"
                            >
                                Commit to Blockchain
                                <CheckCircle size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Card>

        {/* Overlay Progress */}
        {isSubmitting && (
            <div className="fixed inset-0 z-[100] bg-primary-dark/95 backdrop-blur-md flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-12">
                    <div className="relative inline-block">
                        <div className="w-32 h-32 border-8 border-white/10 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 border-t-8 border-accent-light rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw size={40} className="text-white animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className={cn(
                            "flex items-center gap-4 transition-all duration-500",
                            submitPhase >= 1 ? "text-success opacity-100" : "text-white/30"
                        )}>
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", submitPhase >= 1 ? "bg-success border-success" : "border-white/30")}>
                                {submitPhase >= 1 && <CheckCircle size={14} className="text-primary-dark" />}
                            </div>
                            <span className="font-black uppercase tracking-widest text-sm">Uploading photos to IPFS...</span>
                        </div>
                        
                        <div className={cn(
                            "flex items-center gap-4 transition-all duration-500",
                            submitPhase >= 2 ? "text-success opacity-100" : "text-white/30"
                        )}>
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", submitPhase >= 2 ? "bg-success border-success" : "border-white/30")}>
                                {submitPhase >= 2 && <CheckCircle size={14} className="text-primary-dark" />}
                            </div>
                            <span className="font-black uppercase tracking-widest text-sm">Committing to Hyperledger Fabric...</span>
                        </div>

                        <div className={cn(
                            "flex items-center gap-4 transition-all duration-500",
                            submitPhase >= 3 ? "text-success opacity-100" : "text-white/30"
                        )}>
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", submitPhase >= 3 ? "bg-success border-success" : "border-white/30")}>
                                {submitPhase >= 3 && <CheckCircle size={14} className="text-primary-dark" />}
                            </div>
                            <span className="font-black uppercase tracking-widest text-sm">HerbBatch Registered! ID: BL-2025-00847</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default RecordCollection;
