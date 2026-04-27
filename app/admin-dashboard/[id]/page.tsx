"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Plus, 
  Trash2, 
  FileEdit,
  FileText,
  AlertCircle,
  CheckCircle2,
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
  marks: number;
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
  questionTimer: number;
}

export default function QuestionStudio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Questions");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testSettings, setTestSettings] = useState<TestSettings & { fileUrl?: string }>({
    title: "",
    duration: 30,
    passingCriteria: 40,
    allowedAttempts: 1,
    isStrict: false,
    shuffleOptions: true,
    instructions: "",
    category: "General",
    questionTimer: 0,
    fileUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<{show: boolean, type: 'delete' | 'save', targetId?: string}>({show: false, type: 'delete'});
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    type: "mcq",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOption: 0,
    marks: 1,
    section: "General"
  });

  const [bulkData, setBulkData] = useState("");
  const [isPdfPinned, setIsPdfPinned] = useState(true);

  const loadData = async () => {
    try {
      const [testRes, qRes] = await Promise.all([
        API.get(`/test/${id}`),
        API.get(`/admin/questions/${id}`)
      ]);
      
      const qData = qRes.data.map((q: any) => ({
        ...q,
        text: q.questionText || q.text || "", // Handle both variants
        marks: q.marks || q.marks || 1      // Normalize marks 🔥
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
        category: testRes.data.category || "General",
        questionTimer: testRes.data.questionTimer || 0,
        fileUrl: testRes.data.fileUrl || ""
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
      setStatusMsg({ text: "Institutional parameters synchronized successfully.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
    } catch {
      setStatusMsg({ text: "Parameter synchronization failed.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveQuestion = async (q: Question) => {
    setSaving(true);
    try {
      if (q._id) {
        await API.put(`/admin/question/${q._id}`, { ...q, questionText: q.text });
      } else {
        await API.post(`/question/add/${id}`, { ...q, questionText: q.text });
      }
      setStatusMsg({ text: "Assessment item preserved successfully.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
      setIsEditing(false);
    } catch {
      setStatusMsg({ text: "Failed to preserve assessment item.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    try {
      await API.delete(`/admin/question/${qId}`);
      setStatusMsg({ text: "Item expunged from registry.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
      setShowConfirmModal({ show: false, type: 'delete' });
    } catch {
      setStatusMsg({ text: "Expunge operation failed.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
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
        setStatusMsg({ text: `${parsed.length} items merged into registry.`, type: 'success' });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      setStatusMsg({ text: "JSON parsing failure - verification required.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black animate-pulse text-cyan-400 uppercase tracking-widest leading-none text-xs text-center">Synthesizing Institutional <br/> Studio Environment...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-white selection:bg-cyan-500/30">
      <AdminHeader 
        title="Question Studio" 
        path={[{ label: "Library", href: "/admin-dashboard/tests" }, { label: testSettings.title }]} 
      />

      <div className="p-10 lg:p-14 max-w-[1700px] mx-auto w-full flex flex-col lg:flex-row gap-12">
          
          {/* NAVIGATION WING */}
          <div className="w-full lg:w-80 flex flex-col gap-3">
             {[
                { id: "Questions", label: "Questions", icon: <Layers size={18} /> },
                { id: "PDF", label: "Asset Viewer", icon: <FileText size={18} /> },
                { id: "Settings", label: "Settings", icon: <Shield size={18} /> },
                { id: "Import", label: "Bulk Import", icon: <ArrowDownToLine size={18} /> }
             ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-left transition-all border flex items-center gap-4 italic ${activeTab === tab.id ? "bg-cyan-600 text-white border-cyan-400 shadow-[0_15px_40px_rgba(6,182,212,0.3)]" : "bg-white/5 border-white/5 text-gray-500 hover:border-cyan-400/30 hover:text-white"}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
             ))}
             
             <div className="mt-8 p-10 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-md">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-6 italic">Paper Summary</p>
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-[11px] font-bold text-gray-500 uppercase italic">Questions</span>
                      <span className="text-2xl font-black text-white leading-none italic">{questions.length}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-[11px] font-bold text-gray-500 uppercase italic">Total Points</span>
                      <span className="text-2xl font-black text-white leading-none italic">{questions.reduce((a, b) => a + (b.marks || 0), 0)}</span>
                   </div>
                </div>
                {activeTab === "Settings" && (
                  <button 
                    onClick={handleUpdateTest}
                    disabled={saving}
                    className="w-full py-5 mt-10 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-900/20 active:scale-95 italic"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                )}
             </div>
          </div>

          {/* MAIN CANVAS / SPLIT VIEW */}
          <div className="flex-1 flex flex-col xl:flex-row gap-12 min-w-0">
              
              {/* STICKY PDF PANEL 🔥 */}
              {testSettings.fileUrl && activeTab !== "PDF" && isPdfPinned && (
                <div className="w-full xl:w-[600px] h-[600px] xl:h-[85vh] sticky top-14 bg-white/5 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl animate-in slide-in-from-left-10 duration-700">
                    <div className="absolute top-6 left-6 z-10 flex gap-2">
                       <button 
                         onClick={() => setIsPdfPinned(false)}
                         className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[8px] font-black uppercase text-white hover:bg-cyan-600 transition-all"
                       >
                          Minimize Viewer
                       </button>
                    </div>
                    <iframe 
                      src={`${testSettings.fileUrl}#toolbar=0`}
                      className="w-full h-full border-none"
                      title="Sticky Institutional Asset"
                    />
                </div>
              )}

              <div className="flex-1 w-full min-w-0">
                  {!isPdfPinned && testSettings.fileUrl && activeTab !== "PDF" && (
                    <button 
                      onClick={() => setIsPdfPinned(true)}
                      className="mb-8 px-8 py-4 bg-cyan-600/20 border border-cyan-400/30 rounded-2xl text-[9px] font-black uppercase text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all italic"
                    >
                       + Restore Asset Viewer
                    </button>
                  )}
                  
                  {activeTab === "Questions" ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
                   <div className="flex items-center justify-between">
                       <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Questions</h3>
                       <button 
                         onClick={() => {
                           setCurrentQuestion({ text: "", type: "mcq", options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }], correctOption: 0, marks: 1, section: "General" });
                           setIsEditing(true);
                         }}
                         className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-900/40 border border-white/10 italic"
                       >
                         Add Question
                       </button>
                   </div>

                   {questions.length === 0 ? (
                      <div className="bg-white/5 rounded-[4rem] border border-dashed border-white/10 py-40 flex flex-col items-center justify-center text-center backdrop-blur-md">
                         <HelpCircle size={48} className="text-gray-800 mb-6 animate-pulse" />
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] italic">Awaiting Intellectual Injection</p>
                      </div>
                   ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {questions.map((q, idx) => (
                           <div key={idx} className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 flex flex-col gap-8 group hover:border-cyan-400/30 hover:bg-white/[0.05] transition-all duration-700 relative overflow-hidden shadow-2xl">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                              
                              <div className="flex items-center justify-between relative z-10">
                                 <div className="w-12 h-12 bg-white/5 text-cyan-400 border border-white/5 rounded-xl flex items-center justify-center font-black text-xs font-mono group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-lg">{idx + 1}</div>
                                 <div className="flex items-center gap-3">
                                    <button onClick={() => { setCurrentQuestion(q); setIsEditing(true); }} className="w-10 h-10 rounded-xl bg-white/5 text-gray-500 hover:text-white flex items-center justify-center transition-all"><FileEdit size={16} /></button>
                                    <button onClick={() => setShowConfirmModal({ show: true, type: 'delete', targetId: q._id })} className="w-10 h-10 rounded-xl bg-white/5 text-red-500/50 hover:text-red-500 flex items-center justify-center transition-all"><Trash2 size={16} /></button>
                                 </div>
                              </div>

                              <div className="space-y-4 relative z-10 flex-1">
                                 <p className="text-lg font-black text-white tracking-tight italic leading-relaxed">{q.text}</p>
                                 
                                 {/* OPTION BOXES */}
                                 <div className="grid grid-cols-2 gap-3 pt-4">
                                    {q.options.map((opt, i) => (
                                       <div key={i} className={`p-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${q.correctOption === i ? "bg-cyan-600/10 border-cyan-400/30 text-cyan-400" : "bg-white/5 border-white/5 text-gray-600"}`}>
                                          <span className="opacity-40">{String.fromCharCode(65 + i)}</span>
                                          <span className="truncate">{opt.text}</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{q.section || "General Domain"}</span>
                                 <span className="text-[10px] font-black text-white bg-white/5 px-4 py-2 rounded-xl italic">{q.marks} Points</span>
                              </div>
                           </div>
                        ))}
                      </div>
                   )}
                </div>
              ) : activeTab === "PDF" ? (
                <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 overflow-hidden h-[800px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-700">
                    {testSettings.fileUrl ? (
                      <iframe 
                        src={`${testSettings.fileUrl}#toolbar=0`}
                        className="w-full h-full border-none"
                        title="Institutional PDF Viewer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-20 space-y-6">
                         <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-700">
                            <FileText size={40} />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest italic">No PDF Asset Bound</h3>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-relaxed">Please link a PDF resource in the settings to activate the mesh viewer.</p>
                         </div>
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

                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Asset Pipeline (PDF Link)</label>
                         <input 
                           value={testSettings.fileUrl}
                           onChange={(e) => setTestSettings({...testSettings, fileUrl: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-10 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-sm text-cyan-600 italic"
                           placeholder="https://cloudinary.com/..."
                         />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                         <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Duration (Min)</label>
                           <input 
                             type="number"
                             value={testSettings.duration}
                             onChange={(e) => setTestSettings({...testSettings, duration: Number(e.target.value)})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-gray-900"
                           />
                         </div>

                         <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Passing %</label>
                           <input 
                             type="number"
                             value={testSettings.passingCriteria}
                             onChange={(e) => setTestSettings({...testSettings, passingCriteria: Number(e.target.value)})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-gray-900"
                           />
                         </div>

                         <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Attempt Limit</label>
                           <input 
                             type="number"
                             value={testSettings.allowedAttempts}
                             onChange={(e) => setTestSettings({...testSettings, allowedAttempts: Number(e.target.value)})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-gray-900"
                           />
                         </div>
                       </div>

                       <div className="flex flex-col gap-8">
                          <div className="flex items-center justify-between p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-md">
                             <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Strict Intelligent Proctoring</h4>
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">Enable advanced biometric & screen control</p>
                             </div>
                             <button 
                               onClick={() => setTestSettings({...testSettings, isStrict: !testSettings.isStrict})}
                               className={`w-16 h-8 rounded-full relative transition-all duration-500 border border-white/10 ${testSettings.isStrict ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-white/10"}`}
                             >
                                 <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 ${testSettings.isStrict ? "left-9 shadow-red-200" : "left-2"}`} />
                             </button>
                          </div>

                          <div className="flex items-center justify-between p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-md">
                             <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Entropy Shuffling</h4>
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">Randomize logic sequences for students</p>
                             </div>
                             <button 
                               onClick={() => setTestSettings({...testSettings, shuffleOptions: !testSettings.shuffleOptions})}
                               className={`w-16 h-8 rounded-full relative transition-all duration-500 border border-white/10 ${testSettings.shuffleOptions ? "bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-white/10"}`}
                             >
                                 <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 ${testSettings.shuffleOptions ? "left-9 shadow-cyan-200" : "left-2"}`} />
                             </button>
                          </div>
                       </div>


                       <div className="flex flex-col gap-8">
                          <div className="flex items-center justify-between p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-md">
                             <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Clock Synchronization</h4>
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">Set hard limit per node (0 to terminate override)</p>
                             </div>
                             <input 
                               type="number"
                               value={testSettings.questionTimer}
                               onChange={(e) => setTestSettings({...testSettings, questionTimer: Number(e.target.value)})}
                               className="w-24 bg-[#0a0f1d] border border-white/10 rounded-2xl px-4 py-3 font-black text-center text-cyan-400 outline-none focus:border-cyan-400 transition-all shadow-inner italic"
                             />
                          </div>
                       </div>

                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1 italic">Operational Directives</label>
                         <textarea 
                           value={testSettings.instructions}
                           onChange={(e) => setTestSettings({...testSettings, instructions: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-[3rem] px-12 py-10 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-bold min-h-[200px] resize-none text-white leading-relaxed placeholder:text-gray-800 italic"
                           placeholder="Define protocol for this assessment..."
                         />
                       </div>
                    </div>
                </div>
               ) : (
                <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-16 space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                   <div className="space-y-3">
                       <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] italic">Bulk Import Hub</h3>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic tracking-[0.4em]">Paste raw JSON to import multiple questions instantly</p>
                   </div>
                   <textarea 
                     value={bulkData}
                     onChange={(e) => setBulkData(e.target.value)}
                     placeholder='[{"text": "Sample Issue", "options": [{"text": "A"}], "correctOption": 0, "marks": 1, "section": "Quant"}]'
                     className="w-full h-96 bg-black/40 border border-white/10 rounded-[3.5rem] p-12 font-mono text-xs font-black text-cyan-400 outline-none focus:border-cyan-400/50 transition-all shadow-inner italic"
                   />
                   <button 
                     onClick={handleBulkImport}
                     className="px-16 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-blue-900/40 border border-white/10 active:scale-95 italic"
                   >
                     Initialize Ingestion Process
                   </button>
                </div>
                  )}
              </div>
          </div>
      </div>

      {/* ITEM EDITOR MODAL */}
       {isEditing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-6 lg:p-12 overflow-y-auto animate-in fade-in duration-500">
           <div className="bg-[#0a0f1d] rounded-[4.5rem] w-full max-w-6xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col max-h-[90vh]">
              <div className="px-16 py-12 bg-white/5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] italic">Question Editor</h3>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1 italic">Design clinical assessment pathways</p>
                 </div>
                 <button onClick={() => setIsEditing(false)} className="w-16 h-16 bg-white/5 border border-white/10 shadow-2xl rounded-3xl flex items-center justify-center text-gray-500 hover:text-white text-3xl font-light transition-all active:scale-90 animate-in spin-in-90 duration-500">×</button>
              </div>

              <div className="p-16 grid grid-cols-1 lg:grid-cols-2 gap-20 overflow-y-auto no-scrollbar">
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 ml-1 italic">Syntactic Stem / Prompt</label>
                       <textarea 
                         value={currentQuestion.text}
                         onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                         className="w-full h-72 bg-white/5 border border-white/10 rounded-[3rem] p-12 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-2xl leading-tight shadow-inner text-white placeholder:text-gray-800 italic"
                         placeholder="Formulate your prompt here..."
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10">
                       <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Intellectual Value</label>
                          <input 
                            type="number"
                            value={currentQuestion.marks}
                            onChange={(e) => setCurrentQuestion({...currentQuestion, marks: Number(e.target.value)})}
                            className="w-full bg-transparent outline-none font-black text-4xl text-cyan-400 italic"
                          />
                       </div>
                       <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Taxonomic Section</label>
                          <input 
                            value={currentQuestion.section}
                            onChange={(e) => setCurrentQuestion({...currentQuestion, section: e.target.value})}
                            className="w-full bg-transparent outline-none font-black text-xl text-white italic"
                            placeholder="e.g. Quant"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1 italic">Response Option Grid</label>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-6 custom-scrollbar">
                       {currentQuestion.options.map((opt, i) => (
                          <div key={i} className="flex gap-6 items-center animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                             <button 
                               onClick={() => setCurrentQuestion({...currentQuestion, correctOption: i})}
                               className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center font-black text-sm transition-all duration-500 border border-white/5 shadow-2xl ${currentQuestion.correctOption === i ? "bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-white/5 text-gray-600 hover:text-white"}`}
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
                               className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/30 text-white font-black italic shadow-inner"
                               placeholder={`Option ${String.fromCharCode(65 + i)} definition...`}
                             />
                             <button 
                               onClick={() => {
                                 const newOpts = currentQuestion.options.filter((_, idx) => idx !== i);
                                 setCurrentQuestion({...currentQuestion, options: newOpts});
                               }}
                               className="w-14 h-14 rounded-2xl bg-white/5 text-red-100 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90 border border-white/5"
                             >
                                <Trash2 size={22} />
                             </button>
                          </div>
                       ))}
                    </div>
                    <button 
                      onClick={() => setCurrentQuestion({...currentQuestion, options: [...currentQuestion.options, { text: "" }]})}
                      className="w-full py-6 bg-white/5 border border-dashed border-white/10 rounded-3xl font-black text-[10px] uppercase tracking-widest text-gray-600 hover:text-cyan-400 hover:border-cyan-400/30 transition-all italic"
                    >
                      + Integrate Neural Choice Node
                    </button>

                    <div className="pt-10 flex gap-6">
                       <button onClick={() => setIsEditing(false)} className="flex-1 py-6 bg-white/5 rounded-3xl font-black text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition duration-300 italic">Abort Synthesis</button>
                       <button onClick={() => handleSaveQuestion(currentQuestion)} className="flex-[1.5] py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 italic">Commit Node to Registry</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* INSTITUTIONAL STATUS HUD 🔥 */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[300] px-10 py-6 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-5 backdrop-blur-2xl ${statusMsg.type === 'success' ? "bg-white/5 border-cyan-400/20 text-cyan-400 shadow-cyan-900/10" : "bg-white/5 border-red-400/20 text-red-500 shadow-red-900/10"}`}>
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-cyan-400/10" : "bg-red-400/10"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none italic">{statusMsg.text}</p>
        </div>
      )}

      {/* CONFIRMATION OVERLAY 🔥 */}
      {showConfirmModal.show && (
         <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-[#0a0f1d] border border-white/10 rounded-[4.5rem] p-16 max-w-lg w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-center space-y-12 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-red-400/10 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-950/20 border border-red-500/20">
                  <AlertCircle size={40} className="animate-pulse" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Delete Question</h3>
                  <p className="text-sm font-bold text-gray-500 leading-relaxed italic">
                     Are you certain you want to permanently delete this question? This operation cannot be undone.
                  </p>
               </div>
               <div className="flex flex-col gap-6">
                  <button 
                    onClick={() => handleDeleteQuestion(showConfirmModal.targetId!)}
                    className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-red-900/20 transition-all active:scale-95 duration-300"
                  >
                     Confirm Expunge Operation
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal({ show: false, type: 'delete' })}
                    className="w-full py-6 bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-300 border border-white/5"
                  >
                     Abort Operation
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
