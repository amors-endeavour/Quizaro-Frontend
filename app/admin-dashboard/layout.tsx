"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import API from "@/app/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
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
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full relative">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-[60]">
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="p-3 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 text-gray-900"
               >
                  <BarChart3 className="rotate-90" size={24} />
               </button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
