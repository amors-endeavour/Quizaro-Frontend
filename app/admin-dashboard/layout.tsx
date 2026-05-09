"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import API from "@/app/lib/api";
import { SidebarProvider, useSidebar } from "@/app/context/SidebarContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const { isOpen, close } = useSidebar();

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
    <div className="flex min-h-screen bg-[#fbfbfe] text-gray-900 transition-colors duration-500 overflow-x-hidden">
      
      {/* Permanent Sidebar for Desktop, Responsive for Mobile */}
      <AdminSidebar 
        isOpen={isOpen} 
        onClose={close} 
      />
      
      {/* Fluid Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 relative">
        <main className="flex-1">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </SidebarProvider>
  );
}
