"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import { 
  FileText,
  Download,
  Search,
  Filter,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  category: string;
  createdAt: string;
}

export default function UserResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await API.get("/catalog/resources");
        setResources(data);
      } catch (err) {
        console.error("Failed to load resources", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = ["All", ...new Set(resources.map(r => r.category))];
  const filtered = resources.filter(r => 
    (category === "All" || r.category === category) &&
    (r.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-[#050816]">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName="" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <UserHeader 
          title="Knowledge Mesh" 
          breadcrumbs={["Intelligence", "Manuals & Study Notes"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-12 animate-in fade-in duration-700">
           
           {/* CATEGORY SELECTOR */}
           <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
              {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setCategory(cat)}
                   className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${category === cat ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"}`}
                 >
                    {cat}
                 </button>
              ))}
           </div>

           {/* SEARCH HUD */}
           <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center text-gray-500 group-focus-within:text-blue-500 transition-colors">
                 <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Synchronize with study materials and intellectual assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-sm font-black text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600 italic tracking-tight"
              />
           </div>

           {/* RESOURCE GRID */}
           <section className="space-y-8 pb-20">
              <div className="flex items-center gap-4 px-4">
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic">intellectual asset mesh</h3>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-[3rem] animate-pulse" />
                   ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                   <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">No assets detected in this spectral range.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filtered.map((r) => (
                     <div 
                        key={r._id} 
                        className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all duration-500 group relative"
                     >
                        <div className="flex items-center justify-between mb-8">
                           <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-500"><FileText size={24} /></div>
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">{r.fileType}</span>
                           </div>
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic mb-4 leading-none group-hover:text-cyan-400 transition-colors">{r.title}</h4>
                        <p className="text-[11px] text-gray-500 font-bold mb-10 line-clamp-2 italic leading-relaxed font-black">{r.description || "Foundational intellectual document."}</p>
                        
                        <a 
                          href={r.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full mt-auto py-5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-400 hover:text-black transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                        >
                          <Download size={16} /> Decrypt Asset
                        </a>
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
