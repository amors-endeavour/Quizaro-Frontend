"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import API from "@/app/lib/api";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest text-[10px] italic">
        Establishing Secure Session...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050816] text-white font-sans overflow-hidden">
      <UserSidebar userName={user?.name || "Student"} />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
