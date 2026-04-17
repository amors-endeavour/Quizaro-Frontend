"use client";

import { useState } from "react";
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, Fingerprint, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import API from "@/app/lib/api";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Encryption keys do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Bit-length insufficient (Min 6)");
      setLoading(false);
      return;
    }

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setError("Invalid or expired access token");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/user/reset-password", { token, newPassword });

      setSuccess(true);
      setMessage(data.message || "Entropy successfully reset. Returning to station.");

      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      console.error("Reset error:", err);
      const msg = err?.response?.data?.message || err.message || "Protocol override failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050816] p-4 font-sans selection:bg-cyan-500/30">
      {/* Neural Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl w-full max-w-md backdrop-blur-2xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
           <div className={`w-20 h-20 ${success ? "bg-cyan-500/20 shadow-cyan-900/40" : "bg-gradient-to-br from-purple-600/20 to-blue-600/20 shadow-purple-900/10"} border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-500`}>
              {success ? (
                <CheckCircle2 size={36} className="text-cyan-400 animate-in zoom-in" />
              ) : (
                <Fingerprint size={36} className="text-purple-400" />
              )}
           </div>
           <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              {success ? "Success" : "Define Credentials"}
           </h2>
           <p className="text-gray-500 mt-2 text-[10px] font-bold uppercase tracking-widest">
              {success ? "System entropy restored" : "Secure your intellectual node"}
           </p>
        </div>

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-6 py-4 rounded-[1.5rem] mb-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {message && success && (
          <div className="bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 px-6 py-4 rounded-[1.5rem] mb-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <ShieldCheck size={16} />
            {message}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">New Password Cipher</label>
              <div className="flex items-center border border-white/10 rounded-[1.5rem] px-5 py-4 bg-white/5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all group">
                <Lock className="text-gray-600 mr-4 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full outline-none bg-transparent text-white placeholder:text-gray-700 font-bold text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Verify Cipher</label>
              <div className="flex items-center border border-white/10 rounded-[1.5rem] px-5 py-4 bg-white/5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all group">
                <Lock className="text-gray-600 mr-4 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full outline-none bg-transparent text-white placeholder:text-gray-700 font-bold text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-purple-900/20 mt-4"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">
                 {loading ? "Rewriting History..." : "Confirm Protocol"}
              </span>
            </button>
          </form>
        )}

        <div className="text-center mt-10">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all inline-flex items-center gap-3">
            <ArrowLeft size={14} /> Back to Entry Point
          </Link>
        </div>
      </div>
    </div>
  );
}
