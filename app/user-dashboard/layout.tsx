"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import API from "@/app/lib/api";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        setUser(data.user || data);
        setLoading(false);
      } catch (err) {
        console.error("User Layout auth check failed:", err);
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="font-black animate-pulse text-blue-600 uppercase tracking-[0.3em] text-[10px] italic">
          Initializing Intelligence Command...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] text-gray-900 font-sans overflow-hidden relative">
      {/* Integrated Logo Trigger */}
      <div className="fixed top-0 left-0 z-[200] w-32 h-20 bg-white border-r border-b border-gray-100 flex items-center justify-center shadow-sm">
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="hover:scale-105 transition-transform active:scale-95 group relative"
         >
            <img src="/logo.png" alt="Quizaro" className="w-20 h-10 object-contain" />
            <span className="absolute left-full ml-6 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[300]">Access Neural Map</span>
         </button>
      </div>

      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={user?.name || "Student"} />
      
      <main className="flex-1 overflow-y-auto ml-32 scrollbar-hide">
        <div className="animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
