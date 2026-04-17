"use client";

import { useState } from "react";
import { Mail, ArrowLeft, ShieldCheck, AlertCircle, Fingerprint } from "lucide-react";
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
      
      // For demo purposes - in production, link is sent via email
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
    <div className="flex items-center justify-center min-h-screen bg-[#050816] p-4 font-sans selection:bg-cyan-500/30">
      {/* Neural Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl w-full max-w-md backdrop-blur-2xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
           <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-900/10 group">
              <Fingerprint size={36} className="text-purple-400 group-hover:scale-110 transition-transform" />
           </div>
           <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Access Recovery</h2>
           <p className="text-gray-500 mt-2 text-[10px] font-bold uppercase tracking-widest">Restore account intelligence protocols</p>
        </div>

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-6 py-4 rounded-[1.5rem] mb-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {message && (
          <div className="bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 px-6 py-4 rounded-[1.5rem] mb-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <ShieldCheck size={16} />
            {message}
          </div>
        )}

        {resetLink && (
          <div className="bg-white/5 border border-white/10 text-white/90 px-6 py-5 rounded-[1.5rem] mb-8 animate-in zoom-in duration-500">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Debug: Institutional Link</p>
            <a 
              href={resetLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 underline break-all text-[11px] font-mono hover:text-cyan-300 transition-colors"
            >
              {resetLink}
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Registry Email</label>
            <div className="flex items-center border border-white/10 rounded-[1.5rem] px-5 py-4 bg-white/5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all group">
              <Mail className="text-gray-600 mr-4 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                type="email"
                placeholder="name@institution.com"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-700 font-bold text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-purple-900/20 mt-4"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">
               {loading ? "Decrypting..." : "Initialize Recovery"}
            </span>
          </button>
        </form>

        <div className="text-center mt-10">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all inline-flex items-center gap-3">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Log
          </Link>
        </div>
      </div>
    </div>
  );
}
