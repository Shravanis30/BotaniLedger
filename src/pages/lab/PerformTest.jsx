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

const PerformTest = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [results, setResults] = useState({
        overallResult: 'PASS',
        activeIngredient: {
            measured: 0,
            expectedMin: 2.0,
            expectedMax: 5.0,
            unit: '%',
            status: 'PASS'
        },
        heavyMetals: {
            lead: { measured: 0, limit: 10, status: 'PASS' },
            mercury: { measured: 0, limit: 1, status: 'PASS' },
            arsenic: { measured: 0, limit: 3, status: 'PASS' }
        },
        microbiology: {
            status: 'PASS'
        }
    });

    const { data: batch, isLoading } = useQuery({
        queryKey: ['batch', batchId],
        queryFn: async () => {
            const resp = await api.get(`/farmer/batch/${batchId}`);
            return resp.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (formData) => {
            return await api.post('/lab/report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
        setResults(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please upload the physical report PDF.');

        const formData = new FormData();
        formData.append('batchId', batchId);
        formData.append('referenceNumber', `CERT-${Date.now().toString().slice(-6)}`);
        formData.append('testDate', new Date().toISOString());
        formData.append('results', JSON.stringify({
            ...results,
            purityScore: results.activeIngredient.measured // Using active ingredient % as purity score
        }));
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
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Bioactive Content</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Main pass percentage of the botanical batch</p>
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
                                    {['lead', 'mercury', 'arsenic'].map((metal) => (
                                        <div key={metal} className="flex items-center justify-between group">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest capitalize">{metal}</label>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    className="w-24 px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary outline-none text-right font-bold text-gray-900"
                                                    value={results.heavyMetals[metal].measured}
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        setResults(prev => ({
                                                            ...prev,
                                                            heavyMetals: {
                                                                ...prev.heavyMetals,
                                                                [metal]: {
                                                                    ...prev.heavyMetals[metal],
                                                                    measured: val,
                                                                    status: val <= prev.heavyMetals[metal].limit ? 'PASS' : 'FAIL'
                                                                }
                                                            }
                                                        }));
                                                    }}
                                                />
                                                <span className="text-[10px] font-bold text-gray-300 w-12 text-right">ppm</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Microbiology */}
                            <div className="space-y-8">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-3">
                                    Biological Safety <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Microbial Pathogens</span>
                                        <div className="flex gap-2">
                                            {['PASS', 'FAIL'].map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => handleInputChange('microbiology', 'status', status)}
                                                    className={cn(
                                                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        results.microbiology.status === status 
                                                            ? (status === 'PASS' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "bg-red-600 text-white")
                                                            : "bg-white text-gray-400 border-2 border-gray-100"
                                                    )}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-3xl flex gap-4">
                                        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-1" />
                                        <p className="text-[10px] text-amber-900 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                                            Verification includes E.Coli, Salmonella, and Total Plate Count compliance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                        onChange={(e) => handleInputChange('overallResult', '', e.target.value)}
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
