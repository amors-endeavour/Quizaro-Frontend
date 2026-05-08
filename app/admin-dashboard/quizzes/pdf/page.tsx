"use client";

import { useState, useEffect, useRef } from "react";
import AdminHeader from "@/components/AdminHeader";
import { 
  UploadCloud, 
  FileText, 
  Search, 
  MoreVertical, 
  Download, 
  Trash2, 
  ChevronRight, 
  Eye, 
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  Check,
  X,
  AlertCircle,
  Upload
} from "lucide-react";

export default function PDFManagement() {
  const [pdfs] = useState([
    { id: 1, name: "Introduction to AI.pdf", category: "AI", size: "2.4 MB", date: "May 20, 2025", downloads: 124 },
    { id: 2, name: "Machine Learning Basics.pdf", category: "ML", size: "4.1 MB", date: "May 19, 2025", downloads: 89 },
    { id: 3, name: "Data Science Handbook.pdf", category: "Data Science", size: "15.2 MB", date: "May 18, 2025", downloads: 256 },
    { id: 4, name: "Python Programming Guide.pdf", category: "Python", size: "1.8 MB", date: "May 17, 2025", downloads: 412 },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Reading PDF Content...",
    "Identifying Key Concepts...",
    "Drafting MCQ Questions...",
    "Finalizing Explanations..."
  ];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAutoGenerate = (pdf: any) => {
    setSelectedPDF(pdf);
    setIsProcessing(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isProcessing && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isProcessing && currentStep === steps.length) {
      setGeneratedQuestions([
        { id: 1, question: "What is the primary goal of Artificial Intelligence?", options: ["Automating physical labor", "Simulating human intelligence", "Data storage", "Internet connectivity"], answer: "Simulating human intelligence", explanation: "As stated on page 3, AI aims to simulate human cognitive functions.", status: 'keep' },
        { id: 2, question: "Which algorithm is commonly used for classification?", options: ["Merge Sort", "Random Forest", "Binary Search", "Dijkstra"], answer: "Random Forest", explanation: "The PDF highlights Random Forest as a robust classification method in Section 2.", status: 'keep' },
        { id: 3, question: "What does 'ML' stand for?", options: ["Memory Logic", "Machine Learning", "Main Link", "Meta Language"], answer: "Machine Learning", explanation: "Chapter 1 defines ML as a subset of AI focused on learning from data.", status: 'keep' },
      ]);
      setIsProcessing(false);
      setShowReview(true);
    }
  }, [isProcessing, currentStep]);

  const toggleQuestionStatus = (id: number) => {
    setGeneratedQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, status: q.status === 'keep' ? 'discard' : 'keep' } : q
    ));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndStageFile(file);
  };

  const validateAndStageFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Error: Only PDF files are allowed", "error");
      return;
    }
    setStagedFile(file);
    showToast("File staged successfully!", "success");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndStageFile(file);
  };

  const clearStagedFile = () => {
    setStagedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStartAnalysis = () => {
    if (stagedFile) {
      handleAutoGenerate({ name: stagedFile.name });
      setStagedFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="PDF Management" 
        path={[{ label: "Home" }, { label: "PDFs" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* PDF UPLOAD ZONE */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center space-y-8">
           <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-purple-900/5 animate-pulse">
              <UploadCloud size={48} />
           </div>
           <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Upload PDF</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Drag and drop a PDF here, or click to browse</p>
           </div>

           <div 
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             className={`w-full max-w-2xl p-16 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-8 transition-all relative group ${
               isDragging ? "border-[#7C3AED] bg-purple-50/50" : "border-gray-100 bg-white"
             }`}
           >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />

              {!stagedFile ? (
                <>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-5 bg-[#7C3AED] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Choose File
                  </button>
                  <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Only PDF files are allowed.</p>
                </>
              ) : (
                <div className="w-full flex flex-col items-center gap-8 animate-in zoom-in duration-300">
                   <div className="flex items-center gap-6 p-6 bg-purple-50 rounded-[2rem] border border-purple-100 w-full relative group/item">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                         <FileText size={24} />
                      </div>
                      <div className="flex-1 space-y-1">
                         <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none truncate max-w-[300px]">{stagedFile.name}</p>
                         <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest italic">{formatFileSize(stagedFile.size)}</p>
                      </div>
                      <button 
                        onClick={clearStagedFile}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <X size={20} />
                      </button>
                   </div>
                   
                   <button 
                     onClick={handleStartAnalysis}
                     className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                   >
                     <Sparkles size={18} /> Start AI Analysis
                   </button>
                </div>
              )}
           </div>
        </section>

        {/* PDF DETAILS FORM */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Document Configuration</h3>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Access Control:</span>
                 <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-purple-600 bg-white shadow-sm rounded-lg">Public</button>
                    <button className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-900">Premium</button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">PDF Title</label>
                <input type="text" placeholder="Enter document title" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Category / Subject</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm text-gray-500 focus:border-purple-600 outline-none transition-all">
                   <option>Select category</option>
                   <option>General Knowledge</option>
                   <option>Science & Tech</option>
                   <option>History</option>
                </select>
              </div>
           </div>
        </section>

        {/* YOUR PDFS LIST */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Your PDFs</h3>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search PDFs..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">PDF Name</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Category</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">File Size</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Uploaded On</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pdfs.map((pdf) => (
                  <tr key={pdf.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm group-hover:rotate-6 transition-transform">
                          <FileText size={20} />
                        </div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none">{pdf.name}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">{pdf.category}</span>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{pdf.size}</td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">{pdf.date}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleAutoGenerate(pdf)}
                          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-purple-900/20 active:scale-95 transition-all"
                        >
                          <Sparkles size={14} /> Auto-Generate Quiz
                        </button>
                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-purple-600 rounded-xl transition-all"><Eye size={18} /></button>
                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-green-600 rounded-xl transition-all"><Download size={18} /></button>
                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                        <button className="p-2.5 text-gray-300 hover:text-gray-900"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* PROCESSING MODAL */}
      {isProcessing && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8">
           <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl space-y-10 animate-in zoom-in duration-500">
              <div className="flex flex-col items-center gap-6 text-center">
                 <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center animate-spin">
                    <Loader2 size={40} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Ingesting Document</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">{selectedPDF?.name}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                         currentStep > idx ? "bg-green-50 text-green-500" :
                         currentStep === idx ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-200"
                       }`}>
                          {currentStep > idx ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                       </div>
                       <span className={`text-[11px] font-black uppercase tracking-widest italic ${
                         currentStep === idx ? "text-gray-900" : "text-gray-300"
                       }`}>{step}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* REVIEW SCREEN */}
      {showReview && (
        <div className="fixed inset-0 z-[1000] bg-[#F9FAFB] flex flex-col animate-in slide-in-from-right duration-700">
           <div className="p-8 lg:p-12 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
              <div className="space-y-1">
                 <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none flex items-center gap-4">
                    Review Generated Quiz <Sparkles className="text-purple-600" size={28} />
                 </h2>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic">Source: {selectedPDF?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setShowReview(false)} className="px-8 py-4 bg-gray-50 text-gray-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Discard All</button>
                 <button onClick={() => setShowReview(false)} className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 active:scale-95 transition-all flex items-center gap-3">
                   <Save size={18} /> Save & Publish Quiz
                 </button>
              </div>
           </div>

           <div className="flex-1 overflow-auto p-8 lg:p-12 space-y-10 max-w-5xl mx-auto w-full">
              {generatedQuestions.map((q, idx) => (
                <div key={q.id} className={`bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden shadow-sm ${
                  q.status === 'discard' ? "opacity-40 grayscale border-gray-100" : "border-purple-100"
                }`}>
                   <div className="p-8 space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-black text-sm italic border border-purple-100">{idx + 1}</span>
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Generated MCQ</h4>
                         </div>
                         <button 
                          onClick={() => toggleQuestionStatus(q.id)}
                          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            q.status === 'keep' ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                          }`}
                         >
                            {q.status === 'keep' ? <><X size={14} /> Discard</> : <><Check size={14} /> Keep</>}
                         </button>
                      </div>

                      <div className="space-y-6">
                         <h5 className="text-lg font-black text-gray-900 tracking-tight italic leading-snug">{q.question}</h5>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt: string, i: number) => (
                               <div key={i} className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                 opt === q.answer ? "bg-green-50 border-green-200 text-green-600" : "bg-gray-50 border-gray-100 text-gray-500"
                               }`}>
                                  {String.fromCharCode(65 + i)}. {opt}
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 space-y-2">
                         <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest italic leading-none">AI Insight & Explanation</p>
                         <p className="text-[11px] text-purple-600 font-bold italic leading-relaxed">{q.explanation}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

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
