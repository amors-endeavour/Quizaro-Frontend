"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          router.replace("/login");
          return;
        }
        const data = await res.json();
        const role = (data?.role)?.toString().toLowerCase();
        if (role !== "admin") {
          router.replace("/user-dashboard");
          return;
        }
        setIsAuth(true);
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto p-8">{children}</main>
    </div>
  );
}
