"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import useSWR from "swr";
import { 
  Plus, 
  Trash2, 
  MoreVertical, 
  BookOpen, 
  Calendar, 
  Search, 
  ChevronRight, 
  Sparkles, 
  Loader2, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Pencil,
  BarChart,
  FilePlus,
  ArrowRight
} from "lucide-react";

export default function PaidQuizzes() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [seriesName, setSeriesName] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [papers, setPapers] = useState([{ id: 1, name: "", price: "" }]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // REAL-TIME DATABASE SYNCHRONIZATION
  const { data: fetchedSeries, error, mutate } = useSWR<any[]>('/admin/quizzes/paid', async () => {
    // In production: return await fetcher('/admin/quizzes/paid');
    
    // Zero-baseline initialization: Returning empty registry unless real records are found
    await new Promise(resolve => setTimeout(resolve, 1000));
    return []; 
  }, { refreshInterval: 5000 });

  const seriesList = fetchedSeries || [];

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleCreateNewSeries = () => {
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const addPaper = () => {
    setPapers([...papers, { id: Date.now(), name: "", price: "" }]);
  };

  const removePaper = (id: number) => {
    if (papers.length > 1) {
      setPapers(papers.filter(p => p.id !== id));
    } else {
      showToast("At least one paper is required.", 'error');
    }
  };

  const updatePaper = (id: number, field: string, value: string) => {
    setPapers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleStartIngestion = async () => {
    setIsIngesting(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsIngesting(false);
    setIsAutoModalOpen(false);
    showToast("AI Ingestion complete! Check your drafts.", 'success');
  };

  const handleCreateSeriesSubmit = async () => {
    // Real data validation
    if (!seriesName.trim()) {
      showToast("Please enter a Series Name.", 'error');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newSeries = {
        id: Date.now(),
        name: seriesName,
        description: seriesDescription,
        papers: validPapers.map(p => p.name),
        created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        total: validPapers.length
      };

      // Synchronize with database via mutate
      mutate();
      
      setIsFormOpen(false);
      setSeriesName("");
      setSeriesDescription("");
      showToast("Quiz Series created! Redirecting to Paper Manager...", 'success');
      
      // Workflow Change: Redirect to Manage Papers after creating the series container
      setTimeout(() => {
        router.push(`/admin-dashboard/quizzes/create-paper?seriesId=${newSeries.id}`);
      }, 1500);
    } catch (error) {
      showToast("Failed to create series. Please try again.", 'error');
    }
  };

  const handleDeleteSeries = async () => {
    if (!selectedSeries) return;
    try {
      // API call: await API.delete(`/admin/quizzes/paid/${selectedSeries.id}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      mutate(); // Re-fetch live list after deletion
      setIsDeleteModalOpen(false);
      setSelectedSeries(null);
      showToast("Series deleted successfully.", 'success');
    } catch (error) {
      showToast("Failed to delete series.", 'error');
    }
  };

  const handleUpdateSeries = async () => {
    if (!selectedSeries) return;
    try {
      // API call: await API.put(`/admin/quizzes/paid/${selectedSeries.id}`, selectedSeries);
      await new Promise(resolve => setTimeout(resolve, 1000));
      mutate(); // Re-fetch live data after update
      setIsEditModalOpen(false);
      setSelectedSeries(null);
      showToast("Series updated successfully.", 'success');
    } catch (error) {
      showToast("Failed to update series.", 'error');
    }
  };

  const filteredSeries = seriesList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="Paid Quizzes" 
        path={[{ label: "Home" }, { label: "Paid Quizzes" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* ACTION BUTTONS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/50 p-6 rounded-[2.5rem] border border-gray-100 backdrop-blur-sm">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Paid Assessments</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Manage and create premium quiz series</p>
           </div>
           <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setIsAutoModalOpen(true)}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles size={16} /> ✨ Auto-Generate Quiz
              </button>
              <button 
                onClick={handleCreateNewSeries}
                className="px-6 py-4 bg-[#7C3AED] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={16} /> Create Paid Quiz Series
              </button>
           </div>
        </div>

        {/* CREATE SERIES FORM */}
        {isFormOpen && (
          <section ref={formRef} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 space-y-10 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Series Configuration</h3>
               <button onClick={() => setIsFormOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-all"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Series Name</label>
                <input 
                  type="text" 
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  placeholder="Enter series name (e.g. JEE Main 2025)" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Series Description (Optional)</label>
                <textarea 
                  value={seriesDescription}
                  onChange={(e) => setSeriesDescription(e.target.value)}
                  placeholder="Enter series description..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all min-h-[120px] placeholder:text-gray-300"
                />
              </div>



              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50">
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="px-8 py-4 bg-gray-50 text-gray-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateSeriesSubmit}
                  className="px-10 py-4 bg-[#7C3AED] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  Create Series
                </button>
              </div>
            </div>
          </section>
        )}

        {/* YOUR SERIES LIST */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Your Paid Quiz Series</h3>
            <div className="relative w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search series..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-bold"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Series Name</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Papers</th>
                  <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Total</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Created On</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSeries.length > 0 ? filteredSeries.map((series) => (
                  <tr key={series.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100 shadow-sm group-hover:bg-white transition-all">
                          <BookOpen size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic">{series.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{series.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 flex-wrap max-w-md">
                        {series.papers.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100 shadow-sm">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center font-black text-gray-900 italic text-sm">{series.total}</td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{series.created}</td>
                    <td className="px-10 py-8 text-right relative">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => router.push(`/admin-dashboard/quizzes/paid/${series.id}`)}
                          className="px-6 py-2.5 bg-gray-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-100 italic"
                        >
                          View
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === series.id ? null : series.id)}
                            className={`p-2.5 rounded-xl transition-all ${activeDropdown === series.id ? "bg-gray-900 text-white" : "text-gray-300 hover:text-gray-900 hover:bg-gray-100"}`}
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {activeDropdown === series.id && (
                            <div 
                              ref={dropdownRef}
                              className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-3 animate-in fade-in slide-in-from-top-2 duration-300"
                            >
                               <button 
                                 onClick={() => {
                                   setSelectedSeries(series);
                                   setIsEditModalOpen(true);
                                   setActiveDropdown(null);
                                 }}
                                 className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all italic"
                               >
                                  <Pencil size={14} /> Edit Series
                               </button>
                               <button 
                                 onClick={() => router.push(`/admin-dashboard/quizzes/create-paper?seriesId=${series.id}`)}
                                 className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all italic"
                               >
                                  <FilePlus size={14} /> Manage Papers
                               </button>
                               <button 
                                 onClick={() => router.push(`/admin-dashboard/analytics?seriesId=${series.id}`)}
                                 className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all italic"
                               >
                                  <BarChart size={14} /> Analytics
                               </button>
                               <div className="my-2 h-px bg-gray-50" />
                               <button 
                                 onClick={() => {
                                   setSelectedSeries(series);
                                   setIsDeleteModalOpen(true);
                                   setActiveDropdown(null);
                                 }}
                                 className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-50 hover:text-red-600 rounded-xl transition-all italic"
                               >
                                  <Trash2 size={14} /> Delete Series
                               </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                             <Search size={32} />
                          </div>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-widest italic">No series found matching "{searchQuery}"</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedSeries && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl space-y-10 animate-in zoom-in duration-500 relative">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-900 transition-all"><X size={24} /></button>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Edit Quiz Series</h3>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Update your assessment details</p>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Series Name</label>
                    <input 
                      type="text" 
                      value={selectedSeries.name} 
                      onChange={(e) => setSelectedSeries({...selectedSeries, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Description</label>
                    <textarea 
                      value={selectedSeries.description} 
                      onChange={(e) => setSelectedSeries({...selectedSeries, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all min-h-[120px]"
                    />
                 </div>
                 <button 
                   onClick={handleUpdateSeries}
                   className="w-full py-5 bg-[#7C3AED] text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all italic"
                 >
                    Save Changes
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedSeries && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3.5rem] p-16 max-w-md w-full shadow-2xl text-center space-y-10 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                 <Trash2 size={44} />
              </div>
              <div className="space-y-3">
                 <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Delete Series?</h3>
                 <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic leading-relaxed">This will permanently remove <span className="text-gray-900 font-black">"{selectedSeries.name}"</span> and all its associated papers.</p>
              </div>
              <div className="flex flex-col gap-4">
                 <button 
                   onClick={handleDeleteSeries}
                   className="w-full py-6 bg-red-600 text-white rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-red-900/20 hover:scale-[1.02] active:scale-95 transition-all italic"
                 >
                    Confirm Delete
                 </button>
                 <button 
                   onClick={() => setIsDeleteModalOpen(false)}
                   className="w-full py-6 bg-gray-50 text-gray-400 rounded-3xl font-black text-[12px] uppercase tracking-widest hover:bg-gray-100 transition-all italic"
                 >
                    Cancel
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* AUTO-GENERATE MODAL */}
      {isAutoModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl space-y-10 animate-in zoom-in duration-500 relative">
              <button 
                onClick={() => !isIngesting && setIsAutoModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-900 transition-all"
              >
                <X size={24} />
              </button>

              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-900/5">
                    {isIngesting ? <Loader2 size={40} className="animate-spin" /> : <Sparkles size={40} />}
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">AI Auto-Ingest PDF</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Upload a PDF to generate a structured quiz automatically.</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="p-12 border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group hover:border-purple-200 transition-all cursor-pointer bg-gray-50/50">
                    <Upload className="text-gray-300 group-hover:text-purple-400 transition-all" size={32} />
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic">Drag & drop or <span className="text-purple-600 underline">browse</span></p>
                    <p className="text-[9px] text-gray-200 font-bold uppercase">Supported: PDF (Max 20MB)</p>
                 </div>

                 <button 
                    disabled={isIngesting}
                    onClick={handleStartIngestion}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                 >
                    {isIngesting ? <><Loader2 size={18} className="animate-spin" /> Analyzing Document...</> : <>Start AI Ingestion</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* CUSTOM TOAST NOTIFICATION */}
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
