"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import API from "@/app/lib/api";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data.user?.role || data.role)?.toString().toLowerCase();

        if (role === "admin") {
          router.replace("/admin-dashboard");
          return;
        }
        setLoading(false);
      } catch (err) {
        console.error("User Layout Auth Error:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfe] flex flex-col items-center justify-center space-y-10 transition-colors duration-300">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-50 rounded-[2.5rem] animate-pulse shadow-xl shadow-blue-600/5" />
          <div className="absolute inset-0 w-24 h-24 border-t-4 border-blue-600 rounded-[2.5rem] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-black text-3xl italic">Q</div>
        </div>
        <div className="text-center space-y-4">
          <p className="font-black animate-pulse text-blue-600 uppercase tracking-[0.4em] text-[11px] italic leading-none">
            Initializing Intelligence Command...
          </p>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic">Synchronizing Neural Mesh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-gray-900 transition-colors duration-500 font-jetbrains selection:bg-blue-100 selection:text-blue-600">
      <style jsx global>{`
        body { background-color: #fbfbfe !important; }
      `}</style>
      
      {/* Integrated Logo Bar (Student Version) */}
      <div className="fixed top-0 left-0 z-[200] w-32 h-full bg-white border-r-2 border-gray-100 flex flex-col items-center py-10 shadow-sm">
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="hover:scale-110 transition-all active:scale-95 group relative mb-auto"
         >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 border-2 border-white rotate-6 group-hover:rotate-0 transition-transform duration-500">
               <span className="text-white font-black text-2xl italic leading-none">Q</span>
            </div>
            <span className="absolute left-full ml-8 px-5 py-3 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-[300] italic shadow-2xl border border-white/10">Access Node Menu</span>
         </button>
      </div>

      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName="" />
      
      <div className="flex-1 flex flex-col min-w-0 ml-32 transition-all duration-500 relative">
        <main className="flex-1 overflow-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 h-full relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
