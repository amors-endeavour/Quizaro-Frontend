"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldAlert, Eye, EyeOff, Shield, Activity, Fingerprint, Terminal, AlertTriangle, Cpu } from "lucide-react";
import API from "@/app/lib/api";

function AdminLoginForm() {
  const router = useRouter();

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

      if (role !== "admin") {
        setError("Privileged Access Required. Entity permissions mismatched.");
        localStorage.clear();
        return;
      }

      router.replace("/admin-dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Credential verification protocol failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex font-sans"
      style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #0f172a 40%, #1a0f2e 100%)" }}
    >
      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-16 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/50 border border-indigo-500/30">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase leading-none">Quizaro</h1>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic leading-none mt-1">Governance Core</p>
            </div>
          </div>
        </div>

        {/* Center text */}
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] italic">Restricted Access Zone</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter italic leading-[0.9] uppercase">
            Admin<br/>Command<br/>Center
          </h2>
          <p className="text-sm font-black text-gray-500 uppercase tracking-widest italic leading-relaxed max-w-xs">
            High-privilege governance portal. Authorised personnel only. All sessions are monitored and encrypted.
          </p>
          <div className="flex flex-col gap-4 pt-4">
            {["256-bit AES Encryption", "Session Monitoring Active", "Multi-factor Auth Ready"].map((feat) => (
              <div key={feat} className="flex items-center gap-4">
                <div className="w-5 h-5 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                </div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-3">
          <Cpu size={14} className="text-gray-600" />
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] italic">Neural Security Engine v4.5.1</p>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter italic uppercase">Quizaro Governance</h1>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full mb-8">
              <Terminal size={12} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Secure Authentication</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic leading-none mb-3">Access Control</h2>
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic leading-none">Institutional Security Protocol Layer 1</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-5 rounded-2xl mb-10 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-4 animate-in shake duration-500">
              <ShieldAlert size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic">Governance Identifier</label>
              <div className="relative group">
                <Terminal size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@quizaro.institutional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-black text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all italic"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic">Encryption Key</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-16 pr-16 py-5 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-black text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all italic"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.3em] italic transition-all shadow-2xl shadow-indigo-900/50 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Unlock Admin Command <Shield size={18} /></>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-10 p-6 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex items-start gap-4">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest italic leading-relaxed">
              High-security perimeter active. All access attempts are monitored and logged.
            </p>
          </div>

          {/* Footer links */}
          <div className="mt-10 flex items-center justify-between">
            <Link href="/login" className="text-[11px] font-black text-gray-600 hover:text-indigo-400 uppercase tracking-widest italic transition-colors">
              ← Student Portal
            </Link>
            <Link href="/" className="text-[11px] font-black text-gray-600 hover:text-gray-300 uppercase tracking-widest italic transition-colors">
              Return to Base
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e1a" }}>
        <div className="w-12 h-12 border-2 border-indigo-900 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
