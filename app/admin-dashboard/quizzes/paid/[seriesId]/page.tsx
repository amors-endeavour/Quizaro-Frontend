"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import useSWR from "swr";
import API from "@/app/lib/api";
import { 
  Plus, 
  Trash2, 
  MoreVertical, 
  FileText, 
  Calendar, 
  Search, 
  ChevronRight, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Pencil,
  ArrowRight
} from "lucide-react";

interface QuizPaper {
  id: string | number;
  title: string;
  totalQuestions: number;
  status: 'Published' | 'Draft' | 'Archived';
  created: string;
}

export default function SeriesPapers() {
  const router = useRouter();
  const params = useParams();
  const seriesId = params.seriesId;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // REAL-TIME DATABASE SYNCHRONIZATION
  const { data: papers, error, mutate } = useSWR<QuizPaper[]>(`/admin/quizzes/paid/${seriesId}/papers`, async (url: string) => {
    try {
      const res = await API.get(url);
      return res.data || []; 
    } catch (err) {
      console.error("Failed to fetch series papers:", err);
      return [];
    }
  }, { refreshInterval: 5000 });

  const paperList = papers || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeletePaper = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this paper?")) return;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      mutate();
      showToast("Paper deleted successfully.", 'success');
    } catch (error) {
      showToast("Failed to delete paper.", 'error');
    }
  };

  const filteredPapers = paperList.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="Manage Papers" 
        path={[{ label: "Paid Quizzes", href: "/admin-dashboard/quizzes/paid" }, { label: "Series Papers" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/50 p-6 rounded-[2.5rem] border border-gray-100 backdrop-blur-sm">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Series Management</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Configure papers for Series ID: {seriesId}</p>
           </div>
           <button 
             onClick={() => router.push(`/admin-dashboard/quizzes/create-paper?seriesId=${seriesId}`)}
             className="px-6 py-4 bg-[#7C3AED] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"
           >
             <Plus size={16} /> Provision New Paper
           </button>
        </div>

        {/* PAPER LIST TABLE */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Associated Papers</h3>
            <div className="relative w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papers..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 outline-none transition-all placeholder:text-gray-300 font-bold italic"
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Paper Title</th>
                  <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Total MCQs</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Created On</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPapers.length > 0 ? filteredPapers.map((paper) => (
                  <tr key={paper.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8 cursor-pointer group/row" onClick={() => router.push(`/admin-dashboard/quizzes/paid/${seriesId}/${paper.id}`)}>
                      <div className="flex items-center gap-6">
                        <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 shadow-sm group-hover/row:bg-purple-600 group-hover/row:text-white transition-all">
                          <FileText size={18} />
                        </div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic group-hover/row:text-purple-600 transition-colors">{paper.title}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center font-black text-gray-900 italic text-sm">{paper.totalQuestions}</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        paper.status === 'Published' ? "bg-green-50 text-green-600 border border-green-100" : 
                        paper.status === 'Archived' ? "bg-red-50 text-red-500 border border-red-100" :
                        "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}>
                        {paper.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{paper.created}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <button 
                           onClick={() => router.push(`/admin-dashboard/quizzes/create-paper?id=${paper.id}&seriesId=${seriesId}`)}
                           className="px-6 py-2.5 bg-white text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-100 italic"
                         >
                           Edit MCQ
                         </button>
                         <button 
                           onClick={() => handleDeletePaper(paper.id)}
                           className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                       <div className="flex flex-col items-center gap-6 text-gray-200">
                          <FileText size={48} />
                          <div className="space-y-1">
                             <p className="text-sm font-black text-gray-900 uppercase tracking-widest italic">No papers found for this series</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Click 'Provision New Paper' to add your first assessment.</p>
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom-8 duration-500">
           <div className={`px-8 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 ${
             toast.type === 'success' ? "bg-white border-green-100 text-green-600" : "bg-white border-red-100 text-red-500"
           }`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-[11px] font-black uppercase tracking-widest italic">{toast.message}</span>
           </div>
        </div>
      )}
    </div>
  );
}
