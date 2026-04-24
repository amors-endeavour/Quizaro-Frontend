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

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black animate-pulse text-cyan-400 uppercase tracking-widest leading-none text-center">Syncing Resource Files...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-white">
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

      <div className="p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
         
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Institutional Dashboard</h2>
            <button 
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg"
            >
               Go to Institutional Home
            </button>
         </div>

         {/* PERFORMANCE HUD (BIFURCATED) */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(activeTab === 'intelligence' ? [
              { label: "Total Papers", val: stats.totalTests, icon: <FileText size={24} />, color: "blue" },
              { label: "Published", val: stats.publishedTests, icon: <CheckCircle2 size={24} />, color: "green" },
              { label: "Draft Papers", val: stats.draftTests, icon: <Activity size={24} />, color: "purple" },
              { label: "Scheduled", val: 0, icon: <Clock size={24} />, color: "orange" }
            ] : [
              { label: "Students", val: stats.totalUsers, icon: <Users size={24} />, color: "blue" },
              { label: "Total Revenue", val: `₹${stats.revenue}`, icon: <TrendingUp size={24} />, color: "green" },
              { label: "Profit", val: `₹${stats.profit}`, icon: <BarChart3 size={24} />, color: "purple" },
              { label: "Average Score", val: `${stats.avgScore || 0}%`, icon: <Activity size={24} />, color: "orange" }
            ]).map((stat, idx) => (
               <div 
                key={stat.label} 
                className={`bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col justify-between group hover:border-cyan-400/30 transition-all duration-500 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5`}
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

          {activeTab === 'analysis' ? (
             <>
               {/* ANALYTICS GRID */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <section className="lg:col-span-2 bg-white/5 rounded-[3.5rem] border border-white/10 shadow-2xl p-12 space-y-10 group overflow-hidden relative backdrop-blur-md">
                     <div className="flex items-center justify-between relative z-10">
                        <div>
                           <h3 className="text-lg font-black text-white uppercase tracking-tight">Enrollment Velocity</h3>
                           <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Real-time enrollment tracking for last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
                           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                           <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Live Pulse</span>
                        </div>
                     </div>
                     <div className="h-72 w-full relative pt-10 px-2 box-border opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        {/* CHART PLACEHOLDER */}
                        <div className="absolute inset-0 flex items-center justify-center italic text-gray-700 font-black uppercase text-[10px] tracking-[0.5em]">Processing Data...</div>
                     </div>
                  </section>

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
                                <p className="text-[10px] text-gray-500 font-bold mt-1 line-clamp-1">Accessed {attempt.testId?.title}</p>
                                <div className="mt-2 flex items-center gap-2">
                                   <span className="bg-cyan-500/10 text-cyan-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-cyan-400/10">Verification Success</span>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </section>
               </div>

               {/* COMPREHENSIVE RECORDS TAB */}
               <section className="bg-white/5 rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
                  <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-600/10 text-cyan-400 border border-cyan-400/20 rounded-2xl shadow-sm"><BarChart3 size={20} /></div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">Question History</h3>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Detailed student interaction logs</p>
                        </div>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                         <thead>
                           <tr className="bg-white/5">
                              <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Student</th>
                              <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Paper Access</th>
                              <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Origin/Creator</th>
                              <th className="px-12 py-6 text-right pr-20 text-[10px] font-black uppercase tracking-widest text-gray-500">Timestamp</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {filteredAttempts.length === 0 ? (
                             <tr><td colSpan={4} className="px-12 py-24 text-center opacity-30 italic font-black uppercase text-[10px] tracking-widest">Awaiting access telemetry...</td></tr>
                           ) : (
                             filteredAttempts.map((attempt) => (
                                <tr key={attempt._id} className="group hover:bg-white/5 transition-all">
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
                                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{attempt.testId?.createdBy?.name || "Institutional Core"}</span>
                                   </td>
                                   <td className="px-12 py-8 text-right pr-20">
                                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                                   </td>
                                </tr>
                             ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </section>
             </>
          ) : (
             /* BIFURCATED PAPERS HUB 🔥 */
             <div className="space-y-16">
                {/* PAID PAPERS SECTION */}
                <section className="space-y-8">
                   <div className="flex items-center gap-4 px-4">
                      <div className="w-10 h-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-950/10">
                         <BarChart3 size={20} />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Premium Paid Papers</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {paidPapers.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">No Premium Papers Synthesized</p>
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
                            onDelete={() => console.log("Delete triggered from dashboard")}
                          />
                        ))
                      )}
                   </div>
                </section>

                {/* FREE PAPERS SECTION */}
                <section className="space-y-8">
                   <div className="flex items-center gap-4 px-4">
                      <div className="w-10 h-10 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-950/10">
                         <CheckCircle2 size={20} />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Institutional Free Papers</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {freePapers.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">No Free Papers Synthesized</p>
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
                            onDelete={() => console.log("Delete triggered from dashboard")}
                          />
                        ))
                      )}
                   </div>
                </section>
             </div>
          )}
      </div>

      {/* NEURAL FILTER OVERLAY 🔥 */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-[#050816]/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
           <div className="relative w-96 h-full bg-[#0b0f2a] border-l border-white/10 shadow-2xl p-10 space-y-10 animate-in slide-in-from-right-10 duration-500 overflow-y-auto">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Cognitive Filters</h3>
                 <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-white transition">
                    <Plus className="rotate-45" size={24} />
                 </button>
              </div>
              <div className="space-y-8">
                 {[
                   { label: "Performance Grades", options: ["High Proficiency (>80%)", "Standard Pass (>50%)", "Deficiency (<30%)"] },
                   { label: "Temporal Constraints", options: ["Last 24 Hours", "Critical Week", "Historical Archive"] },
                   { label: "Subject Context", options: ["Mathematics Core", "Scientific Theory", "Logic Engine"] }
                 ].map(group => (
                   <div key={group.label} className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/50">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                         {group.options.map(opt => (
                           <button 
                             key={opt}
                             onClick={() => setActiveFilters(prev => prev.includes(opt) ? prev.filter(f => f !== opt) : [...prev, opt])}
                             className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${activeFilters.includes(opt) ? "bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"}`}
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
