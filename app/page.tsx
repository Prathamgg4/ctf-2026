"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Terminal, Shield, Lock, Cpu, Zap, Globe, Share2, Activity, ShieldAlert } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FinalPremiumCTF() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // NEW: Interaction State
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('ESTABLISHING_ENCRYPTED_UPLINK...');
    const { error } = await supabase.from('registrations').insert([formData]);
    if (error) setStatus('UPLINK_ERROR: SECURE_PIPE_FAILED');
    else {
      setStatus('SUCCESS: NODE_REGISTERED_IN_MAINFRAME');
      setFormData({ name: '', email: '', phone: '' });
    }
  };

  if (!mounted) return null;

  const icons = [Terminal, Shield, Lock, Cpu, Zap, Globe, Share2, Activity];

  return (
    <main className="min-h-screen bg-[#05080a] text-[#9feaf9] font-mono flex items-center justify-center relative overflow-hidden p-6 lg:p-12">
      
      {/* 1. INTERACTIVE MOUSE GLOW */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-10 opacity-50"
        style={{
          background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(159, 234, 249, 0.08), transparent 80%)`,
        }}
      />

      {/* 2. GLOBAL BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#9feaf9 1px, transparent 1px), linear-gradient(90deg, #9feaf9 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* 3. UNIVERSAL FLOATING ICONS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {icons.map((Icon, i) => (
          <motion.div
            key={i}
            initial={{ x: `${(i * 100) / icons.length}vw`, y: "110vh" }}
            animate={{ 
              y: "-10vh",
              rotate: 360,
              x: [`${(i * 100) / icons.length}vw`, `${((i * 100) / icons.length) + (i % 2 === 0 ? 8 : -8)}vw`] 
            }}
            transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "linear" }}
            className="absolute text-[#9feaf9] opacity-20 blur-[0.5px] drop-shadow-[0_0_10px_#9feaf9]"
          >
            <Icon size={40 + i * 12} />
          </motion.div>
        ))}
      </div>

      {/* 4. MAIN SIDE-BY-SIDE CONTAINER */}
      <div className="z-20 flex flex-col lg:flex-row items-stretch gap-12 max-w-7xl w-full">
        
        {/* LEFT: THE BRAND CARD */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="bg-[#0b0e14]/85 backdrop-blur-3xl border border-[#9feaf9]/30 rounded-[2.5rem] p-12 relative shadow-[0_0_100px_rgba(0,0,0,0.5)] h-full">
            <motion.div 
              animate={{ y: ["0vh", "80vh"] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9feaf9]/40 to-transparent z-10"
            />

            <div className="flex justify-between items-start mb-14">
              <div>
                <h1 className="text-7xl font-black italic tracking-tighter uppercase text-white leading-none">
                  CTF<span className="text-[#9feaf9]">.26</span>
                </h1>
                <motion.p 
                  animate={{ opacity: [1, 0.4, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-[10px] tracking-[0.6em] text-[#9feaf9] mt-4 font-bold uppercase"
                >
                  {">"} UPLINK STATUS: SECURE
                </motion.p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
                required placeholder="OPERATOR_ALIAS"
                className="w-full bg-black/40 border border-[#9feaf9]/20 p-6 rounded-2xl outline-none focus:border-[#9feaf9] focus:bg-[#9feaf9]/5 transition-all text-white uppercase tracking-widest text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
                required type="email" placeholder="SECURE_EMAIL_V4"
                className="w-full bg-black/40 border border-[#9feaf9]/20 p-6 rounded-2xl outline-none focus:border-[#9feaf9] focus:bg-[#9feaf9]/5 transition-all text-white text-sm"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
                required placeholder="ENCRYPTED_COMMS_LINE"
                className="w-full bg-black/40 border border-[#9feaf9]/20 p-6 rounded-2xl outline-none focus:border-[#9feaf9] focus:bg-[#9feaf9]/5 transition-all text-white text-sm"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#fff" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#9feaf9] text-black font-black py-7 rounded-2xl uppercase tracking-[0.4em] text-xs shadow-[0_20px_40px_rgba(159,234,249,0.2)] transition-all"
              >
                Initialize Connection
              </motion.button>
            </form>
            {status && <p className="mt-8 text-center text-[10px] animate-pulse font-bold tracking-[0.5em] text-white/80">{`> ${status}`}</p>}
          </div>
        </motion.div>

        {/* RIGHT: CHALLENGE RULES BOX */}
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

      {/* FOOTER STRIP */}
      <div className="fixed bottom-8 flex gap-16 text-[9px] tracking-[0.5em] opacity-20 font-black uppercase z-10 text-white">
        <span>Global_Offensive</span>
        <span>Node_04.X</span>
        <span>Secure_Protocol</span>
      </div>
    </main>
  );
}