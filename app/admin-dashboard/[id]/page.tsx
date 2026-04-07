"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import API from "@/app/lib/api";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Eye, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  PieChart,
  Layers,
  ArrowDownToLine,
  HelpCircle
} from "lucide-react";

interface Option {
  text: string;
}

interface Question {
  _id?: string;
  questionText: string;
  options: Option[];
  correctOption: number;
  explanation?: string;
  marks?: number;
  negativeMarks?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
}

interface Test {
  _id: string;
  title: string;
  duration?: number;
  category?: string;
}

export default function QuestionsStudio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Studio Sidebar Sections
  const sidebarItems = [
    { label: "Create Questions", icon: <Plus size={18} />, active: true },
    { label: "Grading", icon: <PieChart size={18} /> },
    { label: "Test Sections", icon: <Layers size={18} /> },
    { label: "Import Questions", icon: <ArrowDownToLine size={18} /> },
    { label: "Test Settings", icon: <Settings size={18} />, sub: "Advanced Settings" },
  ];

  // Editor State for current question
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOption: 0,
    explanation: "",
    marks: 1,
    negativeMarks: 0.25,
    difficulty: "Medium"
  });

  const fetchData = async () => {
    try {
      const [testRes, questionsRes] = await Promise.all([
        API.get(`/test/${id}`),
        API.get(`/admin/questions/${id}`),
      ]);
      setTest(testRes.data);
      const qData = questionsRes.data;
      if (qData.length > 0) {
        setQuestions(qData);
        setCurrentQuestion(qData[0]);
      } else {
        // Start with a fresh question if none exist
        setQuestions([]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Studio data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // Handle Switching Questions
  const handleSwitch = (index: number) => {
    if (index < 0 || index >= (questions.length + 1)) return;
    
    // If we're at the "New Question" index (last + 1)
    if (index === questions.length) {
      setCurrentQuestion({
        questionText: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctOption: 0,
        explanation: "",
        marks: 1,
        negativeMarks: 0.25,
        difficulty: "Medium"
      });
    } else {
      setCurrentQuestion(questions[index]);
    }
    setCurrentIndex(index);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (currentQuestion._id) {
        await API.put(`/admin/question/${currentQuestion._id}`, currentQuestion);
      } else {
        await API.post(`/question/add/${id}`, currentQuestion);
      }
      // Re-fetch to get updated IDs and list
      await fetchData();
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentQuestion._id) return;
    if (!confirm("Delete this question?")) return;
    try {
      await API.delete(`/admin/question/${currentQuestion._id}`);
      fetchData();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f3f4f9] flex items-center justify-center font-black text-blue-600 animate-pulse tracking-widest">LOADING STUDIO...</div>;

  return (
    <div className="flex h-screen bg-[#f3f4f9] text-gray-900 font-sans overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* STUDIO TOP BAR (Image #2/#3 Style) */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/admin-dashboard/tests")}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-sm font-black text-gray-900 tracking-tight uppercase">
              {currentIndex + 1}. {test?.title || "Test Studio"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition">
               <Eye size={16} />
               Preview
             </button>
             <div className="w-px h-6 bg-gray-200 mx-1" />
             <button 
               onClick={() => handleSwitch(currentIndex - 1)}
               disabled={currentIndex === 0}
               className="px-5 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-100 disabled:opacity-30 transition"
             >
               Previous
             </button>
             <button 
               onClick={handleSave}
               disabled={saving}
               className="px-5 py-2 bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-800 shadow-lg shadow-blue-200 flex items-center gap-2 transition"
             >
               {saving ? "Saving..." : <><Save size={16} /> Save</>}
             </button>
             <button 
               onClick={() => handleSwitch(currentIndex + 1)}
               className="px-5 py-2 bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-lg shadow-blue-100"
             >
               Next
             </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* STUDIO LEFT NAV (Image #3 Style) */}
          <aside className="w-72 bg-white border-r border-gray-100 overflow-y-auto hidden xl:block p-4">
             <ul className="space-y-1">
                {sidebarItems.map((item, idx) => (
                  <li key={idx}>
                    <button className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all ${item.active ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"}`}>
                       <div className="flex items-center gap-4">
                         <span className={item.active ? "text-blue-600" : "text-gray-400"}>{item.icon}</span>
                         <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                       </div>
                       <ChevronRight size={14} className={item.active ? "text-blue-400" : "text-gray-300"} />
                    </button>
                  </li>
                ))}
             </ul>

             {/* Test Overview Metadata Area (Image #3 Top-Right Style) */}
             <div className="mt-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Test Details</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <HelpCircle size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-gray-700">{test?.duration || 0} mins Duration</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Layers size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-gray-700 truncate">{test?.category || "General"}</span>
                   </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                   <p className="text-[10px] font-bold leading-relaxed text-gray-400 uppercase tracking-widest mb-2">Instructions</p>
                   <p className="text-[11px] text-gray-600 leading-relaxed font-medium">Test Instructions: Click settings to modify.</p>
                </div>
             </div>
          </aside>

          {/* MAIN EDITOR AREA (Image #2 Style) */}
          <section className="flex-1 overflow-y-auto p-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
                 {/* Question Header: Marks & Difficulty */}
                 <div className="px-10 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-black text-gray-900 border-r border-gray-200 pr-4 uppercase tracking-widest">
                         {currentIndex + 1}. Multiple Choice
                       </span>
                       <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-black tracking-widest">+ {currentQuestion.marks || 1.0}</span>
                          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-[10px] font-black tracking-widest">- {currentQuestion.negativeMarks || 0.25}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Difficulty Level</span>
                       <select 
                         value={currentQuestion.difficulty || "Medium"}
                         onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as any})}
                         className="bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-xs font-bold outline-none focus:border-blue-400 transition cursor-pointer"
                       >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                       </select>
                    </div>
                 </div>

                 {/* Question Content Editor */}
                 <div className="p-10 space-y-10">
                    <div className="space-y-4">
                       <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Question</h3>
                       <textarea 
                         value={currentQuestion.questionText}
                         onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all text-lg font-medium min-h-[140px] resize-none"
                         placeholder="Type your question text here..."
                       />
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Answers</h3>
                         <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest text-gray-600">Single Correct</span>
                       </div>

                       <div className="space-y-3">
                          {currentQuestion.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                               <div 
                                 onClick={() => setCurrentQuestion({...currentQuestion, correctOption: i})}
                                 className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${currentQuestion.correctOption === i ? "border-green-500 bg-green-500 text-white" : "border-gray-200 group-hover:border-blue-400"}`}
                               >
                                 {currentQuestion.correctOption === i && <CheckCircle2 size={14} strokeWidth={4} />}
                               </div>
                               <input 
                                 value={opt.text}
                                 onChange={(e) => {
                                   const newOpts = [...currentQuestion.options];
                                   newOpts[i].text = e.target.value;
                                   setCurrentQuestion({...currentQuestion, options: newOpts});
                                 }}
                                 placeholder={`Option ${i+1}`}
                                 className={`flex-1 bg-gray-50/50 border border-gray-100 rounded-xl px-6 py-4 outline-none transition-all font-bold text-sm ${currentQuestion.correctOption === i ? "border-green-100 bg-green-50/10" : "focus:border-blue-200 focus:bg-white"}`}
                               />
                               <button 
                                 onClick={() => {
                                   const newOpts = currentQuestion.options.filter((_, idx) => idx !== i);
                                   setCurrentQuestion({...currentQuestion, options: newOpts});
                                 }}
                                 className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 transition-all"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                          ))}
                       </div>

                       <button 
                         onClick={() => setCurrentQuestion({...currentQuestion, options: [...currentQuestion.options, { text: "" }]})}
                         className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition"
                       >
                         <Plus size={16} />
                         Add new option
                       </button>
                    </div>

                    <div className="space-y-4 pt-10 border-t border-gray-50">
                       <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Explanation (Shown after test)</h3>
                       <textarea 
                         value={currentQuestion.explanation || ""}
                         onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 transition-all text-sm font-medium min-h-[100px]"
                         placeholder="Provide the reasoning for the correct answer..."
                       />
                    </div>
                 </div>
              </div>
              
              <div className="mt-12 flex items-center justify-between px-4">
                 <button 
                   onClick={handleDelete}
                   className="flex items-center gap-2 text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition"
                 >
                   <Trash2 size={16} />
                   Delete this question
                 </button>
                 <div className="flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <span>Questions: {questions.length} Total</span>
                    <span>Last Saved: Just Now</span>
                 </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
