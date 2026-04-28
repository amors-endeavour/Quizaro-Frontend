"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import API from "@/app/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Instant check (Optimistic UI)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token) {
        setIsAuthenticated(true);
        setUserRole(role);
        setCheckingAuth(false);
      } else {
        setIsAuthenticated(false);
        setCheckingAuth(false);
      }
    }

    // 2. Background verification (Security)
    const verifyAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        setIsAuthenticated(!!data);
        setUserRole(role);
        if (typeof window !== "undefined") {
          localStorage.setItem("role", role);
        }
      } catch (err) {
        setIsAuthenticated(false);
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

  const handleDashboardRedirect = () => {
    if (userRole === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/user-dashboard");
    }
  };

  const handleLogout = async () => {
    setCheckingAuth(true); 
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-1000">
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
        <div className="hidden md:flex gap-10 text-[16px] text-gray-600 font-medium">
              {[
                { name: "Home", href: "/" },
                { name: "Tests", href: "/tests" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item: { name: string; href: string }) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-gray-900 transition relative group"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
                </Link>
              ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 relative">
          {checkingAuth ? (
            <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <button
                onClick={handleDashboardRedirect}
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-red-100"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors px-4"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 text-[11px] font-black uppercase tracking-widest rounded-2xl text-white 
                bg-blue-600 hover:bg-blue-700 
                transition-all shadow-lg shadow-blue-900/10 active:scale-95"
              >
                Enroll
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
