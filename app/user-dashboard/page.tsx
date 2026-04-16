"use client";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

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
  Layers,
  AlertCircle,
  Bookmark,
  Sparkles,
  Flame,
  Star
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
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'alert' | 'error'} | null>(null);

  // Phase 3.1 & 3.2 — Gamification & Favorites State
  const [gamification, setGamification] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [heatmapValues, setHeatmapValues] = useState<{date: string, count: number}[]>([]);

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

  const [recommendations, setRecommendations] = useState<Series[]>([]);

  useEffect(() => {
    if (!isAuthChecked) return;
    const loadData = async () => {
      try {
        const [availableRes, purchasedRes, seriesRes, attemptsRes, badgeRes, favRes] = await Promise.all([
          API.get("/user/tests/available"),
          API.get("/user/tests/purchased"),
          API.get("/series"),
          API.get("/user/attempts"),
          API.get("/user/badges"),
          API.get("/user/favorites")
        ]);
        
        setAvailableTests(availableRes.data);
        setPurchasedTests(purchasedRes.data);
        setSeries(seriesRes.data);
        setGamification(badgeRes.data);
        setFavorites(favRes.data);

        // RECOMMENDATION ENGINE & HEATMAP 🔥
        const attempts = attemptsRes.data;

        // Calculate heatmap values
        const attemptStats: Record<string, number> = {};
        attempts.forEach((a: any) => {
          if (a.submittedAt || a.createdAt) {
            const d = new Date(a.submittedAt || a.createdAt).toISOString().split('T')[0];
            attemptStats[d] = (attemptStats[d] || 0) + 1;
          }
        });
        setHeatmapValues(Object.keys(attemptStats).map(k => ({ date: k, count: attemptStats[k] })));

        if (attempts.length > 0) {
           const categoryStats: Record<string, { total: number, count: number }> = {};
           attempts.forEach((att: any) => {
              const cat = att.testId?.category || "General";
              if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };
              categoryStats[cat].total += att.percentage || 0;
              categoryStats[cat].count += 1;
           });

           // Find lowest performing category
           let weakestCat = "General";
           let lowestAvg = 100;
           Object.keys(categoryStats).forEach(cat => {
              const avg = categoryStats[cat].total / categoryStats[cat].count;
              if (avg < lowestAvg) {
                 lowestAvg = avg;
                 weakestCat = cat;
              }
           });

           // Get unpurchased series in this category
           const recs = seriesRes.data.filter((s: any) => 
             s.category === weakestCat && 
             !purchasedRes.data.some((pt: any) => pt.testId.seriesId === s._id)
           ).slice(0, 2);
           
           setRecommendations(recs);
        }
      } catch (err) {
        console.error("Data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthChecked]);

  // Combined logic for search and filter
  const filteredSeries = filterCategory === "Favorites"
    ? favorites.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
    : series.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                              s.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === "All" || s.category === filterCategory;
        return matchesSearch && matchesCategory;
      });


  const handleJoinSession = async (testId: string) => {
    try {
      setLoading(true);
      const res = await API.post(`/test/purchase/${testId}`);
      router.push(`/quiz/${testId}`);
    } catch (err: any) {
      if (err.response?.status === 402) {
         setStatusMsg({ text: "Premium Paper: institutional access token or transaction required.", type: 'alert' });
         setTimeout(() => setStatusMsg(null), 5000);
      } else {
         setStatusMsg({ text: "Registration Failed: active credentials validation required.", type: 'error' });
         setTimeout(() => setStatusMsg(null), 3000);
      }
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (seriesId: string) => {
    try {
      await API.post(`/user/favorites/${seriesId}`);
      // Optimistic update
      const isFav = favorites.find((f: any) => f._id === seriesId);
      if (isFav) {
        setFavorites(favorites.filter((f: any) => f._id !== seriesId));
      } else {
        const fullSeries = series.find(s => s._id === seriesId);
        if (fullSeries) setFavorites([...favorites, fullSeries]);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

  const categories = ["All", "Favorites", ...Array.from(new Set(series.map(s => s.category)))];

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
          
          {/* GAMIFICATION HUD & PERFORMANCE TRACKER */}
          {gamification && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Streak Counter */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-orange-500/20 text-white relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 blur-2xl rounded-full" />
                  <div className="z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-100 mb-2">Active Streak</p>
                    <p className="text-4xl font-black">{gamification.streak || 0} <span className="text-sm font-bold opacity-80">Days</span></p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center z-10 animate-pulse"><Flame size={32} /></div>
                </div>

                {/* Badges Showcase */}
                <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-[2.5rem] flex flex-col justify-center shadow-xl shadow-gray-100 overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Earned Badges Showcase</p>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {gamification.badges && gamification.badges.length > 0 ? (
                      gamification.badges.map((badge: any, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-2 group flex-shrink-0">
                          <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-50 group-hover:-translate-y-1 transition-transform cursor-help pb-1" title={badge.description || badge.name}>
                            <Award size={28} />
                          </div>
                          <span className="text-[9px] font-black text-gray-900 uppercase tracking-tight">{badge.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-gray-300 italic">No badges earned yet. Complete tests to begin.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Performance Heatmap */}
              <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] flex flex-col justify-center shadow-xl shadow-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Activity Heatmap</h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[700px] heatmap-container">
                    <CalendarHeatmap
                      startDate={new Date(new Date().setMonth(new Date().getMonth() - 5))}
                      endDate={new Date()}
                      values={heatmapValues}
                      classForValue={(value) => {
                        if (!value || value.count === 0) return 'color-empty opacity-20';
                        return `color-scale-${Math.min(value.count, 4)} text-green-500`;
                      }}
                      tooltipDataAttrs={(value: any) => {
                         if (!value || !value.date) return null;
                         return { 'data-tooltip': `${value.date}: ${value.count} tests` };
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
          
          {/* PERSONALIZED IMPROVEMENT HUB (NEW) 🔥 */}
          {recommendations.length > 0 && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3">
                    <TrendingUp size={18} />
                    Personalization: Focus Required
                  </h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                  {recommendations.map(s => (
                    <div key={s._id} className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-200 group relative overflow-hidden">
                       <div className="relative z-10">
                          <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 inline-block backdrop-blur-md">Recommended for Growth</span>
                          <h4 className="text-xl font-black text-white tracking-tight mb-2">{s.title}</h4>
                          <p className="text-[11px] text-blue-100 font-bold mb-8 italic line-clamp-2">Based on your performance in {s.category}, we suggest mastering this series next.</p>
                          
                          <button
                            onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                            className="bg-white text-blue-600 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                          >
                             Enforce Subject Mastery
                          </button>
                       </div>
                       
                       {/* Decorative BG pattern */}
                       <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                          <Award size={200} />
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          )}

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
                  <div key={s._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col group hover:-translate-y-2 transition-all duration-300 relative">
                     <button 
                        onClick={() => handleToggleFavorite(s._id)}
                        className={`absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center transition-all z-10 ${
                          favorites.some(f => f._id === s._id) ? "bg-amber-50 text-amber-500 shadow-lg shadow-amber-50" : "bg-gray-50 text-gray-300 hover:text-amber-500 hover:bg-amber-50"
                        }`}
                     >
                        <Bookmark size={16} fill={favorites.some(f => f._id === s._id) ? "currentColor" : "none"} />
                     </button>
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
                  <div key={test._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                     {/* PREMIUM BADGE 🔥 */}
                     {test.price > 0 && (
                        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                           <Lock size={10} className="text-amber-600" />
                           <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Premium</span>
                        </div>
                     )}

                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all ${test.price > 0 ? "bg-amber-50 text-amber-600 shadow-amber-50 group-hover:bg-amber-600 group-hover:text-white" : "bg-emerald-50 text-emerald-600 shadow-emerald-50 group-hover:bg-emerald-600 group-hover:text-white"}`}>
                        <FileText size={24} />
                     </div>
                     <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-2">{test.title}</h4>
                     <p className={`text-[10px] font-black uppercase tracking-widest mb-6 border px-3 py-1 rounded-full w-fit ${test.price > 0 ? "text-amber-500 border-amber-100" : "text-emerald-500 border-emerald-100"}`}>
                        {test.price > 0 ? `₹${test.price} Access Fee` : "Direct Session"}
                     </p>
                     
                     <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 italic">{test.description || "Individual academic assessment paper."}</p>
                     
                     <button
                        onClick={() => handleJoinSession(test._id)}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-xl ${test.price > 0 ? "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-100" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100"}`}
                     >
                       {test.price > 0 ? `Unlock Paper (₹${test.price})` : "Begin Session"}
                     </button>
                  </div>
                ))}
             </div>
          </section>

        </div>
      </main>
      
      {/* FIGMA: Global Ranking Side Panel */}
      <LeaderboardSidebar />

      {/* INSTITUTIONAL STATUS HUD 🔥 */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[300] px-8 py-5 rounded-[2rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-4 ${statusMsg.type === 'success' ? "bg-white border-green-100 text-green-600" : statusMsg.type === 'alert' ? "bg-white border-amber-100 text-amber-600" : "bg-white border-red-100 text-red-600"}`}>
           <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-50" : statusMsg.type === 'alert' ? "bg-amber-50" : "bg-red-50"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest leading-none">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
