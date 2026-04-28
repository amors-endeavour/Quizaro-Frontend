"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, UserCircle, ArrowRight } from "lucide-react";
import API from "@/app/lib/api";

function UserLoginForm() {
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

      const role = (data?.role || data?.user?.role)?.toString().toLowerCase();

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
      }

      // If an admin tries to login here, we'll still let them, but they go to user dashboard
      // or we can redirect them to admin-dashboard if they really want
      if (role === "admin") {
        router.replace("/admin-dashboard");
      } else if (redirect) {
        const target = redirect.startsWith("/") ? redirect : "/user-dashboard";
        router.replace(target);
      } else {
        router.replace("/user-dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] p-6 selection:bg-blue-100 selection:text-blue-600">
      <div className="bg-white border border-gray-100 p-12 lg:p-16 rounded-[3rem] shadow-2xl shadow-blue-900/5 w-full max-w-md relative z-10 box-border animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-14">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-900/20">
            <UserCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Scholar Portal</h2>
          <p className="text-gray-400 mt-2 text-[11px] font-black uppercase tracking-widest">Resuming intellectual progression</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity Vector (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="student@quizaro.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Access Cipher (Password)</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
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

          <div className="flex justify-end pr-2">
            <Link 
              href="/forgot-password" 
              className="text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
            >
              Lost Cipher?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <div className="flex items-center gap-3">Commence Session <ArrowRight size={18} /></div>
            )}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-gray-50 text-center space-y-6">
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
            New Entity?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 transition-colors">
              Initialize Enrollment
            </Link>
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link href="/admin-login" className="text-[9px] font-black text-gray-300 hover:text-blue-600 transition-colors uppercase tracking-widest">
              Admin Node
            </Link>
            <div className="w-px h-3 bg-gray-100" />
            <Link href="/" className="text-[9px] font-black text-gray-300 hover:text-blue-600 transition-colors uppercase tracking-widest">
              Exit Interface
            </Link>
          </div>
        </div>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fc]" />}>
      <UserLoginForm />
    </Suspense>
  );
}
