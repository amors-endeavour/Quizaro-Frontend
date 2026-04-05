"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

interface Stats {
  totalUsers: number;
  totalTests: number;
  totalAttempts: number;
}

interface RecentAttempt {
  _id: string;
  userId: { name: string; email: string };
  testId: { title: string };
  score: number;
  totalMarks: number;
  submittedAt: string;
}
import API from "@/app/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalTests: 0, totalAttempts: 0 });
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");

        console.log("Admin profile data:", JSON.stringify(data));
        
        const role = (data?.role || data?.user?.role)?.toString().toLowerCase();
        console.log("Admin role check:", role);
        
        if (role !== "admin") {
          console.log("Role is not admin, redirecting to login");
          router.replace("/login");
          return;
        }
        
        console.log("Admin authenticated, loading dashboard");
        setIsAuthChecked(true);
      } catch (err: any) {
        console.error("Admin auth error:", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    
    const fetchData = async () => {
      try {
        const [statsRes, attemptsRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/attempts"),
        ]);

        const statsData = statsRes.data;
        const attemptsData = attemptsRes.data;

        // Handle response - can be array or error object
        const attemptsArray = Array.isArray(attemptsData) ? attemptsData : [];
        
        setStats(statsData);
        setRecentAttempts(attemptsArray.slice(0, 5));
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err?.response?.data?.message || err?.message || "Load Failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthChecked]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-red-50 border border-red-200 p-6 rounded-lg">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Tests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTests}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                📝
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Attempts</h2>
            <a href="/admin-dashboard/attempts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </a>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No attempts yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Test</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt._id} className="text-sm">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">{attempt.userId?.name || "N/A"}</p>
                          <p className="text-gray-500 text-xs">{attempt.userId?.email || "N/A"}</p>
                        </div>
                      </td>
                      <td className="py-4 text-gray-700">{attempt.testId?.title || "N/A"}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {attempt.score}/{attempt.totalMarks}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500">
                        {new Date(attempt.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
