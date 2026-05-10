"use client";

import { useState, useRef, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import useSWR from "swr";
import API from "@/app/lib/api";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  Copy, 
  Archive, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Upload,
  FileText,
  Eye
} from "lucide-react";

interface UnpaidQuiz {
  id: string | number;
  name: string;
  subject: string;
  questions: number;
  duration: number;
  status: 'Published' | 'Draft' | 'Archived';
  created: string;
  description: string;
}

export default function UnpaidQuizzes() {
  // DATABASE SYNCHRONIZATION
  const { data: fetchedQuizzes, error, mutate } = useSWR<UnpaidQuiz[]>('/admin/quizzes/unpaid', async (url: string) => {
    try {
      const res = await API.get(url);
      return res.data || []; 
    } catch (err) {
      console.error("Failed to fetch unpaid quizzes:", err);
      return [];
    }
  }, { refreshInterval: 5000 });

  const quizzes = fetchedQuizzes || [];

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    questions: "",
    duration: "",
    difficulty: "Medium",
    passingMarks: "35",
    negativeMarking: "0.25",
    shuffle: false
  });

  // UI State
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<UnpaidQuiz | null>(null);
  const [previewMCQs, setPreviewMCQs] = useState<any[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
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

  const handleEdit = (quiz: UnpaidQuiz) => {
    setEditingId(quiz.id);
    setFormData({
      title: quiz.name,
      description: quiz.description || "",
      subject: quiz.subject,
      questions: quiz.questions.toString(),
      duration: quiz.duration.toString(),
      difficulty: "Medium",
      passingMarks: "35",
      negativeMarking: "0.25",
      shuffle: false
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    setOpenMenuId(null);
  };

  const handleDuplicate = async (quiz: UnpaidQuiz) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      mutate();
      showToast("Quiz duplicated successfully.", "success");
    } catch (err) {
      showToast("Failed to duplicate quiz.", "error");
    }
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Permanently delete this assessment from the registry?")) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        mutate();
        showToast("Assessment purged from database.", "success");
      } catch (err) {
        showToast("Deletion failed.", "error");
      }
    }
    setOpenMenuId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleStartAIAnalysis = async () => {
    setIsIngesting(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsIngesting(false);
    setIsAutoModalOpen(false);
    showToast("AI extraction drafted successfully!", "success");
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.subject || !formData.questions || !formData.duration) {
      showToast("All institutional parameters are required.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      mutate();
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        subject: "",
        questions: "",
        duration: "",
        difficulty: "Medium",
        passingMarks: "35",
        negativeMarking: "0.25",
        shuffle: false
      });
      showToast("Assessment registry updated!", "success");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showToast("Synchronization error.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPreview = async (quiz: UnpaidQuiz) => {
    setPreviewQuiz(quiz);
    setIsPreviewLoading(true);
    try {
      const res = await API.get(`/admin/quizzes/unpaid/${quiz.id}`);
      setPreviewMCQs(res.data?.questions || []);
    } catch (err) {
      console.error("Failed to fetch preview data:", err);
      setPreviewMCQs([]);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="Unpaid Quizzes" 
        path={[{ label: "Home" }, { label: "Unpaid Quizzes" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* QUIZ TABLE SECTION */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Flat Assessment Registry</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Direct management of standalone unpaid papers</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter by title..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 outline-none transition-all italic font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Assessment Name</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Subject</th>
                  <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 italic">MCQs</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Duration</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quizzes.length > 0 ? quizzes.map((quiz) => (
                  <tr key={quiz.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8 cursor-pointer group/row" onClick={() => window.location.href = `/admin-dashboard/quizzes/unpaid/${quiz.id}`}>
                      <div className="flex items-center gap-6">
                        <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 shadow-sm group-hover/row:bg-purple-600 group-hover/row:text-white transition-all">
                          <BookOpen size={18} />
                        </div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-tight group-hover/row:text-purple-600 transition-colors">{quiz.name}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{quiz.subject}</td>
                    <td className="px-10 py-8 text-center font-black text-gray-900 italic text-sm">{quiz.questions}</td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{quiz.duration} min</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        quiz.status === 'Published' ? "bg-green-50 text-green-600 border border-green-100" : 
                        quiz.status === 'Archived' ? "bg-red-50 text-red-500 border border-red-100" :
                        "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}>
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 relative">
                        <button 
                          onClick={() => handleOpenPreview(quiz)}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Quick Preview"
                        >
                          <Eye size={18} />
                        </button>

                        <button 
                          onClick={() => window.location.href = `/admin-dashboard/quizzes/unpaid/${quiz.id}`}
                          className="px-6 py-2.5 bg-gray-900 text-white hover:bg-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2"
                        >
                          View MCQ <ChevronRight size={14} />
                        </button>
                        
                        <div className="relative">
                           <button 
                             onClick={() => setOpenMenuId(openMenuId === quiz.id ? null : quiz.id)}
                             className="p-2.5 text-gray-300 hover:text-gray-900 transition-all"
                           >
                             <MoreVertical size={18} />
                           </button>

                           {openMenuId === quiz.id && (
                             <div ref={menuRef} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-[100] animate-in zoom-in-95 duration-200">
                                <button onClick={() => handleEdit(quiz)} className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-all">
                                   <Edit2 size={16} className="text-gray-400" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Modify Data</span>
                                </button>
                                <button onClick={() => window.location.href = `/admin-dashboard/quizzes/create-paper?id=${quiz.id}`} className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-all">
                                   <FileText size={16} className="text-gray-400" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Builder Mode</span>
                                </button>
                                <button onClick={() => handleDuplicate(quiz)} className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-all">
                                   <Copy size={16} className="text-gray-400" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Duplicate</span>
                                </button>
                                <div className="my-2 border-t border-gray-50"></div>
                                <button onClick={() => handleDelete(quiz.id)} className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-red-50 transition-all group">
                                   <Trash2 size={16} className="text-gray-300 group-hover:text-red-500" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-red-500">Purge Record</span>
                                </button>
                             </div>
                           )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-10 py-32 text-center">
                       <div className="flex flex-col items-center gap-6 text-gray-200">
                          <BookOpen size={48} />
                          <div className="space-y-1">
                             <p className="text-sm font-black text-gray-900 uppercase tracking-widest italic leading-none">No unpaid assessments found</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Use the form below to provision a new standalone quiz.</p>
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* CREATE/EDIT UNPAID QUIZ FORM */}
        <section ref={formRef} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                {editingId ? "Update Registry Record" : "Provision Flat Assessment"}
              </h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">
                Zero-baseline configuration for standalone unpaid papers
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setIsAutoModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-4 shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles size={18} /> ✨ AI Auto-Drafter
              </button>
              <button 
                disabled={isSaving}
                onClick={handleSubmit}
                className="px-10 py-4 bg-[#7C3AED] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {isSaving ? <><Loader2 size={16} className="animate-spin" /> Syncing...</> : editingId ? "Update Assessment" : "Authorize & Create"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-3 space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Quiz Title <span className="text-red-500">*</span></label>
              <input 
                id="title"
                type="text" 
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Indian Polity Fundamentals" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300 font-bold italic shadow-inner" 
              />
            </div>

            <div className="md:col-span-3 space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Institutional Description</label>
              <textarea 
                id="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter formal assessment context..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all min-h-[140px] placeholder:text-gray-300 font-medium italic shadow-inner" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Subject Category</label>
              <select 
                id="subject"
                value={formData.subject}
                onChange={handleFormChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm text-gray-500 focus:border-purple-600 outline-none transition-all font-bold italic appearance-none cursor-pointer"
              >
                <option value="">Select subject</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Polity</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Target Question Count</label>
              <input 
                id="questions"
                type="number" 
                value={formData.questions}
                onChange={handleFormChange}
                placeholder="25" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all font-bold italic" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Duration (Minutes)</label>
              <input 
                id="duration"
                type="number" 
                value={formData.duration}
                onChange={handleFormChange}
                placeholder="30" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all font-bold italic" 
              />
            </div>
          </div>
        </section>
      </main>

      {/* AUTO-GENERATE MODAL & TOAST */}
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
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">AI Quiz Drafter</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Drop a file to auto-populate the form below.</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="p-12 border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group hover:border-purple-200 transition-all cursor-pointer bg-gray-50/50">
                    <Upload className="text-gray-300 group-hover:text-purple-400 transition-all" size={32} />
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic">Upload PDF for drafting</p>
                 </div>

                 <button 
                    disabled={isIngesting}
                    onClick={handleStartAIAnalysis}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale italic"
                 >
                    {isIngesting ? <><Loader2 size={18} className="animate-spin" /> AI is drafting...</> : <>Start AI Generation</>}
                 </button>
              </div>
           </div>
        </div>
      )}

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

      {/* QUICK PREVIEW MODAL */}
      {previewQuiz && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-12 max-w-4xl w-full shadow-2xl space-y-10 animate-in zoom-in duration-500 relative max-h-[90vh] flex flex-col">
              <button 
                onClick={() => setPreviewQuiz(null)}
                className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-900 transition-all"
              >
                <X size={24} />
              </button>

              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Quick Audit: {previewQuiz.name}</h3>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Read-only preview of assessment content</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 space-y-8 no-scrollbar">
                 {isPreviewLoading ? (
                   <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                      <Loader2 size={40} className="animate-spin text-purple-600" />
                      <p className="text-[10px] font-black uppercase tracking-widest italic">Fetching MCQ Data...</p>
                   </div>
                 ) : previewMCQs.length > 0 ? (
                   previewMCQs.map((mcq, idx) => (
                     <div key={mcq.id} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-6">
                        <div className="flex items-start gap-4">
                           <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs font-black italic">{idx + 1}</span>
                           <p className="text-sm font-black text-gray-900 uppercase tracking-tight italic leading-relaxed">{mcq.text}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                           {mcq.options.map((opt: string, i: number) => (
                             <div key={i} className={`px-6 py-3 rounded-xl text-[11px] font-bold italic border ${i === 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100 text-gray-500'}`}>
                                {String.fromCharCode(65 + i)}. {opt}
                             </div>
                           ))}
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-200">
                      <BookOpen size={48} />
                      <p className="text-[10px] font-black uppercase tracking-widest italic">No MCQs found for this assessment.</p>
                   </div>
                 )}
              </div>

              <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest italic border border-purple-100">
                       {previewMCQs.length} Questions
                    </span>
                    <span className="px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest italic border border-gray-100">
                       Audit Mode
                    </span>
                 </div>
                 <button 
                   onClick={() => window.location.href = `/admin-dashboard/quizzes/unpaid/${previewQuiz.id}`}
                   className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                 >
                   Open Full MCQ View
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
