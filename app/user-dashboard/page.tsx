"use client";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as tf from '@tensorflow/tfjs';
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
  const [recommendations, setRecommendations] = useState<Series[]>([]);

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

      // 2. Safety Timeout (Ensures UI doesn't hang forever)
      const safetyTimeout = setTimeout(() => {
        setLoading(false);
        setIsAuthChecked(true);
      }, 8000);

      try {
        // 3. Identity Handshake
        const { data: profile } = await API.get("/user/profile");
        const role = (profile?.role || profile?.user?.role)?.toLowerCase();
        
        if (role === "admin") {
          router.replace("/admin-dashboard");
          return;
        }

        setUser(profile?.user || profile);
        setIsAuthChecked(true);

        // 4. Sequence Data Loading (More robust than Promise.all for high-latency connections)
        try {
          const [available, purchased, seriesList, attempts, badges, favs] = await Promise.all([
            API.get("/user/tests/available"),
            API.get("/user/tests/purchased"),
            API.get("/series"),
            API.get("/user/attempts"),
            API.get("/user/badges"),
            API.get("/user/favorites")
          ]);

          setAvailableTests(available.data);
          setPurchasedTests(purchased.data);
          setSeries(seriesList.data);
          setGamification(badges.data);
          setFavorites(favs.data);

          // Build Insights
          const attemptData = attempts.data || [];
          const attemptStats: Record<string, number> = {};
          attemptData.forEach((a: any) => {
            const dStr = a.submittedAt || a.createdAt;
            if (dStr) {
               const d = new Date(dStr).toISOString().split('T')[0];
               attemptStats[d] = (attemptStats[d] || 0) + 1;
            }
          });
          setHeatmapValues(Object.keys(attemptStats).map(k => ({ date: k, count: attemptStats[k] })));

          // TFJS Logic (Protected against empty data)
          if (attemptData.length > 0) {
             const categoryStats: Record<string, { total: number, count: number }> = {};
             attemptData.forEach((att: any) => {
                const cat = att.testId?.category || "General";
                if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };
                categoryStats[cat].total += att.percentage || 0;
                categoryStats[cat].count += 1;
             });

             const categories = Object.keys(categoryStats);
             if (categories.length > 0) {
                const averages = categories.map(cat => categoryStats[cat].total / categoryStats[cat].count);
                tf.engine().startScope();
                const weakestIndex = tf.tensor1d(averages).argMin().dataSync()[0];
                const weakestCat = categories[weakestIndex];
                
                const recs = seriesList.data.filter((s: any) => 
                  s.category === weakestCat && 
                  !purchased.data.some((pt: any) => pt.testId.seriesId === s._id)
                ).slice(0, 2);
                setRecommendations(recs);
                tf.engine().endScope();
             }
          }
        } catch (dataErr) {
          console.error("Secondary Data Load Failed:", dataErr);
        }
      } catch (authErr) {
        console.error("Authentication check failed:", authErr);
        router.replace("/user-login");
      } finally {
        clearTimeout(safetyTimeout);
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

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

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black text-cyan-400 animate-pulse tracking-widest uppercase">Initializing Intelligence Grid...</div>;

  return (
    <div className="flex h-screen bg-[#050816] text-white font-sans overflow-hidden">
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
                <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center shadow-2xl backdrop-blur-md overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Earned Badges Showcase</p>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {gamification.badges && gamification.badges.length > 0 ? (
                      gamification.badges.map((badge: any, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-2 group flex-shrink-0">
                          <div className="w-16 h-16 bg-white/5 border border-white/10 text-cyan-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-transform cursor-help pb-1" title={badge.description || badge.name}>
                            <Award size={28} />
                          </div>
                          <span className="text-[9px] font-black text-white uppercase tracking-tight">{badge.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-gray-600 italic">No badges earned yet. Complete tests to begin.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Performance Heatmap */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Activity Heatmap</h3>
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
                         if (!value || !value.date) return { 'data-tooltip': 'No assessments' } as any;
                         return { 'data-tooltip': `${value.date}: ${value.count} tests` } as any;
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
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-cyan-500/50 focus:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all font-bold text-sm tracking-tight text-white placeholder:text-gray-600"
                />
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterCategory === cat ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-900/20" : "bg-white/5 text-gray-500 border border-white/10 hover:border-white/30"}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </section>

          {/* ACTIVE SERIES PROGRESS */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <Play size={18} fill="currentColor" className="text-cyan-400" />
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
                    <div key={s._id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md group">
                       <div className="flex items-center justify-between mb-6">
                          <div>
                             <h4 className="text-lg font-black text-white tracking-tight">{s.title}</h4>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{completed} of {total} Papers Completed</p>
                          </div>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${progress === 100 ? "bg-cyan-400/10 text-cyan-400" : "bg-blue-600/10 text-blue-400"}`}>
                             {progress}%
                          </div>
                       </div>
                       <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6">
                          <div className={`h-full transition-all duration-1000 ${progress === 100 ? "bg-cyan-500" : "bg-gradient-to-r from-blue-600 to-indigo-700"}`} style={{ width: `${progress}%` }} />
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
                  <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-3">
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
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <Layers size={18} className="text-gray-500" />
                  Individual Paper Registry
                </h3>
             </div>

             <div className="grid grid-cols-1">
                {purchasedTests.length === 0 ? (
                  <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">No series purchased yet. Explore the marketplace below.</p>
                  </div>
                ) : (
                  purchasedTests.map((pt) => (
                    <div key={pt._id} className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg hover:shadow-cyan-500/5 hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 group backdrop-blur-md">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                             <FileText size={28} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-white leading-tight group-hover:text-cyan-400 transition-colors">{pt.testId.title}</h4>
                             <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{pt.testId.category || "General"}</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {pt.testId.duration} Min</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          {pt.isCompleted ? (
                             <button
                               onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                               className="px-8 py-3 bg-white/5 text-gray-400 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all"
                             >
                               <CheckCircle2 size={16} />
                               View Scorecard
                             </button>
                          ) : (
                             <button
                               onClick={() => router.push(`/quiz/${pt.testId._id}`)}
                               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95"
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
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <Zap size={18} className="text-yellow-400" />
                  Institutional Global Catalog
                </h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredSeries.map((s) => (
                  <div key={s._id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col group hover:-translate-y-2 transition-all duration-300 relative backdrop-blur-md">
                     <button 
                        onClick={() => handleToggleFavorite(s._id)}
                        className={`absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center transition-all z-10 ${
                          favorites.some(f => f._id === s._id) ? "bg-amber-400/20 text-amber-500 shadow-lg" : "bg-white/5 text-gray-600 hover:text-amber-500 hover:bg-white/10"
                        }`}
                     >
                        <Bookmark size={16} fill={favorites.some(f => f._id === s._id) ? "currentColor" : "none"} />
                     </button>
                     <div className="w-16 h-16 bg-white/5 border border-white/5 text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Layers size={24} />
                     </div>
                     <h4 className="text-lg font-black text-white tracking-tight leading-none mb-2">{s.title}</h4>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">{s.category}</p>
                     
                     <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 italic">{s.description || "A comprehensive series of academic papers."}</p>
                     
                     <button
                        onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 transition shadow-xl"
                     >
                       Explore {s.isFinite ? `${s.maxPapers} Papers` : "Papers"}
                     </button>
                  </div>
                ))}

                {/* STANDALONE PAPERS IN CATALOG */}
                {availableTests.filter(t => !t.seriesId).map((test) => (
                  <div key={test._id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                     {/* PREMIUM BADGE 🔥 */}
                     {test.price > 0 && (
                        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 rounded-full border border-amber-400/30">
                           <Lock size={10} className="text-amber-500" />
                           <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Premium</span>
                        </div>
                     )}

                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all ${test.price > 0 ? "bg-amber-400/10 text-amber-500 border border-amber-400/10" : "bg-cyan-400/10 text-cyan-400 border border-cyan-400/10"}`}>
                        <FileText size={24} />
                     </div>
                     <h4 className="text-lg font-black text-white tracking-tight leading-none mb-2">{test.title}</h4>
                     <p className={`text-[10px] font-black uppercase tracking-widest mb-6 border px-3 py-1 rounded-full w-fit ${test.price > 0 ? "text-amber-500 border-amber-500/30" : "text-cyan-500 border-cyan-500/30"}`}>
                        {test.price > 0 ? `₹${test.price} Access Fee` : "Direct Session"}
                     </p>
                     
                     <p className="text-[11px] text-gray-500 font-bold mb-8 line-clamp-2 italic">{test.description || "Individual academic assessment paper."}</p>
                     
                     <button
                        onClick={() => handleJoinSession(test._id)}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-2xl ${test.price > 0 ? "bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-amber-900/20" : "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-cyan-900/20"}`}
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
