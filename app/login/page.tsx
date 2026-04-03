"use client";

import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const role = (data?.role || data?.user?.role)?.toString().toLowerCase();

      if (!role) {
        throw new Error("Role not found in response.");
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      localStorage.setItem("userRole", role);

      if (role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/user-dashboard");
      }

    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <Mail className="text-gray-400 mr-2" size={20} />
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-2 outline-none bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <Lock className="text-gray-400 mr-2" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register here
          </Link>
        </p>

        <p className="text-center text-gray-500 mt-3 text-sm">
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}
