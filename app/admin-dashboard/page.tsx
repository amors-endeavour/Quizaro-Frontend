"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Users, 
  FileText, 
  Activity, 
  ChevronRight, 
  TrendingUp, 
  BarChart3,
  PieChart
} from "lucide-react";

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

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalTests: 0, totalAttempts: 0 });
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toString().toLowerCase();
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
        const [statsRes, attemptsRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/attempts/recent"),
        ]);
        setStats(statsRes.data);
        setRecentAttempts(attemptsRes.data);
      } catch (err) {
        console.error("Dashboard data load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthChecked]);

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Accessing Console...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader 
        title="Institutional Insights" 
        path={[{ label: "Console" }, { label: "Overview" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1600px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
         
         {/* DASHBOARD STATS (IMAGE #1 Style) */}
         <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-50 mb-8 transition-transform group-hover:rotate-12">
                 <Users size={28} />
               </div>
               <div>
                  <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{stats.totalUsers}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Total Registered Users</p>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
               <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-50 mb-8 transition-transform group-hover:rotate-12">
                 <FileText size={28} />
               </div>
               <div>
                  <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{stats.totalTests}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Live Test Series</p>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
               <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-50 mb-8 transition-transform group-hover:rotate-12">
                 <TrendingUp size={28} />
               </div>
               <div>
                  <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{stats.totalAttempts}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Exams Attempted</p>
               </div>
            </div>
         </section>

         {/* RECENT ACTIVITY TABLE */}
         <section className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 overflow-hidden">
            <div className="px-12 py-10 border-b border-gray-50 flex items-center justify-between">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={18} />
                  Live Activity Flow
               </h3>
               <button onClick={() => router.push("/admin-dashboard/attempts")} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All Records</button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50">
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Identity</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Exam Subject</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Performance Score</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right pr-16">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {recentAttempts.length === 0 ? (
                       <tr>
                         <td colSpan={4} className="px-12 py-20 text-center text-gray-400 font-bold italic">No examination records detected in this cycle.</td>
                       </tr>
                     ) : (
                       recentAttempts.map((attempt) => (
                         <tr key={attempt._id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                            <td className="px-12 py-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-xs text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">{attempt.userId?.name?.charAt(0)}</div>
                                  <div>
                                     <p className="text-xs font-black text-gray-900 uppercase">{attempt.userId?.name}</p>
                                     <p className="text-[10px] text-gray-400 font-bold mt-1">{attempt.userId?.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-12 py-8">
                               <span className="text-xs font-bold text-gray-600 uppercase">{attempt.testId?.title}</span>
                            </td>
                            <td className="px-12 py-8">
                               <p className="text-xs font-black text-gray-900">{attempt.score}<span className="text-gray-300 ml-1">/ {attempt.totalMarks}</span></p>
                            </td>
                            <td className="px-12 py-8 text-right pr-16">
                               <div className="flex items-center gap-2 justify-end text-green-500 font-black text-[10px] uppercase">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                  Certified
                               </div>
                            </td>
                         </tr>
                       ))
                     )}
                  </tbody>
               </table>
            </div>
         </section>

      </div>
    </div>
  );
}
