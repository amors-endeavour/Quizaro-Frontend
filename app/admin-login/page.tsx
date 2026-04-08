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
    <div className="flex items-center justify-center min-h-screen bg-[#02040a] p-4 font-mono select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#9333ea15_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-3xl shadow-[0_0_100px_rgba(147,51,234,0.05)] w-full max-w-sm relative z-10 box-border overflow-hidden group animate-in fade-in zoom-in duration-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-pulse" />
        
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-zinc-900 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/10">
            <ShieldAlert className="text-purple-400" size={28} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">ADMIN CONSOLE</h2>
          <p className="text-zinc-600 mt-3 text-[10px] uppercase font-bold tracking-[0.2em]">Private Administrative Access</p>
        </div>

        {error && (
          <div className="bg-red-950/20 border border-red-950/50 text-red-500 px-4 py-3 rounded-xl mb-10 text-[10px] uppercase font-black tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Admin Email</label>
              <Terminal size={12} className="text-zinc-800" />
            </div>
            <input
              type="email"
              placeholder="admin@quizaro.internal"
              className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 outline-none focus:border-purple-600/50 transition-all text-white placeholder:text-zinc-800 text-sm font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Access Key</label>
              <Lock size={12} className="text-zinc-800" />
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 outline-none focus:border-purple-600/50 transition-all text-white placeholder:text-zinc-800 text-sm font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin mx-auto" />
            ) : (
              "Initialize Access"
            )}
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center gap-6">
          <Link href="/user-login" className="text-[10px] font-black text-zinc-700 hover:text-white transition-colors uppercase tracking-widest border-b border-dashed border-zinc-800 pb-1">
            Student Exit
          </Link>
          <div className="w-px h-3 bg-zinc-900" />
          <Link href="/" className="text-[10px] font-black text-zinc-700 hover:text-white transition-colors uppercase tracking-widest border-b border-dashed border-zinc-800 pb-1">
            Main Entry
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em] flex items-center gap-4">
        <Monitor size={14} className="animate-pulse" /> SYSTEM VERSION 4.0.1
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#02040a]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
