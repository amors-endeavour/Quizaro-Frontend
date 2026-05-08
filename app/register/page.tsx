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

  // Auto-Login Redirection
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token) {
        router.replace(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      }
    }
  }, [router]);

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
      className="min-h-screen !bg-[#fbfbfe] flex flex-col items-center justify-center p-6 relative overflow-hidden font-jetbrains selection:bg-blue-100 selection:text-blue-600 light"
      style={{ backgroundColor: '#fbfbfe', colorScheme: 'light' }}
    >
      <style jsx global>{`
        body { background-color: #fbfbfe !important; }
      `}</style>

      {/* Soft Mesh Gradients (Matching Reference Image) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[140px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px] opacity-60" />
      
      <div className="relative z-10 w-full max-w-[540px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-[0.2em] italic flex flex-col gap-4 animate-in shake duration-500 shadow-lg shadow-red-900/5">
              <div className="flex items-center gap-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                <span className="flex-1">{error}</span>
              </div>
              {error.toLowerCase().includes("exists") && (
                <Link href="/login" className="ml-7 text-blue-600 underline underline-offset-8 hover:text-blue-700 transition-all font-black tracking-widest decoration-2">
                  ACCESS ACTIVE PORTAL INSTEAD →
                </Link>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              {/* Name */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] ml-2 italic">Entity Label (Full Name)</label>
                <div className="relative group">
                  <User size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Scholar Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-20 pr-8 py-6 bg-[#f0f4ff]/50 border border-gray-100 rounded-[2rem] text-[16px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-blue-400 focus:bg-white transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] ml-2 italic">Neural Identifier (Email)</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@institutional.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-20 pr-8 py-6 bg-[#f0f4ff]/50 border border-gray-100 rounded-[2rem] text-[16px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-indigo-400 focus:bg-white transition-all italic shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] ml-2 italic">Access Cipher (Password)</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-20 pr-8 py-6 bg-[#f0f4ff]/50 border border-gray-100 rounded-[2rem] text-[16px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-purple-400 focus:bg-white transition-all italic shadow-inner"
                  />
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
                  <>Establish Identity Matrix <Rocket size={22} /></>
                )}
              </button>
            </div>
          </form>

          {/* Login Trigger */}
          <div className="text-center mt-14 space-y-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic leading-none">
              Existing Neural Entity?
            </p>
            <Link href="/login" className="inline-block text-[14px] font-black text-blue-600 uppercase tracking-[0.2em] italic hover:scale-105 transition-transform active:scale-95 underline underline-offset-8">
              Access Active Session
            </Link>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-14 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link href="/login" className="px-8 py-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-[10px] font-black uppercase tracking-widest italic text-gray-500 hover:text-blue-600 active:scale-95">
            Access Portal
          </Link>
          <Link href="/" className="px-8 py-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-gray-200 transition-all text-[10px] font-black uppercase tracking-widest italic text-gray-500 hover:text-gray-900 active:scale-95 flex items-center gap-3">
             <Shield size={12} className="text-blue-600" /> Return to Base Node
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
