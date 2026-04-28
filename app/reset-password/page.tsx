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
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] p-4 font-sans selection:bg-blue-100 selection:text-blue-600 relative overflow-hidden">
      <div className="bg-white border border-gray-100 p-12 lg:p-16 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12">
           <div className={`w-20 h-20 ${success ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"} border border-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm transition-all duration-500`}>
              {success ? (
                <CheckCircle2 size={36} className="animate-in zoom-in" />
              ) : (
                <Fingerprint size={36} />
              )}
           </div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
              {success ? "Success" : "Reset Cipher"}
           </h2>
           <p className="text-gray-400 mt-2 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              {success ? "System credentials restored" : "Secure your institutional node"}
           </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {message && success && (
          <div className="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
            <ShieldCheck size={16} />
            {message}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 leading-none">New Password Cipher</label>
              <div className="flex items-center border border-gray-100 rounded-2xl px-6 py-4 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all group shadow-inner">
                <Lock className="text-gray-300 mr-4 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full outline-none bg-transparent text-gray-900 font-bold text-sm placeholder:text-gray-300"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 leading-none">Verify Cipher</label>
              <div className="flex items-center border border-gray-100 rounded-2xl px-6 py-4 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all group shadow-inner">
                <Lock className="text-gray-300 mr-4 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full outline-none bg-transparent text-gray-900 font-bold text-sm placeholder:text-gray-300"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-900/10 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? "Rewriting History..." : "Confirm Protocol"}
            </button>
          </form>
        )}

        <div className="text-center mt-12 pt-8 border-t border-gray-50">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all inline-flex items-center gap-3">
            <ArrowLeft size={14} /> Back to Entry Point
          </Link>
        </div>
      </div>
    </div>
  );
}
