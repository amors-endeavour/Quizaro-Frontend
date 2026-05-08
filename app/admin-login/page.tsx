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
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 font-jetbrains">
      {/* Background Grid & Blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-[-15%] left-[-5%] w-[60%] h-[60%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse duration-700" />

      <div className="relative z-10 w-full max-w-[520px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {/* Branding */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white dark:bg-[#0a0f29] rounded-full border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
            <ShieldCheck size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 italic">Governance Portal Restricted</span>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500">
            Quizaro
          </h1>
          <p className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] italic leading-none">
            Admin Command Center // Node Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0a0f29] rounded-[4rem] shadow-2xl shadow-blue-900/10 border-2 border-gray-100 dark:border-gray-800 p-12 lg:p-20 relative group transition-all duration-700 hover:border-blue-600/30">
          
          {/* Header */}
          <div className="mb-14 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">Access Control</h2>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">Institutional Security Protocol Layer 1</p>
            </div>
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.8rem] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl border border-blue-100 dark:border-blue-800/30 animate-pulse">
               <ShieldCheck size={32} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-8 py-5 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-5 animate-in shake duration-500">
              <ShieldAlert size={20} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-10">
            
            <div className="space-y-8">
              {/* Email */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Governance Identifier (Admin Email)</label>
                <div className="relative group/input">
                  <Terminal size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="admin@quizaro.institutional"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-20 pr-8 py-6 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] text-[16px] font-black text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-900 outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Encryption Key (Password)</label>
                <div className="relative group/input">
                  <Lock size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/input:text-purple-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-20 pr-20 py-6 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] text-[16px] font-black text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-900 outline-none focus:border-purple-600 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all italic shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 dark:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-5 py-7 bg-gray-900 dark:bg-blue-600 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.2em] italic transition-all shadow-2xl shadow-blue-900/40 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center gap-5">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Unlock Access Dashboard <LogIn size={20} className="group-hover:translate-x-2 transition-transform" /></>
                )}
              </div>
            </button>
          </form>

          {/* Secure Warning Notice */}
          <div className="mt-14 p-8 bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/20 rounded-[2.5rem] flex items-start gap-5 group/warning">
            <Activity size={20} className="text-amber-500 shrink-0 mt-1 animate-pulse" />
            <p className="text-[11px] text-amber-800 dark:text-amber-400 font-black uppercase tracking-widest italic leading-relaxed opacity-80 group-hover/warning:opacity-100 transition-opacity">
              High-security perimeter active. All access attempts are monitored and recorded via Neural Logs.
            </p>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-10 mt-14 pt-8 border-t border-gray-50 dark:border-gray-800">
            <Link href="/login" className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest italic transition-colors">
              Student Node
            </Link>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800" />
            <Link href="/" className="text-[10px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest italic transition-colors">
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
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] italic animate-pulse leading-none">Authorized Entry Protocol Init...</p>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
