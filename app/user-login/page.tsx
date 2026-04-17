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
    <div className="flex items-center justify-center min-h-screen bg-[#050816] p-4 font-sans selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#0891b220_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md backdrop-blur-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
            <UserCircle className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Student Portal</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Log in to continue your preparation</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-4 rounded-2xl mb-8 text-sm font-semibold flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="student@quizaro.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] text-white transition-all placeholder:text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] text-white transition-all placeholder:text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pr-2">
            <Link 
              href="/forgot-password" 
              className="text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-cyan-400 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-cyan-900/20"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex flex-col items-center gap-1">
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-[10px] font-black animate-pulse opacity-60">Waking up secure server...</span>
                </>
              ) : (
                <div className="flex items-center gap-2">Enter Classroom <ArrowRight size={20} /></div>
              )}
            </span>
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center space-y-4">
          <p className="text-gray-500 text-sm font-medium">
            New to Quizaro?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
              Join for Free
            </Link>
          </p>
          <p>
            <Link href="/admin-login" className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-600 hover:text-purple-400 transition-colors">
              ARE YOU AN ADMIN?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816]" />}>
      <UserLoginForm />
    </Suspense>
  );
}
