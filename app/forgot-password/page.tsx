"use client";

import { useState } from "react";
import { Mail, ArrowLeft, ShieldCheck, AlertCircle, Fingerprint, Activity, Zap } from "lucide-react";
import Link from "next/link";
import API from "@/app/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setResetLink("");

    try {
      const { data } = await API.post("/user/forgot-password", { email });
      setMessage(data.message || "Recovery sequence initiated. Check your link.");
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
    } catch (err: any) {
      console.error("Recovery error:", err);
      const msg = err?.response?.data?.message || err.message || "Encryption protocols failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] dark:bg-[#050816] p-8 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-600 transition-colors duration-500 overflow-hidden relative font-sans">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full -top-48 -left-48 blur-[120px] animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full -bottom-48 -right-48 blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 p-12 lg:p-20 rounded-[4.5rem] shadow-2xl shadow-blue-900/5 w-full max-w-xl relative z-10 box-border animate-in fade-in zoom-in-95 duration-1000 group/form">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none group-hover/form:scale-150 transition-transform duration-1000" />
        
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 border-2 border-blue-100 dark:border-blue-800/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-sm group hover:rotate-12 transition-transform duration-700">
            <Fingerprint size={40} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">Access Recovery</h2>
          <div className="flex items-center justify-center gap-4 mt-6">
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_#3b82f6]" />
             <p className="text-gray-400 dark:text-gray-700 text-[11px] font-black uppercase tracking-[0.4em] leading-relaxed italic">Restoring Account Intelligence Protocols</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-8 py-5 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-widest flex items-center gap-5 animate-in slide-in-from-top-4 italic leading-none">
            <AlertCircle size={20} className="animate-pulse" />
            {error}
          </div>
        )}

        {message && (
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-500 px-8 py-5 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-widest flex items-center gap-5 animate-in slide-in-from-top-4 italic leading-none">
            <ShieldCheck size={20} />
            {message}
          </div>
        )}

        {resetLink && (
          <div className="bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white px-8 py-6 rounded-[2.5rem] mb-12 animate-in zoom-in-95 duration-700 shadow-inner overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-full bg-blue-600/5 rotate-12 pointer-events-none" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-800 mb-4 leading-none italic">Institutional Link Decrypted</p>
            <a 
              href={resetLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-500 underline break-all text-[12px] font-mono hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-500 relative z-10"
            >
              {resetLink}
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-800 ml-4 italic">Registry Identification (Email)</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-8 flex items-center text-gray-300 dark:text-gray-800 group-focus-within/input:text-blue-600 dark:group-focus-within/input:text-blue-500 transition-colors duration-500">
                 <Mail size={24} />
              </div>
              <input
                type="email"
                placeholder="Synchronize recovery protocol..."
                className="w-full bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] pl-20 pr-8 py-6 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-[#0a0f29] transition-all duration-700 text-gray-900 dark:text-white font-black placeholder:text-gray-200 dark:placeholder:text-gray-900 text-lg shadow-inner italic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] transition-all duration-700 hover:bg-blue-700 active:scale-95 disabled:opacity-50 mt-4 shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-6 italic group/btn overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-6">
              {loading ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Initialize Recovery Sequence <Zap size={24} className="group-hover/btn:rotate-12 transition-transform duration-700" /></>
              )}
            </span>
          </button>
        </form>

        <div className="text-center mt-16 pt-12 border-t-2 border-gray-50 dark:border-gray-800">
          <Link href="/login" className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all inline-flex items-center gap-6 italic group/back active:scale-90">
            <ArrowLeft size={18} className="group-hover/back:-translate-x-3 transition-transform duration-500" /> Back to Identity Registry
          </Link>
        </div>
      </div>

      {/* Institutional Security Badge */}
      <div className="fixed bottom-12 left-12 flex items-center gap-6 text-gray-200 dark:text-gray-900 animate-in slide-in-from-left-12 duration-1000 opacity-50">
         <Activity size={24} />
         <p className="text-[10px] font-black uppercase tracking-[0.8em] italic">Encrypted Recovery Active</p>
      </div>
    </div>
  );
}
