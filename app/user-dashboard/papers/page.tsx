"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import { 
  BookOpen,
  ArrowRight,
  Layers,
  Search,
  Filter
} from "lucide-react";

interface Series {
  _id: string;
  title: string;
  description: string;
  category: string;
  isFinite: boolean;
  maxPapers: number;
}

export default function UserPapersPage() {
  const router = useRouter();
  const [series, setSeries] = useState<Series[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const { data } = await API.get("/catalog/series");
        setSeries(data);
      } catch (err) {
        console.error("Failed to load series", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, []);

  const filteredSeries = series.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-[#050816] transition-colors duration-300">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName="" />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <UserHeader 
          title="Intelligence Registry" 
          breadcrumbs={["Intelligence", "Institutional Papers"]} 
        />

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-12 animate-in fade-in duration-700">
           
           {/* SEARCH & FILTER HUD */}
           <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-2xl w-full group">
                 <div className="absolute inset-y-0 left-6 flex items-center text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <Search size={18} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Decrypt paper series by title or institutional category..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] py-6 pl-16 pr-8 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 italic tracking-tight shadow-sm"
                 />
              </div>
              <div className="flex gap-4">
                 <button className="px-8 py-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-3">
                    <Filter size={16} /> Filter
                 </button>
              </div>
           </div>

           {/* SERIES GRID */}
           <section className="space-y-8">
              <div className="flex items-center gap-4 px-4">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                 <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.4em] italic">Available Series Mesh</h3>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="h-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] animate-pulse" />
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                   {filteredSeries.map((s) => (
                     <div 
                        key={s._id} 
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-10 flex flex-col hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 dark:bg-blue-600/10 blur-[50px] rounded-full group-hover:bg-blue-600/10 dark:group-hover:bg-blue-600/20 transition-all" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                           <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><Layers size={24} /></div>
                           <span className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800">{s.category}</span>
                        </div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-4 leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">{s.title}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-10 line-clamp-2 italic leading-relaxed font-black relative z-10">{s.description || "Comprehensive multi-paper series."}</p>
                        
                        <button
                           onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                           className="w-full mt-auto py-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white hover:border-blue-600 transition shadow-sm active:scale-95 relative z-10"
                        >
                          Explore System Grid
                        </button>
                     </div>
                   ))}
                </div>
              )}
           </section>
        </div>
      </div>
    </div>
  );
}
