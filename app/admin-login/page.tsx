"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck, ShieldAlert, Eye, EyeOff, LogIn, Terminal, Shield, Zap, ArrowRight, Activity, Fingerprint } from "lucide-react";
import API from "@/app/lib/api";

function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/user/login", { email, password });
      const role = (data?.role || data?.user?.role)?.toString().toLowerCase();
      
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
      }
      
      if (role !== "admin") {
        setError("Privileged Access Required. Entity permissions mismatched.");
        localStorage.clear();
        return;
      }
      
      router.replace("/admin-dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Credential verification protocol failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen !bg-[#fbfbfe] flex flex-col items-center justify-center p-6 relative overflow-hidden font-jetbrains selection:bg-purple-100 selection:text-purple-600 light"
      style={{ backgroundColor: '#fbfbfe', colorScheme: 'light' }}
    >
      <style jsx global>{`
        body { background-color: #fbfbfe !important; }
      `}</style>

      {/* Soft Mesh Gradients (Matching Image) */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-100/40 rounded-full blur-[140px] opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] opacity-60" />

      <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Top Badge (Gradient Style from Image) */}
        <div className="inline-flex items-center gap-3 px-8 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm rounded-full mb-8 border border-white/50">
          <Shield size={14} className="text-purple-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900 italic">Governance Portal Restricted</span>
        </div>

        {/* Branding (Image Style) */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4 leading-none">
            Quizaro
          </h1>
          <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.4em] italic leading-none">
            Admin Command Center // Node Access
          </p>
        </div>

        {/* Form Container (Major White - Ultra High-End) */}
        <div className="w-full bg-white rounded-[4rem] border border-gray-100/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] p-12 lg:p-16 transition-all duration-700 hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)] relative">
          
          <div className="mb-14">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none mb-3">Access Control</h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic leading-none">Institutional Security protocol layer 1</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-8 py-5 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-5 animate-in shake duration-500">
              <ShieldAlert size={20} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-12">
            <div className="space-y-8">
              {/* Email */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] ml-2 italic">Governance Identifier (Admin Email)</label>
                <div className="relative group">
                  <Terminal size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="admin@quizaro.institutional"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-20 pr-8 py-6 bg-[#f0f4ff]/50 border border-gray-100 rounded-[2rem] text-[16px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-blue-400 focus:bg-white transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] ml-2 italic">Encryption Key (Password)</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-20 pr-20 py-6 bg-[#f0f4ff]/50 border border-gray-100 rounded-[2rem] text-[16px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-purple-400 focus:bg-white transition-all italic shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button (Centered & Adjustable) */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="min-w-[280px] px-12 py-7 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-black text-[12px] uppercase tracking-[0.25em] italic transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-5"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Unlock Access Dashboard <ArrowRight size={22} /></>
                )}
              </button>
            </div>
          </form>

          {/* Warning Notice (Image Style) */}
          <div className="mt-16 p-8 bg-amber-50/30 border border-amber-100/50 rounded-[2.5rem] flex items-start gap-5">
            <Activity size={20} className="text-amber-500 shrink-0 mt-1 animate-pulse" />
            <p className="text-[11px] text-amber-900 font-black uppercase tracking-widest italic leading-relaxed opacity-80">
              High-security perimeter active. All access attempts are monitored and recorded via Neural Logs.
            </p>
          </div>

          {/* External Options (Matching Image Style) */}
          <div className="mt-14 pt-10 border-t border-gray-50 text-center">
             <button
                className="inline-flex items-center gap-4 text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest italic transition-colors"
              >
                <Fingerprint size={16} /> Authenticate via Biometric Token
              </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link href="/login" className="px-8 py-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-[10px] font-black uppercase tracking-widest italic text-gray-400 hover:text-blue-600 active:scale-95">
            Student Node
          </Link>
          <Link href="/" className="px-8 py-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all text-[10px] font-black uppercase tracking-widest italic text-gray-400 hover:text-gray-900 active:scale-95 flex items-center gap-3">
             <Shield size={12} /> Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
