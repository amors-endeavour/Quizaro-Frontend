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
      // 1. Handle Token Handoff (Social Login)
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

        // 4. Data Synchronization (Resilient Fetching)
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
      router.push(`/quiz/${testId}`);
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

  // Logic for filtering
  const matchesSearch = (item: any) => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(search.toLowerCase()));

  const myTests = purchasedTests.filter(pt => matchesSearch(pt.testId));
  const freeStandalone = availableTests.filter(t => !t.seriesId && t.price === 0 && matchesSearch(t));
  const librarySeries = series.filter(s => matchesSearch(s));
  
  const filteredResources = resources.filter(r => {
    const isMatched = matchesSearch(r);
    const categoryMatch = resourceCategory === "All" || r.category === resourceCategory;
    return isMatched && categoryMatch;
  });

  const resourceCategories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black text-cyan-400 animate-pulse tracking-widest uppercase italic">Decrypting Neural Registry...</div>;

  return (
    <div className="flex h-screen bg-[#050816] text-white font-sans overflow-hidden">
      <UserSidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Intelligence Command" 
          breadcrumbs={["Intelligence", "Command Dashboard"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-1000">
          
          {/* SIMPLIFIED PERFORMANCE HUD 🔥 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                { label: "Papers Submitted", val: papersSubmitted, icon: <CheckCircle2 size={24} />, color: "green" },
                { label: "Global Attempts", val: totalAttempts, icon: <History size={24} />, color: "blue" },
                { label: "Training Velocity", val: `${totalTimeSpent}m`, icon: <Clock size={24} />, color: "purple" }
             ].map((stat, idx) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-white/20 transition-all backdrop-blur-md">
                   <div>
                      <h4 className="text-3xl font-black text-white italic tracking-tighter leading-none">{stat.val}</h4>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-3">{stat.label}</p>
                   </div>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      stat.color === 'green' ? "bg-green-500/10 text-green-400" :
                      stat.color === 'blue' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                   }`}>
                      {stat.icon}
                   </div>
                </div>
             ))}
          </section>
          
          {/* UNIFIED SEARCH HUD */}
          <section className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="space-y-1 text-center md:text-left">
                   <h2 className="text-3xl font-black tracking-tighter uppercase italic">Welcome back, {user?.name?.split(' ')[0] || "Scholar"}</h2>
                   <div className="flex items-center gap-3 justify-center md:justify-start">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Neural Link Active</p>
                      {search && (
                        <div className="flex gap-2">
                           <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md text-[8px] font-black uppercase tracking-tighter">{myTests.length + freeStandalone.length + librarySeries.length} Tests Found</span>
                           <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md text-[8px] font-black uppercase tracking-tighter">{filteredResources.length} Notes Found</span>
                        </div>
                      )}
                   </div>
                </div>
                <div className="relative w-full md:w-[500px]">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search across Tests, Manuals, & Study Notes..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all font-bold text-sm text-white placeholder:text-gray-700 shadow-inner"
                   />
                </div>
             </div>
          </section>

          {/* SECTION 1: PERSONAL TEST REGISTRY */}
          <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl flex items-center justify-center shadow-lg"><BookOpen size={20} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">My Assessment Registry</h3>
                </div>
                {!search && <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{myTests.length} Active Protcols</span>}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {myTests.length === 0 ? (
                  <div className="py-16 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center gap-4 opacity-40">
                    <History size={32} className="text-gray-600" />
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No active protocols found</p>
                  </div>
                ) : (
                  myTests.map((pt) => (
                    <div key={pt._id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:shadow-cyan-500/5 hover:bg-white/[0.07] transition-all duration-300 group flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md relative overflow-hidden">
                       <div className="flex items-center gap-8 relative z-10">
                          <div className={`w-16 h-16 ${pt.isCompleted ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/20"} border rounded-2xl flex items-center justify-center transition-all group-hover:scale-110`}>
                             {pt.isCompleted ? <CheckCircle2 size={32} /> : <FileText size={32} />}
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter">{pt.testId.title}</h4>
                             <div className="flex items-center gap-6 mt-3">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{pt.testId.category || "General"}</span>
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Clock size={12} className="text-cyan-400" /> {pt.testId.duration} Min</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 relative z-10">
                          {pt.isCompleted ? (
                             <button
                                onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                                className="px-10 py-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 hover:text-white transition-all"
                             >
                                <Award size={18} /> View Analysis
                             </button>
                          ) : (
                             <button
                                onClick={() => router.push(`/quiz/${pt.testId._id}`)}
                                className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-2xl hover:shadow-cyan-900/40 transition-all font-black"
                             >
                                <Play size={18} fill="white" /> Launch System
                             </button>
                          )}
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-3xl pointer-events-none" />
                    </div>
                  ))
                )}
              </div>
          </section>

          {/* SECTION 2: STUDY MANUALS & NOTES REPOSITORY 🔥 */}
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between px-4 gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg"><FileText size={20} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Knowledge & Notes Mesh</h3>
                </div>
                
                {/* Resource Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                   {resourceCategories.map(cat => (
                     <button
                       key={cat}
                       onClick={() => setResourceCategory(cat)}
                       className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                         resourceCategory === cat 
                         ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/20" 
                         : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30"
                       }`}
                     >
                        {cat}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.length === 0 ? (
                  <div className="md:col-span-3 py-24 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center gap-4 opacity-40">
                     <AlertCircle size={40} className="text-gray-700" />
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No matching knowledge nodes found in repository</p>
                  </div>
                ) : (
                  filteredResources.map((res) => {
                    const isNew = new Date().getTime() - new Date(res.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
                    return (
                      <div key={res._id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-xl group hover:bg-[#0b0f2a] transition-all duration-300 backdrop-blur-md flex flex-col relative overflow-hidden">
                         <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                               <FileText size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-md font-black text-white tracking-tight uppercase leading-none truncate group-hover:text-green-400 transition-colors">{res.title}</h4>
                                  {isNew && <Sparkles size={12} className="text-amber-500 animate-pulse" />}
                               </div>
                               <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{res.category || "Study Manual"}</p>
                            </div>
                         </div>
                         <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 italic leading-relaxed">{res.description || "Official institutional study material."}</p>
                         
                         <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic">Node: {res._id.slice(-6)}</span>
                            <a 
                              href={res.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-green-600 hover:border-green-600 transition-all font-black text-[9px] uppercase tracking-widest flex items-center gap-2"
                            >
                               <Download size={14} /> Open Manual
                            </a>
                         </div>
                         {isNew && (
                            <div className="absolute -top-1 -right-1 w-20 h-20 bg-green-500/10 blur-3xl pointer-events-none" />
                         )}
                      </div>
                    );
                  })
                )}
              </div>
          </section>

          {/* SECTION 3: RECENT OPEN ASSESSMENTS (FREE) */}
          {freeStandalone.length > 0 && (
             <section className="space-y-8 animate-in fade-in duration-1000">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg"><Zap size={20} /></div>
                     <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Standalone Open Catalog</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                   {freeStandalone.map((test) => (
                      <div key={test._id} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                         <div className="w-16 h-16 bg-white/5 border border-white/5 text-cyan-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-cyan-500 group-hover:text-white transition-all">
                            <Sparkles size={28} />
                         </div>
                         <h4 className="text-lg font-black text-white tracking-tighter leading-none mb-3 italic">{test.title}</h4>
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6">{test.category || "Elective Paper"}</p>
                         <p className="text-[11px] text-gray-600 font-bold mb-10 line-clamp-2 italic leading-relaxed">{test.description || "Direct evaluation paper."}</p>
                         
                         <button
                            onClick={() => handleJoinSession(test._id)}
                            className="w-full mt-auto py-5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:shadow-2xl hover:shadow-cyan-900/40 active:scale-95"
                         >
                           Initiate Direct Session
                         </button>
                      </div>
                   ))}
                </div>
             </section>
          )}

          {/* SECTION 4: GLOBAL INSTITUTIONAL SERIES */}
          <section className="space-y-8 animate-in fade-in duration-1000 pb-20">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg"><Layers size={20} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Institutional Series Mesh</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {librarySeries.map((s) => (
                  <div key={s._id} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col group hover:-translate-y-2 transition-all duration-300 relative backdrop-blur-md">
                     <div className="w-16 h-16 bg-white/5 border border-white/5 text-purple-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Layers size={28} />
                     </div>
                     <h4 className="text-lg font-black text-white tracking-tighter leading-none mb-3 italic">{s.title}</h4>
                     <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6">{s.category}</p>
                     
                     <p className="text-[11px] text-gray-600 font-bold mb-10 line-clamp-2 italic leading-relaxed font-black">{s.description || "Comprehensive multi-paper series."}</p>
                     
                     <button
                        onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                        className="w-full mt-auto py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:border-purple-600 transition shadow-2xl active:scale-95"
                     >
                       Explore System Grid
                     </button>
                  </div>
                ))}
              </div>
          </section>

        </div>
      </main>
      
      {/* Figma Global Ranking Sync */}
      <LeaderboardSidebar />

      {/* Persistence Notification HUD */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[300] px-10 py-6 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-5 backdrop-blur-3xl ${statusMsg.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : statusMsg.type === 'alert' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-500/20" : statusMsg.type === 'alert' ? "bg-amber-500/20" : "bg-red-500/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
           </div>
           <p className="text-[11px] font-black uppercase tracking-widest">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
