"use client";

import React, { useState } from "react";
import { User, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import API from "@/app/lib/api";

export default function RegisterPage() {
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
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/user/register", { name, email, password });

      // Auto-login upon successful registration
      const role = (data?.role || data?.user?.role || data?.data?.role || "student").toString().toLowerCase();

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user || data.data?.user || {}));
      }

      // Registration is almost always for students
      router.replace("/user-dashboard");

    } catch (err: any) {
      console.error("Registration error:", err);
      const msg = err?.response?.data?.message || err.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] p-6 selection:bg-blue-100 selection:text-blue-600">
      <div className="bg-white border border-gray-100 p-12 lg:p-16 rounded-[3rem] shadow-2xl shadow-blue-900/5 w-full max-w-md relative z-10 box-border animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Scholar Enrollment</h2>
          <p className="text-gray-400 mt-2 text-[11px] font-black uppercase tracking-widest leading-relaxed">Initializing personal intellectual registry</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Entity Label (Full Name)</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm shadow-inner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity Vector (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
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
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <div className="flex items-center gap-3">Create Scholar Account <ArrowRight size={18} /></div>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center space-y-6">
          <button
            onClick={() => {
              const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";
              window.location.href = `${baseUrl}/auth/google`;
            }}
            className="w-full flex items-center justify-center gap-4 bg-white border border-gray-100 text-gray-600 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm group shadow-sm"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Institutional Google
          </button>
          
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
            Existing Entity?{" "}
            <Link href="/user-login" className="text-blue-600 hover:text-blue-700 transition-colors">
              Access Session
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
