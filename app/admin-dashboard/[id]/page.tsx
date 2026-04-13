"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Plus, 
  Trash2, 
  FileEdit,
  AlertCircle,
  PieChart,
  Layers,
  ArrowDownToLine,
  HelpCircle,
  Shield,
  Clock,
  Target,
  Users,
  Lock,
  Mail,
  MoreVertical,
  ChevronLeft
} from "lucide-react";

interface Question {
  _id?: string;
  text: string;
  type: "mcq" | "descriptive";
  options: { text: string }[];
  correctOption: number;
  points: number;
  section?: string;
}

interface TestSettings {
  title: string;
  duration: number;
  passingCriteria: number;
  allowedAttempts: number;
  isStrict: boolean;
  shuffleOptions: boolean;
  instructions: string;
  category: string;
}

export default function QuestionStudio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Questions");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testSettings, setTestSettings] = useState<TestSettings>({
    title: "",
    duration: 30,
    passingCriteria: 40,
    allowedAttempts: 1,
    isStrict: false,
    shuffleOptions: true,
    instructions: "",
    category: "General"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    type: "mcq",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOption: 0,
    points: 1,
    section: "General"
  });

  const [bulkData, setBulkData] = useState("");

  const loadData = async () => {
    try {
      const [testRes, qRes] = await Promise.all([
        API.get(`/test/${id}`),
        API.get(`/admin/questions/${id}`)
      ]);
      
      const qData = qRes.data.map((q: any) => ({
        ...q,
        text: q.questionText || q.text || "" // Handle both variants
      }));

      setQuestions(qData);
      setTestSettings({
        title: testRes.data.title || "",
        duration: testRes.data.duration || 30,
        passingCriteria: testRes.data.passingCriteria || 40,
        allowedAttempts: testRes.data.allowedAttempts || 1,
        isStrict: testRes.data.isStrict || false,
        shuffleOptions: testRes.data.shuffleOptions ?? true,
        instructions: testRes.data.description || "",
        category: testRes.data.category || "General"
      });
    } catch (err) {
      console.error("Studio data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpdateTest = async () => {
    setSaving(true);
    try {
      await API.put(`/admin/test/${id}`, {
        ...testSettings,
        description: testSettings.instructions
      });
      alert("Institutional update published successfully.");
      loadData();
    } catch {
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveQuestion = async (q: Question) => {
    try {
      if (q._id) {
        await API.put(`/admin/question/${q._id}`, { ...q, questionText: q.text });
      } else {
        await API.post(`/question/add/${id}`, { ...q, questionText: q.text });
      }
      loadData();
      setIsEditing(false);
    } catch {
      alert("Save failed");
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await API.delete(`/admin/question/${qId}`);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkData);
      if (Array.isArray(parsed)) {
        await Promise.all(parsed.map(q => API.post(`/question/add/${id}`, { ...q, questionText: q.text || q.questionText })));
        setBulkData("");
        setActiveTab("Questions");
        loadData();
        alert(`${parsed.length} questions merged successfully.`);
      }
    } catch {
      alert("Invalid JSON format.");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Synthesizing Studio Environment...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader 
        title="Question Studio" 
        path={[{ label: "Library", href: "/admin-dashboard/tests" }, { label: testSettings.title }]} 
      />

      <div className="p-10 lg:p-14 max-w-[1700px] mx-auto w-full flex flex-col lg:flex-row gap-12">
          
          {/* NAVIGATION WING */}
          <div className="w-full lg:w-80 flex flex-col gap-3">
             {[
               { id: "Questions", label: "Questions Registry", icon: <Layers size={18} /> },
               { id: "Settings", label: "Global Parameters", icon: <Shield size={18} /> },
               { id: "Import", label: "Batch Ingestion", icon: <ArrowDownToLine size={18} /> }
             ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-left transition-all border flex items-center gap-4 ${activeTab === tab.id ? "bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200" : "bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-gray-900"}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
             ))}
             
             <div className="mt-8 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-50">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Paper Census</p>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Items</span>
                      <span className="text-xl font-black text-gray-900 leading-none">{questions.length}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Weightage</span>
                      <span className="text-xl font-black text-gray-900 leading-none">{questions.reduce((a, b) => a + (b.points || 0), 0)}</span>
                   </div>
                </div>
                {activeTab === "Settings" && (
                  <button 
                    onClick={handleUpdateTest}
                    disabled={saving}
                    className="w-full py-4 mt-8 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
                  >
                    {saving ? "Syncing..." : "Sync Settings"}
                  </button>
                )}
             </div>
          </div>

          {/* MAIN CANVAS */}
          <div className="flex-1 w-full">
              {activeTab === "Questions" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
                   <div className="flex items-center justify-between">
                       <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Item Registry</h3>
                       <button 
                         onClick={() => {
                           setCurrentQuestion({ text: "", type: "mcq", options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }], correctOption: 0, points: 1, section: "General" });
                           setIsEditing(true);
                         }}
                         className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100"
                       >
                         Append New Item
                       </button>
                   </div>

                   {questions.length === 0 ? (
                      <div className="bg-white rounded-[3.5rem] border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
                         <HelpCircle size={48} className="text-gray-200 mb-6" />
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Awaiting Paper Content</p>
                      </div>
                   ) : (
                       <div className="flex flex-col gap-6">
                        {questions.map((q, idx) => (
                           <div key={idx} className="bg-white rounded-[2.5rem] border border-gray-100 p-10 flex items-center justify-between group hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
                              <div className="flex items-center gap-8">
                                 <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center font-black text-xs font-mono group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">{idx + 1}</div>
                                 <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">Sector: {q.section || "General"}</span>
                                    <p className="text-lg font-black text-gray-900 tracking-tight line-clamp-1 max-w-2xl italic">{q.text}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <button onClick={() => {
                                   setCurrentQuestion(q);
                                   setIsEditing(true);
                                 }} className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"><FileEdit size={20} /></button>
                                 <button onClick={() => handleDeleteQuestion(q._id!)} className="w-14 h-14 rounded-2xl bg-gray-50 text-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={20} /></button>
                              </div>
                           </div>
                        ))}
                      </div>
                   )}
                </div>
              ) : activeTab === "Settings" ? (
                <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-100/30 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="px-12 py-11 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                       <div>
                          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Global Test Parameters</h3>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Configure institutional standards</p>
                       </div>
                       <Shield size={22} className="text-blue-600" />
                    </div>
                    
                    <div className="p-14 space-y-12">
                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Exam Nomenclature</label>
                         <input 
                           value={testSettings.title}
                           onChange={(e) => setTestSettings({...testSettings, title: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-10 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-2xl tracking-tighter text-gray-900"
                         />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                         <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Duration (Min)</label>
                           <input 
                             type="number"
                             value={testSettings.duration}
                             onChange={(e) => setTestSettings({...testSettings, duration: Number(e.target.value)})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-black"
                           />
                         </div>

                         <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Passing %</label>
                           <input 
                             type="number"
                             value={testSettings.passingCriteria}
                             onChange={(e) => setTestSettings({...testSettings, passingCriteria: Number(e.target.value)})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-black"
                           />
                         </div>

                         <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Attempt Limit</label>
                           <input 
                             type="number"
                             value={testSettings.allowedAttempts}
                             onChange={(e) => setTestSettings({...testSettings, allowedAttempts: Number(e.target.value)})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-black"
                           />
                         </div>
                       </div>

                       <div className="flex flex-col gap-6">
                          <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                             <div>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Strict Mode</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Enable AI Proctoring Control</p>
                             </div>
                             <button 
                               onClick={() => setTestSettings({...testSettings, isStrict: !testSettings.isStrict})}
                               className={`w-14 h-7 rounded-full relative transition-all ${testSettings.isStrict ? "bg-red-500" : "bg-gray-200"}`}
                             >
                                <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all ${testSettings.isStrict ? "left-8" : "left-2"}`} />
                             </button>
                          </div>

                          <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                             <div>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Randomize Options</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Shuffle choices for each student</p>
                             </div>
                             <button 
                               onClick={() => setTestSettings({...testSettings, shuffleOptions: !testSettings.shuffleOptions})}
                               className={`w-14 h-7 rounded-full relative transition-all ${testSettings.shuffleOptions ? "bg-blue-600" : "bg-gray-200"}`}
                             >
                                <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all ${testSettings.shuffleOptions ? "left-8" : "left-2"}`} />
                             </button>
                          </div>
                       </div>

                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Test Instructions</label>
                         <textarea 
                           value={testSettings.instructions}
                           onChange={(e) => setTestSettings({...testSettings, instructions: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] px-10 py-8 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold min-h-[180px] resize-none text-gray-900 leading-relaxed"
                           placeholder="Specify rules for this assessment..."
                         />
                       </div>
                    </div>
                </div>
              ) : (
                <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-100/30 p-16 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                   <div className="space-y-2">
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Institutional Batch Ingestion</h3>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Paste JSON array to merge content</p>
                   </div>
                   <textarea 
                     value={bulkData}
                     onChange={(e) => setBulkData(e.target.value)}
                     placeholder='[{"text": "Sample Issue", "options": [{"text": "A"}], "correctOption": 0, "points": 1, "section": "Quant"}]'
                     className="w-full h-80 bg-gray-50 border border-gray-100 rounded-[2.5rem] p-12 font-mono text-xs font-black text-blue-600 outline-none focus:border-blue-500 transition-all shadow-inner"
                   />
                   <button 
                     onClick={handleBulkImport}
                     className="px-14 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 active:scale-95"
                   >
                     Batch Merging Process
                   </button>
                </div>
              )}
          </div>
      </div>

      {/* ITEM EDITOR MODAL */}
       {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-3xl z-50 flex items-center justify-center p-6 lg:p-12 overflow-y-auto animate-in fade-in duration-500">
           <div className="bg-[#f8f9fc] rounded-[4rem] w-full max-w-6xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.25)] border border-white/20 flex flex-col max-h-[90vh]">
              <div className="px-16 py-12 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Item Construction</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Design logical assessment points</p>
                 </div>
                 <button onClick={() => setIsEditing(false)} className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 text-3xl font-light transition-all active:scale-95">×</button>
              </div>

              <div className="p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Stem / Prompt</label>
                       <textarea 
                         value={currentQuestion.text}
                         onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                         className="w-full h-40 bg-gray-50 border border-gray-100 rounded-3xl p-8 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-lg leading-relaxed shadow-inner text-gray-900"
                         placeholder="Formulate your prompt..."
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Point Valuation</label>
                          <input 
                            type="number"
                            value={currentQuestion.points}
                            onChange={(e) => setCurrentQuestion({...currentQuestion, points: Number(e.target.value)})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-xl text-gray-900"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Logical Section</label>
                          <input 
                            value={currentQuestion.section}
                            onChange={(e) => setCurrentQuestion({...currentQuestion, section: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-gray-900"
                            placeholder="e.g. Quant"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Option Spectrum</label>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4">
                       {currentQuestion.options.map((opt, i) => (
                          <div key={i} className="flex gap-4">
                             <button 
                               onClick={() => setCurrentQuestion({...currentQuestion, correctOption: i})}
                               className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${currentQuestion.correctOption === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-300"}`}
                             >
                                {String.fromCharCode(65 + i)}
                             </button>
                             <input 
                               value={opt.text}
                               onChange={(e) => {
                                 const newOpts = [...currentQuestion.options];
                                 newOpts[i].text = e.target.value;
                                 setCurrentQuestion({...currentQuestion, options: newOpts});
                               }}
                               className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 outline-none focus:border-blue-200 text-gray-900 font-bold"
                             />
                             <button 
                               onClick={() => {
                                 const newOpts = currentQuestion.options.filter((_, idx) => idx !== i);
                                 setCurrentQuestion({...currentQuestion, options: newOpts});
                               }}
                               className="p-4 text-red-200 hover:text-red-500"
                             >
                                <Trash2 size={20} />
                             </button>
                          </div>
                       ))}
                    </div>
                    <button 
                      onClick={() => setCurrentQuestion({...currentQuestion, options: [...currentQuestion.options, { text: "" }]})}
                      className="w-full py-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400"
                    >
                      Append choice
                    </button>

                    <div className="pt-8 border-t border-gray-50 flex gap-4">
                       <button onClick={() => setIsEditing(false)} className="flex-1 py-5 border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400">Abort</button>
                       <button onClick={() => handleSaveQuestion(currentQuestion)} className="flex-2 px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Commit Item</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
