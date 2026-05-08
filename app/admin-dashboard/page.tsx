"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Users, 
  FileText, 
  CreditCard,
  PlusCircle,
  Upload,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, totalTests: 0, unpaidCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role || "student").toString().toLowerCase();
        if (role !== "admin") {
          router.replace("/admin-login");
          return;
        }
        setIsAuthChecked(true);
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    const fetchData = async () => {
      try {
        const { data } = await API.get("/admin/stats");
        // For unpaid count, we'll use a placeholder or check if API provides it
        // If not provided, we might need a separate endpoint or default to 0 for now
        setStats({ 
          totalUsers: data.totalUsers || 0, 
          totalTests: data.totalTests || 0,
          unpaidCount: data.unpaidCount || 0 
        });
      } catch (err) {
        console.error("Dashboard stats load failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthChecked]);

  if (!isAuthChecked || loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Dashboard" 
        path={[]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* WELCOME SECTION */}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, Admin!</h2>
          <p className="text-sm text-gray-500">Here's an overview of your platform performance.</p>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all cursor-default">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Joined Students</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-green-200 transition-all cursor-default">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Papers Uploaded</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.totalTests.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-orange-200 transition-all cursor-default">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unpaid Items</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.unpaidCount.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button 
              onClick={() => router.push("/admin-dashboard/tests?type=paid")}
              className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">Create Paid Quizzes</p>
                  <p className="text-[10px] text-gray-400">Add premium assessment assets</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => router.push("/admin-dashboard/tests?type=free")}
              className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-green-600 hover:shadow-lg transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">Create Unpaid Quizzes</p>
                  <p className="text-[10px] text-gray-400">Add foundational assets</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-200 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => router.push("/admin-dashboard/tests?upload=pdf")}
              className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-purple-600 hover:shadow-lg transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">Upload Papers/PDFs</p>
                  <p className="text-[10px] text-gray-400">Direct file synchronization</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-200 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
