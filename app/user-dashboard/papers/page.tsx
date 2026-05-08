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
  Filter,
  Activity
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        const [profileRes, seriesRes] = await Promise.all([
          API.get("/user/profile"),
          API.get("/catalog/series")
        ]);
        setUser(profileRes.data.user || profileRes.data);
        setSeries(seriesRes.data);
      } catch (err) {
        console.error("Failed to load institutional papers", err);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, []);

  const filteredSeries = series.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#fbfbfe] text-gray-900 font-sans overflow-hidden transition-colors duration-500">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={user?.name || "Scholar"} />
      
      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Intelligence Registry" 
          breadcrumbs={["Intelligence", "Institutional Papers"]} 
        />

        <div className="p-8 lg:p-14 max-w-[1700px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
           
           {/* SEARCH & FILTER HUD */}
           <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 relative group w-full">
                 <div className="absolute inset-y-0 left-8 flex items-center text-gray-300 group-focus-within:text-blue-600 transition-colors">
                    <Search size={22} strokeWidth={3} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Decrypt paper series by title or institutional category..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full bg-white border-2 border-gray-50 rounded-[2.5rem] py-7 pl-20 pr-10 text-base font-black text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder:text-gray-300 italic tracking-tight shadow-sm"
                 />
              </div>
              <div className="flex items-center gap-6 w-full lg:w-auto">
                 <div className="bg-blue-50/50 border-2 border-blue-100 p-3 rounded-3xl flex items-center gap-4 px-8 shadow-sm">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Activity size={20} /></div>
                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest italic">{series.length} Series Nodes</p>
                 </div>
              </div>
           </div>

           {/* SERIES GRID */}
           <section className="space-y-12">
              <div className="flex items-center gap-6 px-8">
                 <div className="w-2 h-10 bg-blue-600 rounded-full" />
                 <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Institutional Series Mesh</h3>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="h-96 bg-white border-2 border-gray-50 rounded-[4rem] animate-pulse shadow-sm" />
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                   {filteredSeries.map((s) => (
                     <div 
                        key={s._id} 
                        className="bg-white border-2 border-gray-50 rounded-[4.5rem] p-12 flex flex-col hover:border-blue-600 hover:shadow-2xl transition-all duration-700 group relative overflow-hidden active:scale-[0.98]"
                     >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                        
                        <div className="flex items-center justify-between mb-12 relative z-10">
                           <div className="w-16 h-16 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm"><Layers size={28} /></div>
                           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-6 py-2 rounded-full border-2 border-blue-100 italic leading-none">{s.category}</span>
                        </div>

                        <div className="space-y-4 mb-12 relative z-10">
                           <h4 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter leading-none line-clamp-2">{s.title}</h4>
                           <p className="text-[12px] text-gray-400 font-black italic line-clamp-2 uppercase tracking-widest leading-relaxed">{s.description || "Foundational institutional assessment node synchronized with latest syllabus."}</p>
                        </div>
                        
                        <div className="mt-auto pt-8 border-t-2 border-gray-50 flex items-center justify-between relative z-10">
                           <div className="space-y-1">
                              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest italic">Node Capacity</p>
                              <p className="text-[12px] font-black text-gray-900 italic">{s.maxPapers} Protocol Units</p>
                           </div>
                           <button
                              onClick={() => router.push(`/tests?seriesId=${s._id}`)}
                              className="px-10 py-5 bg-gray-900 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 italic"
                           >
                             Explore Grid
                           </button>
                        </div>
                     </div>
                   ))}

                   {filteredSeries.length === 0 && (
                      <div className="col-span-full py-48 text-center bg-gray-50/50 rounded-[5rem] border-4 border-dashed border-gray-100 flex flex-col items-center gap-12 transition-all duration-1000">
                         <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center text-gray-100 shadow-2xl border-2 border-gray-50"><Layers size={64} /></div>
                         <div className="space-y-6">
                            <p className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Series Registry Null</p>
                            <p className="text-[14px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">No intelligence nodes matched your query</p>
                         </div>
                      </div>
                   )}
                </div>
              )}
           </section>
        </div>
      </main>
    </div>
  );
}
