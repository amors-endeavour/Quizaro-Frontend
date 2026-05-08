"use client";

import React, { useState, Suspense } from "react";
import { User, Mail, Lock, UserPlus, LogIn, ArrowRight, Activity, Shield, Rocket, Zap, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/app/lib/api";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Cipher must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/user/register", { name, email, password });
      const role = (data?.role || data?.user?.role || data?.data?.role || "student").toString().toLowerCase();

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user || data.data?.user || {}));
      }

      router.replace("/user-dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Institutional registration failed.";
      setError(msg);
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
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] animate-pulse duration-700" />
      
      <div className="relative z-10 w-full max-w-[540px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {/* Branding */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white dark:bg-[#0a0f29] rounded-full border border-gray-100 dark:border-gray-800 shadow-sm mb-4 animate-in slide-in-from-top-4 duration-700">
            <Zap size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 italic">Neural Network Initialization</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            Quizaro
          </h1>
          <p className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] italic leading-none">
            Scholar Entity Creation Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0a0f29] rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 dark:border-gray-800 p-12 lg:p-16 relative group transition-all duration-500 hover:border-blue-200 dark:hover:border-blue-900/50">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          {/* Header */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight italic mb-2">Initialize Registry</h2>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">Register your identity vector in the mesh</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-[1.5rem] mb-10 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-4 animate-in shake duration-500">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Entity Label (Full Name)</label>
                <div className="relative group/input">
                  <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Scholar Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-900 outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Neural Identifier (Email)</label>
                <div className="relative group/input">
                  <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/input:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@institutional.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-900 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Access Cipher (Password)</label>
                <div className="relative group/input">
                  <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/input:text-purple-600 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-900 outline-none focus:border-purple-600 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all italic shadow-inner"
                  />
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
                <>Establish Identity Matrix <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* OAuth Divider */}
          <div className="flex items-center gap-6 my-10">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            <span className="text-[9px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest italic">External Sync</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>

          {/* Google */}
          <button
            onClick={() => {
              const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";
              window.location.href = `${baseUrl}/auth/google`;
            }}
            className="w-full flex items-center justify-center gap-4 py-5 bg-white dark:bg-[#050816] border-2 border-gray-50 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:border-blue-600 transition-all italic active:scale-95 shadow-sm"
          >
            <Globe size={16} className="text-blue-600" /> Synchronize with Google Registry
          </button>

          {/* Login Trigger */}
          <div className="text-center mt-12 space-y-2">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic">
              Existing Neural Entity?
            </p>
            <Link href="/login" className="inline-block text-[12px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] italic hover:scale-105 transition-transform active:scale-95">
              Access Active Session
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
            <Shield size={14} className="group-hover:rotate-12 transition-transform" /> Return to Base Node
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] italic animate-pulse leading-none">Mapping Neural Space...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
