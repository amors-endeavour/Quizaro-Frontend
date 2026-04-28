"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminTestCard from "@/components/AdminTestCard";
import API from "@/app/lib/api";
import { 
  Users, 
  FileText, 
  Activity, 
  ChevronRight, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalTests: number;
  totalAttempts: number;
  publishedTests: number;
  draftTests: number;
  revenue: number;
  profit: number;
  avgScore?: number;
}

interface RecentAttempt {
  _id: string;
  userId: { name: string; email: string };
  testId: { title: string; createdBy?: { name: string } };
  score: number;
  totalMarks: number;
  submittedAt: string;
}

interface Paper {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  isPublished: boolean;
  createdAt: string;
  createdBy?: { name: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ 
    totalUsers: 0, totalTests: 0, totalAttempts: 0, 
    publishedTests: 0, draftTests: 0, revenue: 0, profit: 0 
  });
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'analysis'>('intelligence');
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Split papers into Paid and Free
  const paidPapers = papers.filter(p => p.price && p.price > 0);
  const freePapers = papers.filter(p => !p.price || p.price === 0);

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
        const [statsRes, revenueRes, attemptsRes, papersRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/revenue"),
          API.get("/admin/attempts/recent"),
          API.get("/admin/tests")
        ]);
        setStats({ ...statsRes.data, ...revenueRes.data });
        setRecentAttempts(attemptsRes.data);
        setPapers(papersRes.data);
      } catch (err) {
        console.error("Dashboard data load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthChecked]);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredAttempts(recentAttempts);
      return;
    }
    const filtered = recentAttempts.filter(a => 
      a.userId?.name?.toLowerCase().includes(q) || 
      a.userId?.email?.toLowerCase().includes(q) || 
      a.testId?.title?.toLowerCase().includes(q)
    );
    setFilteredAttempts(filtered);
  }, [searchQuery, recentAttempts]);

  const handleStatusToggle = async (id: string, newStatus: string) => {
    try {
      setPapers(papers.map(p => p._id === id ? { ...p, isPublished: newStatus === "Published" } : p));
      await API.put(`/admin/test/${id}`, { status: newStatus });
    } catch {
      console.error("Status update failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-bold animate-pulse text-blue-600 uppercase tracking-widest text-[10px]">
        Synchronizing Data Ecosystem...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] text-gray-900">
      <AdminHeader 
        title="Overview" 
        path={[{ label: "Overview" }]} 
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'intelligence' | 'analysis')}
        onNew={() => router.push("/admin-dashboard/tests")}
        onSettings={() => router.push("/admin-dashboard/settings")}
        onFilter={() => setIsFilterOpen(!isFilterOpen)}
        onSearchChange={setSearchQuery}
      />

      <div className="p-8 lg:p-12 max-w-[1700px] mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
         
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Institutional Performance</h2>
            <button 
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
            >
               Return to Landing
            </button>
         </div>

         {/* PERFORMANCE HUD */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(activeTab === 'intelligence' ? [
              { label: "Total Papers", val: stats.totalTests, icon: <FileText size={24} />, color: "blue" },
              { label: "Published", val: stats.publishedTests, icon: <CheckCircle2 size={24} />, color: "green" },
              { label: "Draft Papers", val: stats.draftTests, icon: <Activity size={24} />, color: "purple" },
              { label: "Active Cohorts", val: stats.totalUsers, icon: <Users size={24} />, color: "orange" }
            ] : [
              { label: "Students", val: stats.totalUsers, icon: <Users size={24} />, color: "blue" },
              { label: "Total Revenue", val: `₹${stats.revenue}`, icon: <TrendingUp size={24} />, color: "green" },
              { label: "Profit", val: `₹${stats.profit}`, icon: <BarChart3 size={24} />, color: "purple" },
              { label: "Global Average", val: `${stats.avgScore || 0}%`, icon: <Activity size={24} />, color: "orange" }
            ]).map((stat) => (
               <div 
                key={stat.label} 
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all duration-300"
              >
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                   stat.color === "blue" ? "bg-blue-50 text-blue-600" : 
                   stat.color === "green" ? "bg-green-50 text-green-600" :
                   stat.color === "purple" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
                 }`}>
                    {stat.icon}
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-gray-900 leading-none tracking-tight">{stat.val}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">{stat.label}</p>
                 </div>
              </div>
            ))}
          </section>

          {activeTab === 'analysis' ? (
             <>
               <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BarChart3 size={20} /></div>
                        <div>
                          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Recent Engagement telemetry</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Detailed student interaction logs</p>
                        </div>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                          <thead>
                           <tr className="bg-gray-50/50">
                              <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Student</th>
                              <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Assessment</th>
                              <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin</th>
                              <th className="px-10 py-5 text-right pr-20 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {filteredAttempts.length === 0 ? (
                             <tr><td colSpan={4} className="px-10 py-20 text-center text-gray-300 italic font-bold uppercase text-[10px] tracking-widest">Awaiting access telemetry...</td></tr>
                           ) : (
                             filteredAttempts.map((attempt) => (
                                <tr key={attempt._id} className="group hover:bg-gray-50/50 transition-all">
                                   <td className="px-10 py-6">
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center font-bold text-xs text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            {attempt.userId?.name?.charAt(0)}
                                         </div>
                                         <div>
                                            <p className="text-[11px] font-bold text-gray-900 uppercase">{attempt.userId?.name}</p>
                                            <p className="text-[9px] text-gray-400 mt-1">{attempt.userId?.email}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-10 py-6">
                                      <span className="text-[11px] font-bold text-gray-600 uppercase">{attempt.testId?.title}</span>
                                   </td>
                                   <td className="px-10 py-6">
                                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{attempt.testId?.createdBy?.name || "System Core"}</span>
                                   </td>
                                   <td className="px-10 py-6 text-right pr-20">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                                   </td>
                                </tr>
                             ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </section>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <section className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-8 relative overflow-hidden">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Growth Velocity</h3>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Institutional scale analytics</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                           <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                           <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Active Sync</span>
                        </div>
                     </div>
                     <div className="h-64 w-full relative">
                        <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                           <defs>
                              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                 <stop offset="0%" stopColor="#2563eb" stopOpacity="0.1" />
                                 <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                              </linearGradient>
                           </defs>
                           <path d="M 0 250 Q 150 200 300 220 T 500 150 T 750 180 T 1000 50 L 1000 300 L 0 300 Z" fill="url(#blueGrad)" />
                           <path d="M 0 250 Q 150 200 300 220 T 500 150 T 750 180 T 1000 50" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                     </div>
                  </section>

                  <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Live Activity</h3>
                        <Activity size={18} className="text-blue-600" />
                     </div>
                     <div className="flex-1 space-y-6">
                        {recentAttempts.slice(0, 6).map((attempt, i) => (
                           <div key={attempt._id} className="flex gap-4">
                              <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">
                                 {attempt.userId?.name?.charAt(0)}
                              </div>
                              <div className="flex flex-col flex-1">
                                 <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-900 uppercase">{attempt.userId?.name}</span>
                                    <span className="text-[9px] font-bold text-green-600 uppercase">Live</span>
                                 </div>
                                 <p className="text-[10px] text-gray-400 font-bold mt-0.5 truncate">Completed {attempt.testId?.title}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>
             </>
          ) : (
             <div className="space-y-12">
                <section className="space-y-6">
                   <div className="flex items-center gap-4 px-2">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                         <BarChart3 size={20} />
                      </div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Premium Assets</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {paidPapers.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Premium Assets Detected</p>
                        </div>
                      ) : (
                        paidPapers.map((paper) => (
                          <AdminTestCard 
                            key={paper._id}
                            title={paper.title}
                            description={paper.description}
                            date={new Date(paper.createdAt).toLocaleDateString()}
                            status={paper.isPublished ? "Published" : "Draft"}
                            onStatusToggle={(ns) => handleStatusToggle(paper._id, ns)}
                            onEdit={() => router.push(`/admin-dashboard/tests`)}
                            onQuestions={() => router.push(`/admin-dashboard/${paper._id}`)}
                            onDelete={() => console.log("Delete triggered")}
                          />
                        ))
                      )}
                   </div>
                </section>

                <section className="space-y-6">
                   <div className="flex items-center gap-4 px-2">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                         <CheckCircle2 size={20} />
                      </div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Standard Assets</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {freePapers.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Standard Assets Detected</p>
                        </div>
                      ) : (
                        freePapers.map((paper) => (
                          <AdminTestCard 
                            key={paper._id}
                            title={paper.title}
                            description={paper.description}
                            date={new Date(paper.createdAt).toLocaleDateString()}
                            status={paper.isPublished ? "Published" : "Draft"}
                            onStatusToggle={(ns) => handleStatusToggle(paper._id, ns)}
                            onEdit={() => router.push(`/admin-dashboard/tests`)}
                            onQuestions={() => router.push(`/admin-dashboard/${paper._id}`)}
                            onDelete={() => console.log("Delete triggered")}
                          />
                        ))
                      )}
                   </div>
                </section>
             </div>
          )}
      </div>

      {/* FILTER OVERLAY */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[250] flex justify-end animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
           <div className="relative w-96 h-full bg-white border-l border-gray-100 shadow-2xl p-10 space-y-10 animate-in slide-in-from-right-8 duration-500 overflow-y-auto">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">System Filters</h3>
                 <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-900 transition">
                    <Plus className="rotate-45" size={24} />
                 </button>
              </div>
              <div className="space-y-8">
                 {[
                   { label: "Performance Grades", options: ["High (>80%)", "Standard (>50%)", "Critical (<30%)"] },
                   { label: "Temporal Constraints", options: ["24 Hours", "7 Days", "30 Days"] },
                   { label: "Asset Type", options: ["MCQ Set", "Theory Manual", "Interactive Session"] }
                 ].map(group => (
                   <div key={group.label} className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                         {group.options.map(opt => (
                           <button 
                             key={opt}
                             onClick={() => setActiveFilters(prev => prev.includes(opt) ? prev.filter(f => f !== opt) : [...prev, opt])}
                             className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${activeFilters.includes(opt) ? "bg-blue-600 border-blue-600 text-white shadow-sm" : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"}`}
                           >
                             {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
