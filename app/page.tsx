"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Terminal, Shield, Lock, Cpu, Zap, Globe, Share2, Activity, ShieldAlert, X, FileText, LockKeyhole, AlertTriangle, MailCheck, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

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
  const [showOtpPopup, setShowOtpPopup] = useState(false); 
  const [showVerifiedPopup, setShowVerifiedPopup] = useState(false); 
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  
  const [generatedOtp, setGeneratedOtp] = useState(''); 
  const [userOtp, setUserOtp] = useState(''); 
  
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
    const target = new Date('January 28, 2026 05:00:00').getTime();
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
      if (scrollTop + clientHeight >= scrollHeight - 10) setHasReadToBottom(true);
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const handleAccept = async () => {
    setShowTerms(false);
    setStatus('DISPATCHING_PACKET...');
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    const templateParams = {
      to_email: formData.email, // Updated to match your Dashboard
      verification_code: otp,
    };

    emailjs.send(
      'service_zmqi8eh', 
      'template_6t1m1ip', 
      templateParams, 
      'sgSMSuLKab-qDLPG9'
    )
    .then(() => {
      setShowOtpPopup(true);
      setStatus('PACKET_DISPATCHED');
    })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      setStatus('TRANSPORT_LAYER_ERROR');
    }); 
  };

  const handleVerifyUplink = async () => {
    if (userOtp === generatedOtp) {
      setStatus('SYNCHRONIZING...');
      const { error } = await supabase
        .from('registrations') 
        .insert([{ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone 
        }]);

      if (error) setStatus(`DB_ERROR: ${error.message}`);
      else {
        setShowOtpPopup(false);
        setShowVerifiedPopup(true);
        setStatus('UPLINK_ESTABLISHED');
      }
    } else {
      setStatus('INVALID_TOKEN');
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '' });
    setShowOtpPopup(false);
    setShowVerifiedPopup(false);
    setStatus('');
    setHasReadToBottom(false);
    setUserOtp('');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050014] text-[#a586ff] font-mono flex flex-col items-center relative overflow-x-hidden overflow-y-auto">
      <header className="z-30 w-full flex justify-center pt-8 lg:pt-12 px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-48 sm:w-64 lg:w-80">
          <img src="/header.jpeg" alt="HACKX" className="w-full h-auto drop-shadow-[0_0_15px_rgba(165,134,255,0.2)]" />
        </motion.div>
      </header>

      <motion.div className="pointer-events-none fixed inset-0 z-10 opacity-60" style={{ background: `radial-gradient(800px circle at ${springX}px ${springY}px, rgba(123, 31, 162, 0.15), transparent 80%)` }} />
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none" style={{ background: `linear-gradient(135deg, #050014 0%, #1a0b3c 50%, #050014 100%)` }} />
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(#a586ff 1px, transparent 1px), linear-gradient(90deg, #a586ff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="z-20 flex flex-col items-center w-full max-w-7xl px-4 sm:px-8 lg:px-12 pt-6 lg:pt-10 flex-grow">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 w-full mb-16 lg:mb-24">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="flex-1 w-full">
            <div className="bg-[#0b0e14]/90 backdrop-blur-3xl border border-[#a586ff]/30 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-12 relative shadow-[0_0_100px_rgba(0,0,0,0.8)] h-full">
              <div className="flex justify-between items-start mb-10 lg:mb-14">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black italic tracking-tighter text-white leading-none uppercase">CYBERLOCK<span className="text-[#a586ff]">.26</span></h1>
                  <p className="text-[8px] lg:text-[10px] tracking-[0.4em] text-[#a586ff] mt-4 font-bold uppercase">{">"} UPLINK STATUS: SECURE</p>
                </div>
                <div className="p-3 lg:p-4 bg-[#a586ff]/5 rounded-xl lg:rounded-2xl border border-[#a586ff]/20"><Activity className="text-[#a586ff] animate-pulse" size={24} /></div>
              </div>
              <div className="grid grid-cols-4 gap-2 lg:gap-4 mb-8 lg:mb-12">
                {Object.entries(timeLeft).map(([unit, val]) => (
                  <div key={unit} className="bg-black/40 border border-[#a586ff]/10 p-3 lg:p-5 rounded-xl lg:rounded-2xl text-center shadow-inner">
                    <span className="block text-xl lg:text-4xl font-black text-white">{val}</span>
                    <span className="text-[7px] lg:text-[9px] uppercase tracking-widest text-[#a586ff]/40 font-bold">{unit}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleInitialSubmit} className="space-y-4 lg:space-y-6">
                <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required placeholder="Username" className="w-full bg-black/40 border border-[#a586ff]/20 p-4 lg:p-6 rounded-xl lg:rounded-2xl outline-none focus:border-[#a586ff] transition-all text-white uppercase tracking-widest text-xs lg:text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required type="email" placeholder="Email Address" className="w-full bg-black/40 border border-[#a586ff]/20 p-4 lg:p-6 rounded-xl lg:rounded-2xl outline-none focus:border-[#a586ff] transition-all text-white text-xs lg:text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required placeholder="Phone Number" className="w-full bg-black/40 border border-[#a586ff]/20 p-4 lg:p-6 rounded-xl lg:rounded-2xl outline-none focus:border-[#a586ff] transition-all text-white text-xs lg:text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }} whileTap={{ scale: 0.98 }} className="w-full bg-[#a586ff] text-white font-black py-5 lg:py-7 rounded-xl lg:rounded-2xl uppercase tracking-[0.2em] lg:tracking-[0.4em] text-[10px] lg:text-xs shadow-[0_20px_40px_rgba(165,134,255,0.2)]">Initialize Connection</motion.button>
              </form>
              {status && <p className="mt-4 text-center text-[10px] text-[#a586ff] animate-pulse uppercase tracking-[0.2em]">{status}</p>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0, borderColor: isTyping ? "rgba(165, 134, 255, 0.7)" : "rgba(165, 134, 255, 0.2)", boxShadow: isTyping ? "0 0 50px rgba(165, 134, 255, 0.2)" : "none" }} className="w-full lg:w-[450px] bg-[#0b0e14]/90 backdrop-blur-3xl border rounded-[1.5rem] lg:rounded-[2.5rem] p-8 lg:p-12 flex flex-col transition-all duration-500 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-8 flex items-center gap-4 italic uppercase tracking-tighter flex-shrink-0"><ShieldAlert className="text-[#a586ff]" size={28} /> Rules</h2>
            <div className="space-y-4 lg:space-y-5">
              {[
                "No DoS/DDoS attacks against the platform or other players.",
                "Sharing flags or solutions is strictly prohibited.",
                "Brute-forcing flags on the submission server is not allowed.",
                "No social engineering attacks against organizers or participants.",
                "One account per person; team size must not exceed the limit.",
                "The decisions of the HACK-X organizers are final.",
                "Respect the infrastructure; no destructive payloads.",
                "Flags must be submitted in the specified format.",
                "Any form of cheating will result in immediate disqualification.",
                "Have fun and keep the competition professional and ethical."
              ].map((rule, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-[#a586ff]/5 border border-[#a586ff]/20 flex items-center justify-center text-[#a586ff] font-black text-[10px] lg:text-xs group-hover:bg-[#a586ff] group-hover:text-black transition-all">
                    {idx + 1}
                  </span>
                  <p className="text-[#a586ff]/60 text-[9px] lg:text-[11px] leading-relaxed font-bold uppercase tracking-wider">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-[#a586ff]/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full animate-pulse ${isTyping ? 'bg-[#a586ff]' : 'bg-white/20'}`} /><span className="text-[7px] lg:text-[8px] font-black text-[#a586ff]/40 uppercase tracking-widest">{isTyping ? 'Syncing...' : 'Standby'}</span></div>
              <Zap size={14} className={isTyping ? 'text-[#a586ff]' : 'text-[#a586ff]/20'} />
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="z-10 w-full relative"><img src="/footer-brand.jpeg" alt="HACKX" className="w-full h-auto block drop-shadow-[0_0_20px_rgba(165,134,255,0.3)]" /></footer>

      <AnimatePresence>
        {showOtpPopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0e14] border-2 border-[#a586ff]/50 p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] max-w-md w-full text-center shadow-[0_0_80px_rgba(165,134,255,0.2)]">
              <div className="flex justify-center mb-8"><div className="p-5 bg-[#a586ff]/10 rounded-full border border-[#a586ff]/30"><Mail className="text-[#a586ff] animate-pulse" size={56} /></div></div>
              <h3 className="text-3xl font-black italic uppercase text-white mb-4">Identity Check</h3>
              <p className="text-[#a586ff]/70 text-[11px] lg:text-sm font-bold leading-relaxed mb-8 uppercase tracking-widest">A confirmation code has been sent to your email. Enter the 6-digit token below to finalize.</p>
              <input maxLength={6} value={userOtp} onChange={(e) => setUserOtp(e.target.value)} placeholder="000000" className="w-full bg-black/40 border-2 border-[#a586ff] p-5 rounded-2xl text-center text-4xl font-black text-white tracking-[0.5em] mb-8 outline-none" />
              <button onClick={handleVerifyUplink} className="w-full bg-[#a586ff] text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-xs hover:bg-white transition-all">Verify Uplink</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVerifiedPopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0e14] border-2 border-green-500/50 p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] max-w-md w-full text-center shadow-[0_0_80px_rgba(34,197,94,0.2)]">
              <div className="flex justify-center mb-8"><div className="p-5 bg-green-500/10 rounded-full border border-green-500/30"><ShieldCheck className="text-green-500 animate-bounce" size={56} /></div></div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-6">Uplink Verified</h3>
              <p className="text-green-500/70 text-[11px] lg:text-sm font-bold leading-relaxed mb-10 uppercase tracking-widest">Identity confirmed. Your info has been synchronized with the HACK-X database.</p>
              <button onClick={handleReset} className="w-full bg-green-500 text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] lg:text-xs hover:bg-white transition-all">Enter Terminal</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0e14] border border-[#a586ff]/40 w-full max-w-2xl rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 lg:p-8 border-b border-[#a586ff]/10 flex items-center justify-between bg-[#a586ff]/5">
                <div className="flex items-center gap-4 text-[#a586ff]"><FileText size={20} /><h3 className="text-lg lg:text-xl font-black italic uppercase tracking-tighter">Code_of_Conduct_v1.0</h3></div>
                <button onClick={() => setShowTerms(false)} className="text-[#a586ff]/40 hover:text-[#a586ff]"><X size={24} /></button>
              </div>
              <div ref={scrollRef} onScroll={handleScroll} className="p-6 lg:p-10 overflow-y-auto space-y-10 text-[#a586ff]/70 text-[11px] lg:text-sm font-bold leading-relaxed custom-scrollbar">
                
                {/* SECTION A */}
                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-[10px] lg:text-xs uppercase underline font-black">A. Integrity & Fair Play</h4>
                  <ul className="space-y-3 list-disc pl-5 opacity-80">
                    <li>Sharing flags or solutions with other participants is strictly forbidden.</li>
                    <li>Unauthorized collaboration outside of your registered team is prohibited.</li>
                    <li>Use of automated brute-force tools or scripts to solve challenges is banned.</li>
                    <li>Attempting to reverse engineer the competition platform will result in a ban.</li>
                  </ul>
                </section>

                {/* SECTION B */}
                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-[10px] lg:text-xs uppercase underline font-black">B. Platform Usage</h4>
                  <ul className="space-y-3 list-disc pl-5 opacity-80">
                    <li>Do not attempt to exploit vulnerabilities in the CTF7 platform itself.</li>
                    <li>Operators are responsible for securing their own login credentials.</li>
                    <li>Compliance with specific rules for individual challenges is mandatory.</li>
                  </ul>
                </section>

                {/* SECTION C */}
                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-[10px] lg:text-xs uppercase underline font-black">C. Community Engagement</h4>
                  <ul className="space-y-3 list-disc pl-5 opacity-80">
                    <li>Treat all participants, organizers, and sponsors with respect and courtesy.</li>
                    <li>Harassment, discrimination, or hate speech will not be tolerated.</li>
                    <li>Posting inappropriate or offensive content is cause for immediate removal.</li>
                  </ul>
                </section>

                {/* SECTION D */}
                <section className="space-y-4">
                  <h4 className="text-white tracking-[0.3em] text-[10px] lg:text-xs uppercase underline font-black">D. Penalties</h4>
                  <p className="italic leading-loose opacity-80">Violations may lead to disqualification, permanent bans, and legal reporting. All decisions made by the organizing committee are final and binding.</p>
                </section>

                <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-start gap-4 text-red-400">
                  <AlertTriangle size={18} className="flex-shrink-0" />
                  <p className="text-[9px] lg:text-[10px] uppercase font-black tracking-widest">Organizer decisions are final.</p>
                </div>
              </div>
              <div className="p-6 lg:p-8 border-t border-[#a586ff]/10 bg-black flex gap-3 lg:gap-4">
                <button onClick={() => setShowTerms(false)} className="flex-1 py-4 border border-[#a586ff]/20 rounded-xl text-[#a586ff]/40 uppercase text-[9px] lg:text-[10px] font-black tracking-widest">Decline</button>
                <motion.button disabled={!hasReadToBottom} onClick={handleAccept} className={`flex-[2] py-4 rounded-xl flex items-center justify-center gap-3 uppercase text-[9px] lg:text-[10px] font-black transition-all ${hasReadToBottom ? 'bg-[#a586ff] text-black shadow-[0_0_30px_rgba(165,134,255,0.4)]' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}>
                  {!hasReadToBottom && <LockKeyhole size={14} />} {hasReadToBottom ? 'Agree & Connect' : 'Scroll to Unlock'}
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