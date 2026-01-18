"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Terminal, Shield, Lock, Cpu, Zap, Globe, Share2, Activity, ShieldAlert, X, FileText, LockKeyhole, AlertTriangle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FinalPremiumCTF() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  
  // Modal States
  const [showTerms, setShowTerms] = useState(false);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse Glow Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const target = new Date('January 31, 2026 5:59:59').getTime();
    const interval = setInterval(() => {
      const diff = target - new Date().getTime();
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll detection to unlock buttons
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Triggers when user is within 10px of the bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setHasReadToBottom(true);
      }
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const handleAccept = async () => {
  setShowTerms(false);
  setStatus('SENDING_VERIFICATION_PACKET...');

  // This initiates the Supabase Auth process and sends the confirmation email
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: 'CTF_SECURE_PASS_2026', // System requirement; users won't need to know this
    options: {
      data: {
        alias: formData.name, // The database trigger will look for this key
        phone: formData.phone  // The database trigger will look for this key
      }
    }
  });

  if (error) {
    setStatus(`UPLINK_ERROR: ${error.message}`);
  } else {
    // This confirms to the operator that they must check their inbox
    setStatus('UPLINK_PENDING: CHECK_YOUR_INBOX_TO_CONFIRM');
  }
};

  if (!mounted) return null;
  const icons = [Terminal, Shield, Lock, Cpu, Zap, Globe, Share2, Activity];

  return (
    <main className="min-h-screen bg-[#05080a] text-[#9feaf9] font-mono flex items-center justify-center relative overflow-hidden p-6 lg:p-12">
      
      {/* BACKGROUND EFFECTS */}
      <motion.div className="pointer-events-none fixed inset-0 z-10 opacity-50" style={{ background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(159, 234, 249, 0.08), transparent 80%)` }} />
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(#9feaf9 1px, transparent 1px), linear-gradient(90deg, #9feaf9 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* SIDE-BY-SIDE INTERFACE */}
      <div className="z-20 flex flex-col lg:flex-row items-stretch gap-12 max-w-7xl w-full">
        
        {/* REGISTRATION FORM (LEFT) */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
          <div className="bg-[#0b0e14]/85 backdrop-blur-3xl border border-[#9feaf9]/30 rounded-[2.5rem] p-12 relative shadow-[0_0_100px_rgba(0,0,0,0.5)] h-full">
            <div className="flex justify-between items-start mb-14">
              <div>
                <h1 className="text-7xl font-black italic tracking-tighter uppercase text-white leading-none">CTF<span className="text-[#9feaf9]">.26</span></h1>
                <p className="text-[10px] tracking-[0.6em] text-[#9feaf9] mt-4 font-bold uppercase">{">"} UPLINK STATUS: SECURE</p>
              </div>
              <div className="p-4 bg-[#9feaf9]/5 rounded-2xl border border-[#9feaf9]/20">
                <Activity className="text-[#9feaf9] animate-pulse" size={36} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-12">
              {Object.entries(timeLeft).map(([unit, val]) => (
                <div key={unit} className="bg-black/40 border border-[#9feaf9]/10 p-5 rounded-2xl text-center shadow-inner">
                  <span className="block text-4xl font-black text-white">{val}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#9feaf9]/40 font-bold">{unit}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required placeholder="OPERATOR_ALIAS" className="w-full bg-black/40 border border-[#9feaf9]/20 p-6 rounded-2xl outline-none focus:border-[#9feaf9] transition-all text-white uppercase tracking-widest text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required type="email" placeholder="SECURE_EMAIL_V4" className="w-full bg-black/40 border border-[#9feaf9]/20 p-6 rounded-2xl outline-none focus:border-[#9feaf9] transition-all text-white text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required placeholder="ENCRYPTED_COMMS_LINE" className="w-full bg-black/40 border border-[#9feaf9]/20 p-6 rounded-2xl outline-none focus:border-[#9feaf9] transition-all text-white text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <motion.button whileHover={{ scale: 1.02, backgroundColor: "#fff" }} whileTap={{ scale: 0.98 }} className="w-full bg-[#9feaf9] text-black font-black py-7 rounded-2xl uppercase tracking-[0.4em] text-xs shadow-[0_20px_40px_rgba(159,234,249,0.2)] transition-all">Initialize Connection</motion.button>
            </form>
          </div>
        </motion.div>

        {/* RULES PREVIEW (RIGHT) */}
              <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ 
            opacity: 1, x: 0,
            borderColor: isTyping ? "rgba(159, 234, 249, 0.6)" : "rgba(159, 234, 249, 0.2)",
            boxShadow: isTyping ? "0 0 50px rgba(159, 234, 249, 0.15)" : "0 0 0px transparent"
          }}
          className="w-full lg:w-[450px] bg-[#0b0e14]/85 backdrop-blur-3xl border rounded-[2.5rem] p-12 flex flex-col transition-all duration-500"
        >
          <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4 italic uppercase tracking-tighter">
            <ShieldAlert className="text-[#9feaf9]" size={32} />
            Rules
          </h2>

          <div className="space-y-10">
            <div className="flex gap-6 group">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#9feaf9]/5 border border-[#9feaf9]/20 flex items-center justify-center text-[#9feaf9] font-black group-hover:bg-[#9feaf9] group-hover:text-black transition-all">
                1
              </span>
              <p className="text-[#9feaf9]/60 text-xs leading-relaxed tracking-wider font-bold">
                CHALLENGES ARE WORTH <span className="text-white">DYNAMIC POINTS</span> BASED ON DIFFICULTY AND FIRST-BLOOD SPEED.
              </p>
            </div>

            <div className="flex gap-6 group">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#9feaf9]/5 border border-[#9feaf9]/20 flex items-center justify-center text-[#9feaf9] font-black group-hover:bg-[#9feaf9] group-hover:text-black transition-all">
                2
              </span>
              <p className="text-[#9feaf9]/60 text-xs leading-relaxed tracking-wider font-bold">
                PLATFORM INFRASTRUCTURE TAMPERING OR <span className="text-red-400">DoS ATTACKS</span> RESULT IN INSTANT PERMA-BAN.
              </p>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-[#9feaf9]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isTyping ? 'bg-[#9feaf9]' : 'bg-white/20'}`} />
              <span className="text-[8px] tracking-[0.3em] font-black text-[#9feaf9]/40 uppercase">
                {isTyping ? 'Syncing...' : 'Standby'}
              </span>
            </div>
            <Zap size={16} className={isTyping ? 'text-[#9feaf9]' : 'text-[#9feaf9]/20'} />
          </div>
        </motion.div>
      </div>


      {/* TERMS MODAL (SCROLL-TO-UNLOCK) */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0e14] border border-[#9feaf9]/40 w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[80vh]">
              
              <div className="p-8 border-b border-[#9feaf9]/10 flex items-center justify-between bg-[#9feaf9]/5">
                <div className="flex items-center gap-4 text-[#9feaf9]"><FileText size={24} /><h3 className="text-xl font-black italic uppercase tracking-tighter">Code_of_Conduct_v1.0</h3></div>
                <button onClick={() => setShowTerms(false)} className="text-[#9feaf9]/40 hover:text-[#9feaf9]"><X size={24} /></button>
              </div>

              <div ref={scrollRef} onScroll={handleScroll} className="p-10 overflow-y-auto space-y-8 text-[#9feaf9]/70 text-sm font-bold leading-relaxed custom-scrollbar">
                
                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs">A. INTEGRITY & FAIR PLAY</h4>
                  <ul className="space-y-2 list-disc pl-4 text-xs">
                    <li>No sharing flags or solutions.</li>
                    <li>No unauthorized collaboration.</li>
                    <li>No brute-forcing or automated solving tools.</li>
                    <li>No reverse engineering the platform.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs">B. PLATFORM USAGE</h4>
                  <ul className="space-y-2 list-disc pl-4 text-xs">
                    <li>Do not exploit bugs in the CTF7 platform.</li>
                    <li>Maintain account security at all times.</li>
                    <li>Comply with challenge-specific guidelines.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs">C. COMMUNITY ENGAGEMENT</h4>
                  <ul className="space-y-2 list-disc pl-4 text-xs">
                    <li>Treat all participants and organizers with respect.</li>
                    <li>Zero tolerance for harassment or discrimination.</li>
                    <li>No inappropriate or offensive content.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs">D. PENALTIES</h4>
                  <p className="text-[11px] opacity-80 italic">Violations may lead to disqualification, bans from future events, prize forfeiture, and legal reporting. All decisions by organizers are final.</p>
                </section>

                <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-start gap-4 text-red-400">
                  <AlertTriangle size={20} className="flex-shrink-0" /><p className="text-[10px] uppercase font-black">Warning: Decisions on conduct are final and binding.</p>
                </div>
              </div>

              <div className="p-8 border-t border-[#9feaf9]/10 bg-black flex gap-4">
                <button onClick={() => setShowTerms(false)} className="flex-1 py-4 border border-[#9feaf9]/20 rounded-xl text-[#9feaf9]/40 uppercase tracking-widest text-[10px] font-black">Decline</button>
                <motion.button disabled={!hasReadToBottom} onClick={handleAccept} className={`flex-[2] py-4 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] font-black transition-all ${hasReadToBottom ? 'bg-[#9feaf9] text-black shadow-[0_0_30px_rgba(159,234,249,0.4)]' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}>
                  {!hasReadToBottom && <LockKeyhole size={14} />}{hasReadToBottom ? 'Agree & Connect' : 'Scroll to Unlock Rules'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(159, 234, 249, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(159, 234, 249, 0.3); border-radius: 10px; }
      `}</style>
    </main>
  );
}