"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Shield, Eye, EyeOff, ArrowRight, Zap, Globe, Github, Rocket } from "lucide-react";
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
      const role = (data?.role || data?.user?.role || data?.data?.role || "student").toString().toLowerCase();
      
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
      setError(err?.response?.data?.message || err.message || "Credential verification protocol failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen !bg-[#fbfbfe] flex flex-col items-center justify-center p-6 relative overflow-hidden font-jetbrains selection:bg-blue-100 selection:text-blue-600 light"
      style={{ backgroundColor: '#fbfbfe', colorScheme: 'light' }}
    >
      <style jsx global>{`
        body { background-color: #fbfbfe !important; }
      `}</style>

      {/* Soft Mesh Gradients (Matching Reference Image) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[140px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px] opacity-60" />
      
      <div className="relative z-10 w-full max-w-[500px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Top Badge (Gradient Style from Image) */}
        <div className="inline-flex items-center gap-3 px-8 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm rounded-full mb-8 border border-white/50">
          <Zap size={14} className="text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900 italic">Neural Network Initialization</span>
        </div>

        {/* Branding (Image Style) */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4 leading-none">
            Quizaro
          </h1>
          <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.4em] italic leading-none">
            Scholar Entity Creation Portal
          </p>
        </div>

        {/* Form Container (Major White - Ultra High-End) */}
        <div className="w-full bg-white rounded-[4rem] border border-gray-100/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] p-12 lg:p-16 transition-all duration-700 hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)]">
          
          <div className="mb-14">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none mb-3">Initialize Registry</h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic leading-none">Register your identity vector in the mesh</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-8 py-5 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-5 animate-in shake duration-500">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-12">
            <div className="space-y-8">
              {/* Email */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] ml-2 italic">Neural Identifier (Email)</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@institutional.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-20 pr-8 py-6 bg-[#f0f4ff]/50 border border-gray-100 rounded-[2rem] text-[16px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-blue-400 focus:bg-white transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-2">
                  <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] italic">Access Cipher (Password)</label>
                  <Link href="/forgot-password" text-blue-600 className="text-[10px] font-black italic uppercase tracking-widest hover:underline">
                    Lost Cipher?
                  </Link>
                </div>
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

            {/* Submit (High-Contrast Gradient Button from Image) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-7 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-[0.3em] italic transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Establish Identity Matrix <ArrowRight size={22} /></>
              )}
            </button>
          </form>

          {/* OAuth Section (Image Style) */}
          <div className="mt-14">
             <div className="flex items-center gap-6 mb-10">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">External Sync</span>
                <div className="flex-1 h-px bg-gray-100" />
             </div>
             <button
                onClick={() => {
                  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";
                  window.location.href = `${baseUrl}/auth/google`;
                }}
                className="w-full flex items-center justify-center gap-5 py-6 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 hover:border-blue-600 transition-all italic active:scale-95 shadow-sm"
              >
                <Globe size={18} className="text-blue-600" /> Synchronize with Google Registry
              </button>
          </div>

          {/* Login Trigger */}
          <div className="text-center mt-14 space-y-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic leading-none">
              New Intelligence Entity?
            </p>
            <Link href="/register" className="inline-block text-[14px] font-black text-blue-600 uppercase tracking-[0.2em] italic hover:scale-105 transition-transform active:scale-95 underline underline-offset-8">
              Initialize Account Matrix
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest italic transition-colors group">
             <Shield size={14} className="group-hover:rotate-12 transition-transform" /> Return to Base Node
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}