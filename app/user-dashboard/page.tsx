"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import LeaderboardSidebar from "@/components/LeaderboardSidebar";
import { 
  Play, 
  Clock, 
  FileText, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  AlertCircle,
  Bookmark,
  Zap,
  Download,
  Search,
  BookOpen,
  History,
  Award,
  Sparkles,
  Filter,
  X,
  TrendingUp,
  BrainCircuit,
  BarChart4,
  LayoutGrid,
  Shield
} from "lucide-react";

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  totalQuestions: number;
  category?: string;
  seriesId?: string;
  paperNumber?: number;
  difficulty?: string;
  isPublished?: boolean;
}

interface PurchasedTest {
  _id: string;
  testId: Test;
  purchasedAt: string;
  expiresAt: string;
  isCompleted: boolean;
}

interface Series {
  _id: string;
  title: string;
  description: string;
  category: string;
  isFinite: boolean;
  maxPapers: number;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  category: string;
  createdAt: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [purchasedTests, setPurchasedTests] = useState<PurchasedTest[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [resourceCategory, setResourceCategory] = useState("All");
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'alert' | 'error'} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derive Stats
  const papersSubmitted = new Set(attempts.map(a => a.testId?._id)).size;
  const totalAttempts = attempts.length;
  const totalTimeSpent = Math.round(attempts.reduce((acc, a) => acc + (a.timeTaken || 0), 0) / 60); // In minutes

  useEffect(() => {
    const initDashboard = async () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        if (urlToken) {
          localStorage.setItem("token", urlToken);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      const safetyTimeout = setTimeout(() => setLoading(false), 8000);

      try {
        const { data: profile } = await API.get("/user/profile");
        const role = (profile?.role || profile?.user?.role)?.toLowerCase();
        
        if (role === "admin") {
           router.replace("/admin-dashboard");
           return;
        }

        setUser(profile?.user || profile);

        try {
          const [available, purchased, seriesList, resourceList, attemptList] = await Promise.allSettled([
            API.get("/user/tests/available"),
            API.get("/user/tests/purchased"),
            API.get("/series"),
            API.get("/user/resources"),
            API.get("/user/attempts")
          ]);

          if (available.status === 'fulfilled') setAvailableTests(available.value.data);
          if (purchased.status === 'fulfilled') setPurchasedTests(purchased.value.data);
          if (seriesList.status === 'fulfilled') setSeries(seriesList.value.data);
          if (resourceList.status === 'fulfilled') setResources(resourceList.value.data);
          if (attemptList.status === 'fulfilled') setAttempts(attemptList.value.data);
        } catch (dataErr) {
          console.error("Secondary Data Fetch Failure:", dataErr);
        }

      } catch (err) {
        console.error("Dashboard Init Error:", err);
        router.replace("/user-login");
      } finally {
        clearTimeout(safetyTimeout);
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const handleJoinSession = async (testId: string) => {
    try {
      setLoading(true);
      await API.post(`/test/purchase/${testId}`);
      window.open(`/quiz/${testId}`, '_blank');
      window.location.reload(); // Refresh to show as purchased
    } catch (err: any) {
      if (err.response?.status === 402) {
         setStatusMsg({ text: "Premium Paper: Institutional access required.", type: 'alert' });
         setTimeout(() => setStatusMsg(null), 5000);
      } else {
         setStatusMsg({ text: "Session Activation Failed.", type: 'error' });
         setTimeout(() => setStatusMsg(null), 3000);
      }
      setLoading(false);
    }
  };

  const matchesSearch = (item: any) => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(search.toLowerCase()));

  const myTests = purchasedTests.filter(pt => pt.testId && matchesSearch(pt.testId));
  const availableRegistry = availableTests.filter(t => matchesSearch(t));
  const librarySeries = series.filter(s => matchesSearch(s));
  
  const filteredResources = resources.filter(r => {
    const isMatched = matchesSearch(r);
    const categoryMatch = resourceCategory === "All" || r.category === resourceCategory;
    return isMatched && categoryMatch;
  });

  const resourceCategories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];

  if (loading && attempts.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic leading-none">
        Synchronizing Scholar Command Grid...
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-500">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={user?.name || "Scholar"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Scholar Command Terminal" 
          breadcrumbs={["Institutional Matrix", "Command Center"]} 
        />

        <div className="p-8 lg:p-14 max-w-[1700px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 px-4">
             <div className="space-y-3">
                <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900 dark:text-white italic leading-none">Scholar Intelligence Terminal</h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Real-time Neural Telemetry Synchronization</p>
             </div>
             <button 
               onClick={() => router.push("/")}
               className="px-10 py-5 bg-white dark:bg-[#0a0f29] text-gray-600 dark:text-gray-400 border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm italic active:scale-95 group"
             >
                Return to Campus Node <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          {/* PERFORMANCE HUD */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
                { label: "Submitted Assets", val: papersSubmitted, icon: <CheckCircle2 size={32} />, color: "green", trend: "Registry Node Commits", desc: "Successfully validated assessment paper nodes" },
                { label: "Global Attempts", val: totalAttempts, icon: <History size={32} />, color: "blue", trend: "Intelligence Flow Rate", desc: "Total synchronization cycles recorded in grid" },
                { label: "Neural Load Time", val: `${totalTimeSpent}m`, icon: <Clock size={32} />, color: "purple", trend: "Mastery Duration", desc: "Total focus intensity duration in active sessions" }
             ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-12 rounded-[4rem] flex flex-col justify-between group hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-700 shadow-sm relative overflow-hidden active:scale-[0.98]">
                   <div className={`absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-10 group-hover:opacity-20 transition-all duration-700 ${
                      stat.color === 'green' ? "bg-green-600" :
                      stat.color === 'blue' ? "bg-blue-600" : "bg-purple-600"
                   }`} />
                   
                   <div className="flex items-center justify-between mb-10 relative z-10">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-sm border ${
                        stat.color === 'green' ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-green-100 dark:border-green-800/30" :
                        stat.color === 'blue' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 border-blue-100 dark:border-blue-800/30" : 
                        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-500 border-purple-100 dark:border-purple-800/30"
                      }`}>
                         {stat.icon}
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none">{stat.trend}</p>
                      </div>
                   </div>

                   <div className="space-y-4 relative z-10">
                      <div className="space-y-2">
                         <h4 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none italic tabular-nums group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stat.val}</h4>
                         <p className="text-[12px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic leading-none">{stat.label}</p>
                      </div>
                      <p className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-relaxed max-w-[200px]">{stat.desc}</p>
                   </div>
                </div>
             ))}
          </section>

          {/* WELCOME & SEARCH HUD */}
          <section className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-14 lg:p-20 rounded-[5rem] shadow-sm relative overflow-hidden group transition-all duration-700">
             <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
             
             <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-center justify-between">
                <div className="space-y-6 text-center xl:text-left max-w-2xl">
                   <div className="space-y-4">
                      <h2 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                         Synchronizing, <span className="text-blue-600 dark:text-blue-500">{user?.name?.split(' ')[0] || "Scholar Entity"}</span>
                      </h2>
                      <div className="flex items-center gap-8 justify-center xl:justify-start">
                         <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#050816] px-6 py-3 rounded-full border-2 border-gray-100 dark:border-gray-800 shadow-inner">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                            <p className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] italic leading-none">Neural Mesh Optimized</p>
                         </div>
                         {search && (
                            <div className="flex items-center gap-3 px-6 py-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-full border border-blue-100 dark:border-blue-800/30">
                               <Zap size={14} className="text-blue-600 dark:text-blue-400" />
                               <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase italic tracking-widest leading-none tabular-nums">{myTests.length + availableRegistry.length} Active Nodes Located</span>
                            </div>
                         )}
                      </div>
                   </div>
                   <p className="text-[15px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-relaxed max-w-lg">Accessing global institutional assessment registry. All performance telemetry is archived in the cloud vault.</p>
                </div>
                <div className="relative w-full max-w-2xl group/search">
                   <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] blur-xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-700" />
                   <Search className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/search:text-blue-600 transition-all duration-700" size={36} />
                   <input 
                     type="text" 
                     placeholder="Synchronize Search (Tests, Manuals, Mesh Nodes)..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[3rem] pl-28 pr-16 py-10 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-[#050816] transition-all duration-700 font-black text-[22px] text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-900 italic shadow-inner relative z-10"
                   />
                </div>
             </div>
          </section>

          {/* SECTION 1: ASSESSMENT REGISTRY */}
          <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-8">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-2 border-blue-100 dark:border-blue-800/30 rounded-[1.5rem] flex items-center justify-center shadow-sm group hover:rotate-6 transition-all duration-500"><BookOpen size={32} /></div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Intelligence Registry</h3>
                      <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Global Institutional Assessment Protocol Buffer</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   {!search && <div className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-full text-[11px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] italic leading-none shadow-sm tabular-nums">{myTests.length + availableRegistry.length} Synchronized Nodes</div>}
                   <button className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm"><Filter size={20} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10">
                {/* Part A: Active & Completed Protocols */}
                {myTests.map((pt) => (
                  <div key={pt._id} className="bg-white dark:bg-[#0a0f29] p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-700 group flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-2 h-full bg-blue-600/50 group-hover:bg-blue-600 transition-all" />
                     <div className="flex items-center gap-12 flex-1 min-w-0 relative z-10">
                        <div className={`w-24 h-24 shrink-0 ${pt.isCompleted ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-2 border-green-100 dark:border-green-800/30" : "bg-blue-600 text-white shadow-2xl shadow-blue-900/40"} rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 group-hover:scale-110 group-hover:rotate-6`}>
                           {pt.isCompleted ? <CheckCircle2 size={48} /> : <FileText size={48} />}
                        </div>
                        <div className="space-y-6 flex-1 min-w-0">
                           <div className="space-y-3">
                              <h4 className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors uppercase italic tracking-tighter leading-none truncate">{pt.testId.title}</h4>
                              <p className="text-[12px] text-gray-400 dark:text-gray-600 font-black italic line-clamp-1 uppercase tracking-widest">{pt.testId.description || "Foundational institutional assessment node synchronized with latest syllabus."}</p>
                           </div>
                           <div className="flex flex-wrap items-center gap-10">
                              <span className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest bg-gray-50/50 dark:bg-[#050816] px-6 py-2.5 rounded-full border-2 border-gray-50 dark:border-gray-800 italic leading-none">{pt.testId.category || "General Logic Node"}</span>
                              <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none"><Clock size={18} className="text-blue-600 dark:text-blue-500" /> {pt.testId.duration} Min Session Duration</div>
                              {(pt.testId as any).pdfUrl && (
                                 <a 
                                   href={(pt.testId as any).pdfUrl} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="text-[11px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest flex items-center gap-3 hover:underline italic leading-none group/link"
                                   onClick={(e) => e.stopPropagation()}
                                 >
                                   <Download size={18} className="group-hover/link:translate-y-0.5 transition-transform" /> Preserve Registry Payload
                                 </a>
                              )}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-8 w-full xl:w-auto relative z-10">
                        {pt.isCompleted ? (
                           <button
                              onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                              className="w-full xl:w-auto px-16 py-7 bg-gray-50 dark:bg-[#050816] text-gray-600 dark:text-gray-400 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-6 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-700 italic active:scale-[0.98] shadow-sm"
                           >
                              <BarChart4 size={24} /> Performance Analysis HUB
                           </button>
                        ) : (
                           <button
                              onClick={() => window.open(`/quiz/${pt.testId._id}`, '_blank')}
                              className="w-full xl:w-auto px-16 py-8 bg-blue-600 text-white rounded-[2.5rem] text-[14px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 italic active:scale-[0.98]"
                           >
                              <Play size={24} fill="white" className="group-hover:scale-110 transition-transform" /> Initiate Assessment
                           </button>
                        )}
                     </div>
                  </div>
                ))}

                {/* Part B: Newly Published Nodes */}
                {availableRegistry.map((test) => (
                  <div key={test._id} className="bg-white dark:bg-[#0a0f29] p-12 rounded-[4.5rem] border-4 border-dashed border-gray-50 dark:border-gray-800 shadow-sm hover:border-amber-400 dark:hover:border-amber-600/50 transition-all duration-1000 group flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-2 h-full bg-amber-500/20 group-hover:bg-amber-500 transition-all" />
                     <div className="flex items-center gap-12 flex-1 min-w-0 relative z-10">
                        <div className="w-24 h-24 shrink-0 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 text-gray-200 dark:text-gray-800 rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 group-hover:text-amber-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/10 group-hover:scale-110 group-hover:rotate-12 group-hover:border-amber-400/50 shadow-inner">
                           <Sparkles size={48} />
                        </div>
                        <div className="space-y-6 flex-1 min-w-0">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                              <h4 className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors uppercase italic tracking-tighter leading-none truncate">{test.title}</h4>
                              <div className="px-6 py-2.5 bg-amber-50/50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500 border-2 border-amber-100 dark:border-amber-800/30 rounded-full text-[11px] font-black uppercase tracking-[0.2em] italic w-fit leading-none shadow-sm">New Protocol Synchronized</div>
                           </div>
                           <div className="flex items-center gap-10">
                              <span className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest bg-gray-50/50 dark:bg-[#050816] px-6 py-2.5 rounded-full border-2 border-gray-50 dark:border-gray-800 italic leading-none">{test.category || "Institutional Knowledge"}</span>
                              <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none"><Clock size={18} className="text-amber-500" /> {test.duration} Min Provision Node</div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-8 w-full xl:w-auto relative z-10">
                        <button
                           onClick={() => handleJoinSession(test._id)}
                           className="w-full xl:w-auto px-16 py-7 bg-white dark:bg-[#050816] text-gray-400 dark:text-gray-700 border-2 border-gray-100 dark:border-gray-800 hover:bg-amber-600 hover:text-white hover:border-amber-600 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 transition-all duration-700 italic active:scale-[0.98] shadow-sm"
                        >
                           <Play size={24} className="group-hover:scale-125 transition-transform" /> Activate Logic Node
                        </button>
                     </div>
                  </div>
                ))}

                {myTests.length === 0 && availableRegistry.length === 0 && (
                  <div className="py-48 text-center bg-gray-50/50 dark:bg-[#0a0f29]/30 rounded-[5rem] border-4 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-12 transition-all duration-1000 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-1000" />
                    <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-[3.5rem] flex items-center justify-center text-gray-100 dark:text-gray-900 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 relative z-10 border-2 border-gray-50 dark:border-gray-700"><History size={64} /></div>
                    <div className="space-y-6 relative z-10">
                       <p className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Neural Registry Null</p>
                       <p className="text-[14px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.5em] italic leading-none">No Intelligence Nodes Detected In Global Grid Buffer</p>
                    </div>
                  </div>
                )}
              </div>
          </section>

          {/* SECTION 2: STUDY REPOSITORY */}
          <section className="space-y-16 pt-8">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between px-8 gap-10">
                <div className="flex items-center gap-10">
                   <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-2 border-green-100 dark:border-green-800/30 rounded-[1.5rem] flex items-center justify-center shadow-sm group hover:rotate-6 transition-all duration-500"><FileText size={32} /></div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Institutional Repository</h3>
                      <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Preserved Knowledge Manuals & Neural Nodes</p>
                   </div>
                </div>
                
                <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar-horizontal px-2">
                   {resourceCategories.map(cat => (
                     <button
                       key={cat}
                       onClick={() => setResourceCategory(cat)}
                       className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 border-2 italic whitespace-nowrap leading-none tabular-nums shadow-sm active:scale-95 ${
                         resourceCategory === cat 
                         ? "bg-green-600 border-green-600 text-white shadow-2xl shadow-green-900/40" 
                         : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10"
                       }`}
                     >
                        {cat.toUpperCase()}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredResources.length === 0 ? (
                  <div className="md:col-span-3 py-48 text-center bg-gray-50/50 dark:bg-[#0a0f29]/30 rounded-[5rem] border-4 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-12 transition-all duration-1000 group">
                     <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/5 transition-all duration-1000" />
                     <AlertCircle size={64} className="text-gray-100 dark:text-gray-900 group-hover:scale-125 transition-all duration-1000 relative z-10" />
                     <p className="text-[14px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.5em] italic leading-none relative z-10">No Knowledge Nodes Found In Sector Registry</p>
                  </div>
                ) : (
                  filteredResources.map((res) => {
                    const isNew = new Date().getTime() - new Date(res.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
                    return (
                      <div key={res._id} className="bg-white dark:bg-[#0a0f29] p-12 rounded-[4.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-green-400 dark:hover:border-green-600 transition-all duration-700 flex flex-col relative overflow-hidden active:scale-[0.98]">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
                         <div className="flex items-center gap-8 mb-12 relative z-10">
                            <div className="w-20 h-20 bg-green-50/50 dark:bg-green-900/10 text-green-600 dark:text-green-500 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-1000 group-hover:rotate-12 border-2 border-green-100 dark:border-green-800/30">
                               <FileText size={40} />
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                               <div className="flex items-center gap-4">
                                  <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase truncate group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors italic leading-none tracking-tight">{res.title}</h4>
                                  {isNew && <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                                </div>
                                <p className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">{res.category || "Study Protocol Manual"}</p>
                            </div>
                         </div>
                         <p className="text-[15px] text-gray-500 dark:text-gray-400 font-black mb-16 line-clamp-4 italic leading-relaxed relative z-10">{res.description || "Official institutional study material and preserved knowledge assets synchronized with latest syllabus protocols."}</p>
                         
                         <div className="mt-auto pt-10 border-t-2 border-gray-50 dark:border-gray-800 flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                               <span className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.4em] italic block leading-none">NODE-UPLINK</span>
                               <span className="text-[9px] font-black text-blue-400/50 dark:text-blue-500/30 uppercase tracking-widest italic block leading-none">{res._id.slice(-10).toUpperCase()}</span>
                            </div>
                            <a 
                              href={res.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-10 py-5 bg-gray-50 dark:bg-[#050816] text-gray-400 dark:text-gray-700 border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-700 font-black text-[11px] uppercase tracking-widest flex items-center gap-4 italic active:scale-95 shadow-sm group/btn"
                            >
                               <Download size={20} className="group-hover/btn:translate-y-0.5 transition-transform" /> Access Node
                            </a>
                         </div>
                      </div>
                    );
                  })
                )}
              </div>
          </section>

          {/* SECTION 3: SERIES MESH HUB */}
          <section className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-16 lg:p-20 rounded-[5rem] shadow-sm space-y-20 transition-all duration-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-10 relative z-10">
                 <div className="w-18 h-18 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-2 border-purple-100 dark:border-purple-800/30 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:rotate-12 transition-all duration-700"><Layers size={36} /></div>
                 <div className="space-y-3">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Series Synthesis Mesh</h3>
                    <p className="text-[12px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Curated Multi-Node Intelligence Clusters</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                {librarySeries.map((s) => (
                  <div key={s._id} className="bg-gray-50/50 dark:bg-[#050816]/50 p-12 rounded-[3.5rem] border-2 border-gray-50 dark:border-gray-800 flex flex-col group/card hover:bg-white dark:hover:bg-[#0a0f29] hover:border-purple-600 transition-all duration-700 shadow-sm relative overflow-hidden active:scale-[0.98]">
                     <div className="absolute inset-0 bg-purple-600/0 group-hover/card:bg-purple-600/5 transition-all duration-700" />
                     <div className="w-20 h-20 bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 text-purple-600 dark:text-purple-500 rounded-[1.5rem] flex items-center justify-center mb-12 shadow-sm group-hover/card:bg-purple-600 group-hover/card:text-white group-hover/card:rotate-12 transition-all duration-1000 relative z-10">
                        <LayoutGrid size={40} />
                     </div>
                     <div className="space-y-4 mb-12 relative z-10">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none group-hover/card:text-purple-600 dark:group-hover/card:text-purple-500 transition-colors">{s.title}</h4>
                        <div className="flex items-center gap-4">
                           <span className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">{s.category}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                           <span className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none tabular-nums">MESH CLUSTER</span>
                        </div>
                     </div>
                     
                     <p className="text-[14px] text-gray-500 dark:text-gray-400 font-black mb-16 line-clamp-4 leading-relaxed italic relative z-10">{s.description || "Comprehensive multi-paper series designed for institutional assessment and global neural cohort refinement."}</p>
                     
                     <button
                        onClick={() => router.push(`/user-dashboard/tests?seriesId=${s._id}`)}
                        className="w-full mt-auto py-7 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-600 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-700 active:scale-[0.98] shadow-sm italic relative z-10 group/btn"
                     >
                       Explore Cluster Mesh <ArrowRight size={16} className="inline ml-2 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
                ))}
              </div>
          </section>

          {/* SECTION 4: RANKING HUD HUB */}
          <div className="flex justify-center pb-20">
             <section className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[6rem] p-20 lg:p-32 max-w-[1300px] w-full shadow-sm text-center space-y-24 transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="flex flex-col items-center gap-12 relative z-10">
                   <div className="w-32 h-32 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-500 border-4 border-white dark:border-[#050816] rounded-[3.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 relative">
                      <div className="absolute inset-0 bg-blue-600/20 rounded-[3.5rem] animate-ping opacity-20" />
                      <Award size={64} className="relative z-10" />
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Global Performance Matrix</h3>
                      <p className="text-[13px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.5em] italic leading-none">Institutional Neural Telemetry Synchronization Hub</p>
                   </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[5rem] p-20 lg:p-24 space-y-12 relative overflow-hidden group/card transition-all duration-1000 shadow-inner">
                   <div className="absolute inset-0 bg-blue-600/0 group-hover/card:bg-blue-600/5 transition-all duration-1000" />
                   <div className="relative z-10 space-y-10">
                      <div className="w-24 h-24 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-xl group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-1000">
                         <BrainCircuit size={48} />
                      </div>
                      <div className="space-y-6">
                         <p className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Initializing Rank Synthesis</p>
                         <p className="text-[16px] font-black text-gray-400 dark:text-gray-700 italic leading-relaxed max-w-2xl mx-auto uppercase tracking-wide">Commence active assessment protocols to activate your global cohort position. Real-time telemetry requires minimum [01] validated node commit.</p>
                      </div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden max-w-lg mx-auto shadow-inner relative">
                         <div className="h-full w-1/3 bg-blue-600 animate-pulse shadow-[0_0_25px_rgba(37,99,235,0.6)]" />
                      </div>
                      <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 italic active:scale-[0.98]">Activate Performance Node</button>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 w-full relative z-10">
                   {[
                      { label: "HUD PROTOCOL", val: "V4.5.2", color: "blue", icon: <Layers size={14} /> },
                      { label: "NEURAL STATUS", val: "OPTIMIZED", color: "cyan", icon: <Zap size={14} /> },
                      { label: "GRID UPLINK", val: "STABLE", color: "purple", icon: <History size={14} /> },
                      { label: "DATA INTEGRITY", val: "99.98%", color: "green", icon: <Shield size={14} /> }
                   ].map(stat => (
                      <div key={stat.label} className="bg-gray-50/50 dark:bg-[#050816]/50 border-2 border-gray-50 dark:border-gray-800 p-10 rounded-[2.5rem] space-y-4 group/stat hover:border-blue-600/50 transition-all duration-700 shadow-sm text-center">
                         <div className="flex items-center justify-center gap-3 text-gray-400 dark:text-gray-700 group-hover/stat:text-blue-600 transition-colors">
                            {stat.icon}
                            <p className="text-[11px] font-black uppercase tracking-widest italic leading-none">{stat.label}</p>
                         </div>
                         <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none tabular-nums group-hover/stat:text-blue-600 transition-colors">{stat.val}</h4>
                      </div>
                   ))}
                </div>
             </section>
          </div>

        </div>
      </main>

      <LeaderboardSidebar />

      {statusMsg && (
        <div className={`fixed bottom-12 left-12 z-[600] px-12 py-8 rounded-[3.5rem] border-2 shadow-2xl animate-in slide-in-from-left-12 duration-700 flex items-center gap-10 backdrop-blur-3xl bg-white/90 dark:bg-[#0a0f29]/90 transition-all ${statusMsg.type === 'success' ? "border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400" : statusMsg.type === 'alert' ? "border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400" : "border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"}`}>
           <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl ${statusMsg.type === 'success' ? "bg-green-50 dark:bg-green-900/20" : statusMsg.type === 'alert' ? "bg-amber-50 dark:bg-amber-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={36} /> : statusMsg.type === 'alert' ? <AlertCircle size={36} /> : <X size={36} />}
           </div>
           <p className="text-[15px] font-black uppercase tracking-widest italic leading-none">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
