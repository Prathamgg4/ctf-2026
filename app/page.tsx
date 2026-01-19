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
  
  const [showTerms, setShowTerms] = useState(false);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const target = new Date('January 31, 2026 05:00:00').getTime();
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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
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
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: 'CTF_SECURE_PASS_2026',
      options: { data: { alias: formData.name, phone: formData.phone } }
    });
    if (error) setStatus(`UPLINK_ERROR: ${error.message}`);
    else setStatus('UPLINK_PENDING: CHECK_YOUR_INBOX_TO_CONFIRM');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050014] text-[#a586ff] font-mono flex flex-col items-center relative overflow-x-hidden overflow-y-auto">
      
      {/* 1. BRANDED HEADER - Centered at the top */}
      <header className="z-30 w-full flex justify-center pt-10 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[300px] lg:max-w-[400px]"
        >
          <img 
            src="/header.jpeg" 
            alt="HACKX Header" 
            className="w-full h-auto drop-shadow-[0_0_15px_rgba(165,134,255,0.2)]"
          />
        </motion.div>
      </header>

      {/* BACKGROUND EFFECTS */}
      <motion.div className="pointer-events-none fixed inset-0 z-10 opacity-60" style={{ background: `radial-gradient(800px circle at ${springX}px ${springY}px, rgba(123, 31, 162, 0.15), transparent 80%)` }} />
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none" style={{ background: `linear-gradient(135deg, #050014 0%, #1a0b3c 50%, #050014 100%)` }} />
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(#a586ff 1px, transparent 1px), linear-gradient(90deg, #a586ff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* CONTENT AREA */}
      <div className="z-20 flex flex-col items-center justify-center w-full max-w-7xl px-6 lg:px-12 pt-8 flex-grow">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 w-full mb-20">
          
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
            <div className="bg-[#0b0e14]/90 backdrop-blur-3xl border border-[#a586ff]/30 rounded-[2.5rem] p-12 relative shadow-[0_0_100px_rgba(0,0,0,0.8)] h-full">
              <div className="flex justify-between items-start mb-14">
                <div>
                  <h1 className="text-7xl font-black italic tracking-tighter uppercase text-white leading-none">CTF<span className="text-[#a586ff]">.26</span></h1>
                  <p className="text-[10px] tracking-[0.6em] text-[#a586ff] mt-4 font-bold uppercase">{">"} UPLINK STATUS: SECURE</p>
                </div>
                <div className="p-4 bg-[#a586ff]/5 rounded-2xl border border-[#a586ff]/20 shadow-[0_0_15px_rgba(165,134,255,0.2)]">
                  <Activity className="text-[#a586ff] animate-pulse" size={36} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-12">
                {Object.entries(timeLeft).map(([unit, val]) => (
                  <div key={unit} className="bg-black/40 border border-[#a586ff]/10 p-5 rounded-2xl text-center shadow-inner">
                    <span className="block text-4xl font-black text-white">{val}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#a586ff]/40 font-bold">{unit}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleInitialSubmit} className="space-y-6">
                <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required placeholder="Username" className="w-full bg-black/40 border border-[#a586ff]/20 p-6 rounded-2xl outline-none focus:border-[#a586ff] transition-all text-white uppercase tracking-widest text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required type="email" placeholder="Email Address" className="w-full bg-black/40 border border-[#a586ff]/20 p-6 rounded-2xl outline-none focus:border-[#a586ff] transition-all text-white text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required placeholder="Phone Number" className="w-full bg-black/40 border border-[#a586ff]/20 p-6 rounded-2xl outline-none focus:border-[#a586ff] transition-all text-white text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }} whileTap={{ scale: 0.98 }} className="w-full bg-[#a586ff] text-white font-black py-7 rounded-2xl uppercase tracking-[0.4em] text-xs shadow-[0_20px_40px_rgba(165,134,255,0.2)] transition-all">Initialize Connection</motion.button>
              </form>
            </div>
          </motion.div>

          {/* RULES BOX WITH ACTIVE GLOW */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={{ 
              opacity: 1, x: 0,
              borderColor: isTyping ? "rgba(165, 134, 255, 0.7)" : "rgba(165, 134, 255, 0.2)",
              boxShadow: isTyping ? "0 0 50px rgba(165, 134, 255, 0.2)" : "0 0 0px transparent"
            }} 
            className="w-full lg:w-[450px] bg-[#0b0e14]/90 backdrop-blur-3xl border rounded-[2.5rem] p-12 flex flex-col transition-all duration-500"
          >
            <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4 italic uppercase tracking-tighter">
              <ShieldAlert className="text-[#a586ff]" size={32} /> Rules
            </h2>
            <div className="space-y-10">
              <div className="flex gap-6 group">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#a586ff]/5 border border-[#a586ff]/20 flex items-center justify-center text-[#a586ff] font-black group-hover:bg-[#a586ff] group-hover:text-black transition-all">1</span>
                <p className="text-[#a586ff]/60 text-xs leading-relaxed tracking-wider font-bold uppercase">Challenges are worth dynamic points based on difficulty.</p>
              </div>
              <div className="flex gap-6 group">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#a586ff]/5 border border-[#a586ff]/20 flex items-center justify-center text-[#a586ff] font-black group-hover:bg-[#a586ff] group-hover:text-black transition-all">2</span>
                <p className="text-[#a586ff]/60 text-xs leading-relaxed tracking-wider font-bold uppercase italic">Infrastructure tampering results in instant perma-ban.</p>
              </div>
            </div>

            {/* SYNC STATUS INDICATOR */}
            <div className="mt-auto pt-10 border-t border-[#a586ff]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isTyping ? 'bg-[#a586ff]' : 'bg-white/20'}`} />
                <span className="text-[8px] tracking-[0.3em] font-black text-[#a586ff]/40 uppercase">
                  {isTyping ? 'Syncing...' : 'Standby'}
                </span>
              </div>
              <Zap size={16} className={isTyping ? 'text-[#a586ff]' : 'text-[#a586ff]/20'} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* FULL-WIDTH ANCHORED FOOTER */}
      <footer className="z-10 w-full relative">
        <img 
          src="/footer-brand.jpeg" 
          alt="HACKX MIT-WPU"
          className="w-full h-auto block drop-shadow-[0_0_20px_rgba(165,134,255,0.2)]"
        />
      </footer>

      {/* TERMS MODAL */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0e14] border border-[#a586ff]/40 w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[80vh]">
              
              <div className="p-8 border-b border-[#a586ff]/10 flex items-center justify-between bg-[#a586ff]/5">
                <div className="flex items-center gap-4 text-[#a586ff]"><FileText size={24} /><h3 className="text-xl font-black italic uppercase tracking-tighter">Code_of_Conduct_v1.0</h3></div>
                <button onClick={() => setShowTerms(false)} className="text-[#a586ff]/40 hover:text-[#a586ff]"><X size={24} /></button>
              </div>

              <div ref={scrollRef} onScroll={handleScroll} className="p-10 overflow-y-auto space-y-10 text-[#a586ff]/70 text-sm font-bold leading-relaxed custom-scrollbar">
                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs uppercase underline">A. Integrity & Fair Play</h4>
                  <ul className="space-y-3 list-disc pl-5 text-xs opacity-80">
                    <li>Sharing flags or solutions with other participants is strictly forbidden.</li>
                    <li>Unauthorized collaboration outside of your registered team is prohibited.</li>
                    <li>Use of automated brute-force tools or scripts to solve challenges is banned.</li>
                    <li>Attempting to reverse engineer the competition platform will result in a ban.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs uppercase underline">B. Platform Usage</h4>
                  <ul className="space-y-3 list-disc pl-5 text-xs opacity-80">
                    <li>Do not attempt to exploit vulnerabilities in the CTF7 platform itself.</li>
                    <li>Operators are responsible for securing their own credentials.</li>
                    <li>Compliance with specific rules for individual challenges is mandatory.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs uppercase underline">C. Community Engagement</h4>
                  <ul className="space-y-3 list-disc pl-5 text-xs opacity-80">
                    <li>Treat all participants, organizers, and sponsors with respect and courtesy.</li>
                    <li>Harassment, discrimination, or hate speech will not be tolerated.</li>
                    <li>Posting inappropriate or offensive content is cause for immediate removal.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-xs uppercase underline">D. Penalties for Violations</h4>
                  <p className="text-[11px] opacity-90 italic leading-loose">
                    Violations may result in disqualification, a permanent ban from future events, forfeiture of all prizes, and reporting to legal authorities. Organizers reserve the final right of interpretation.
                  </p>
                </section>

                <div className="p-5 border border-red-500/20 bg-red-500/5 rounded-2xl flex items-start gap-4 text-red-400">
                  <AlertTriangle size={20} className="flex-shrink-0" />
                  <p className="text-[10px] uppercase font-black leading-tight">Terminal Alert: Organizer decisions are final and binding.</p>
                </div>
              </div>

              <div className="p-8 border-t border-[#a586ff]/10 bg-black flex gap-4">
                <button onClick={() => setShowTerms(false)} className="flex-1 py-4 border border-[#a586ff]/20 rounded-xl text-[#a586ff]/40 uppercase tracking-widest text-[10px] font-black">Decline</button>
                <motion.button disabled={!hasReadToBottom} onClick={handleAccept} className={`flex-[2] py-4 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] font-black transition-all ${hasReadToBottom ? 'bg-[#a586ff] text-white shadow-[0_0_30px_rgba(165,134,255,0.4)]' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}>
                  {!hasReadToBottom && <LockKeyhole size={14} />}{hasReadToBottom ? 'Agree & Connect' : 'Scroll to Unlock Rules'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(165, 134, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(165, 134, 255, 0.3); border-radius: 10px; }
      `}</style>
    </main>
  );
}


