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
  AlertCircle,
  Zap,
  X
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
      await API.put(`/admin/test/publish/${id}`);
    } catch {
      console.error("Status update failed");
    }
  };

  if (loading && papers.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
      <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px]">
        Synchronizing Governance Ecosystem...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminHeader 
        title="Governance Overview" 
        path={[{ label: "Governance" }, { label: "Command Center" }]} 
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'intelligence' | 'analysis')}
        onNew={() => router.push("/admin-dashboard/tests")}
        onFilter={() => setIsFilterOpen(!isFilterOpen)}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
         
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 px-4">
            <div className="space-y-2">
               <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white italic leading-none">Institutional Mesh Performance</h2>
               <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic leading-none">Real-time governance telemetry synchronization</p>
            </div>
            <button 
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-white dark:bg-[#0a0f29] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm italic active:scale-95"
            >
               Return to Base Node
            </button>
         </div>

         {/* PERFORMANCE HUD */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {(activeTab === 'intelligence' ? [
              { label: "Total Assets", val: stats.totalTests, icon: <FileText size={28} />, color: "blue", trend: "Registry Count" },
              { label: "Operational Nodes", val: stats.publishedTests, icon: <CheckCircle2 size={28} />, color: "green", trend: "Active Assessment" },
              { label: "Staged Nodes", val: stats.draftTests, icon: <Zap size={28} />, color: "purple", trend: "Awaiting Commit" },
              { label: "Total Cohorts", val: stats.totalUsers, icon: <Users size={28} />, color: "orange", trend: "Scholar Population" }
            ] : [
              { label: "Active Scholars", val: stats.totalUsers, icon: <Users size={28} />, color: "blue", trend: "Weekly Participation" },
              { label: "Gross Credits", val: `₹${stats.revenue}`, icon: <TrendingUp size={28} />, color: "green", trend: "Portfolio Influx" },
              { label: "Net Margin", val: `₹${stats.profit}`, icon: <BarChart3 size={28} />, color: "purple", trend: "Institutional Yield" },
              { label: "Mesh Average", val: `${stats.avgScore || 0}%`, icon: <Activity size={28} />, color: "orange", trend: "Accuracy Index" }
            ]).map((stat) => (
               <div 
                key={stat.label} 
                className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between group hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden"
              >
                 <div className={`absolute -top-4 -right-4 w-24 h-24 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity ${
                    stat.color === "blue" ? "bg-blue-600" : 
                    stat.color === "green" ? "bg-green-600" :
                    stat.color === "purple" ? "bg-purple-600" : "bg-orange-600"
                 }`} />
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 shadow-sm ${
                   stat.color === "blue" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : 
                   stat.color === "green" ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" :
                   stat.color === "purple" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                 }`}>
                    {stat.icon}
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tighter italic">{stat.val}</h3>
                       <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest italic leading-none">{stat.label}</p>
                    </div>
                    <p className="text-[9px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest italic leading-none">{stat.trend}</p>
                 </div>
              </div>
            ))}
          </section>

          {activeTab === 'analysis' ? (
             <>
               <section className="bg-white dark:bg-[#0a0f29] rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-500">
                  <div className="px-12 py-10 lg:px-16 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800/30"><BarChart3 size={24} /></div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Access Telemetry Stream</h3>
                          <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic leading-none">Real-time scholar interaction synchronization</p>
                        </div>
                     </div>
                     <button onClick={() => router.push("/admin-dashboard/attempts")} className="px-6 py-3 bg-gray-50 dark:bg-[#050816] text-gray-400 dark:text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-gray-100 dark:border-gray-800">Explore Full Grid</button>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                     <table className="w-full text-left">
                          <thead>
                           <tr className="bg-gray-50/50 dark:bg-[#050816]/30">
                              <th className="px-12 lg:px-16 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 italic">Scholar Identity</th>
                              <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 italic">Target Asset</th>
                              <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 italic text-center">Neural Grade</th>
                              <th className="px-12 lg:px-16 py-8 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 italic">Commit Timestamp</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                           {filteredAttempts.length === 0 ? (
                             <tr><td colSpan={4} className="px-12 py-32 text-center text-gray-300 dark:text-gray-800 italic font-black uppercase text-[11px] tracking-widest italic">Awaiting initial engagement telemetry from mesh...</td></tr>
                           ) : (
                             filteredAttempts.slice(0, 10).map((attempt) => (
                                <tr key={attempt._id} className="group hover:bg-gray-50 dark:hover:bg-[#050816] transition-all duration-500 cursor-pointer">
                                   <td className="px-12 lg:px-16 py-10">
                                      <div className="flex items-center gap-6">
                                         <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center font-black text-lg text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500 shadow-sm italic">
                                            {attempt.userId?.name?.charAt(0)}
                                         </div>
                                         <div className="space-y-1">
                                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{attempt.userId?.name}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black lowercase italic leading-none">{attempt.userId?.email}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-12 py-10">
                                      <div className="flex items-center gap-4">
                                         <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                                         <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">{attempt.testId?.title}</span>
                                      </div>
                                   </td>
                                   <td className="px-12 py-10 text-center">
                                      <span className="text-xl font-black text-gray-900 dark:text-white italic leading-none">{((attempt.score / attempt.totalMarks) * 100).toFixed(0)}%</span>
                                   </td>
                                   <td className="px-12 lg:px-16 py-10 text-right">
                                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic">{new Date(attempt.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                   </td>
                                </tr>
                             ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </section>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <section className="lg:col-span-2 bg-white dark:bg-[#0a0f29] rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm p-14 lg:p-16 space-y-12 relative overflow-hidden transition-all duration-500">
                     <div className="flex items-center justify-between">
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Mesh Growth Velocity</h3>
                           <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic">Institutional scale telemetry</p>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 rounded-[1.5rem]">
                           <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-sm shadow-blue-500" />
                           <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Live Grid Active</span>
                        </div>
                     </div>
                     <div className="h-80 w-full relative pt-12">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
                           <defs>
                              <linearGradient id="meshGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                 <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                                 <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                              </linearGradient>
                           </defs>
                           <path d="M 0 250 Q 200 180 400 220 T 700 120 T 1000 60 L 1000 350 L 0 350 Z" fill="url(#meshGrad)" />
                           <path d="M 0 250 Q 200 180 400 220 T 700 120 T 1000 60" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" className="drop-shadow-2xl" />
                           <circle cx="1000" cy="60" r="12" fill="#2563eb" className="animate-pulse shadow-xl shadow-blue-500" />
                        </svg>
                     </div>
                  </section>

                  <section className="bg-white dark:bg-[#0a0f29] rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm p-12 flex flex-col transition-all duration-500">
                     <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                           <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Live HUD</h3>
                           <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">Scholar Participation Stream</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center"><Activity size={20} className="animate-pulse" /></div>
                     </div>
                     <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar pr-2">
                        {recentAttempts.slice(0, 10).map((attempt, i) => (
                           <div key={attempt._id} className="flex gap-6 group">
                              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center font-black text-gray-400 dark:text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm italic">
                                 {attempt.userId?.name?.charAt(0)}
                              </div>
                              <div className="flex flex-col flex-1 gap-2">
                                 <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">{attempt.userId?.name}</span>
                                    <span className="text-[8px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-800/30 italic">Active</span>
                                 </div>
                                 <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black truncate leading-none uppercase italic">Committed {attempt.testId?.title}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>
             </>
          ) : (
             <div className="space-y-20 pb-20">
                <section className="space-y-10">
                   <div className="flex items-center gap-6 px-6">
                      <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-[1.5rem] flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800/30">
                         <BarChart3 size={28} />
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Premium Assessment Assets</h3>
                         <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic leading-none">High-Value Knowledge Nodes</p>
                      </div>
                      <div className="flex-1 h-px bg-gray-50 dark:bg-gray-800 ml-4" />
                   </div>
                   
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 px-4">
                      {paidPapers.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-white dark:bg-[#0a0f29] rounded-[4rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center gap-6">
                          <FileText size={48} className="text-gray-100 dark:text-gray-800" />
                          <p className="text-[11px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic">No Premium Assets Registered In Institutional Mesh</p>
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

                <section className="space-y-10">
                   <div className="flex items-center gap-6 px-6">
                      <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-[1.5rem] flex items-center justify-center shadow-sm border border-green-100 dark:border-green-800/30">
                         <CheckCircle2 size={28} />
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Standard Assessment Assets</h3>
                         <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic leading-none">Foundational Knowledge Nodes</p>
                      </div>
                      <div className="flex-1 h-px bg-gray-50 dark:bg-gray-800 ml-4" />
                   </div>
                   
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 px-4">
                      {freePapers.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-white dark:bg-[#0a0f29] rounded-[4rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center gap-6">
                           <FileText size={48} className="text-gray-100 dark:text-gray-800" />
                          <p className="text-[11px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic">No Standard Assets Registered In Institutional Mesh</p>
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
        <div className="fixed inset-0 z-[600] flex justify-end animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/80 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
           <div className="relative w-full max-w-[450px] h-full bg-white dark:bg-[#050816] border-l border-gray-100 dark:border-gray-800 shadow-2xl p-16 space-y-16 animate-in slide-in-from-right-10 duration-700 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Governance Filters</h3>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">Refine institutional telemetry</p>
                 </div>
                 <button onClick={() => setIsFilterOpen(false)} className="w-14 h-14 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-300 hover:text-red-500 transition-all duration-500 active:scale-90">
                    <X size={28} />
                 </button>
              </div>
              <div className="space-y-16">
                 {[
                   { label: "Performance Grades", options: ["High (>80%)", "Standard (>50%)", "Critical (<30%)"] },
                   { label: "Temporal Constraints", options: ["24 Hours", "7 Days", "30 Days"] },
                   { label: "Asset Logic Type", options: ["MCQ Set", "Theory Manual", "Interactive Session"] }
                 ].map(group => (
                   <div key={group.label} className="space-y-8">
                      <div className="flex items-center gap-4">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-gray-800 italic leading-none whitespace-nowrap">{group.label}</p>
                         <div className="w-full h-px bg-gray-50 dark:bg-gray-900" />
                      </div>
                      <div className="flex flex-wrap gap-4">
                         {group.options.map(opt => (
                           <button 
                             key={opt}
                             onClick={() => setActiveFilters(prev => prev.includes(opt) ? prev.filter(f => f !== opt) : [...prev, opt])}
                             className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border italic leading-none ${activeFilters.includes(opt) ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-900/20" : "bg-white dark:bg-[#0a0f29] border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 hover:border-blue-400 dark:hover:border-blue-500/50"}`}
                           >
                             {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="pt-12 border-t border-gray-50 dark:border-gray-900">
                 <button 
                  onClick={() => setActiveFilters([])}
                  className="w-full py-7 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 italic active:scale-95"
                 >
                    Reset Governance Mesh
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
