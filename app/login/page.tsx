"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Shield, Activity, ArrowRight, Zap, Star } from "lucide-react";
import API from "@/app/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      if (!role) {
        throw new Error("User role not identified. Please contact institutional support.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user || data.data?.user || {}));
      }

      if (role === "admin") {
        router.replace("/admin-dashboard");
      } else if (redirect) {
        const target = redirect.startsWith("/") ? redirect : "/user-dashboard";
        router.replace(target);
      } else {
        router.replace("/user-dashboard");
      }
    } catch (err: any) {
      console.error("Login component error:", err);
      const msg = err?.response?.data?.message || err.message || "Institutional authentication failure.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] dark:bg-[#050816] p-8 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-600 font-sans transition-colors duration-500 overflow-hidden relative">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full -top-48 -left-48 blur-[120px] animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full -bottom-48 -right-48 blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 p-12 lg:p-20 rounded-[4.5rem] shadow-2xl shadow-blue-900/5 w-full max-w-xl relative z-10 box-border animate-in fade-in zoom-in-95 duration-1000 group/form">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none group-hover/form:scale-150 transition-transform duration-1000" />
        
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 border-2 border-blue-100 dark:border-blue-800/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-sm group hover:rotate-12 transition-transform duration-700">
            <Shield size={40} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">Portal Access</h2>
          <div className="flex items-center justify-center gap-4 mt-6">
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
             <p className="text-gray-400 dark:text-gray-700 text-[11px] font-black uppercase tracking-[0.4em] leading-relaxed italic">Institutional Authentication Protocol // V4.5</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-8 py-5 rounded-[2rem] mb-12 text-[11px] font-black uppercase tracking-widest flex items-center gap-5 animate-in slide-in-from-top-4 italic leading-none">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-800 ml-4 italic">Registry Identity (Email)</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-8 flex items-center text-gray-300 dark:text-gray-800 group-focus-within/input:text-blue-600 dark:group-focus-within/input:text-blue-500 transition-colors duration-500">
                 <Mail size={24} />
              </div>
              <input
                type="email"
                placeholder="Synchronize email protocol..."
                className="w-full bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] pl-20 pr-8 py-6 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-[#0a0f29] transition-all duration-700 text-gray-900 dark:text-white font-black placeholder:text-gray-200 dark:placeholder:text-gray-900 text-lg shadow-inner italic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-800 ml-4 italic">Access Cipher (Password)</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-8 flex items-center text-gray-300 dark:text-gray-800 group-focus-within/input:text-blue-600 dark:group-focus-within/input:text-blue-500 transition-colors duration-500">
                 <Lock size={24} />
              </div>
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] pl-20 pr-8 py-6 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-[#0a0f29] transition-all duration-700 text-gray-900 dark:text-white font-black placeholder:text-gray-200 dark:placeholder:text-gray-900 text-lg shadow-inner italic"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pr-4">
            <Link 
              href="/forgot-password" 
              className="text-[11px] uppercase font-black tracking-[0.2em] text-gray-300 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all italic underline underline-offset-4 decoration-2"
            >
              Forgot Password Protocol?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] transition-all duration-700 hover:bg-blue-700 active:scale-95 disabled:opacity-50 mt-4 shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-6 italic group/btn overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-6">
              {loading ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Authorize Portal Sync <LogIn size={24} className="group-hover/btn:translate-x-2 transition-transform duration-700" /></>
              )}
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </button>
        </form>

        <div className="mt-16 pt-12 border-t-2 border-gray-50 dark:border-gray-800 text-center space-y-10">
          <button
            onClick={() => {
              const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";
              window.location.href = `${baseUrl}/auth/google`;
            }}
            className="w-full flex items-center justify-center gap-6 bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-700 py-6 rounded-[2.5rem] hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-700 font-black text-[12px] uppercase tracking-[0.2em] group shadow-sm italic active:scale-95"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" viewBox="0 0 24 24">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
            </div>
            Synchronize Institutional Google
          </button>
          <div className="space-y-6">
            <p className="text-gray-300 dark:text-gray-800 text-[12px] font-black uppercase tracking-[0.4em] italic">
              New Neural Entity?{" "}
              <Link href="/register" className="text-blue-600 dark:text-blue-500 hover:scale-105 transition-all inline-block underline underline-offset-4">
                Initialize Registry
              </Link>
            </p>
            <div className="pt-4">
              <Link href="/" className="text-[11px] uppercase font-black tracking-[0.6em] text-gray-200 dark:text-gray-900 hover:text-blue-600 dark:hover:text-blue-500 transition-all italic active:scale-90 flex items-center justify-center gap-4">
                <div className="w-10 h-px bg-current opacity-20" /> [ ABORT TO MISSION HOME ] <div className="w-10 h-px bg-current opacity-20" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Security Badge */}
      <div className="fixed bottom-12 left-12 flex items-center gap-6 text-gray-200 dark:text-gray-900 animate-in slide-in-from-left-12 duration-1000 opacity-50">
         <Activity size={24} />
         <p className="text-[10px] font-black uppercase tracking-[0.8em] italic">Encrypted Handshake Active</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-500">
        <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
        <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic leading-none">Accessing Intelligence Vault...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}