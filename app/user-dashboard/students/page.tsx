"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import { 
  Users,
  Trophy,
  Target,
  Sparkles,
  Search,
  ChevronRight
} from "lucide-react";
import { getInitials } from "@/app/lib/utils";

interface Student {
  _id: string;
  name: string;
  level?: number;
  points?: number;
}

export default function UserStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await API.get("/user/leaderboard");
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#050816]">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName="" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <UserHeader 
          title="Institutional Pulse" 
          breadcrumbs={["Intelligence", "Scholar Directory"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-12 animate-in fade-in duration-700">
           
           {/* SEARCH & HUD */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 relative group">
                 <div className="absolute inset-y-0 left-6 flex items-center text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <Search size={18} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Decrypt student signatures by name or entity ID..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-sm font-black text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600 italic tracking-tight"
                 />
              </div>
              <div className="bg-blue-600/10 border border-blue-600/20 p-6 rounded-[2rem] flex items-center gap-6">
                 <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Trophy size={20} /></div>
                 <div>
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active Scholars</p>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{students.length} Nodes</h3>
                 </div>
              </div>
           </div>

           {/* STUDENT DIRECTORY */}
           <section className="space-y-6 pb-20">
              <div className="flex items-center gap-4 px-4">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic">Institutional identity mesh</h3>
              </div>

              {loading ? (
                <div className="space-y-4">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-[2rem] animate-pulse" />
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {filtered.map((s, idx) => (
                     <div 
                        key={s._id} 
                        className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6 hover:bg-white/[0.08] hover:border-blue-500/50 transition-all duration-500 group"
                     >
                        <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white border border-white/10 flex items-center justify-center font-black text-sm uppercase group-hover:scale-110 transition-transform shadow-xl">
                           {getInitials(s.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3">
                              <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{s.name}</h4>
                              {idx < 3 && <Sparkles size={14} className="text-amber-500 shrink-0" />}
                           </div>
                           <div className="flex items-center gap-4 mt-1">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Scholar</span>
                              <div className="w-1 h-1 bg-white/10 rounded-full" />
                              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Lvl {s.level || 1}</span>
                           </div>
                        </div>
                        <div className="text-right pr-4">
                           <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">XP Points</p>
                           <h5 className="text-lg font-black text-white tracking-tighter">{s.points || 0}</h5>
                        </div>
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
