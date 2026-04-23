import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LabLayout from '@/components/shared/LabLayout';
import { Card, Button, Input } from '@/components/shared/UI';
import { 
    Microscope, FlaskConical, ShieldCheck, Upload, 
    ArrowLeft, Loader2, CheckCircle2, AlertTriangle,
    FileText, Zap, Beaker, ClipboardList
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';

const PerformTest = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [results, setResults] = useState({
        overallResult: 'PASS',
        activeIngredient: {
            name: 'Withanolides', // Default for many herbs, can be made dynamic
            measured: 0,
            expectedMin: 2.0,
            expectedMax: 5.0,
            unit: '%',
            status: 'PASS'
        },
        heavyMetals: {
            lead: { measured: 0, limit: 10, status: 'PASS' },
            mercury: { measured: 0, limit: 1, status: 'PASS' },
            arsenic: { measured: 0, limit: 3, status: 'PASS' },
            cadmium: { measured: 0, limit: 0.3, status: 'PASS' }
        },
        physicochemical: {
            ashContent: { total: 0, acidInsoluble: 0, status: 'PASS' },
            extractiveValues: { alcoholSoluble: 0, waterSoluble: 0, status: 'PASS' },
            moisture: { value: 0, limit: 10, status: 'PASS' }
        },
        microbiology: {
            tpc: 0,
            ymc: 0,
            ecoli: 'ABSENT',
            salmonella: 'ABSENT',
            status: 'PASS'
        },
        organoleptic: {
            appearance: '',
            color: '',
            odor: ''
        },
        verifiedPhotos: {}
    });

    const token = useAuthStore(state => state.token);

    const { data: batch, isLoading } = useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const resp = await api.get(`/farmer/batch/${batchId}`);
            return resp.data;
        },
        enabled: !!token && !!batchId
    });

    const mutation = useMutation({
        mutationFn: async (formData) => {
            return await api.post('/lab/report', formData);
        },
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/lab/certificates');
            }, 2500);
        },
        onError: (err) => {
            alert('Failed to generate certificate: ' + (err.response?.data?.message || err.message));
        }
    });

    const handleInputChange = (category, field, value) => {
        // Handle empty or NaN values for numeric inputs
        const sanitizedValue = (typeof value === 'number' && isNaN(value)) ? 0 : value;

        setResults(prev => {
            if (!field) {
                return { ...prev, [category]: sanitizedValue };
            }
            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [field]: sanitizedValue
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please upload the physical report PDF.');

        const photoKeys = Object.keys(batch?.photos || {}).filter(k => !['ipfsFolderCid', '_id'].includes(k) && batch.photos[k]?.url);
        const allVerified = photoKeys.every(k => results.verifiedPhotos[k]);
        
        if (!allVerified) {
            return alert('Please verify all botanical images against the physical specimen before generating the certificate.');
        }

        const formData = new FormData();
        formData.append('batchId', batchId);
        formData.append('referenceNumber', `CERT-${Date.now().toString().slice(-6)}`);
        formData.append('testDate', new Date().toISOString());
        const payload = {
            ...results,
            microbiology: {
                ...results.microbiology,
                totalPlateCount: results.microbiology.tpc,
                yeastAndMould: results.microbiology.ymc
            },
            purityScore: results.activeIngredient.measured,
            verificationStatus: results.verifiedPhotos
        };

        formData.append('results', JSON.stringify(payload));
        formData.append('report', file);

        mutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <LabLayout portalName="Lab Tester Node">
                <div className="h-[60vh] flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-primary mb-4" size={48} />
                    <p className="text-sm font-black text-gray-400">Syncing Batch DNA...</p>
                </div>
            </LabLayout>
        );
    }

    if (!batch) {
        return (
            <LabLayout portalName="Lab Tester Node">
                <div className="h-[60vh] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                        <AlertTriangle size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">Batch DNA Not Found</h2>
                    <p className="text-sm font-medium text-gray-400 max-w-sm text-center mb-8">
                        Unable to synchronize with the blockchain for batch <span className="font-bold text-red-400">#{batchId}</span>. This may be due to insufficient clearance or a temporary network disruption.
                    </p>
                    <button 
                        onClick={() => navigate('/lab')}
                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                    >
                        Return to Queue
                    </button>
                </div>
            </LabLayout>
        );
    }

    return (
        <LabLayout portalName="Lab Tester Node">
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1f18]/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="flex flex-col items-center p-12 bg-white rounded-[3rem] shadow-2xl border-2 border-emerald-500/20 max-w-md w-full animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-8 relative">
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
                            <CheckCircle2 size={48} className="relative z-10" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tight text-center">Certificate Generated</h2>
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-8 mt-2">Sovereign Truth Anchored ✓</div>
                        <div className="w-full h-px bg-gray-100 mb-8" />
                        <p className="text-sm font-medium text-gray-500 text-center leading-relaxed italic">
                            Molecular integrity details for Batch <span className="text-primary font-black not-italic">#{batchId}</span> have been cryptographically verified and committed to the global AYUSH blockchain.
                        </p>
                    </div>
                </div>
            )}
            <header className="mb-10">
                <button 
                    onClick={() => navigate('/lab')}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6"
                >
                    <ArrowLeft size={14} /> Back to Queue
                </button>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Molecular Analysis Phase</div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none italic">
                            Perform <span className="text-primary font-light not-italic">Testing</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-3 italic text-sm">Target Batch: <span className="text-primary font-mono font-bold not-italic">#{batchId}</span></p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-10">
                    {/* Active Ingredient Pass Percentage */}
                    <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Bioactive Content</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Main pass percentage of the botanical batch</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Collection Date</div>
                                <div className="text-sm font-bold text-gray-900 italic">
                                    {batch?.collectionDate ? new Date(batch.collectionDate).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-2">
                                <Input 
                                    label="Measured Percentage (%)"
                                    type="number" 
                                    step="0.1" 
                                    required
                                    className="text-2xl"
                                    value={results.activeIngredient.measured}
                                    onChange={(e) => handleInputChange('activeIngredient', 'measured', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="p-8 bg-primary/[0.03] rounded-3xl border-2 border-primary/5 flex flex-col justify-center">
                                <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-2 text-center">Protocol Reference</span>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600 px-4">
                                    <span>Expected:</span>
                                    <span className="text-primary">{results.activeIngredient.expectedMin}% - {results.activeIngredient.expectedMax}%</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Secondary Testing Matrix */}
                    <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-sky-100 rounded-2xl text-sky-600">
                                <Beaker size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Testing Matrix</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Pharmacopeia Compliance Standards</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {/* Heavy Metals */}
                            <div className="space-y-8">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-3">
                                    Heavy Metal Profile <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="space-y-6">
                                    {['lead', 'mercury', 'arsenic', 'cadmium'].map((metal) => (
                                        <div key={metal} className="flex items-center justify-between group">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest capitalize">{metal}</label>
                                                <span className="text-[9px] font-black text-gray-300 uppercase">Limit: {results.heavyMetals[metal].limit} ppm</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    className="w-24 px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary outline-none text-right font-bold text-gray-900"
                                                    value={results.heavyMetals[metal].measured || ''}
                                                    placeholder="0.00"
                                                    onChange={(e) => {
                                                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                        handleInputChange('heavyMetals', metal, {
                                                            ...results.heavyMetals[metal],
                                                            measured: val,
                                                            status: val <= results.heavyMetals[metal].limit ? 'PASS' : 'FAIL'
                                                        });
                                                    }}
                                                />
                                                <span className="text-[10px] font-bold text-gray-300 w-12 text-right">ppm</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Microbiology Expanded */}
                            <div className="space-y-8">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-3">
                                    Biological Safety <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TPC (Limit: 10^5)</label>
                                            <input 
                                                type="number" 
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold"
                                                value={results.microbiology.tpc || ''}
                                                onChange={(e) => handleInputChange('microbiology', 'tpc', e.target.value === '' ? 0 : parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Y&M (Limit: 10^3)</label>
                                            <input 
                                                type="number" 
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold"
                                                value={results.microbiology.ymc || ''}
                                                onChange={(e) => handleInputChange('microbiology', 'ymc', e.target.value === '' ? 0 : parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">E. Coli</span>
                                        <select 
                                            className="bg-transparent text-[10px] font-black uppercase outline-none"
                                            value={results.microbiology.ecoli}
                                            onChange={(e) => handleInputChange('microbiology', 'ecoli', e.target.value)}
                                        >
                                            <option value="ABSENT">ABSENT</option>
                                            <option value="PRESENT">PRESENT</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Salmonella</span>
                                        <select 
                                            className="bg-transparent text-[10px] font-black uppercase outline-none"
                                            value={results.microbiology.salmonella}
                                            onChange={(e) => handleInputChange('microbiology', 'salmonella', e.target.value)}
                                        >
                                            <option value="ABSENT">ABSENT</option>
                                            <option value="PRESENT">PRESENT</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Safety Status</span>
                                        <div className="flex gap-2">
                                            {['PASS', 'FAIL'].map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => handleInputChange('microbiology', 'status', status)}
                                                    className={cn(
                                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                                        results.microbiology.status === status 
                                                            ? (status === 'PASS' ? "bg-emerald-600 text-white" : "bg-red-600 text-white")
                                                            : "bg-white text-gray-400 border border-gray-100"
                                                    )}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Physicochemical Analysis */}
                    <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                                <FlaskConical size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Physicochemical Analysis</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Purity and Quality Metrics</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-3 mb-4">
                                    Ash Content <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Ash (%) <span className="text-primary/60">[Limit: 7%]</span></label>
                                        <input 
                                            type="number" step="0.01"
                                            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold"
                                            value={results.physicochemical.ashContent.total || ''}
                                            placeholder="0.00"
                                            onChange={(e) => handleInputChange('physicochemical', null, {
                                                ...results.physicochemical,
                                                ashContent: { ...results.physicochemical.ashContent, total: e.target.value === '' ? 0 : parseFloat(e.target.value) }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acid Insoluble (%) <span className="text-primary/60">[Limit: 1%]</span></label>
                                        <input 
                                            type="number" step="0.01"
                                            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold"
                                            value={results.physicochemical.ashContent.acidInsoluble || ''}
                                            placeholder="0.00"
                                            onChange={(e) => handleInputChange('physicochemical', null, {
                                                ...results.physicochemical,
                                                ashContent: { ...results.physicochemical.ashContent, acidInsoluble: e.target.value === '' ? 0 : parseFloat(e.target.value) }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 pt-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moisture / LOD (%) <span className="text-primary/60">[Limit: 12%]</span></label>
                                    <input 
                                        type="number" step="0.01"
                                        className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold"
                                        value={results.physicochemical.moisture.value || ''}
                                        placeholder="0.00"
                                        onChange={(e) => handleInputChange('physicochemical', null, {
                                            ...results.physicochemical,
                                            moisture: { ...results.physicochemical.moisture, value: e.target.value === '' ? 0 : parseFloat(e.target.value) }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-3 mb-4">
                                    Extractive Values <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Alcohol Soluble (%)</label>
                                        <input 
                                            type="number" step="0.1"
                                            className="w-24 px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-right"
                                            value={results.physicochemical.extractiveValues.alcoholSoluble}
                                            onChange={(e) => handleInputChange('physicochemical', null, {
                                                ...results.physicochemical,
                                                extractiveValues: { ...results.physicochemical.extractiveValues, alcoholSoluble: e.target.value === '' ? 0 : parseFloat(e.target.value) }
                                            })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Water Soluble (%)</label>
                                        <input 
                                            type="number" step="0.1"
                                            className="w-24 px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-right"
                                            value={results.physicochemical.extractiveValues.waterSoluble}
                                            onChange={(e) => handleInputChange('physicochemical', null, {
                                                ...results.physicochemical,
                                                extractiveValues: { ...results.physicochemical.extractiveValues, waterSoluble: e.target.value === '' ? 0 : parseFloat(e.target.value) }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* Organoleptic Evaluation */}
                    <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                                <Microscope size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Organoleptic Evaluation</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sensory Analysis Standards</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['appearance', 'color', 'odor'].map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{field}</label>
                                    <input 
                                        type="text"
                                        placeholder={`Enter ${field}...`}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold italic"
                                        value={results.organoleptic[field]}
                                        onChange={(e) => handleInputChange('organoleptic', field, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Image Verification Section */}
                    <Card className="p-10 border-none shadow-2xl shadow-black/5 bg-white overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Botanical Verification</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Verify physical specimen against blockchain records</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(batch?.photos || {})
                                .filter(([key]) => !['ipfsFolderCid', '_id'].includes(key) && batch.photos[key]?.url)
                                .map(([key, photo], idx) => (
                                <div key={key} className="space-y-4 group">
                                    <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-gray-100 bg-gray-50 shadow-inner">
                                        <img 
                                            src={photo.url} 
                                            alt={`Batch Photo ${key}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{key}</span>
                                        </div>
                                    </div>
                                    <div 
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer",
                                            results.verifiedPhotos[key] 
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                                                : "bg-gray-50 border-gray-100 text-gray-400"
                                        )}
                                        onClick={() => setResults(prev => ({
                                            ...prev,
                                            verifiedPhotos: {
                                                ...prev.verifiedPhotos,
                                                [key]: !prev.verifiedPhotos[key]
                                            }
                                        }))}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                                            results.verifiedPhotos[key] ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-200"
                                        )}>
                                            {results.verifiedPhotos[key] && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {results.verifiedPhotos[key] ? 'Identity Confirmed' : 'Confirm Identity'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!batch?.photos || batch.photos.length === 0) && (
                            <div className="py-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No blockchain photos available for this batch</p>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-10">
                    <Card className="p-8 border-none shadow-2xl shadow-black/5 bg-[#0d1f18] text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-primary italic">Document Sovereignty</h3>
                        
                        <div className="space-y-6 relative z-10">
                            <div 
                                className={cn(
                                    "border-2 border-dashed rounded-[2.5rem] p-10 text-center transition-all cursor-pointer group",
                                    file ? "border-primary/40 bg-primary/5" : "border-white/10 hover:border-primary/40 hover:bg-white/5"
                                )}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <input 
                                    id="file-upload"
                                    type="file" 
                                    accept=".pdf"
                                    className="hidden" 
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                {file ? (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto shadow-2xl">
                                            <FileText size={32} />
                                        </div>
                                        <div className="text-xs font-bold text-white italic truncate px-4">{file.name}</div>
                                        <button onClick={(e) => {e.stopPropagation(); setFile(null);}} className="text-[9px] text-red-400 font-bold uppercase tracking-widest hover:text-red-300">Change Document</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 mx-auto group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs font-black uppercase tracking-widest">Upload Physical Cert</div>
                                            <div className="text-[9px] text-white/20 uppercase tracking-[0.2em]">PDF Format Required</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 pt-4">
                                <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Consensus Overview</div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">Overall Result:</span>
                                    <select 
                                        className="bg-transparent text-primary font-black uppercase tracking-widest outline-none cursor-pointer"
                                        value={results.overallResult}
                                        onChange={(e) => handleInputChange('overallResult', null, e.target.value)}
                                    >
                                        <option value="PASS" className="bg-[#0d1f18]">PASS</option>
                                        <option value="FAIL" className="bg-[#0d1f18]">FAIL</option>
                                    </select>
                                </div>
                            </div>

                            <Button 
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full py-6 rounded-[2rem] gold-gradient text-primary-dark font-black uppercase tracking-widest mt-8 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {mutation.isPending ? (
                                    <><Loader2 className="animate-spin" size={20} /> <span className="animate-pulse">Anchoring Truth...</span></>
                                ) : (
                                    <><ShieldCheck size={20} /> Generate Certificate</>
                                )}
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-8 border-none shadow-xl shadow-black/5 bg-gray-50 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <FlaskConical className="text-primary" size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Batch Identity DNA</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Botanical ID</span>
                                <span className="text-sm font-black text-gray-900 font-mono italic">{batch?.batchId}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Species</span>
                                <span className="text-sm font-black text-gray-900 italic">{batch?.herbSpecies?.common}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Zone Origin</span>
                                <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                                    {batch?.location?.zone || 'Assigned Belt'}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </LabLayout>
    );
};

export default PerformTest;
