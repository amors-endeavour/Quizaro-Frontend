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
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] p-6 selection:bg-blue-100 selection:text-blue-600 font-sans">
      <div className="bg-white border border-gray-100 p-12 lg:p-16 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 w-full max-w-md relative z-10 box-border animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12">
           <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Fingerprint size={36} className="text-blue-600" />
           </div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Access Recovery</h2>
           <p className="text-gray-400 mt-2 text-[10px] font-black uppercase tracking-widest">Restore account intelligence protocols</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {message && (
          <div className="bg-blue-50 border border-blue-100 text-blue-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-2">
            <ShieldCheck size={18} />
            {message}
          </div>
        )}

        {resetLink && (
          <div className="bg-gray-50 border border-gray-100 text-gray-900 px-6 py-5 rounded-2xl mb-10 animate-in zoom-in duration-500 shadow-inner">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 leading-none">Debug: Institutional Link</p>
            <a 
              href={resetLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all text-[11px] font-mono hover:text-blue-700 transition-colors"
            >
              {resetLink}
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2 leading-none">Registry Email</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="name@institution.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-900/10 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              "Initialize Recovery Sequence"
            )}
          </button>
        </form>

        <div className="text-center mt-12">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-blue-600 transition-all inline-flex items-center gap-4">
            <ArrowLeft size={16} /> Back to Identity Log
          </Link>
        </div>
      </div>
    </div>
  );
}
