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
  History
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
}

export default function UserDashboard() {
  const router = useRouter();
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [purchasedTests, setPurchasedTests] = useState<PurchasedTest[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'alert' | 'error'} | null>(null);

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

        // Fetch Data
        const [available, purchased, seriesList, resourceList] = await Promise.all([
          API.get("/user/tests/available"),
          API.get("/user/tests/purchased"),
          API.get("/series"),
          API.get("/user/resources")
        ]);

        setAvailableTests(available.data);
        setPurchasedTests(purchased.data);
        setSeries(seriesList.data);
        setResources(resourceList.data);

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
  const searchResources = resources.filter(r => matchesSearch(r));

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black text-cyan-400 animate-pulse tracking-widest uppercase italic">Decrypting Neural Registry...</div>;

  return (
    <div className="flex h-screen bg-[#050816] text-white font-sans overflow-hidden">
      <UserSidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Student Intelligence Hub" 
          breadcrumbs={["Classroom", "Neural Dashboard"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-16 animate-in fade-in duration-1000">
          
          {/* SEARCH HUD SECTION */}
          <section className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="space-y-2 text-center md:text-left">
                   <h2 className="text-3xl font-black tracking-tighter uppercase italic">Welcome back, {user?.name?.split(' ')[0] || "Scholar"}</h2>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Registry Search • Available Protocols</p>
                </div>
                <div className="relative w-full md:w-[450px]">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search tests, papers, or study resources..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all font-bold text-sm text-white placeholder:text-gray-700 shadow-inner"
                   />
                </div>
             </div>
          </section>

          {/* SECTION 1: MY REGISTRY (OWNED TESTS) */}
          <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-900/10"><BookOpen size={20} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">My Assessment Registry</h3>
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{myTests.length} Papers Active</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {myTests.length === 0 ? (
                  <div className="py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center gap-4">
                    <History size={40} className="text-gray-700" />
                    <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">No active assessments found matching your search</p>
                  </div>
                ) : (
                  myTests.map((pt) => (
                    <div key={pt._id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:shadow-cyan-500/5 hover:bg-white/[0.07] transition-all duration-300 group flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">
                       <div className="flex items-center gap-8">
                          <div className={`w-16 h-16 ${pt.isCompleted ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/20"} border rounded-2xl flex items-center justify-center transition-all group-hover:scale-110`}>
                             {pt.isCompleted ? <CheckCircle2 size={32} /> : <FileText size={32} />}
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors uppercase italic">{pt.testId.title}</h4>
                             <div className="flex items-center gap-6 mt-3">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{pt.testId.category || "General"}</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-cyan-400" /> {pt.testId.duration} Min</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          {pt.isCompleted ? (
                             <button
                                onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                                className="px-10 py-4 bg-white/5 text-gray-400 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 hover:text-white transition-all shadow-xl"
                             >
                                <Award size={18} /> Review Scorecard
                             </button>
                          ) : (
                             <button
                                onClick={() => router.push(`/quiz/${pt.testId._id}`)}
                                className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-cyan-900/30"
                             >
                                <Play size={18} fill="white" /> Resume Protocol
                             </button>
                          )}
                       </div>
                    </div>
                  ))
                )}
              </div>
          </section>

          {/* SECTION 2: STANDALONE INDIVIDUAL PAPERS (FREE) */}
          {freeStandalone.length > 0 && (
             <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg"><Zap size={20} /></div>
                     <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Standalone Open Assessments</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                   {freeStandalone.map((test) => (
                      <div key={test._id} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                         <div className="w-16 h-16 bg-white/5 border border-white/5 text-cyan-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-cyan-500 group-hover:text-white transition-all">
                            <FileText size={28} />
                         </div>
                         <h4 className="text-lg font-black text-white tracking-tight leading-none mb-3 italic">{test.title}</h4>
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">{test.category || "Elective Paper"}</p>
                         <p className="text-[11px] text-gray-600 font-bold mb-10 line-clamp-2 italic leading-relaxed">{test.description || "Standalone academic evaluation paper."}</p>
                         
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

          {/* SECTION 3: TEST SERIES LIBRARY */}
          <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg"><Layers size={20} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Institutional Series Catalog</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {librarySeries.map((s) => (
                  <div key={s._id} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col group hover:-translate-y-2 transition-all duration-300 relative backdrop-blur-md">
                     <div className="w-16 h-16 bg-white/5 border border-white/5 text-purple-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Layers size={28} />
                     </div>
                     <h4 className="text-lg font-black text-white tracking-tight leading-none mb-3 italic">{s.title}</h4>
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">{s.category}</p>
                     
                     <p className="text-[11px] text-gray-600 font-bold mb-10 line-clamp-2 italic leading-relaxed">{s.description || "Comprehensive multi-paper series."}</p>
                     
                     <button
                        onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                        className="w-full mt-auto py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:border-purple-600 transition shadow-2xl active:scale-95"
                     >
                       Explore System Matrix
                     </button>
                  </div>
                ))}
              </div>
          </section>

          {/* SECTION 4: RESOURCE HUB (PDFS/PAPERS) 🔥 */}
          <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg"><Download size={20} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Academic Resource Repository</h3>
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{searchResources.length} Documents Available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResources.length === 0 ? (
                  <div className="md:col-span-3 py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 transition-all">
                     <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest italic">No resource files matched your query</p>
                  </div>
                ) : (
                  searchResources.map((res) => (
                    <div key={res._id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-xl group hover:bg-[#0b0f2a] transition-all duration-300 backdrop-blur-md flex items-center gap-6">
                       <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          <FileText size={28} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-md font-black text-white tracking-tight uppercase leading-none mb-2">{res.title}</h4>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{res.category || "Question Paper"}</p>
                       </div>
                       <a 
                         href={res.fileUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="p-4 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-green-600 hover:border-green-600 transition-all"
                       >
                          <Download size={20} />
                       </a>
                    </div>
                  ))
                )}
              </div>
          </section>

        </div>
      </main>
      
      {/* Figma Component Sync */}
      <LeaderboardSidebar />

      {/* Global Persistence HUD */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[300] px-10 py-6 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-5 backdrop-blur-2xl ${statusMsg.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : statusMsg.type === 'alert' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-500/20" : statusMsg.type === 'alert' ? "bg-amber-500/20" : "bg-red-500/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
           </div>
           <p className="text-[11px] font-black uppercase tracking-widest tracking-tighter">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
