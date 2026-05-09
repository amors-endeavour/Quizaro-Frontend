"use client";

import { useState, useRef, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
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
  FileText
} from "lucide-react";

export default function UnpaidQuizzes() {
  // Table Data State
  const [quizzes, setQuizzes] = useState([
    { id: 1, name: "Indian Polity Quiz", subject: "Polity", questions: 25, duration: 30, status: "Published", created: "15 Jan 2025", description: "Comprehensive test on the Indian Constitution." },
    { id: 2, name: "Physics Basics Quiz", subject: "Physics", questions: 20, duration: 25, status: "Published", created: "12 Jan 2025", description: "Fundamental concepts of mechanics and heat." },
    { id: 3, name: "Chemistry MCQ Test", subject: "Chemistry", questions: 30, duration: 30, status: "Draft", created: "10 Jan 2025", description: "Organic and Inorganic chemistry overview." },
    { id: 4, name: "Arithmetic Practice Quiz", subject: "Quantitative Aptitude", questions: 25, duration: 20, status: "Published", created: "09 Jan 2025", description: "Speed and accuracy training." },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "Select subject",
    questions: "",
    duration: "",
    difficulty: "Select difficulty level",
    passingMarks: "",
    negativeMarking: "",
    shuffle: false
  });

  // UI State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
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

  // --- Table Actions ---
  const handleEdit = (quiz: any) => {
    setEditingId(quiz.id);
    setFormData({
      title: quiz.name,
      description: quiz.description || "",
      subject: quiz.subject,
      questions: quiz.questions.toString(),
      duration: quiz.duration.toString(),
      difficulty: quiz.difficulty || "Medium",
      passingMarks: quiz.passingMarks || "",
      negativeMarking: quiz.negativeMarking || "",
      shuffle: quiz.shuffle || false
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    setOpenMenuId(null);
  };

  const handleDuplicate = (quiz: any) => {
    const newQuiz = {
      ...quiz,
      id: Date.now(),
      name: `${quiz.name} (Copy)`,
      status: "Draft",
      created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setQuizzes([newQuiz, ...quizzes]);
    showToast("Quiz duplicated as Draft.", "success");
    setOpenMenuId(null);
  };

  const handleToggleArchive = (id: number) => {
    setQuizzes(prev => prev.map(q => 
      q.id === id ? { ...q, status: q.status === 'Archived' ? 'Published' : 'Archived' } : q
    ));
    showToast("Quiz visibility toggled.", "success");
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
      showToast("Quiz deleted successfully.", "success");
    }
    setOpenMenuId(null);
  };

  // --- Form Actions ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleAutoGenerateClick = () => {
    setIsAutoModalOpen(true);
  };

  const handleStartAIAnalysis = async () => {
    setIsIngesting(true);
    // Simulate AI parsing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setFormData(prev => ({
      ...prev,
      title: "Generated Quiz: Quantum Mechanics",
      description: "Automated assessment based on uploaded research paper.",
      subject: "Physics"
    }));
    setIsIngesting(false);
    setIsAutoModalOpen(false);
    showToast("AI has drafted the quiz fields!", "success");
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim() || formData.subject === "Select subject" || !formData.questions || !formData.duration) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (editingId) {
        setQuizzes(prev => prev.map(q => 
          q.id === editingId ? { 
            ...q, 
            name: formData.title, 
            subject: formData.subject, 
            questions: parseInt(formData.questions), 
            duration: parseInt(formData.duration),
            description: formData.description
          } : q
        ));
        showToast("Quiz updated successfully!", "success");
      } else {
        const newQuiz = {
          id: Date.now(),
          name: formData.title,
          subject: formData.subject,
          questions: parseInt(formData.questions),
          duration: parseInt(formData.duration),
          status: "Published",
          created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          description: formData.description
        };
        setQuizzes([newQuiz, ...quizzes]);
        showToast("Quiz created successfully!", "success");
      }
      
      // Reset
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        subject: "Select subject",
        questions: "",
        duration: "",
        difficulty: "Select difficulty level",
        passingMarks: "",
        negativeMarking: "",
        shuffle: false
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showToast("Error saving quiz. Please try again.", "error");
    } finally {
      setIsSaving(false);
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
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Unpaid Quizzes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search quizzes..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 outline-none transition-all"
                />
              </div>
              <button className="px-6 py-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">Reset</button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Quiz Name</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Subject</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Questions</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Duration</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Created On</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 shadow-sm">
                          <BookOpen size={18} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-tight">{quiz.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic leading-tight">Standalone Assessment</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{quiz.subject}</td>
                    <td className="px-10 py-8 font-black text-gray-900 italic text-sm">{quiz.questions}</td>
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
                    <td className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">{quiz.created}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 relative">
                        <button 
                          onClick={() => handleEdit(quiz)}
                          className="px-4 py-2 bg-white text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-100 shadow-sm hover:shadow-purple-900/10 flex items-center gap-2"
                        >
                          <Edit2 size={12} /> Edit
                        </button>

                        <button 
                          onClick={() => window.location.href = `/admin-dashboard/quizzes/create-paper?id=${quiz.id}`}
                          className="px-4 py-2 bg-white text-gray-500 hover:bg-gray-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-100 shadow-sm flex items-center gap-2 whitespace-nowrap"
                        >
                          <FileText size={12} /> Manage Papers
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
                                <button onClick={() => handleDuplicate(quiz)} className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-all">
                                   <Copy size={16} className="text-gray-400" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Duplicate</span>
                                </button>
                                <button onClick={() => handleToggleArchive(quiz.id)} className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-all">
                                   <Archive size={16} className="text-gray-400" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{quiz.status === 'Archived' ? 'Restore' : 'Archive'}</span>
                                </button>
                                <div className="my-2 border-t border-gray-50"></div>
                                <button onClick={() => handleDelete(quiz.id)} className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-red-50 transition-all group">
                                   <Trash2 size={16} className="text-gray-300 group-hover:text-red-500" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-red-500">Delete</span>
                                </button>
                             </div>
                           )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Showing 1 to {quizzes.length} of {quizzes.length} quizzes</p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} className="rotate-180" /></button>
              <button className="w-8 h-8 bg-purple-600 text-white rounded-lg text-[10px] font-black">1</button>
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* CREATE/EDIT UNPAID QUIZ FORM */}
        <section ref={formRef} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                {editingId ? "Update Unpaid Quiz" : "Create Unpaid Quiz"}
              </h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">
                {editingId ? "Modify existing standalone assessment" : "Add standalone direct assessment"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={handleAutoGenerateClick}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-4 shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles size={18} /> ✨ Auto-Generate Quiz
              </button>
              <button 
                disabled={isSaving}
                onClick={handleSubmit}
                className="px-10 py-4 bg-[#7C3AED] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingId ? "Save Changes" : "Create Quiz"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Quiz Title</label>
                <span className="text-[9px] text-gray-300 font-bold">{formData.title.length}/100</span>
              </div>
              <input 
                id="title"
                type="text" 
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter quiz title" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300 font-bold italic" 
              />
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Description (Optional)</label>
                <span className="text-[9px] text-gray-300 font-bold">{formData.description.length}/500</span>
              </div>
              <textarea 
                id="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter quiz description..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all min-h-[140px] placeholder:text-gray-300 font-medium italic" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Subject</label>
              <select 
                id="subject"
                value={formData.subject}
                onChange={handleFormChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm text-gray-500 focus:border-purple-600 outline-none transition-all font-bold italic"
              >
                <option>Select subject</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Polity</option>
                <option>Quantitative Aptitude</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Total Questions</label>
              <input 
                id="questions"
                type="number" 
                value={formData.questions}
                onChange={handleFormChange}
                placeholder="Enter number of questions" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all font-bold italic" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Duration (in minutes)</label>
              <input 
                id="duration"
                type="number" 
                value={formData.duration}
                onChange={handleFormChange}
                placeholder="Enter duration" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all font-bold italic" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Difficulty Level</label>
              <select 
                id="difficulty"
                value={formData.difficulty}
                onChange={handleFormChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm text-gray-500 focus:border-purple-600 outline-none transition-all font-bold italic"
              >
                <option>Select difficulty level</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Passing Marks (%)</label>
              <input 
                id="passingMarks"
                type="number" 
                value={formData.passingMarks}
                onChange={handleFormChange}
                placeholder="35" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all font-bold italic" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Negative Marking</label>
              <input 
                id="negativeMarking"
                type="text" 
                value={formData.negativeMarking}
                onChange={handleFormChange}
                placeholder="0.25" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm focus:border-purple-600 outline-none transition-all font-bold italic" 
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-4 group cursor-pointer bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100">
              <input 
                id="shuffle"
                type="checkbox" 
                checked={formData.shuffle}
                onChange={handleFormChange}
                className="w-6 h-6 rounded-lg border-gray-200 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer" 
              />
              <div className="space-y-0.5">
                <label htmlFor="shuffle" className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic cursor-pointer block">Shuffle Questions</label>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">Show questions in random order to each user</p>
              </div>
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-6 pt-10 border-t border-gray-100">
              <button 
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: "",
                    description: "",
                    subject: "Select subject",
                    questions: "",
                    duration: "",
                    difficulty: "Select difficulty level",
                    passingMarks: "",
                    negativeMarking: "",
                    shuffle: false
                  });
                }}
                className="px-10 py-5 bg-gray-50 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isSaving}
                onClick={handleSubmit}
                className="px-12 py-5 bg-[#7C3AED] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingId ? "Save Changes" : "Create Quiz"}
              </button>
            </div>
          </div>
        </section>

      </main>

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
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
                 >
                    {isIngesting ? <><Loader2 size={18} className="animate-spin" /> AI is drafting...</> : <>Start AI Generation</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* CUSTOM TOAST */}
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
