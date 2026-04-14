import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TreeDeciduous, Upload, ShieldCheck, MapPin, Building2, UserCircle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/shared/UI';
import api from '@/lib/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('FARMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
        const payload = {
            ...formData,
            role: role === 'LABORATORY' ? 'lab' : role.toLowerCase(),
            organization: formData.name,
            address: formData.location
        };

        await api.post('/auth/register', payload);
        navigate('/awaiting-approval');
    } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-black text-2xl mb-8">
                <div className="bg-primary text-white p-2 rounded-xl shadow-lg">
                    <TreeDeciduous size={32} />
                </div>
                BotaniLedger
            </Link>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Stakeholder Registry</h1>
            {error && <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold ring-1 ring-red-100 animate-bounce">{error}</div>}
        </div>

        <Card className="p-10 border-none shadow-2xl shadow-green-900/10">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Role Switcher */}
                <div className="grid grid-cols-3 gap-3 p-1.5 bg-gray-100 rounded-2xl">
                    {['FARMER', 'LABORATORY', 'MANUFACTURER'].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                role === r ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                                required
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                placeholder={role === 'FARMER' ? 'Farm Name' : 'Organization Name'}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Contact Email</label>
                        <div className="relative">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                                id="email"
                                name="email"
                                required type="email"
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                placeholder="yourname@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                                required type="password"
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Headquarters Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                                required
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800"
                                placeholder="Region, State"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Credential Verification (License / Registration Image)</label>
                    <div className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${
                        file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                    }`}>
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept="image/*,.pdf"
                        />
                        {file ? (
                            <div className="text-center">
                                <ShieldCheck size={48} className="text-primary mx-auto mb-4" />
                                <div className="text-sm font-black text-gray-900">{file.name}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Ready for verification</div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Upload size={48} className="text-gray-300 mx-auto mb-4" />
                                <div className="text-sm font-black text-gray-400 uppercase tracking-widest">Click or Drag to Upload</div>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Ayush Certification / Farmer ID / GMP License required</p>
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    disabled={isSubmitting || !file}
                    className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-green-900/20 hover:bg-primary-dark transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
                >
                    {isSubmitting ? 'Processing Application...' : (
                        <>Submit for Approval <ArrowRight size={18} /></>
                    )}
                </button>
            </form>
        </Card>

        <p className="text-center text-xs font-bold text-gray-400">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
