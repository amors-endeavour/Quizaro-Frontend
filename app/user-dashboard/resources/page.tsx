"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import { 
  FileText,
  Download,
  Search,
  Layers,
  BookOpen,
  Zap,
  Info,
  Activity
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        const [profileRes, resourcesRes] = await Promise.all([
          API.get("/user/profile"),
          API.get("/user/resources")
        ]);
        setUser(profileRes.data.user || profileRes.data);
        setResources(resourcesRes.data);
      } catch (err) {
        console.error("Failed to load institutional knowledge mesh", err);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, []);

  const categories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];
  const filtered = resources.filter(r => 
    (category === "All" || r.category === category) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading && !user) return (
    <div className="min-h-screen bg-[#fbfbfe] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 uppercase tracking-[0.5em] text-[10px] italic leading-none text-center">
        Accessing Institutional <br/> Knowledge Mesh...
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fbfbfe] text-gray-900 font-sans overflow-hidden transition-colors duration-500">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={user?.name || "Scholar"} />
      
      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Institutional Knowledge Hub" 
          breadcrumbs={["Intelligence", "Knowledge Registry"]} 
        />

        <div className="p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
           
           {/* CATEGORY SELECTOR HUD */}
           <div className="bg-white p-12 rounded-[4rem] border-2 border-gray-50 shadow-sm space-y-12 transition-all duration-700">
              <div className="flex items-center gap-6 px-4">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-sm border-2 border-blue-100 group-hover:rotate-6 transition-all"><Layers size={32} /></div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Sector Classification</h3>
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic leading-none">Institutional Knowledge Segmentation Matrix</p>
                 </div>
              </div>

              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-4 px-4">
                 {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-12 py-6 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-700 whitespace-nowrap border-2 italic active:scale-95 leading-none ${
                        category === cat 
                        ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-900/30" 
                        : "bg-white border-gray-100 text-gray-400 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                       {cat.toUpperCase()}
                    </button>
                 ))}
              </div>
           </div>

           {/* SEARCH TERMINAL */}
           <div className="relative group w-full max-w-[1200px] mx-auto">
              <div className="absolute inset-y-0 left-10 flex items-center text-gray-300 group-focus-within:text-blue-600 transition-colors">
                 <Search size={28} strokeWidth={3} />
              </div>
              <input 
                type="text" 
                placeholder="Synchronize Search (Study Manuals, Intelligence Nodes, Asset Registers)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border-2 border-gray-50 rounded-[3.5rem] py-10 pl-24 pr-12 text-xl font-black text-gray-900 focus:outline-none focus:border-blue-600 transition-all duration-700 placeholder:text-gray-200 italic tracking-tight shadow-sm"
              />
           </div>

           {/* KNOWLEDGE GRID */}
           <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-8">
                 <div className="flex items-center gap-8">
                    <div className="w-2 h-10 bg-blue-600 rounded-full" />
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Preserved Intelligence Nodes</h3>
                       <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.4em] italic leading-none">Global Knowledge Mesh Synchronization Hub</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 px-8 py-3 bg-blue-50 border-2 border-blue-100 rounded-full text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] italic leading-none shadow-sm">
                    <Activity size={16} /> {filtered.length} Synchronized Assets
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                 {filtered.length === 0 ? (
                    <div className="md:col-span-full py-48 text-center bg-gray-50/50 rounded-[5rem] border-4 border-dashed border-gray-100 flex flex-col items-center gap-10 transition-all duration-1000">
                       <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center text-gray-100 shadow-2xl border-2 border-gray-50"><Zap size={64} /></div>
                       <p className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Knowledge Registry Null</p>
                    </div>
                 ) : (
                    filtered.map((r) => (
                       <div 
                          key={r._id} 
                          className="bg-white border-2 border-gray-50 rounded-[4.5rem] p-12 flex flex-col hover:border-blue-600 hover:shadow-2xl transition-all duration-700 group relative overflow-hidden active:scale-[0.98]"
                       >
                          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                          
                          <div className="flex items-center justify-between mb-12 relative z-10">
                             <div className="w-18 h-18 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-sm"><FileText size={36} /></div>
                             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-6 py-2 rounded-full border-2 border-blue-100 italic leading-none">{r.category}</span>
                          </div>

                          <div className="space-y-4 mb-12 relative z-10">
                             <h4 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter leading-none line-clamp-2">{r.title}</h4>
                             <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                                <Zap size={14} className="text-blue-600/50 animate-pulse" />
                                <span>UPLINK-ID: {r._id.slice(-8).toUpperCase()}</span>
                             </div>
                          </div>

                          <p className="text-[14px] text-gray-400 font-black mb-16 line-clamp-3 italic leading-relaxed uppercase tracking-tight relative z-10">{r.description || "Foundational institutional intelligence asset synchronized for neural refinement."}</p>
                          
                          <a 
                            href={r.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full mt-auto py-7 bg-gray-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all duration-700 shadow-xl active:scale-95 flex items-center justify-center gap-6 relative z-10 italic group/btn"
                          >
                            <Download size={24} className="group-hover/btn:translate-y-1 transition-transform" /> Fetch Intelligence Node
                          </a>
                       </div>
                    )))}
                </div>
              </section>
        </div>
      </main>

      <div className="fixed bottom-12 right-12 z-[50] group">
         <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
         <button className="w-20 h-20 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl relative z-10 active:scale-90 transition-all hover:rotate-12">
            <Info size={36} />
         </button>
      </div>
    </div>
  );
}
