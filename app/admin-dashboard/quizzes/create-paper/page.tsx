"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  Send, 
  Eye, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Clock, 
  Target, 
  Check, 
  X, 
  Upload, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  marks: number;
  options: { id: string; text: string }[];
  correctAnswer: string; // 'A', 'B', 'C', 'D'
}

interface PaperDetails {
  title: string;
  subject: string;
  totalMarks: number;
  duration: number;
  instructions: string;
}

export default function CreatePaper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = searchParams.get("id");

  // --- STATE ---
  const [details, setDetails] = useState<PaperDetails>({
    title: "",
    subject: "",
    totalMarks: 0,
    duration: 0,
    instructions: "Read all questions carefully. Each question carries 1 mark."
  });

  const [questions, setQuestions] = useState<Question[]>([
    { 
      id: "q-1", 
      text: "Which is the largest planet in our Solar System?", 
      marks: 1, 
      options: [
        { id: "A", text: "Earth" },
        { id: "B", text: "Jupiter" },
        { id: "C", text: "Saturn" },
        { id: "D", text: "Mars" }
      ], 
      correctAnswer: "B" 
    }
  ]);

  const [paperCount, setPaperCount] = useState(1);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- FETCH REAL DATA ---
  useEffect(() => {
    if (quizId) {
      // Simulate fetching quiz data from DB
      // In a real app, you'd do: API.get(`/admin/quizzes/${quizId}`)
      const mockQuizData = {
        name: "General Knowledge Quiz",
        subject: "General Knowledge",
        questions: 20,
        duration: 20,
      };
      
      setDetails({
        title: mockQuizData.name,
        subject: mockQuizData.subject,
        totalMarks: mockQuizData.questions, // Default to 1 mark per question
        duration: mockQuizData.duration,
        instructions: "Read all questions carefully. Each question carries 1 mark."
      });
    }
  }, [quizId]);

  // --- LIVE COUNTERS ---
  const stats = useMemo(() => {
    return {
      totalQuestions: questions.length,
      totalMarks: questions.reduce((acc, q) => acc + (Number(q.marks) || 0), 0)
    };
  }, [questions]);

  // --- ACTIONS ---
  const addQuestion = () => {
    const newId = `q-${Date.now()}`;
    setQuestions([...questions, {
      id: newId,
      text: "",
      marks: 1,
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" }
      ],
      correctAnswer: "A"
    }]);
  };

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const duplicateQuestion = (q: Question) => {
    setQuestions([...questions, { ...q, id: `q-${Date.now()}` }]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const updateOption = (qId: string, optId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(o => o.id === optId ? { ...o, text } : o)
        };
      }
      return q;
    }));
  };

  const handleAIIngest = async () => {
    setIsIngesting(true);
    // Simulate AI parsing PDF -> JSON
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const extractedQuestions: Question[] = [
      {
        id: "ai-1",
        text: "What is the chemical symbol for water?",
        marks: 1,
        options: [
          { id: "A", text: "H2O" },
          { id: "B", text: "CO2" },
          { id: "C", text: "NaCl" },
          { id: "D", text: "O2" }
        ],
        correctAnswer: "A"
      },
      {
        id: "ai-2",
        text: "Which gas do plants absorb from the atmosphere?",
        marks: 1,
        options: [
          { id: "A", text: "Oxygen" },
          { id: "B", text: "Carbon dioxide" },
          { id: "C", text: "Nitrogen" },
          { id: "D", text: "Hydrogen" }
        ],
        correctAnswer: "B"
      }
    ];

    setQuestions([...questions, ...extractedQuestions]);
    setIsIngesting(false);
    setIsAutoModalOpen(false);
    setToast({ message: "AI has successfully extracted 2 MCQs!", type: 'success' });
  };

  const handleSave = async (isPublish: boolean) => {
    setIsSaving(true);
    // Simulate API POST
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setToast({ message: isPublish ? "Paper published successfully!" : "Paper saved as draft.", type: 'success' });
    if (isPublish) router.push("/admin-dashboard/quizzes/unpaid");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="Create Quiz Paper" 
        path={[{ label: "Papers" }, { label: "Create Paper" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* TOP HEADER ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Create Quiz Paper</h1>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">Add details and MCQ questions to create your paper.</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-4">
              <button className="px-8 py-3.5 bg-white border border-gray-100 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-widest italic shadow-sm flex items-center gap-3 hover:bg-gray-50 transition-all">
                 <Eye size={16} /> Preview
              </button>
              <button 
                onClick={() => handleSave(false)}
                className="px-8 py-3.5 bg-white border border-gray-100 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-widest italic shadow-sm flex items-center gap-3 hover:bg-gray-50 transition-all"
              >
                 <Save size={16} /> Save
              </button>
              <button 
                onClick={() => handleSave(true)}
                className="px-10 py-3.5 bg-[#7C3AED] text-white rounded-xl text-[11px] font-black uppercase tracking-widest italic shadow-xl shadow-purple-900/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
              >
                 <Send size={16} /> Publish
              </button>
           </div>
        </div>

        <div className="flex justify-end">
           <button 
             onClick={() => setPaperCount(prev => prev + 1)}
             className="px-8 py-3 bg-white border border-purple-100 text-purple-600 rounded-xl text-[11px] font-black uppercase tracking-widest italic shadow-sm flex items-center gap-3 hover:bg-purple-50 transition-all border-dashed border-2"
           >
              <Plus size={16} /> Add Paper {paperCount + 1}
           </button>
        </div>

        {/* PAPER DETAILS CARD */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-8">
           <div className="flex items-center gap-4 text-purple-600">
              <FileText size={20} />
              <h2 className="text-[12px] font-black uppercase tracking-widest italic">Paper Details</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2 space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Paper Title <span className="text-red-500">*</span></label>
                 <input 
                   type="text" 
                   value={details.title}
                   onChange={(e) => setDetails({...details, title: e.target.value})}
                   placeholder="Enter paper title"
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Subject / Category</label>
                 <select 
                   value={details.subject}
                   onChange={(e) => setDetails({...details, subject: e.target.value})}
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all appearance-none cursor-pointer"
                 >
                    <option value="">Select subject</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                 </select>
              </div>
              <div className="flex gap-4">
                 <div className="space-y-3 flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Total Marks <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      value={details.totalMarks}
                      onChange={(e) => setDetails({...details, totalMarks: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all"
                    />
                 </div>
                 <div className="space-y-3 flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Duration <span className="text-red-500">*</span></label>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={details.duration}
                         onChange={(e) => setDetails({...details, duration: parseInt(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all pr-12"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase italic">min</span>
                    </div>
                 </div>
              </div>

              <div className="md:col-span-4 space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Instructions (Optional)</label>
                 <textarea 
                   value={details.instructions}
                   onChange={(e) => setDetails({...details, instructions: e.target.value})}
                   placeholder="Enter any special instructions..."
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium italic outline-none focus:border-purple-600 transition-all min-h-[80px]"
                 />
              </div>
           </div>
        </section>

        {/* MCQ QUESTIONS BUILDER */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-purple-600">
                 <BookOpen size={20} />
                 <h2 className="text-[12px] font-black uppercase tracking-widest italic">MCQ Questions</h2>
              </div>
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setIsAutoModalOpen(true)}
                   className="px-6 py-3 bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-purple-600 rounded-xl text-[11px] font-black uppercase tracking-widest italic flex items-center gap-3 border border-purple-100 hover:scale-105 transition-all shadow-sm"
                 >
                    <Sparkles size={16} /> ✨ Auto-Generate from PDF
                 </button>
                 <button 
                   onClick={addQuestion}
                   className="px-8 py-3 bg-white border border-purple-100 text-purple-600 rounded-xl text-[11px] font-black uppercase tracking-widest italic shadow-sm flex items-center gap-3 hover:bg-purple-50 transition-all border-dashed border-2"
                 >
                    <Plus size={16} /> Add Question
                 </button>
              </div>
           </div>

           <div className="space-y-8">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all animate-in slide-in-from-right-8 duration-500">
                   <div className="p-8 space-y-8">
                      <div className="flex items-start gap-6">
                         <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-[1.2rem] flex items-center justify-center font-black text-sm italic shadow-sm border border-purple-100">
                            {index + 1}
                         </div>
                         <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-6">
                               <input 
                                 type="text" 
                                 value={q.text}
                                 onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                                 placeholder="Type your question here..."
                                 className="flex-1 bg-gray-50/50 border border-transparent rounded-xl px-6 py-4 text-[15px] font-black text-gray-900 uppercase tracking-tight italic outline-none focus:bg-white focus:border-purple-600 transition-all"
                               />
                               <div className="flex items-center gap-4">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Marks</label>
                                  <input 
                                    type="number" 
                                    value={q.marks}
                                    onChange={(e) => updateQuestion(q.id, { marks: parseInt(e.target.value) })}
                                    className="w-16 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-black text-gray-900 italic text-center"
                                  />
                               </div>
                               <div className="flex items-center gap-2">
                                  <button onClick={() => duplicateQuestion(q)} className="p-3 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"><Copy size={18} /></button>
                                  <button onClick={() => deleteQuestion(q.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {q.options.map((opt) => (
                                 <div 
                                   key={opt.id} 
                                   className={`relative group/opt p-2 rounded-[1.5rem] border transition-all duration-300 flex items-center gap-6 ${
                                     q.correctAnswer === opt.id 
                                       ? "bg-green-50 border-green-200" 
                                       : "bg-white border-gray-100 hover:border-purple-200"
                                   }`}
                                 >
                                    <div className="w-10 h-10 flex items-center justify-center font-black text-[12px] text-gray-400 italic">
                                       {opt.id}
                                    </div>
                                    
                                    <div className="flex-1 flex items-center gap-4">
                                       <button 
                                         onClick={() => updateQuestion(q.id, { correctAnswer: opt.id })}
                                         className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                           q.correctAnswer === opt.id 
                                             ? "bg-green-500 border-green-500 text-white" 
                                             : "border-gray-200 group-hover/opt:border-purple-300"
                                         }`}
                                       >
                                          {q.correctAnswer === opt.id && <Check size={14} />}
                                       </button>
                                       <input 
                                         type="text" 
                                         value={opt.text}
                                         onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                                         placeholder={`Option ${opt.id}`}
                                         className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold text-gray-700 italic"
                                       />
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* BUILDER FOOTER STATS */}
           <div className="bg-[#111827] rounded-[2rem] p-10 flex items-center justify-between text-white shadow-2xl">
              <div className="flex items-center gap-12">
                 <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Total Questions</p>
                    <h4 className="text-2xl font-black italic leading-none">{stats.totalQuestions}</h4>
                 </div>
                 <div className="w-px h-10 bg-gray-800" />
                 <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Total Marks</p>
                    <h4 className="text-2xl font-black italic leading-none">{stats.totalMarks}</h4>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic">Live calculation synced</p>
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">AI MCQ Ingestor</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Scan your PDF for automatic question generation.</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="p-12 border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group hover:border-purple-200 transition-all cursor-pointer bg-gray-50/50">
                    <Upload className="text-gray-300 group-hover:text-purple-400 transition-all" size={32} />
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic">Drop your PDF here</p>
                 </div>

                 <button 
                    disabled={isIngesting}
                    onClick={handleAIIngest}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
                 >
                    {isIngesting ? <><Loader2 size={18} className="animate-spin" /> AI is scanning...</> : <>Extract MCQs via AI</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* CUSTOM TOAST */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom-8 duration-500">
           <div className={`px-8 py-4 bg-white rounded-2xl shadow-2xl border flex items-center gap-4 ${
             toast.type === 'success' ? "border-green-100 text-green-600" : "border-red-100 text-red-500"
           }`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-[11px] font-black uppercase tracking-widest italic">{toast.message}</span>
           </div>
        </div>
      )}
    </div>
  );
}
