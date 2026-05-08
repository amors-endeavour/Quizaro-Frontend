"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LogOut, LayoutDashboard, UserPlus, LogIn, Menu, X, 
  ArrowRight, ShieldCheck, Zap
} from "lucide-react";
import API from "@/app/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token) {
        setIsAuthenticated(true);
        setUserRole(role);
      }
      setCheckingAuth(false);
    }
    
    const verifyAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        setIsAuthenticated(!!data);
        setUserRole(role);
        if (typeof window !== "undefined") {
          localStorage.setItem("role", role);
        }
      } catch {
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
    router.push(userRole === "admin" ? "/admin-dashboard" : "/user-dashboard");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setTimeout(() => {
      window.location.href = "/";
    }, 200);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tests", href: "/tests" },
    { name: "Knowledge", href: "/resources" },
    { name: "Support", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm" : "bg-white/50 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-600/20">
            Q
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black text-gray-900 tracking-tighter uppercase">Quizaro</span>
            <span className="text-[7px] font-black text-blue-600 uppercase tracking-widest mt-1">Intelligence Core</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-all"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          {checkingAuth ? (
            <div className="w-20 h-9 bg-gray-50 rounded-lg animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <button
                onClick={handleDashboardRedirect}
                className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-[10px] font-black text-gray-900 hover:text-blue-600 uppercase tracking-[0.2em] transition-all"
              >
                Login <ArrowRight size={14} className="text-blue-600" />
              </Link>
              <Link
                href="/register"
                className="px-7 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
              >
                Enroll Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-gray-900 hover:text-blue-600"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-50 px-6 py-8 space-y-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-bold text-gray-900 hover:text-blue-600 py-2 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { handleDashboardRedirect(); setOpen(false); }}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="w-full py-4 border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="w-full py-4 text-center text-gray-900 font-black text-xs uppercase tracking-[0.2em]"
                >
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}
                  className="w-full py-4 text-center bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
                >
                  Enroll Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
