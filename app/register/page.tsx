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
    <div className="flex items-center justify-center min-h-screen bg-[#050816] p-4 font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-gray-400 mt-2 text-sm">Join the next generation of top performers</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
            <div className="flex items-center border border-white/10 rounded-2xl px-4 py-3 bg-white/5 focus-within:border-blue-500/50 transition-all">
              <User className="text-gray-500 mr-3" size={18} />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
            <div className="flex items-center border border-white/10 rounded-2xl px-4 py-3 bg-white/5 focus-within:border-blue-500/50 transition-all">
              <Mail className="text-gray-500 mr-3" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</label>
            <div className="flex items-center border border-white/10 rounded-2xl px-4 py-3 bg-white/5 focus-within:border-blue-500/50 transition-all">
              <Lock className="text-gray-500 mr-3" size={18} />
              <input
                type="password"
                placeholder="Min. 6 characters"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-600"
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
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 font-bold shadow-lg shadow-purple-900/20 mt-4 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                Create Free Account
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold">
              Sign in Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
