"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import API from "@/app/lib/api";
import { 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Search, 
  ArrowRight, 
  Clock,
  ChevronRight,
  Download,
  Info,
  Layers,
  Zap,
  Filter,
  Activity,
  Award
} from "lucide-react";

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  totalQuestions: number;
  seriesId?: string;
  paperNumber?: number;
}

export default function TestsPage() {
  const router = useRouter();
  const [seriesId, setSeriesId] = useState<string | null>(null);
  
  const [tests, setTests] = useState<Test[]>([]);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'alert' | 'error'} | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSeriesId(params.get("seriesId"));
    }
  }, []);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        if (seriesId) {
          const { data } = await API.get(`/series/${seriesId}`);
          setSeriesTitle(data.series.title);
          setTests(data.papers);
        } else {
          const { data } = await API.get("/tests");
          setTests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch library context:", err);
      } finally {
        setLoading(false);
      }
    };
    if (seriesId !== undefined) fetchContext();
  }, [seriesId]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/user/profile");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLaunchPaper = async (testId: string) => {
    if (!isAuthenticated) {
      router.push("/user-login");
      return;
    }
    try {
      setLoading(true);
      await API.post(`/test/purchase/${testId}`);
      router.push(`/quiz/${testId}`);
    } catch (err: any) {
      if (err.response?.status === 402) {
         setStatusMsg({ text: "Premium Paper Cluster: Institutional access required.", type: 'alert' });
         setTimeout(() => setStatusMsg(null), 5000);
      } else if (err.response?.status === 400) {
         router.push(`/quiz/${testId}`);
         return;
      } else {
         setStatusMsg({ text: "Registry access restricted in current session.", type: 'error' });
         setTimeout(() => setStatusMsg(null), 3000);
      }
      setLoading(false);
    }
  }

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase()) ||
    test.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && tests.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
        <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
        <div className="text-center font-black text-blue-600 dark:text-blue-400 tracking-[0.5em] uppercase animate-pulse leading-none text-[10px] italic">
           Synchronizing Registry Node Matrix...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-600 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      <div className="max-w-[1700px] mx-auto px-10 py-32 lg:py-48 pb-32">
        <div className="flex flex-col xl:flex-row justify-between items-end gap-16 mb-32 animate-in fade-in slide-in-from-top-10 duration-1000">
           <div className="space-y-10 flex-1 w-full">
              <div className="flex items-center gap-10">
                 <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 group hover:rotate-12 transition-transform duration-700 border-4 border-white dark:border-[#050816] shrink-0">
                    <BookOpen size={40} />
                 </div>
                 <div className="space-y-3">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-none truncate max-w-[800px]">
                      {seriesTitle || "Intelligence Registry"}
                    </h1>
                    <p className="text-[12px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.5em] italic leading-none pt-2">
                      {seriesId ? "Institutional Series Sequence Node // Cluster Active" : "Complete Platform Assessment Catalog // Global Mesh"}
                    </p>
                 </div>
              </div>
              
              {seriesId && isAuthenticated && (
                <button 
                  onClick={async () => {
                    // Logic already handled via handleLaunchPaper per individual test
                  }}
                  className="px-14 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 flex items-center gap-6 w-fit active:scale-[0.98] italic group"
                >
                  Synchronize Sequence Enrollment
                  <Zap size={24} className="group-hover:scale-125 transition-transform" />
                </button>
              )}
           </div>
           
           <div className="w-full xl:w-[600px] relative group/search">
              <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] blur-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-700" />
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-800 group-focus-within/search:text-blue-600 transition-all duration-700 relative z-10" size={32} />
              <input
                type="text"
                placeholder="Locate intelligence nodes within spectral mesh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[3rem] pl-28 pr-12 py-9 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-[#050816] transition-all duration-700 font-black text-[20px] text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-900 shadow-2xl shadow-blue-900/5 dark:shadow-none italic tracking-tighter relative z-10"
              />
           </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-56 bg-white dark:bg-[#0a0f29] rounded-[6rem] border-4 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-12 animate-in zoom-in-95 duration-1000 shadow-sm group">
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-1000" />
            <Layers size={80} className="text-gray-100 dark:text-gray-900 group-hover:scale-110 transition-transform duration-1000 relative z-10" />
            <p className="text-[14px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.5em] italic leading-none relative z-10">No Intellectual Assets Located In Selective Registry Mesh</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {filteredTests.map((test, idx) => (
              <div
                key={test._id}
                className="bg-white dark:bg-[#0a0f29] rounded-[5rem] border border-gray-100 dark:border-gray-800 p-14 hover:border-blue-600/50 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-700 group flex flex-col relative overflow-hidden shadow-sm active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-10 mb-14 relative z-10">
                   <div className="w-24 h-24 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 text-gray-200 dark:text-gray-800 rounded-[2.5rem] flex items-center justify-center font-black text-2xl italic group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:rotate-12 transition-all duration-1000 shadow-inner shrink-0">
                      {test.paperNumber ? `P${test.paperNumber}` : "★"}
                   </div>
                   <div className="flex-1 min-w-0 space-y-4">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors uppercase italic truncate">{test.title}</h3>
                      <div className="flex items-center gap-6">
                        <div className="px-6 py-2.5 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 rounded-full text-[11px] font-black uppercase tracking-[0.2em] italic leading-none shadow-sm">{test.duration || 30} Min Provision</div>
                        <div className="w-2 h-2 rounded-full bg-blue-600/30 animate-pulse" />
                      </div>
                   </div>
                </div>

                {test.description && (
                  <p className="text-gray-500 dark:text-gray-700 font-black text-[15px] mb-14 line-clamp-3 leading-relaxed italic relative z-10 uppercase tracking-tight">{test.description}</p>
                )}

                <div className="mt-auto pt-12 border-t-2 border-gray-50 dark:border-gray-800 flex items-center justify-between relative z-10">
                   <div className="flex flex-col gap-3">
                      <span className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.4em] leading-none italic">Inquiry Nodes</span>
                      <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none italic tabular-nums">{test.totalQuestions || 0}</span>
                   </div>

                   {test.price > 0 ? (
                      <div className="flex flex-col items-end gap-3 pr-6">
                         <span className="text-[11px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.4em] leading-none italic">Registry Token</span>
                         <div className="flex items-center gap-3">
                            <span className="text-4xl font-black text-amber-600 dark:text-amber-500 tracking-tighter leading-none italic tabular-nums">₹{test.price}</span>
                            <Zap size={20} className="text-amber-500" />
                         </div>
                      </div>
                   ) : (
                      <div className="flex flex-col items-end gap-3 pr-6">
                         <span className="text-[11px] font-black text-green-600 dark:text-green-500 uppercase tracking-[0.4em] leading-none italic">Access Node</span>
                         <div className="flex items-center gap-3">
                            <span className="text-4xl font-black text-green-600 dark:text-green-500 tracking-tighter leading-none italic uppercase">Free</span>
                            <CheckCircle2 size={24} className="text-green-500" />
                         </div>
                      </div>
                   )}
                </div>
                
                <button
                  onClick={() => handleLaunchPaper(test._id)}
                  className={`mt-12 w-full py-8 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.3em] transition-all duration-700 shadow-2xl active:scale-[0.98] italic flex items-center justify-center gap-6 group/btn relative overflow-hidden ${test.price > 0 ? "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-900/30" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/30"}`}
                >
                  <span className="relative z-10 flex items-center gap-6">
                    {!isAuthenticated ? "Authorize Access Node" : test.price > 0 ? `Unlock Paper Protocol` : "Initiate Paper Protocol"}
                    <ChevronRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-32 pt-16 border-t-2 border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-12 opacity-50 italic">
           <div className="flex items-center gap-8">
              <Activity size={24} className="text-blue-600 dark:text-blue-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 dark:text-gray-700">Institutional Registry Active // Sync Integrity 99.98%</p>
           </div>
           <div className="flex items-center gap-10">
              <Link href="/about" className="text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">Governance</Link>
              <Link href="/contact" className="text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">Support</Link>
              <Award size={24} className="text-gray-300 dark:text-gray-800" />
           </div>
        </div>
      </div>

      {statusMsg && (
        <div className={`fixed bottom-12 left-12 z-[700] px-12 py-8 rounded-[3.5rem] border-2 shadow-2xl animate-in slide-in-from-left-12 duration-700 flex items-center gap-10 backdrop-blur-3xl bg-white/90 dark:bg-[#0a0f29]/90 transition-all ${statusMsg.type === 'success' ? "border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400" : statusMsg.type === 'alert' ? "border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400" : "border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"}`}>
           <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl ${statusMsg.type === 'success' ? "bg-green-50 dark:bg-green-900/20" : statusMsg.type === 'alert' ? "bg-amber-50 dark:bg-amber-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
           </div>
           <p className="text-[15px] font-black uppercase tracking-widest leading-none italic">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
