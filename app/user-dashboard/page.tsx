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
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Layers
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

export default function UserDashboard() {
  const router = useRouter();
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [purchasedTests, setPurchasedTests] = useState<PurchasedTest[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        if (role === "admin") {
          router.replace("/admin-dashboard");
          return;
        }
        setUser(data?.user || data);
        setIsAuthChecked(true);
      } catch {
        router.replace("/user-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    const loadData = async () => {
      try {
        const [availableRes, purchasedRes, seriesRes] = await Promise.all([
          API.get("/user/tests/available"),
          API.get("/user/tests/purchased"),
          API.get("/series")
        ]);
        setAvailableTests(availableRes.data);
        setPurchasedTests(purchasedRes.data);
        setSeries(seriesRes.data);
      } catch (err) {
        console.error("Data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthChecked]);

  // Combined logic for search and filter
  const filteredSeries = series.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinSession = async (testId: string) => {
    try {
      setLoading(true);
      await API.post(`/test/purchase/${testId}`);
      router.push(`/quiz/${testId}`);
    } catch (err) {
      alert("Registration Failed: Please ensure your account has access credentials.");
      setLoading(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(series.map(s => s.category)))];

  if (loading) return <div className="min-h-screen bg-[#f3f4f9] flex items-center justify-center font-black text-blue-600 animate-pulse tracking-widest uppercase">Initializing Classroom...</div>;

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-900 font-sans overflow-hidden">
      <UserSidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Classroom Tests" 
          breadcrumbs={["Classroom", "Test Series"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          
          {/* SEARCH & FILTER HUD */}
          <section className="flex flex-col md:flex-row gap-6 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <input 
                  type="text" 
                  placeholder="Search series or topics..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-3xl px-8 py-5 outline-none focus:border-blue-400 focus:shadow-2xl focus:shadow-blue-50/50 transition-all font-bold text-sm tracking-tight"
                />
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterCategory === cat ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "bg-white text-gray-400 border border-gray-100 hover:border-blue-200"}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </section>

          {/* ACTIVE SERIES PROGRESS */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Play size={18} fill="currentColor" />
                  Your Series Progress
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {series.map(s => {
                  const papersInSeries = purchasedTests.filter(pt => pt.testId.seriesId === s._id);
                  if (papersInSeries.length === 0) return null;
                  const completed = papersInSeries.filter(pt => pt.isCompleted).length;
                  const total = papersInSeries.length;
                  const progress = Math.round((completed / total) * 100);

                  return (
                    <div key={s._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 group">
                       <div className="flex items-center justify-between mb-6">
                          <div>
                             <h4 className="text-lg font-black text-gray-900 tracking-tight">{s.title}</h4>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{completed} of {total} Papers Completed</p>
                          </div>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${progress === 100 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                             {progress}%
                          </div>
                       </div>
                       <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden mb-6">
                          <div className={`h-full transition-all duration-1000 ${progress === 100 ? "bg-green-500" : "bg-blue-600"}`} style={{ width: `${progress}%` }} />
                       </div>
                    </div>
                  );
                })}
             </div>
          </section>

          {/* ACTIVE PAPERS REGISTRY */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Layers size={18} />
                  Individual Paper Registry
                </h3>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {purchasedTests.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No series purchased yet. Explore the marketplace below.</p>
                  </div>
                ) : (
                  purchasedTests.map((pt) => (
                    <div key={pt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 group">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
                             <FileText size={28} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{pt.testId.title}</h4>
                             <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{pt.testId.category || "General"}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {pt.testId.duration} Min</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          {pt.isCompleted ? (
                             <button
                               onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                               className="px-8 py-3 bg-green-50 text-green-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all shadow-lg shadow-green-50"
                             >
                               <CheckCircle2 size={16} />
                               View Scorecard
                             </button>
                          ) : (
                             <button
                               onClick={() => router.push(`/quiz/${pt.testId._id}`)}
                               className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                             >
                               <Play size={16} fill="white" />
                               START TEST NOW
                             </button>
                          )}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </section>

          {/* MARKETPLACE: SERIES BROWSER */}
          <section className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Zap size={18} />
                  Institutional Global Catalog
                </h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredSeries.map((s) => (
                  <div key={s._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col group hover:-translate-y-2 transition-all duration-300">
                     <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Layers size={24} />
                     </div>
                     <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-2">{s.title}</h4>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{s.category}</p>
                     
                     <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 italic">{s.description || "A comprehensive series of academic papers."}</p>
                     
                     <button
                        onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-xl"
                     >
                       Explore {s.isFinite ? `${s.maxPapers} Papers` : "Papers"}
                     </button>
                  </div>
                ))}

                {/* STANDALONE PAPERS IN CATALOG */}
                {availableTests.filter(t => !t.seriesId).map((test) => (
                  <div key={test._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col group hover:-translate-y-2 transition-all duration-300">
                     <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <FileText size={24} />
                     </div>
                     <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-2">{test.title}</h4>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 border border-emerald-100 px-3 py-1 rounded-full w-fit">Direct Session</p>
                     
                     <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 italic">{test.description || "Individual academic assessment paper."}</p>
                     
                     <button
                        onClick={() => handleJoinSession(test._id)}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-100"
                     >
                       Begin Session
                     </button>
                  </div>
                ))}
             </div>
          </section>

        </div>
      </main>
      
      {/* FIGMA: Global Ranking Side Panel */}
      <LeaderboardSidebar />
    </div>
  );
}
