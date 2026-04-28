"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  User,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Zap,
  ArrowUpRight
} from "lucide-react";

interface Attempt {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  testId: {
    _id: string;
    title: string;
  };
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  submittedAt: string;
}

export default function AttemptsPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [testFilter, setTestFilter] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        if (role !== "admin") {
          router.replace("/admin-login");
        }
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { data } = await API.get("/admin/attempts");
        setAttempts(data);
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const uniqueTests = [...new Set(attempts.map((a) => a.testId?._id))].filter(Boolean);

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = 
      attempt.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      attempt.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      attempt.testId?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesTest = testFilter === "all" || attempt.testId?._id === testFilter;
    return matchesSearch && matchesTest;
  });

  const getPercentage = (score: number, total: number) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  if (loading && attempts.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic">
        Accessing Institutional Performance Flow...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <AdminHeader 
        title="Intelligence Flow Telemetry" 
        path={[{ label: "Governance" }, { label: "Performance Matrix" }]} 
      />

      <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
         
         {/* PERFORMANCE HUD */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
            <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-all duration-500">
               <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/30"><Activity size={24} /></div>
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic">Grid Throughput</span>
               </div>
               <div className="space-y-1">
                  <h4 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{attempts.length}</h4>
                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">Total Sync Cycles Recorded</p>
               </div>
            </div>

            <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-all duration-500">
               <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center border border-green-100 dark:border-green-800/30"><CheckCircle2 size={24} /></div>
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic">Registry Accuracy</span>
               </div>
               <div className="space-y-1">
                  <h4 className="text-4xl font-black text-green-600 dark:text-green-400 uppercase italic tracking-tighter leading-none">
                    {attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + getPercentage(a.score, a.totalMarks), 0) / attempts.length) : 0}%
                  </h4>
                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">Mean Scholar Efficiency Node</p>
               </div>
            </div>

            <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-all duration-500">
               <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-800/30"><Zap size={24} /></div>
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic">Peak Intensity</span>
               </div>
               <div className="space-y-1">
                  <h4 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    {attempts.length > 0 ? Math.max(...attempts.map(a => getPercentage(a.score, a.totalMarks))) : 0}%
                  </h4>
                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">Maximum Recorded Intelligence Commits</p>
               </div>
            </div>

            <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-all duration-500">
               <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30"><BarChart3 size={24} /></div>
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic">Matrix Coverage</span>
               </div>
               <div className="space-y-1">
                  <h4 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{uniqueTests.length}</h4>
                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">Active Intelligence Clusters Tracked</p>
               </div>
            </div>
         </div>

         {/* SEARCH & FILTERS */}
         <div className="flex flex-col xl:flex-row items-center gap-8 bg-white/50 dark:bg-[#0a0f29]/50 p-6 rounded-[4rem] border border-gray-100 dark:border-gray-800 backdrop-blur-3xl shadow-sm transition-all duration-500">
            <div className="flex-1 relative group w-full">
               <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within:text-blue-600 transition-all duration-500" size={24} />
               <input
                 type="text"
                 placeholder="Synchronize Search (Candidate Identity, Email, Assessment Title)..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-24 pr-12 py-8 bg-white dark:bg-[#050816] border-2 border-gray-50 dark:border-gray-800 rounded-[3rem] shadow-sm focus:border-blue-600 transition-all outline-none text-md font-black text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-900 italic tracking-tight"
               />
            </div>
            <div className="flex items-center gap-8 bg-white dark:bg-[#050816] px-10 py-6 rounded-[3rem] border-2 border-gray-50 dark:border-gray-800 shadow-sm w-full xl:w-auto relative group">
               <div className="w-12 h-12 bg-gray-50 dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-700 shadow-sm"><Filter size={22} /></div>
               <div className="flex-1 min-w-[280px]">
                  <select
                    value={testFilter}
                    onChange={(e) => setTestFilter(e.target.value)}
                    className="w-full bg-transparent text-[11px] font-black uppercase tracking-widest outline-none pr-12 cursor-pointer text-gray-900 dark:text-white italic appearance-none leading-none"
                  >
                    <option value="all">ALL INTELLIGENCE CLUSTERS</option>
                    {uniqueTests.map((testId) => {
                      const test = attempts.find((a) => a.testId?._id === testId);
                      return <option key={testId} value={testId}>{test?.testId?.title.toUpperCase()}</option>;
                    })}
                  </select>
               </div>
               <ChevronRight size={18} className="absolute right-10 rotate-90 text-gray-300 dark:text-gray-800 group-hover:text-blue-600 transition-colors" />
            </div>
         </div>

         {/* ATTEMPTS TABLE */}
         <section className="bg-white dark:bg-[#0a0f29] rounded-[4.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-500">
            <div className="px-16 py-12 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-10 bg-gray-50/30 dark:bg-[#050816]/30">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-6 italic leading-none">
                     <Activity size={28} className="text-blue-600 dark:text-blue-400" />
                     Live Activity Matrix
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] italic leading-none">Real-time Performance Node Synchronization</p>
               </div>
               <div className="flex items-center gap-8 bg-white dark:bg-gray-800 px-10 py-5 rounded-3xl border border-gray-100 dark:border-gray-700 transition-all duration-500 shadow-sm">
                  <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic leading-none">Total Registry Cycles:</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400 italic leading-none tabular-nums">{filteredAttempts.length}</span>
               </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50 dark:bg-[#050816]/50">
                        <th className="px-16 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Candidate Entity Identity</th>
                        <th className="px-16 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Intelligence Cluster Node</th>
                        <th className="px-16 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic text-center">Score Vector</th>
                        <th className="px-16 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic text-center">Commit Efficiency</th>
                        <th className="px-16 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic text-right">Commit Timestamp</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                     {filteredAttempts.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-16 py-40 text-center text-gray-200 dark:text-gray-900 font-black uppercase tracking-[0.5em] italic text-sm">No institutional commits detected in current buffer matrix.</td>
                       </tr>
                     ) : (
                       filteredAttempts.map((attempt) => {
                         const percentage = getPercentage(attempt.score, attempt.totalMarks);
                         return (
                           <tr key={attempt._id} className="group hover:bg-gray-50/50 dark:hover:bg-[#050816]/50 transition-all duration-700 cursor-pointer">
                              <td className="px-16 py-12">
                                 <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-800 rounded-[1.5rem] flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 shadow-inner group-hover:rotate-6">
                                       {attempt.userId?.name?.[0].toUpperCase() || "A"}
                                    </div>
                                    <div className="space-y-2">
                                       <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter italic group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none">{attempt.userId?.name || "Anonymous Scholar Entity"}</p>
                                       <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black leading-none lowercase italic tracking-widest">{attempt.userId?.email || "Restricted Protocol Uplink"}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-16 py-12">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-700 border border-blue-100 dark:border-blue-800/30">
                                       <FileText size={22} />
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight italic leading-none block">{attempt.testId?.title}</span>
                                       <span className="text-[9px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none">NODE-ID: {attempt.testId?._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-16 py-12 text-center">
                                 <div className="inline-flex flex-col items-center gap-3">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none tabular-nums italic">{attempt.score}<span className="text-gray-100 dark:text-gray-900 mx-3 text-lg">/</span>{attempt.totalMarks}</p>
                                    <div className="flex gap-3">
                                       <p className="text-[10px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest italic bg-green-50 dark:bg-green-900/20 px-4 py-1.5 rounded-full border border-green-100 dark:border-green-800/30">+{attempt.correctAnswers} CR</p>
                                       <p className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest italic bg-red-50 dark:bg-red-900/20 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-800/30">-{attempt.wrongAnswers} ER</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-16 py-12 text-center">
                                 <div className="flex flex-col items-center gap-3">
                                    <div className={`px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest border-2 transition-all duration-700 italic shadow-sm ${
                                      percentage >= 60 ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30"
                                    }`}>
                                      {percentage}% Efficiency
                                    </div>
                                    <div className="w-24 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                       <div className={`h-full transition-all duration-1000 ${percentage >= 60 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${percentage}%` }} />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-16 py-12 text-right">
                                 <div className="flex flex-col items-end gap-3">
                                    <div className="flex items-center gap-4 text-[12px] text-gray-900 dark:text-white font-black uppercase tracking-widest italic bg-gray-50 dark:bg-[#050816] px-6 py-3 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-sm">
                                       <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                                       {new Date(attempt.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-gray-300 dark:text-gray-800 font-black uppercase tracking-[0.3em] italic pr-4">
                                       <Clock size={16} />
                                       {new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                 </div>
                              </td>
                           </tr>
                         );
                       })
                     )}
                  </tbody>
               </table>
            </div>
         </section>

         <div className="flex items-center justify-center gap-10 text-gray-100 dark:text-gray-900 italic font-black uppercase tracking-[0.8em] text-[12px] pt-12 pb-12">
            <div className="w-32 h-px bg-gray-50 dark:bg-gray-900" />
            Governance Telemetry V4.5.1 // GRID ACTIVE
            <div className="w-32 h-px bg-gray-50 dark:bg-gray-900" />
         </div>

      </div>
    </div>
  );
}
