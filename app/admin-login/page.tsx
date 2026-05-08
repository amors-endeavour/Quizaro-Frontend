"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck, ShieldAlert, Eye, EyeOff, LogIn, Terminal, Shield, Zap, ArrowRight, Activity } from "lucide-react";
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
      className="min-h-screen !bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-jetbrains selection:bg-blue-100 selection:text-blue-600 light"
      style={{ backgroundColor: '#ffffff', colorScheme: 'light' }}
    >
      <style jsx global>{`
        body { background-color: white !important; }
      `}</style>
      {/* Background Elements (Image 2 Style) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-0 right-0 w-1/3 h-1 bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600" />
      <div className="absolute -top-[15%] -left-[5%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[140px] opacity-30" />

      <div className="relative z-10 w-full max-w-[460px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Top Badge (Image 2 Style) */}
        <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white border border-gray-100 shadow-sm rounded-full mb-6">
          <Shield size={12} className="text-blue-600" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Governance Portal Restricted</span>
        </div>

        {/* Branding (Image 2 Style) */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 mb-2 leading-none">
            Quizaro
          </h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic leading-none">
            Admin Command Center // Node Access
          </p>
        </div>

        {/* Form Container (Major White) */}
        <div className="w-full bg-white rounded-[3.5rem] border border-gray-100 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.06)] p-12 lg:p-16 transition-all duration-500 hover:shadow-[0_48px_100px_-16px_rgba(0,0,0,0.1)]">
          
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none">Access Control</h2>
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic leading-none">Institutional Security protocol layer 1</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
               <ShieldCheck size={24} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-4 animate-in shake duration-500">
              <ShieldAlert size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2 italic">Governance Identifier (Admin Email)</label>
                <div className="relative group">
                  <Terminal size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="admin@quizaro.institutional"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2 italic">Encryption Key (Password)</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-16 pr-16 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-purple-600 focus:bg-white transition-all italic shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit (Image 2 Gradient Button) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] italic transition-all shadow-xl shadow-blue-700/10 hover:shadow-blue-700/25 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Unlock Access Dashboard <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Warning Notice (Image 2 Style) */}
          <div className="mt-12 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-start gap-4">
            <Activity size={16} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[10px] text-amber-800 font-black uppercase tracking-widest italic leading-relaxed opacity-80">
              High-security perimeter active. All access attempts are monitored and recorded via Neural Logs.
            </p>
          </div>

          {/* Footer links (Image 2 Style) */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-50">
            <Link href="/login" className="text-[10px] font-black text-gray-500 hover:text-blue-600 uppercase tracking-widest italic transition-colors">
              Student Mode
            </Link>
            <Link href="/" className="text-[10px] font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest italic transition-colors">
              Back to Home
            </Link>
          </div>
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
