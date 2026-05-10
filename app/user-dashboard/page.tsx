"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import { 
  Trophy, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Clock,
  Download,
  FileText,
  Sparkles,
  History,
  Play,
  BarChart4,
  Search,
  Activity
} from "lucide-react";


interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  attemptCount?: number;
  userBestRank?: number | null;
}

interface Attempt {
  _id: string;
  testId: Test;
  score: number;
  totalMarks: number;
  isCompleted: boolean;
  submittedAt: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myTests, setMyTests] = useState<Attempt[]>([]);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'alert' | 'error'} | null>(null);

  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      const safetyTimeout = setTimeout(() => setLoading(false), 8000);
      
      try {
        const { data: profile } = await API.get("/user/profile");
        const rawRole = profile?.role || profile?.user?.role || profile?.data?.role || profile?.data?.user?.role || "student";
        const role = rawRole.toString().toLowerCase();
        
        if (role === "admin") {
           router.replace("/admin-dashboard");
           return;
        }

        setUser(profile?.user || profile);

        const [attemptsRes, testsRes] = await Promise.all([
          API.get("/user/attempts"),
          API.get("/tests")
        ]);

        setMyTests(Array.isArray(attemptsRes.data) ? attemptsRes.data : []);
        setAvailableTests(Array.isArray(testsRes.data) ? testsRes.data : []);

      } catch (err) {
        console.error("Dashboard Init Error:", err);
        router.replace("/login");
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
      const { data } = await API.post("/user/sessions/join", { testId });
      if (data.sessionId) {
        window.open(`/quiz/${testId}?sessionId=${data.sessionId}`, '_blank');
        setStatusMsg({ text: "Session Initialized Successfully.", type: "success" });
      } else {
        handlePayment(testId);
      }
    } catch (err: any) {
      console.error("Join Session Error:", err);
      if (err.response?.status === 402) {
        handlePayment(testId);
      } else {
        setStatusMsg({ text: err.response?.data?.message || "Failed to join session.", type: "error" });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handlePayment = async (testId: string) => {
    try {
      setLoading(true);
      const { data } = await API.post("/user/payment/create", { testId });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setStatusMsg({ text: "Transaction Gateway Error. Please retry.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const matchesSearch = (test: any) => {
    const query = searchQuery.toLowerCase();
    return test.title.toLowerCase().includes(query) || 
           test.category?.toLowerCase().includes(query) ||
           test.description?.toLowerCase().includes(query);
  };

  const purchasedTests = myTests.filter(t => matchesSearch(t.testId));
  const availableRegistry = availableTests.filter(t => matchesSearch(t) && !myTests.some(pt => pt.testId?._id === t._id));

  if (loading && !user) return (
    <div className="min-h-screen bg-[#fbfbfe] flex flex-col items-center justify-center space-y-10 transition-colors duration-300">
      <div className="w-24 h-24 border-4 border-blue-50 border-t-blue-600 rounded-[2.5rem] animate-spin shadow-xl shadow-blue-600/5" />
      <p className="font-black animate-pulse text-blue-600 uppercase tracking-[0.5em] text-[12px] italic leading-none">
        Synchronizing Scholar Node Matrix...
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fbfbfe] text-gray-900 font-sans overflow-hidden transition-colors duration-500">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={user?.name || "Scholar"} />
      
      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Scholar Command Terminal" 
          breadcrumbs={["Institutional Matrix", "Command Center"]} 
        />

        <div className="p-8 lg:p-14 max-w-[1700px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
           
           {/* SEARCH & FILTERS HUB */}
           <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 relative group w-full">
                 <div className="absolute inset-y-0 left-8 flex items-center text-gray-300 group-focus-within:text-blue-600 transition-colors">
                    <Search size={22} strokeWidth={3} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Scan Global Intelligence Registry..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-white border-2 border-gray-50 rounded-[2.5rem] py-7 pl-20 pr-10 text-base font-black text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder:text-gray-300 italic tracking-tight shadow-sm"
                 />
              </div>
              <div className="flex items-center gap-6 w-full lg:w-auto">
                 <div className="bg-blue-50/50 border-2 border-blue-100 p-3 rounded-3xl flex items-center gap-4 px-8 shadow-sm">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Activity size={20} /></div>
                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest italic">{availableRegistry.length + myTests.length} Total Nodes</p>
                 </div>
              </div>
           </div>

           {/* ASSESSMENT GRID SECTION */}
           <section className="space-y-12">
              <div className="flex items-center justify-between px-8">
                 <div className="flex items-center gap-6">
                    <div className="w-2 h-10 bg-blue-600 rounded-full" />
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Neural Assessment Registry</h3>
                 </div>
                 <button onClick={() => router.push("/user-dashboard/papers")} className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] hover:translate-x-2 transition-transform flex items-center gap-4 italic">Expand Full Registry <ArrowRight size={16} /></button>
              </div>

              <div className="grid grid-cols-1 gap-10">
                {purchasedTests.map((pt) => (
                  <div key={pt._id} className="bg-white p-12 rounded-[4rem] border-2 border-gray-100 shadow-sm hover:border-blue-600 transition-all duration-700 group flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-2 h-full bg-blue-600/50 group-hover:bg-blue-600 transition-all" />
                     <div className="flex items-center gap-12 flex-1 min-w-0 relative z-10">
                        <div className={`w-24 h-24 shrink-0 ${pt.isCompleted ? "bg-green-50 text-green-600 border-2 border-green-100" : "bg-blue-600 text-white shadow-2xl shadow-blue-900/40"} rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 group-hover:scale-110 group-hover:rotate-6`}>
                           {pt.isCompleted ? <CheckCircle2 size={48} /> : <FileText size={48} />}
                        </div>
                        <div className="space-y-6 flex-1 min-w-0">
                           <div className="space-y-3">
                              <h4 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter leading-none truncate">{pt.testId.title}</h4>
                              <p className="text-[12px] text-gray-400 font-black italic line-clamp-1 uppercase tracking-widest">{pt.testId.description || "Foundational institutional assessment node synchronized with latest syllabus."}</p>
                           </div>
                           <div className="flex flex-wrap items-center gap-10">
                              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-2.5 rounded-full border-2 border-gray-50 italic leading-none">{pt.testId.category || "General Logic Node"}</span>
                              <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest italic leading-none"><Clock size={18} className="text-blue-600" /> {pt.testId.duration} Min Session Duration</div>
                              <div className="flex items-center gap-4 ml-6">
                                 <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">
                                    {pt.testId.attemptCount ? `Attempted by ${pt.testId.attemptCount}` : "No attempts yet"}
                                 </span>
                                 {pt.testId.userBestRank && (
                                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest italic">
                                       • Rank: {pt.testId.userBestRank}
                                    </span>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-8 w-full xl:w-auto relative z-10">
                        {pt.isCompleted ? (
                           <button
                              onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                              className="w-full xl:w-auto px-16 py-7 bg-gray-50 text-gray-600 border-2 border-gray-100 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-6 hover:bg-white hover:text-blue-600 transition-all duration-700 italic active:scale-[0.98] shadow-sm"
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

                {availableRegistry.map((test) => (
                  <div key={test._id} className="bg-white p-12 rounded-[4.5rem] border-4 border-dashed border-gray-100 shadow-sm hover:border-amber-400 transition-all duration-1000 group flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-2 h-full bg-amber-500/20 group-hover:bg-amber-500 transition-all" />
                     <div className="flex items-center gap-12 flex-1 min-w-0 relative z-10">
                        <div className="w-24 h-24 shrink-0 bg-gray-50 border-2 border-gray-100 text-gray-200 rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:scale-110 group-hover:rotate-12 group-hover:border-amber-400/50 shadow-inner">
                           <Sparkles size={48} />
                        </div>
                        <div className="space-y-6 flex-1 min-w-0">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                              <h4 className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors uppercase italic tracking-tighter leading-none truncate">{test.title}</h4>
                              <div className="px-6 py-2.5 bg-amber-50/50 text-amber-600 border-2 border-amber-100 rounded-full text-[11px] font-black uppercase tracking-[0.2em] italic w-fit leading-none shadow-sm">New Protocol Synchronized</div>
                           </div>
                           <div className="flex items-center gap-10">
                              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-2.5 rounded-full border-2 border-gray-50 italic leading-none">{test.category || "Institutional Knowledge"}</span>
                              <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest italic leading-none"><Clock size={18} className="text-amber-500" /> {test.duration} Min Provision Node</div>
                              <div className="flex items-center gap-4 ml-6">
                                 <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">
                                    {test.attemptCount ? `Attempted by ${test.attemptCount}` : "No attempts yet"}
                                 </span>
                                 {test.userBestRank && (
                                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest italic">
                                       • Rank: {test.userBestRank}
                                    </span>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-8 w-full xl:w-auto relative z-10">
                        <button
                           onClick={() => handleJoinSession(test._id)}
                           className="w-full xl:w-auto px-16 py-7 bg-white text-gray-400 border-2 border-gray-100 hover:bg-amber-600 hover:text-white hover:border-amber-600 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 transition-all duration-700 italic active:scale-[0.98] shadow-sm"
                        >
                           <Play size={24} className="group-hover:scale-125 transition-transform" /> Activate Logic Node
                        </button>
                     </div>
                  </div>
                ))}

                {purchasedTests.length === 0 && availableRegistry.length === 0 && (
                  <div className="py-48 text-center bg-gray-50/50 rounded-[5rem] border-4 border-dashed border-gray-100 flex flex-col items-center gap-12 transition-all duration-1000 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-1000" />
                    <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center text-gray-100 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 relative z-10 border-2 border-gray-50"><History size={64} /></div>
                    <div className="space-y-6 relative z-10">
                       <p className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Neural Registry Null</p>
                       <p className="text-[14px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">No Intelligence Nodes Detected In Global Grid Buffer</p>
                    </div>
                  </div>
                )}
              </div>
           </section>

           {/* RECRUITMENT & COHORT CTA */}
           <section className="relative overflow-hidden bg-gray-900 rounded-[5rem] p-16 lg:p-32 group">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.15),transparent)] transition-all duration-1000 group-hover:scale-150" />
              <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.1),transparent)] transition-all duration-1000 group-hover:scale-150" />
              
              <div className="relative z-10 text-center space-y-12">
                 <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full">
                    <Sparkles size={16} className="text-blue-400 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] italic leading-none">Global Performance Threshold</span>
                 </div>
                 <h2 className="text-5xl lg:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">Elevate Your <br/> Scholastic Rank</h2>
                 <p className="text-[16px] font-black text-gray-400 italic leading-relaxed max-w-2xl mx-auto uppercase tracking-wide">Commence active assessment protocols to activate your global cohort position. Real-time telemetry requires minimum [01] validated node commit.</p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                    <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 italic active:scale-[0.98]">Activate Performance Node</button>
                    <button className="px-12 py-6 bg-white/5 border-2 border-white/10 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all italic active:scale-[0.98]">View Peer Metrics</button>
                 </div>
              </div>
           </section>

           {/* SYSTEM OVERLAYS */}
           {statusMsg && (
             <div className={`fixed bottom-10 left-10 z-[500] px-10 py-6 rounded-[2.5rem] border-2 shadow-2xl animate-in slide-in-from-left-10 duration-700 flex items-center gap-6 backdrop-blur-3xl bg-white/95 transition-all ${statusMsg.type === 'success' ? "border-green-100 text-green-700" : statusMsg.type === 'alert' ? "border-amber-100 text-amber-700" : "border-red-100 text-red-600"}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${statusMsg.type === 'success' ? "bg-green-50" : statusMsg.type === 'alert' ? "bg-amber-50" : "bg-red-50"}`}>
                   {statusMsg.type === 'success' ? <CheckCircle2 size={24} /> : statusMsg.type === 'alert' ? <AlertCircle size={24} /> : <AlertCircle size={24} />}
                </div>
                <p className="text-[14px] font-black uppercase tracking-widest italic leading-none">{statusMsg.text}</p>
             </div>
           )}
        </div>
      </main>


    </div>
  );
}
