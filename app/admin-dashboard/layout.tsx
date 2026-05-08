"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import API from "@/app/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
        router.replace("/admin-login");
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfe]">
        <div className="flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000 text-gray-900">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-50 rounded-[2rem] animate-pulse shadow-xl shadow-blue-600/5" />
            <div className="absolute inset-0 w-24 h-24 border-t-4 border-blue-600 rounded-[2rem] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-black text-3xl italic">Q</div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] animate-pulse italic leading-none">Initializing Hub...</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic">Verification in progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fbfbfe] text-gray-900 transition-colors duration-500">
      {/* Integrated Logo Bar (The Mini-Sidebar) */}
      <div className="fixed top-0 left-0 z-[200] w-32 h-full bg-white border-r border-gray-100 flex flex-col items-center py-10 shadow-sm">
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="hover:scale-110 transition-all active:scale-95 group relative mb-auto"
         >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 border-2 border-white rotate-6 group-hover:rotate-0 transition-transform duration-500">
               <span className="text-white font-black text-2xl italic leading-none">Q</span>
            </div>
            <span className="absolute left-full ml-8 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-[300] italic shadow-2xl">Open Matrix Menu</span>
         </button>

         {/* OPTIONAL: ADD MINI-ICONS HERE IF NEEDED LATER */}
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
