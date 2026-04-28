"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import API from "@/app/lib/api";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const userObj = data.user || data;
        const role = userObj.role?.toString().toLowerCase();

        if (role !== "admin") {
          router.replace("/user-dashboard");
          return;
        }
        setIsAuth(true);
      } catch (err: any) {
        console.error("Layout auth check failed:", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] dark:bg-[#050816]">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000 text-gray-900 dark:text-white">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 rounded-3xl animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 border-t-4 border-blue-600 rounded-3xl animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-black text-2xl">Q</div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] animate-pulse">Initializing Hub...</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verification in progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Integrated Logo Trigger */}
      <div className="fixed top-0 left-0 z-[200] w-32 h-20 bg-white dark:bg-[#0a0f29] border-r border-b border-gray-100 dark:border-gray-800 flex items-center justify-center shadow-sm">
         <div className="flex items-center gap-3 p-2 bg-gray-50/50 dark:bg-[#0a0f29] rounded-[1.5rem] border-2 border-gray-100 dark:border-gray-800 shadow-inner">
            {mounted && <ThemeToggle />}
         </div>
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="hover:scale-105 transition-transform active:scale-95 group relative ml-4"
         >
            <img src="/logo.png" alt="Quizaro" className="w-20 h-10 object-contain" />
            <span className="absolute left-full ml-6 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[300]">Open Matrix Menu</span>
         </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 ml-32 transition-all duration-500">
        <main className="flex-1 overflow-auto">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
