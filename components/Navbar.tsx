"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import API from "@/app/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Instant check (Optimistic UI)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsAuthenticated(true);
      setCheckingAuth(false);
    } else {
      // If no token, we can also be sure they are NOT logged in
      setIsAuthenticated(false);
      setCheckingAuth(false);
    }

    // 2. Background verification (Security)
    const verifyAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        setIsAuthenticated(!!data);
      } catch (err) {
        setIsAuthenticated(false);
        // Clear local state if verification fails
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAuth();
  }, []);

  const handleAdminAccess = () => {
    setOpen(false);
    // Directly go to admin dashboard if we're likely an admin
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (role === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/login?redirect=/admin-dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/user/logout");
    } catch {
      console.log("Remote logout failed, clearing local state anyway");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      setIsAuthenticated(false);
      router.replace("/login");
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#050816] border-b border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Quizaro"
            className="h-16 w-auto object-contain cursor-pointer"
          />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex gap-10 text-[16px] text-gray-300 font-medium">
              {[
                { name: "Home", href: "/" },
                { name: "Tests", href: "/tests" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item: { name: string; href: string }) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-white transition relative group"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 transition-all group-hover:w-full"></span>
                </Link>
              ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 relative">
          {checkingAuth ? (
            <div className="w-20 h-8 bg-white/10 rounded-lg animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <Link
                href="/user-dashboard"
                className="text-base font-medium text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white 
                bg-gradient-to-r from-red-500 to-pink-500 
                hover:opacity-90 transition shadow-lg shadow-red-500/20"
              >
                Logout
              </button>
              <button
                onClick={() => setOpen(!open)}
                className="text-gray-400 hover:text-white transition text-lg"
              >
                ▼
              </button>
              {open && (
                <div className="absolute right-0 top-14 w-48 bg-[#0b0f2a] border border-white/10 rounded-xl shadow-xl py-2">
                  <button
                    onClick={handleAdminAccess}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                  >
                    Admin Access
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-base font-medium text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white 
                bg-gradient-to-r from-purple-500 to-cyan-500 
                hover:opacity-90 transition shadow-lg shadow-purple-500/20"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
    </nav>
  );
}
