import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Search,
  Activity,
  Lock,
  Globe,
  Database,
  ArrowRight,
  TrendingUp,
  Award,
  FlaskConical,
  Sprout,
  QrCode
} from 'lucide-react';

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#0d1f18] text-white selection:bg-accent-light selection:text-primary-dark">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[105vh] flex items-center justify-center overflow-hidden px-6">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-botanical.png"
            alt="Botanical Traceability"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Floating Particle Effects (SVG) */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.circle
              cx="20" cy="30" r="0.2" fill="white"
              animate={{ y: [-20, 20], opacity: [0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.circle
              cx="80" cy="60" r="0.3" fill="white"
              animate={{ y: [20, -20], opacity: [0, 0.8, 0] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            />
          </svg>
        </div>

        <div className="max-w-7xl w-full relative z-20 pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 mb-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-primary-dark bg-accent-light flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-primary-dark" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold tracking-wider uppercase text-green-300">
                  Securing India's Ayush Network
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-bold leading-[1.1] mb-8 text-gradient italic">
                Purity <span className="font-light not-italic">Verified.</span> <br />
                Trust <span className="text-accent underline decoration-accent/30 underline-offset-8">Blockchain</span>ed.
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-100/70 mb-12 max-w-xl leading-relaxed font-light">
                BotaniLedger combines **AI Species Identification** with **Hyperledger Fabric** to ensure every herb in your medicine is authentic and untampered.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/login" className="group w-full sm:w-auto px-10 py-5 bg-accent text-primary-dark rounded-full font-bold hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(76,175,80,0.3)] flex items-center justify-center gap-3">
                  Start Traceability
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/verify" className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 rounded-full font-bold hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-3">
                  <QrCode className="w-5 h-5" />
                  Verify Batch
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-16 flex items-center gap-8 border-t border-white/10 pt-10">
                <div>
                  <div className="text-3xl font-bold italic">98.4%</div>
                  <div className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Accuracy rate</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-3xl font-bold italic">0.2s</div>
                  <div className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Block Finality</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-accent italic" />
                  <span className="text-xs font-medium text-green-100/50">AYUSH <br />Standard V3</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Interactive Hero Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="glass p-8 rounded-[3rem] border-white/20 shadow-[-20px_20px_60px_rgba(0,0,0,0.5)] relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-accent/20 rounded-2xl">
                    <Database className="w-8 h-8 text-accent" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Current Ledger Status</div>
                    <div className="text-xs font-bold text-success flex items-center gap-2 justify-end">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      Live & Synchronized
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex justify-between mb-3 text-xs">
                      <span className="text-white/60">Batch ID</span>
                      <span className="font-mono text-accent">#BL-7729-WX</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-accent"
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] uppercase tracking-tighter font-bold">
                      <span>Harvested</span>
                      <span className="text-accent">Authenticating Species...</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 rounded-2xl">
                      <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
                      <div className="text-lg font-bold italic">$8B+</div>
                      <div className="text-[10px] text-white/40">Market Risk Mitigated</div>
                    </div>
                    <div className="glass-card p-4 rounded-2xl">
                      <Lock className="w-5 h-5 text-sky-400 mb-2" />
                      <div className="text-lg font-bold italic">AES-256</div>
                      <div className="text-[10px] text-white/40">Encryption Standard</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-primary-dark bg-gray-800" />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-white/50">Used by 1,200+ Accredited Labs</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/40 blur-[100px] rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <Sprout className="w-10 h-10 text-accent" />,
              title: "Ethical Sourcing",
              desc: "Every batch is pinned to a specific GPS-verified farm plot via IPFS metadata."
            },
            {
              icon: <FlaskConical className="w-10 h-10 text-emerald-400" />,
              title: "Scientific Rigor",
              desc: "Integration with NABL-accredited labs for immutable quality certificates."
            },
            {
              icon: <QrCode className="w-10 h-10 text-sky-400" />,
              title: "Radical Transparency",
              desc: "Empowering consumers with the full truth of their medicine via a 1-second scan."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group"
            >
              <div className="mb-8 p-4 bg-white/5 rounded-2xl inline-block group-hover:bg-accent/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 italic">{item.title}</h3>
              <p className="text-green-100/50 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The 6-Phase Ledger Walkthrough */}
      <section className="py-32 px-6 bg-[#0a1712] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 italic text-gradient">The Cryptographic Lifecycle</h2>
            <p className="text-white/40 max-w-2xl mx-auto font-light text-lg">
              From the moment an herb is plucked to the moment it reaches your hands,
              identity and quality are mathematically guaranteed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { phase: "01", title: "Botanical Fingerprinting", desc: "AI visual recognition at the collection center identifies species and visual purity." },
              { phase: "02", title: "Metadata Anchoring", desc: "Harvest data, GPS, and farmer identity are timestamped into a Fabric block." },
              { phase: "03", title: "Laboratory Vault", desc: "Physical test results are hashed and pinned to IPFS, ensuring certificates can't be forged." },
              { phase: "04", title: "Genesys Tracking", desc: "Smart contracts manage the ownership transfer between farmer, lab, and manufacturer." },
              { phase: "05", title: "Batch Genealogy", desc: "Complex products derived from multiple herb batches are automatically linked in our graph." },
              { phase: "06", title: "Public Truth Portal", desc: "Consumer redirection to a secure, unhackable authenticity web portal." }
            ].map((item, i) => (
              <div key={i} className="group relative p-1 leading-none rounded-[2rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative glass-card p-10 rounded-[2rem] h-full flex flex-col justify-between">
                  <div>
                    <span className="text-4xl font-black text-white/5 mb-6 block group-hover:text-accent/20 transition-colors uppercase tracking-tighter">
                      Phase {item.phase}
                    </span>
                    <h4 className="text-xl font-bold mb-4 italic tracking-wide">{item.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed font-light">{item.desc}</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest">Secured by Chain</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="text-3xl font-bold italic mb-6">Botani<span className="text-accent font-light">Ledger</span></div>
            <p className="text-white/40 max-w-sm font-light leading-relaxed mb-8">
              Securing the ancient wisdom of Ayurveda through modern cryptographic proofs and sovereign identity.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent/20 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-white/50" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-accent">Protocol</h5>
            <ul className="space-y-4 text-sm text-white/40 font-light">
              <li className="hover:text-white cursor-pointer transition-colors">Hyperledger Fabric</li>
              <li className="hover:text-white cursor-pointer transition-colors">IPFS / Pinata</li>
              <li className="hover:text-white cursor-pointer transition-colors">Species AI Engine</li>
              <li className="hover:text-white cursor-pointer transition-colors">Smart Contracts</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-accent">Company</h5>
            <ul className="space-y-4 text-sm text-white/40 font-light">
              <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-white cursor-pointer transition-colors">Audit Reports</li>
              <li className="hover:text-white cursor-pointer transition-colors">Governance</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] uppercase tracking-widest text-white/20">
            © 2025 BotaniLedger. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-px bg-white/10" />
            <div className="text-[10px] uppercase tracking-widest text-white/20 flex items-center gap-2">
              <Activity className="w-3 h-3 text-success" />
              Network Status: 100% Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
