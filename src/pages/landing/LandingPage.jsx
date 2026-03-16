import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Zap, AlertTriangle, Search, Activity, Lock, Globe, Database } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden sidebar-gradient text-white px-6">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" />
          </svg>
        </div>
        
        <div className="max-w-6xl w-full text-center z-10 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent-light" />
              <span className="text-sm font-medium">Powered by Hyperledger Fabric + IPFS</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            From Field to Formulation — <br/>
            <span className="text-accent-light">Cryptographically Verified</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-green-100/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            BotaniLedger secures India's Ayurvedic herb supply chain through AI authentication, 
            blockchain immutability, and consumer-facing QR verification.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/verify/BP-2025-0056" className="w-full md:w-auto px-8 py-4 border-2 border-white rounded-xl font-bold hover:bg-white hover:text-primary transition-all duration-300">
              Verify a Product
            </Link>
            <Link to="/login" className="w-full md:w-auto px-8 py-4 bg-accent-light text-primary-dark rounded-xl font-bold hover:bg-white transition-all duration-300 shadow-xl shadow-green-900/20">
              Get Started
            </Link>
          </div>
          
          {/* Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: "Herbs Adulterated", value: "40%+", color: "text-red-300" },
              { label: "Annual Loss", value: "₹8,000 Cr", color: "text-amber-300" },
              { label: "Protection", value: "6-Phase", color: "text-emerald-300" },
              { label: "Verification", value: "< 2 sec", color: "text-sky-300" }
            ].map((stat, i) => (
              <div key={i} className="glass p-4 rounded-2xl animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-green-100/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">The Problem with Ayurvedic Supply Chains</h2>
            <div className="w-20 h-1 bg-accent-light mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Species Substitution", desc: "Wrong herbs declared at collection stage.", icon: AlertTriangle },
              { title: "Document Fraud", desc: "Fake lab certificates and reporting.", icon: AlertTriangle },
              { title: "Transit Adulteration", desc: "Physical swapping during shipment.", icon: AlertTriangle },
              { title: "Consumer Blindness", desc: "No way to verify product authenticity.", icon: AlertTriangle }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl border border-red-50 bg-red-50/30 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our 6-Phase Cryptographic Protection</h2>
            <p className="text-gray-600">Ensuring integrity at every touchpoint of the supply chain.</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { phase: "I", title: "Botanical Fingerprinting", icon: "🌿", status: "Active", desc: "AI-powered vision at collection." },
              { phase: "II", title: "Lab Quality Anchoring", icon: "🔬", status: "Secure", desc: "Cryptographic test reports." },
              { phase: "III", title: "Non-Repudiation Handover", icon: "🤝", status: "Verified", desc: "Digital signatures on transit." },
              { phase: "IV", title: "Visual Similarity Engine", icon: "👁️", status: "Active", desc: "5-point photo matching." },
              { phase: "V", title: "Batch Genealogy", icon: "🔗", status: "Immutable", desc: "Complete heritage tracking." },
              { phase: "VI", title: "Consumer Verification", icon: "📱", status: "Public", desc: "Instant QR authenticity." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors"></div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4 z-10 relative">
                  {item.phase}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-sm mb-2">{item.title}</h4>
                <p className="text-xs text-gray-500 mb-4">{item.desc}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-[10px] uppercase font-bold text-success tracking-wider">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                role: "Farmer",
                icon: <Globe className="w-8 h-8 text-primary" />,
                steps: ["Capture 5-point herb photos", "GPS location verification", "Sync offline data to chain"]
              },
              {
                role: "Laboratory",
                icon: <Database className="w-8 h-8 text-primary" />,
                steps: ["Standard NABL quality tests", "Upload chemical composition", "Issue on-chain certificate"]
              },
              {
                role: "Consumer",
                icon: <Search className="w-8 h-8 text-primary" />,
                steps: ["Scan product QR code", "View full truth timeline", "Verify lab & farmer data"]
              }
            ].map((col, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  {col.icon}
                </div>
                <h3 className="text-2xl font-bold mb-6 italic">{col.role}</h3>
                <ul className="space-y-4 text-left inline-block">
                  {col.steps.map((step, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-accent-light shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-dark text-white text-center">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { n: "3,500+", l: "TPS Network Speed" },
            { n: "< 2 sec", l: "Verification Time" },
            { n: "0%", l: "Adulteration Goal" },
            { n: "8,000+", l: "Registered Batches" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-bold text-accent-light mb-2">{stat.n}</div>
              <div className="text-sm text-green-100/60 uppercase tracking-widest">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-2xl font-bold text-primary mb-2">BotaniLedger</div>
            <p className="text-sm text-gray-500 italic">Securing the essence of Ayurveda through technology.</p>
          </div>
          <div className="flex gap-12 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Technology</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 BotaniLedger. Powered by Hyperledger Fabric + IPFS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
