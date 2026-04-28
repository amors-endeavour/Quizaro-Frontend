"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldAlert, Monitor, Terminal } from "lucide-react";
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

      // Restrict access to admin only
      if (role !== "admin") {
        setError("Access Denied: Administrative privileges required.");
        localStorage.clear();
        return;
      }
      
      router.replace("/admin-dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Admin authorization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] p-6 selection:bg-blue-100 selection:text-blue-600">
      <div className="bg-white border border-gray-100 p-12 lg:p-16 rounded-[3rem] shadow-2xl shadow-blue-900/5 w-full max-w-md relative z-10 box-border animate-in fade-in zoom-in duration-700">
        
        <div className="text-center mb-14">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic leading-none">Administrative Core</h2>
          <p className="text-gray-400 mt-3 text-[10px] uppercase font-black tracking-widest leading-relaxed">Authorized Personnel Access Protocol</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Registry Email</label>
            </div>
            <div className="relative group">
               <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
               <input
                 type="email"
                 placeholder="admin@quizaro.internal"
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm shadow-inner"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Cipher</label>
            </div>
            <div className="relative group">
               <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
               <input
                 type="password"
                 placeholder="••••••••••••"
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm shadow-inner"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-blue-900/10"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Initialize Secure Session"
            )}
          </button>
        </form>

        <div className="mt-14 flex items-center justify-center gap-8">
          <Link href="/user-login" className="text-[9px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
            Student Portal
          </Link>
          <div className="w-px h-3 bg-gray-100" />
          <Link href="/" className="text-[9px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
            Home Interface
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-[10px] text-gray-300 font-black uppercase tracking-widest flex items-center gap-4 italic">
        Institutional System Framework v4.0.1
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fc]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
