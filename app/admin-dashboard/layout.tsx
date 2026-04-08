"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/user/profile`, {
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        const role = (data?.role || data?.user?.role)?.toString().toLowerCase();
        if (role !== "admin") {
          router.replace("/user-dashboard");
          return;
        }
        setIsAuth(true);
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500/20 rounded-3xl animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 border-t-4 border-blue-600 rounded-3xl animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-black text-2xl">Q</div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.3em] animate-pulse">Establishing Secure Hub</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verification in progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
