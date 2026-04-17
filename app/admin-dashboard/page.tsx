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

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black animate-pulse text-cyan-400 uppercase tracking-widest leading-none text-center">Accessing Institutional <br/> Intelligence Grid...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-white">
      <AdminHeader 
        title="Institutional Intelligence" 
        path={[{ label: "Intelligence" }, { label: "Overview" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
         
         {/* PERFORMANCE HUD (IMAGE #1 ANALYTICS STYLE) */}
         <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Active Cohort", val: stats.totalUsers, icon: <Users size={24} />, color: "blue" },
              { label: "Paper Catalog", val: stats.totalTests, icon: <FileText size={24} />, color: "green" },
              { label: "Global Submissions", val: stats.totalAttempts, icon: <Activity size={24} />, color: "purple" },
              { label: "Average Velocity", val: "84%", icon: <TrendingUp size={24} />, color: "orange" }
            ].map((stat, idx) => (
               <div 
                key={stat.label} 
                className={`bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col justify-between group hover:border-cyan-400/30 transition-all duration-500 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 delay-[${idx * 100}ms]`}
              >
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ${
                   stat.color === "blue" ? "bg-blue-600/10 text-blue-400 border border-blue-400/20 shadow-blue-900/10" : 
                   stat.color === "green" ? "bg-cyan-600/10 text-cyan-400 border border-cyan-400/20 shadow-cyan-900/10" :
                   stat.color === "purple" ? "bg-purple-600/10 text-purple-400 border border-purple-400/20 shadow-purple-900/10" : "bg-orange-600/10 text-orange-400 border border-orange-400/20 shadow-orange-900/10"
                 }`}>
                    {stat.icon}
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white leading-none tracking-tighter">{stat.val}</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-3">{stat.label}</p>
                 </div>
              </div>
            ))}
         </section>

         {/* ANALYTICS GRID */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
             {/* PERFORMANCE VELOCITY (CUSTOM SVG CHART) */}
            <section className="lg:col-span-2 bg-white/5 rounded-[3.5rem] border border-white/10 shadow-2xl p-12 space-y-10 group overflow-hidden relative backdrop-blur-md">
               <div className="flex items-center justify-between relative z-10">
                  <div>
                     <h3 className="text-lg font-black text-white uppercase tracking-tight">Institutional Velocity</h3>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Real-time enrollment tracking for last 7 days</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
                     <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                     <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Live Pulse</span>
                  </div>
               </div>

               <div className="h-72 w-full relative pt-10 px-2 box-border">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                     <defs>
                        <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                           <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     <path 
                       d="M 0 200 Q 150 140 300 180 Q 450 80 600 120 Q 750 40 900 60 L 1000 60 L 1000 300 L 0 300 Z" 
                       fill="url(#velocityGrad)"
                     />
                     <path 
                       d="M 0 200 Q 150 140 300 180 Q 450 80 600 120 Q 750 40 900 60 L 1000 60" 
                       fill="none" 
                       stroke="#06b6d4" 
                       strokeWidth="6" 
                       strokeLinecap="round" 
                       className="animate-in fade-in duration-1000 transition-all drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                     />
                     {[0, 300, 600, 900].map((x, i) => (
                        <circle key={x} cx={x} cy={[200, 180, 120, 60][i]} r="6" fill="white" stroke="#06b6d4" strokeWidth="4" />
                     ))}
                  </svg>
                  <div className="flex justify-between mt-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                     {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}
                  </div>
               </div>
            </section>

            {/* SYSTEM PULSE (REAL-TIME FEED) */}
            <section className="bg-white/5 rounded-[3.5rem] border border-white/10 shadow-2xl p-10 flex flex-col group backdrop-blur-md">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">System Pulse</h3>
                  <Activity size={18} className="text-cyan-400 shadow-cyan-400" />
               </div>
               
               <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
                  {recentAttempts.slice(0, 5).map((attempt, i) => (
                    <div key={attempt._id} className="flex gap-4 group/item">
                       <div className="relative">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${i === 0 ? "bg-cyan-600 text-white" : "bg-white/5 border border-white/5 text-gray-500 group-hover/item:text-cyan-400 group-hover/item:border-cyan-400/20"}`}>
                             {attempt.userId?.name?.charAt(0)}
                          </div>
                          {i < 4 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white/5" />}
                       </div>
                       <div className="flex flex-col flex-1 pb-4">
                          <div className="flex items-center justify-between">
                             <span className="text-[11px] font-black text-white uppercase">{attempt.userId?.name}</span>
                             <span className="text-[9px] font-bold text-gray-600 uppercase">Just Now</span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold mt-1 line-clamp-1">Finished {attempt.testId?.title}</p>
                           <div className="mt-2 flex items-center gap-2">
                             <span className="bg-cyan-500/10 text-cyan-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-cyan-400/10">Success</span>
                             <span className="text-[9px] font-black text-white/50 tracking-tighter"><b className="text-white font-black">{attempt.score}/{attempt.totalMarks}</b> Points</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               
               <button onClick={() => router.push("/admin-dashboard/attempts")} className="w-full py-4 mt-6 bg-white/5 text-gray-500 hover:bg-cyan-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                  Access History Registry
               </button>
            </section>
         </div>

          {/* COMPREHENSIVE RECORDS TAB (IMAGE #1 LIST STYLE) */}
         <section className="bg-white/5 rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-600/10 text-cyan-400 border border-cyan-400/20 rounded-2xl shadow-sm"><BarChart3 size={20} /></div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Institutional Records</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Comprehensive activity tracking</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <span className="bg-white/5 text-gray-500 border border-white/10 text-[9px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full">Archive Grid</span>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                   <thead>
                     <tr className="bg-white/5">
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Student Identity</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Subject Context</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Grade Performance</th>
                        <th className="px-12 py-6 text-right pr-20 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {recentAttempts.length === 0 ? (
                       <tr>
                         <td colSpan={4} className="px-12 py-24 text-center">
                            <div className="flex flex-col items-center gap-4 py-10 opacity-30">
                               <Activity size={48} className="text-gray-400 animate-pulse" />
                               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Awaiting Submissions...</p>
                            </div>
                         </td>
                       </tr>
                     ) : (
                       recentAttempts.map((attempt) => (
                          <tr key={attempt._id} className="group hover:bg-white/5 transition-all cursor-pointer">
                             <td className="px-12 py-8">
                                <div className="flex items-center gap-5">
                                   <div className="w-11 h-11 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center font-black text-xs text-gray-500 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
                                      {attempt.userId?.name?.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black text-white uppercase tracking-tight">{attempt.userId?.name}</p>
                                      <p className="text-[9px] text-gray-500 font-bold mt-1 lowercase">{attempt.userId?.email}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-12 py-8">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{attempt.testId?.title}</span>
                             </td>
                             <td className="px-12 py-8">
                                <div className="flex items-center gap-3">
                                   <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                                        style={{ width: `${(attempt.score / (attempt.totalMarks || 100)) * 100}%` }} 
                                      />
                                   </div>
                                   <span className="text-[11px] font-black text-white tracking-tighter">{attempt.score}<span className="text-gray-600 ml-1">/ {attempt.totalMarks}</span></span>
                                </div>
                             </td>
                             <td className="px-12 py-8 text-right pr-20">
                                <button 
                                  onClick={() => router.push(`/admin-dashboard/attempts`)}
                                  className="px-6 py-2 bg-white/5 border border-white/10 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm"
                                >
                                  Open Analysis
                                </button>
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
