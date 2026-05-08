"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Shield, Eye, EyeOff, ArrowRight, Zap, Globe, Github } from "lucide-react";
import API from "@/app/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirect = searchParams?.get("redirect") || "";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/user/login", { email, password });
      const role = (data?.role || data?.user?.role || data?.data?.role)?.toString().toLowerCase();
      if (!role) throw new Error("Authentication node mapping failed. Access restricted.");
      
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user || data.data?.user || {}));
      }
      
      if (role === "admin") {
        router.replace("/admin-dashboard");
      } else if (redirect) {
        router.replace(redirect.startsWith("/") ? redirect : "/user-dashboard");
      } else {
        router.replace("/user-dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Synchronization failure. Verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 font-jetbrains">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] animate-pulse duration-700" />
      
      <div className="relative z-10 w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {/* Branding */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white dark:bg-[#0a0f29] rounded-full border border-gray-100 dark:border-gray-800 shadow-sm mb-4 animate-in slide-in-from-top-4 duration-700">
            <Zap size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 italic">Neural Sync Active</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            Quizaro
          </h1>
          <p className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] italic leading-none">
            Institutional Intelligence Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0a0f29] rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 dark:border-gray-800 p-12 lg:p-16 relative group transition-all duration-500 hover:border-blue-200 dark:hover:border-blue-900/50">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          {/* Header */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight italic mb-2">Welcome Back Node</h2>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">Initialize session credentials to synchronize</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-[1.5rem] mb-10 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-4 animate-in shake duration-500">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Neural Identifier (Email)</label>
                <div className="relative group/input">
                  <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@institutional.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-900 outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] italic">Access Code (Password)</label>
                  <Link href="/forgot-password" title="Initialize Recovery" className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic hover:underline underline-offset-4">
                    Lost Code?
                  </Link>
                </div>
                <div className="relative group/input">
                  <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/input:text-purple-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-16 pr-16 py-5 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-900 outline-none focus:border-purple-600 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all italic shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 dark:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] italic transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.98] disabled:opacity-60 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Synchronize Session <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </form>

          {/* OAuth Divider */}
          <div className="flex items-center gap-6 my-10">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            <span className="text-[9px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest italic">External Portals</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";
                window.location.href = `${baseUrl}/auth/google`;
              }}
              className="flex items-center justify-center gap-3 py-4 bg-white dark:bg-[#050816] border-2 border-gray-50 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:border-blue-600 transition-all italic active:scale-95 shadow-sm"
            >
              <Globe size={16} className="text-blue-600" /> Google
            </button>
            <button
              className="flex items-center justify-center gap-3 py-4 bg-white dark:bg-[#050816] border-2 border-gray-50 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:border-purple-600 transition-all italic active:scale-95 shadow-sm opacity-50 cursor-not-allowed"
            >
              <Github size={16} /> GitHub
            </button>
          </div>

          {/* Registration Trigger */}
          <div className="text-center mt-12 space-y-2">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic">
              New Intelligence Entity?
            </p>
            <Link href="/register" className="inline-block text-[12px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] italic hover:scale-105 transition-transform active:scale-95">
              Initialize Account Matrix
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
            <Shield size={14} className="group-hover:rotate-12 transition-transform" /> Back to Base Node
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] italic animate-pulse leading-none">Booting Auth Mesh...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}