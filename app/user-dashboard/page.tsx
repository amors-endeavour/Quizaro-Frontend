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
  Filter
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

  if (loading && !attempts.length) return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-bold animate-pulse text-blue-600 uppercase tracking-widest text-[10px]">
        Synchronizing Neural Progress...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] text-gray-900">
        <UserHeader 
          title="Command Center" 
          breadcrumbs={["Intelligence", "Command Dashboard"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 italic">Student Intelligence Hub</h2>
             <button 
               onClick={() => router.push("/")}
               className="px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
             >
                Return to Campus
             </button>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
                { label: "Papers Submitted", val: papersSubmitted, icon: <CheckCircle2 size={24} />, color: "green" },
                { label: "Global Attempts", val: totalAttempts, icon: <History size={24} />, color: "blue" },
                { label: "Training Velocity", val: `${totalTimeSpent}m`, icon: <Clock size={24} />, color: "purple" }
             ].map((stat) => (
                <div key={stat.label} className="bg-white border border-gray-100 p-8 rounded-3xl flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm">
                   <div>
                      <h4 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{stat.val}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">{stat.label}</p>
                   </div>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      stat.color === 'green' ? "bg-green-50 text-green-600" :
                      stat.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                   }`}>
                      {stat.icon}
                   </div>
                </div>
             ))}
          </section>

          <section className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="space-y-1 text-center md:text-left">
                   <h2 className="text-3xl font-black tracking-tight uppercase italic text-gray-900">Welcome, {user?.name?.split(' ')[0] || "Scholar"}</h2>
                   <div className="flex items-center gap-3 justify-center md:justify-start">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Connection Stable</p>
                      {search && (
                        <div className="flex gap-2">
                           <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[8px] font-black uppercase">{myTests.length + availableRegistry.length} Tests Active</span>
                        </div>
                      )}
                   </div>
                </div>
                <div className="relative w-full md:w-[500px]">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search across Tests, Manuals, & Study Notes..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-16 pr-8 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-sm text-gray-900 placeholder:text-gray-400 shadow-inner"
                   />
                </div>
             </div>
          </section>

          {/* SECTION 1: CONSOLIDATED INTELLIGENCE REGISTRY */}
          <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center shadow-sm"><BookOpen size={20} /></div>
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Assessments</h3>
                </div>
                {!search && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{myTests.length + availableRegistry.length} Protocols available</span>}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Part A: Active & Completed Protocols */}
                {myTests.map((pt) => (
                  <div key={pt._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all group flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 ${pt.isCompleted ? "bg-green-50 text-green-600" : "bg-blue-600 text-white shadow-lg shadow-blue-900/20"} rounded-xl flex items-center justify-center transition-all`}>
                           {pt.isCompleted ? <CheckCircle2 size={28} /> : <FileText size={28} />}
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tight">{pt.testId.title}</h4>
                           <div className="flex items-center gap-4 mt-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{pt.testId.category || "General"}</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} className="text-blue-600" /> {pt.testId.duration} Min</span>
                               {(pt.testId as any).pdfUrl && (
                                 <a 
                                   href={(pt.testId as any).pdfUrl} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="text-[9px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                                   onClick={(e) => e.stopPropagation()}
                                 >
                                   <Download size={12} /> PDF
                                 </a>
                               )}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                        {pt.isCompleted ? (
                           <button
                              onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                              className="px-8 py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-all"
                           >
                              <Award size={16} /> Analysis
                           </button>
                        ) : (
                           <button
                              onClick={() => window.open(`/quiz/${pt.testId._id}`, '_blank')}
                              className="px-8 py-4 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                           >
                              <Play size={16} fill="white" /> Resume
                           </button>
                        )}
                     </div>
                  </div>
                ))}

                {/* Part B: Newly Published Institutional Nodes */}
                {availableRegistry.map((test) => (
                  <div key={test._id} className="bg-white p-6 rounded-2xl border border-gray-100 border-dashed shadow-sm hover:border-amber-200 transition-all group flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center transition-all group-hover:text-amber-500 group-hover:bg-amber-50`}>
                           <Sparkles size={28} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <h4 className="text-lg font-black text-gray-900 group-hover:text-amber-600 transition-colors uppercase italic tracking-tight">{test.title}</h4>
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[8px] font-bold uppercase">New</span>
                           </div>
                           <div className="flex items-center gap-4 mt-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{test.category || "General"}</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} className="text-amber-500" /> {test.duration} Min</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                        <button
                           onClick={() => handleJoinSession(test._id)}
                           className="px-8 py-4 bg-white text-gray-600 border border-gray-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                           <Play size={16} /> Initiate
                        </button>
                     </div>
                  </div>
                ))}

                {myTests.length === 0 && availableRegistry.length === 0 && (
                  <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center gap-3">
                    <History size={32} className="text-gray-300" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No intelligence nodes found in registry</p>
                  </div>
                )}
              </div>
          </section>

          {/* SECTION 2: STUDY MANUALS & NOTES REPOSITORY */}
          <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-green-50 text-green-600 border border-green-100 rounded-2xl flex items-center justify-center shadow-sm"><FileText size={20} /></div>
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Knowledge Repository</h3>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                   {resourceCategories.map(cat => (
                     <button
                       key={cat}
                       onClick={() => setResourceCategory(cat)}
                       className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                         resourceCategory === cat 
                         ? "bg-green-600 border-green-600 text-white shadow-sm" 
                         : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                       }`}
                     >
                        {cat}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.length === 0 ? (
                  <div className="md:col-span-3 py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center gap-3">
                     <AlertCircle size={32} className="text-gray-300" />
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No matching knowledge nodes found</p>
                  </div>
                ) : (
                  filteredResources.map((res) => {
                    const isNew = new Date().getTime() - new Date(res.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
                    return (
                      <div key={res._id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group hover:border-green-200 transition-all flex flex-col">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm">
                               <FileText size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-md font-black text-gray-900 uppercase truncate group-hover:text-green-600 transition-colors">{res.title}</h4>
                                  {isNew && <Sparkles size={12} className="text-amber-500 animate-pulse" />}
                               </div>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{res.category || "Study Manual"}</p>
                            </div>
                         </div>
                         <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 italic leading-relaxed">{res.description || "Official institutional study material."}</p>
                         
                         <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">NODE-{res._id.slice(-4)}</span>
                            <a 
                              href={res.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-all font-bold text-[9px] uppercase tracking-widest flex items-center gap-2"
                            >
                               <Download size={14} /> Open
                            </a>
                         </div>
                      </div>
                    );
                  })
                )}
              </div>
          </section>

          {/* SECTION 3: INSTITUTIONAL SERIES MESH */}
          <section className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-purple-50 text-purple-600 border border-purple-100 rounded-2xl flex items-center justify-center shadow-sm"><Layers size={20} /></div>
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Series Collections</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {librarySeries.map((s) => (
                  <div key={s._id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col group hover:bg-white hover:border-purple-200 transition-all duration-300 shadow-sm">
                     <div className="w-12 h-12 bg-white border border-gray-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Layers size={24} />
                     </div>
                     <h4 className="text-md font-black text-gray-900 mb-2 italic">{s.title}</h4>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">{s.category}</p>
                     
                     <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 leading-relaxed">{s.description || "Comprehensive multi-paper series."}</p>
                     
                     <button
                        onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                        className="w-full mt-auto py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition active:scale-95 shadow-sm"
                     >
                       Explore Series
                     </button>
                  </div>
                ))}
              </div>
          </section>

          {/* SECTION 4: GLOBAL RANKING HUD */}
          <div className="flex justify-center pb-12">
             <section className="bg-white border border-gray-100 rounded-[2.5rem] p-10 lg:p-14 max-w-[1000px] w-full shadow-sm text-center space-y-10">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-3xl flex items-center justify-center shadow-sm"><Award size={32} /></div>
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Global Ranking Matrix</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional Leaderboard</p>
                   </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 space-y-6 relative overflow-hidden">
                   <Zap size={48} className="mx-auto text-blue-100" />
                   <div className="space-y-2">
                      <p className="text-md font-black text-gray-900 uppercase tracking-widest italic">Awaiting Performance Data</p>
                      <p className="text-xs font-bold text-gray-400 italic leading-relaxed max-w-md mx-auto">Complete assessments to activate your rank and synchronize with the global cohort.</p>
                   </div>
                   <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden max-w-sm mx-auto">
                      <div className="h-full w-1/4 bg-blue-600 animate-pulse" />
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                   {[
                      { label: "HUD VERSION", val: "V4.5.1", color: "blue" },
                      { label: "NEURAL LOAD", val: "OPTIMAL", color: "cyan" },
                      { label: "SYNC STATUS", val: "ACTIVE", color: "purple" },
                      { label: "INTEGRITY", val: "99.8%", color: "green" }
                   ].map(stat => (
                      <div key={stat.label} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl space-y-1">
                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                         <h4 className="text-sm font-black text-gray-900 tracking-tight">{stat.val}</h4>
                      </div>
                   ))}
                </div>
             </section>
          </div>

        </div>

      {statusMsg && (
        <div className={`fixed bottom-8 left-8 z-[300] px-8 py-5 rounded-2xl border shadow-2xl animate-in slide-in-from-left-8 duration-500 flex items-center gap-4 backdrop-blur-md ${statusMsg.type === 'success' ? "bg-white border-green-200 text-green-600" : statusMsg.type === 'alert' ? "bg-white border-amber-200 text-amber-600" : "bg-white border-red-200 text-red-600"}`}>
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-50" : statusMsg.type === 'alert' ? "bg-amber-50" : "bg-red-50"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
           </div>
           <p className="text-[11px] font-bold uppercase tracking-widest">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
