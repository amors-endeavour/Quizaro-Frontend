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
  ArrowRight,
  BookOpen,
  Layers,
  Zap,
  Info,
  ChevronRight
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
        const { data } = await API.get("/user/resources");
        setResources(data);
      } catch (err) {
        console.error("Failed to load resources", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];
  const filtered = resources.filter(r => 
    (category === "All" || r.category === category) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading && resources.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic leading-none">
        Accessing Institutional Knowledge Mesh...
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-[#050816] transition-colors duration-500">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName="" />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <UserHeader 
          title="Institutional Knowledge Hub" 
          breadcrumbs={["Intelligence", "Knowledge Registry"]} 
        />

        <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1600px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
           
           {/* CATEGORY SELECTOR HUD */}
           <div className="bg-white dark:bg-[#0a0f29] p-8 lg:p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10 transition-all duration-700">
              <div className="flex items-center gap-6 px-4">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800/30"><Layers size={24} /></div>
                 <div className="space-y-1">
                    <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] italic leading-none">Sector Classification</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Institutional Knowledge Segmentation Matrix</p>
                 </div>
              </div>

              <div className="flex items-center gap-5 overflow-x-auto custom-scrollbar-horizontal pb-4 px-4">
                 {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap border-2 italic active:scale-95 tabular-nums leading-none ${
                        category === cat 
                        ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-900/40" 
                        : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                      }`}
                    >
                       {cat.toUpperCase()}
                    </button>
                 ))}
              </div>
           </div>

           {/* SEARCH TERMINAL */}
           <div className="relative group max-w-5xl mx-auto w-full group/search">
              <div className="absolute inset-0 bg-blue-600/5 rounded-[3.5rem] blur-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-1000" />
              <div className="absolute inset-y-0 left-12 flex items-center text-gray-300 dark:text-gray-800 group-focus-within/search:text-blue-600 transition-all duration-700 relative z-10">
                 <Search size={32} />
              </div>
              <input 
                type="text" 
                placeholder="Synchronize Search (Study Manuals, Intelligence Nodes, Asset Registers)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[3.5rem] py-10 pl-32 pr-12 text-2xl font-black text-gray-900 dark:text-white focus:outline-none focus:border-blue-600 transition-all duration-700 placeholder:text-gray-200 dark:placeholder:text-gray-900 italic tracking-tighter uppercase shadow-sm relative z-10"
              />
           </div>

           {/* KNOWLEDGE GRID */}
           <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-8">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-2 border-blue-100 dark:border-blue-800/30 rounded-[1.5rem] flex items-center justify-center shadow-sm group hover:rotate-6 transition-all duration-500"><BookOpen size={32} /></div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Preserved Intelligence Nodes</h3>
                       <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Global Knowledge Mesh Synchronization Hub</p>
                    </div>
                 </div>
                 <div className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-full text-[11px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] italic leading-none shadow-sm tabular-nums">
                    {filtered.length} Synchronized Assets
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                 {filtered.length === 0 ? (
                   <div className="md:col-span-3 py-48 text-center bg-gray-50/50 dark:bg-[#0a0f29] rounded-[5rem] border-4 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-10 transition-all duration-1000 group">
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-1000" />
                      <div className="w-28 h-28 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-[3.5rem] flex items-center justify-center text-gray-100 dark:text-gray-900 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 relative z-10"><Zap size={56} /></div>
                      <p className="text-[14px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.5em] italic leading-none relative z-10">No Knowledge Nodes Located In Current Spectral Sector</p>
                   </div>
                 ) : (
                   filtered.map((r) => (
                      <div 
                         key={r._id} 
                         className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[4.5rem] p-12 flex flex-col hover:border-blue-600/50 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-700 group relative overflow-hidden active:scale-[0.98]"
                      >
                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
                         <div className="flex items-center justify-between mb-12 relative z-10">
                            <div className="w-18 h-18 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800/30 rounded-[1.5rem] flex items-center justify-center text-blue-600 dark:text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-inner shadow-blue-900/5"><FileText size={36} /></div>
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] bg-blue-50/50 dark:bg-blue-900/10 px-5 py-2.5 rounded-full border border-blue-100 dark:border-blue-800/30 italic tabular-nums leading-none">{r.category}</span>
                         </div>
                         <div className="space-y-4 mb-12 relative z-10">
                            <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">{r.title}</h4>
                            <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic">
                               <Zap size={12} className="text-blue-600/50" />
                               <span>NODE-UPLINK: {r._id.slice(-10).toUpperCase()}</span>
                            </div>
                         </div>
                         <p className="text-[14px] text-gray-500 dark:text-gray-400 font-black mb-16 line-clamp-4 italic leading-relaxed uppercase tracking-tight relative z-10">{r.description || "Foundational institutional intelligence asset synchronized for neural refinement."}</p>
                         
                         <a 
                           href={r.fileUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="w-full mt-auto py-7 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-700 shadow-xl shadow-blue-900/5 active:scale-95 flex items-center justify-center gap-4 relative z-10 italic group/btn"
                         >
                           <Download size={22} className="group-hover/btn:translate-y-0.5 transition-transform" /> Fetch Intelligence Asset
                         </a>
                      </div>
                    )))}
                </div>
             </section>
        </div>

        <div className="fixed bottom-12 right-12 z-[50] group">
           <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
           <button className="w-18 h-18 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl relative z-10 active:scale-90 transition-transform">
              <Info size={32} />
           </button>
        </div>
      </div>
    </div>
  );
}
