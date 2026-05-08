"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Globe, BookOpen, Trophy, Target, Star } from "lucide-react";
import API from "@/app/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const redirect = searchParams?.get("redirect") || "";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/user/login", { email, password });
      const rawRole = data?.role || data?.user?.role || data?.data?.role || data?.data?.user?.role || "student";
      const role = rawRole.toString().toLowerCase();

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user || data.data?.user || {}));
      }

      if (role === "admin") {
        router.replace("/admin-dashboard");
      } else {
        const finalRedirect = redirect && redirect.startsWith("/") ? redirect : "/user-dashboard";
        router.replace(finalRedirect);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <Trophy size={18} className="text-amber-500" />, label: "Top Performers", value: "12K+" },
    { icon: <BookOpen size={18} className="text-blue-500" />, label: "Tests Available", value: "500+" },
    { icon: <Target size={18} className="text-green-500" />, label: "Avg Accuracy", value: "87%" },
    { icon: <Star size={18} className="text-purple-500" />, label: "Success Rate", value: "94%" },
  ];

  return (
    <div className="min-h-screen flex bg-[#fbfbfe] font-sans" style={{ colorScheme: "light" }}>
      <style jsx global>{`body { background-color: #fbfbfe !important; }`}</style>

      {/* LEFT PANEL — Student branding, warm & inviting */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-16"
        style={{ background: "linear-gradient(145deg, #eff6ff 0%, #f0f9ff 40%, #faf5ff 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-purple-200/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100/30 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
              <span className="text-white font-black text-2xl italic">Q</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Quizaro</h1>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] italic leading-none mt-1">Scholar Portal</p>
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 border border-blue-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em] italic">Students Active Now</span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic leading-[0.9] uppercase">
            Your<br/>Learning<br/>Journey<br/>Awaits
          </h2>
          <p className="text-sm font-black text-gray-400 uppercase tracking-wide italic leading-relaxed max-w-xs">
            Access your tests, track your progress, and climb the leaderboard. The mesh is live.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">{s.icon}</div>
                <div>
                  <p className="text-lg font-black text-gray-900 leading-none italic">{s.value}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-3">
          <Zap size={14} className="text-blue-400" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Quizaro Intelligence Platform v4.5</p>
        </div>
      </div>

      {/* RIGHT PANEL — Login Form, clean white */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl italic">Q</span>
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter italic uppercase">Quizaro Scholar</h1>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
              <BookOpen size={12} className="text-blue-500" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Student Login</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none mb-3">Welcome Back</h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Access your student dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-4 animate-in shake duration-500">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] ml-2 italic">Email Address</label>
              <div className="relative group">
                <Mail size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-14 pr-5 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-[15px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-blue-400 focus:bg-white transition-all italic"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-2">
                <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] italic">Password</label>
                <Link href="/forgot-password" className="text-[10px] font-black text-blue-500 italic uppercase tracking-widest hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-14 pr-14 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-[15px] font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-blue-400 focus:bg-white transition-all italic"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.3em] italic transition-all shadow-xl shadow-blue-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Access Dashboard <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </form>

          {/* Google SSO */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <button
              onClick={() => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";
                window.location.href = `${baseUrl}/auth/google`;
              }}
              className="w-full flex items-center justify-center gap-4 py-5 bg-white border-2 border-gray-100 rounded-2xl text-[12px] font-black uppercase tracking-widest text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all italic active:scale-95"
            >
              <Globe size={17} className="text-blue-500" /> Continue with Google
            </button>
          </div>

          {/* Register link */}
          <div className="text-center mt-10 space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">New to Quizaro?</p>
            <Link href="/register" className="inline-block text-[13px] font-black text-blue-600 uppercase tracking-widest italic hover:scale-105 transition-transform underline underline-offset-8">
              Create Your Account
            </Link>
          </div>

          {/* Admin link */}
          <div className="mt-8 text-center">
            <Link href="/admin-login" className="text-[10px] font-black text-gray-300 hover:text-gray-500 uppercase tracking-widest italic transition-colors">
              Admin? → Go to Governance Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fbfbfe] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}