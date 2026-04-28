"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, UserPlus, LogIn, Menu, X, Activity } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
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
    <nav className="w-full sticky top-0 z-[100] bg-white/80 dark:bg-[#050816]/80 backdrop-blur-2xl border-b-2 border-gray-100 dark:border-gray-800 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Institutional Identity */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-900/30 group-hover:rotate-12 transition-transform duration-500 border-2 border-white dark:border-[#0a0f29]">Q</div>
          <div className="flex flex-col">
             <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Quizaro</span>
             <span className="text-[9px] text-blue-600 dark:text-blue-500 font-black uppercase tracking-[0.3em] leading-none mt-1.5 italic">Intelligence Core</span>
          </div>
        </Link>

        {/* Cognitive Navigation Mesh */}
        <div className="hidden lg:flex gap-12 items-center">
              {[
                { name: "Global Home", href: "/" },
                { name: "Test Registry", href: "/tests" },
                { name: "Intel Mesh", href: "/resources" },
                { name: "Contact Unit", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all relative group italic"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-2 w-0 h-1 bg-blue-600 dark:bg-blue-500 transition-all group-hover:w-full rounded-full shadow-[0_0_8px_#3b82f6]"></span>
                </Link>
              ))}
        </div>

        {/* Protocol Access Hub */}
        <div className="flex items-center gap-6">
          <div className="bg-gray-50 dark:bg-[#0a0f29] p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
             <ThemeToggle />
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {checkingAuth ? (
              <div className="w-32 h-12 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDashboardRedirect}
                  className="flex items-center gap-4 px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/30 active:scale-95 italic group/dash"
                >
                  <LayoutDashboard size={18} className="group-hover:rotate-12 transition-transform" />
                  Access Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="p-4 text-red-500 dark:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[1.5rem] transition-all border-2 border-red-100 dark:border-red-900/30 group/logout"
                  title="Terminate Session"
                >
                  <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all italic px-4"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-4 px-10 py-4 text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] text-white 
                  bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white
                  transition-all shadow-2xl shadow-gray-900/20 active:scale-95 italic group/enroll"
                >
                  <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                  Enroll Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigator Trigger */}
          <button 
             onClick={() => setOpen(!open)}
             className="lg:hidden p-4 bg-gray-50 dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 dark:text-gray-700 hover:text-blue-600 transition-all shadow-sm"
          >
             {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Cognitive Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-x-0 top-[88px] bg-white dark:bg-[#050816] border-b border-gray-100 dark:border-gray-800 p-8 animate-in slide-in-from-top-10 duration-500 shadow-2xl space-y-10 z-[40]">
           <div className="flex flex-col gap-6">
              {[
                { name: "Home Node", href: "/" },
                { name: "Test Registry", href: "/tests" },
                { name: "Knowledge Mesh", href: "/resources" },
                { name: "Support Link", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-800 hover:text-blue-600 italic border-b border-gray-50 dark:border-gray-900 pb-4"
                >
                  {item.name}
                </Link>
              ))}
           </div>

           <div className="pt-6">
              {isAuthenticated ? (
                <div className="flex flex-col gap-6">
                  <button
                    onClick={() => { handleDashboardRedirect(); setOpen(false); }}
                    className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest italic flex items-center justify-center gap-4"
                  >
                    <LayoutDashboard size={20} /> Access Dashboard
                  </button>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="w-full py-6 text-red-500 dark:text-red-600 font-black uppercase tracking-widest italic border-2 border-red-100 dark:border-red-900/30 rounded-[1.5rem]"
                  >
                    Terminate Session
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="w-full py-6 text-center text-gray-400 dark:text-gray-800 font-black uppercase tracking-widest italic border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem]"
                  >
                    Identify (Login)
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="w-full py-6 text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest italic rounded-[1.5rem]"
                  >
                    Enroll Now
                  </Link>
                </div>
              )}
           </div>
        </div>
      )}
    </nav>
  );
}
