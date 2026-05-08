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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-jetbrains selection:bg-blue-100 selection:text-blue-600">
      {/* Ultra-Minimal Background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-40" />
      <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[100px] opacity-40" />
      
      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Top Badge (Image 1 Style) */}
        <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white border border-gray-100 shadow-sm rounded-full mb-6">
          <Zap size={12} className="text-blue-600" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Neural Network Initialization</span>
        </div>

        {/* Branding (Image 1 Style) */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-2">
            Quizaro
          </h1>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">
            Scholar Entity Creation Portal
          </p>
        </div>

        {/* Form Container (Major White) */}
        <div className="w-full bg-white rounded-[3rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-10 lg:p-14 transition-all duration-500 hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)]">
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight italic mb-2 leading-none">Initialize Registry</h2>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Register your identity vector in the mesh</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-4 animate-in shake duration-500">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic">Entity Label (Full Name)</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="Scholar Name"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-16 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 placeholder:text-gray-200 outline-none focus:border-blue-600 focus:bg-white transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic">Access Cipher (Password)</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-16 pr-16 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 placeholder:text-gray-200 outline-none focus:border-purple-600 focus:bg-white transition-all italic shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit (Image 1 Gradient Button) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] italic transition-all shadow-xl shadow-blue-600/10 hover:shadow-blue-600/25 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Establish Identity Matrix <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* OAuth Section (Image 1 Style) */}
          <div className="mt-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gray-50" />
                <span className="text-[8px] font-black text-gray-200 uppercase tracking-widest italic">External Sync</span>
                <div className="flex-1 h-px bg-gray-50" />
             </div>
             <button
                onClick={() => {
                  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";
                  window.location.href = `${baseUrl}/auth/google`;
                }}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all italic active:scale-95 shadow-sm"
              >
                <Globe size={14} /> Synchronize with Google Registry
              </button>
          </div>

          {/* Footer (Image 1 Style) */}
          <div className="text-center mt-10">
             <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mb-2">Existing Neural Entity?</p>
             <Link href="/login" className="text-[11px] font-black text-blue-600 uppercase tracking-[0.1em] italic hover:underline underline-offset-4">
                Access Active Session
             </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10">
          <Link href="/" className="text-[10px] font-black text-gray-200 uppercase tracking-widest italic hover:text-gray-400 transition-colors">
             Return to Base Node
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