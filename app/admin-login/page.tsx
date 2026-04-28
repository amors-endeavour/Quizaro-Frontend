"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldAlert, Monitor, Terminal, ShieldCheck, Activity, LogIn } from "lucide-react";
import API from "@/app/lib/api";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError("Access Denied: High-level administrative clearance required.");
        localStorage.clear();
        return;
      }
      
      router.replace("/admin-dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Institutional authorization protocol failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] dark:bg-[#050816] p-8 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-600 transition-colors duration-500 overflow-hidden relative font-sans">
      {/* Administrative Background Matrix */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-red-600/5 dark:bg-red-600/10 rounded-full -top-96 -left-96 blur-[150px] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full -bottom-48 -right-48 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 p-12 lg:p-20 rounded-[5rem] shadow-2xl shadow-blue-900/5 w-full max-w-xl relative z-10 box-border animate-in fade-in zoom-in-95 duration-1000 group/form">
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/5 rounded-full blur-3xl pointer-events-none group-hover/form:scale-150 transition-transform duration-1000" />
        
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border-2 border-red-100 dark:border-red-800/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-sm group hover:rotate-12 transition-transform duration-700">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">Admin Core</h2>
          <div className="flex items-center justify-center gap-4 mt-6">
             <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]" />
             <p className="text-gray-400 dark:text-gray-700 text-[11px] font-black uppercase tracking-[0.4em] leading-relaxed italic">Authorized Governance Protocol // RESTRICTED</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-8 py-5 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-widest flex items-center gap-5 animate-in slide-in-from-top-4 italic leading-none">
            <ShieldAlert size={18} className="animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-12">
          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-800 ml-4 italic">Registry Identification</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-8 flex items-center text-gray-300 dark:text-gray-800 group-focus-within/input:text-red-600 transition-colors duration-500">
                 <Terminal size={24} />
              </div>
              <input
                type="email"
                placeholder="governance@quizaro.internal"
                className="w-full bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] pl-20 pr-8 py-6 outline-none focus:border-red-600 focus:bg-white dark:focus:bg-[#0a0f29] transition-all duration-700 text-gray-900 dark:text-white font-black placeholder:text-gray-200 dark:placeholder:text-gray-900 text-lg shadow-inner italic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-800 ml-4 italic">Security Cipher</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-8 flex items-center text-gray-300 dark:text-gray-800 group-focus-within/input:text-red-600 transition-colors duration-500">
                 <Lock size={24} />
              </div>
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] pl-20 pr-8 py-6 outline-none focus:border-red-600 focus:bg-white dark:focus:bg-[#0a0f29] transition-all duration-700 text-gray-900 dark:text-white font-black placeholder:text-gray-200 dark:placeholder:text-gray-900 text-lg shadow-inner italic"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-8 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] transition-all duration-700 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white active:scale-95 disabled:opacity-50 mt-4 shadow-2xl shadow-gray-900/40 flex items-center justify-center gap-6 italic group/btn overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-6">
              {loading ? (
                <div className="w-8 h-8 border-4 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>Initialize Governance Hub <LogIn size={24} className="group-hover/btn:translate-x-2 transition-transform duration-700" /></>
              )}
            </span>
          </button>
        </form>

        <div className="mt-16 pt-12 border-t-2 border-gray-50 dark:border-gray-800 flex items-center justify-center gap-12">
          <Link href="/login" className="text-[11px] font-black text-gray-300 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all uppercase tracking-[0.4em] italic active:scale-90">
            Student Portal
          </Link>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800" />
          <Link href="/" className="text-[11px] font-black text-gray-300 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all uppercase tracking-[0.4em] italic active:scale-90">
            Mission Home
          </Link>
        </div>
      </div>

      {/* Institutional System Framework Badge */}
      <div className="fixed bottom-12 left-12 flex items-center gap-6 text-gray-200 dark:text-gray-900 animate-in slide-in-from-left-12 duration-1000 opacity-50">
         <Activity size={24} />
         <p className="text-[10px] font-black uppercase tracking-[0.8em] italic">Institutional Framework v4.5.1 // SECURE</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-500">
        <div className="w-20 h-20 border-4 border-red-100 dark:border-red-900/30 border-t-red-600 rounded-full animate-spin shadow-sm" />
        <p className="font-black animate-pulse text-red-600 dark:text-red-500 uppercase tracking-[0.5em] text-[10px] italic leading-none">Accessing Governance Core...</p>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
