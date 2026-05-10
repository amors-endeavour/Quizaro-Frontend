"use client";

import { useState, useEffect, useRef } from "react";
import AdminHeader from "@/components/AdminHeader";
import useSWR from "swr";
import API from "@/app/lib/api";
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
  Upload,
  Plus,
  Filter,
  ExternalLink
} from "lucide-react";

interface PDFResource {
  id: string;
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  category: string;
}

export default function PDFManagement() {
  // LIVE DATABASE SYNCHRONIZATION
  const { data: fetchedPDFs, error, mutate } = useSWR<PDFResource[]>('/admin/resources/pdf', async (url: string) => {
    try {
      const res = await API.get(url);
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch PDF resources:", err);
      return [];
    }
  }, { refreshInterval: 5000 });

  const pdfList = fetchedPDFs || [];

  // UI STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingPDF, setEditingPDF] = useState<PDFResource | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    category: "Question Paper"
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setStagedFile(file);
    } else if (file) {
      showToast("Only PDF files are permitted.", "error");
    }
  };

  const handleUploadSubmit = async () => {
    if (!stagedFile && !editingPDF) {
      showToast("Please select a PDF file.", "error");
      return;
    }
    if (!formData.title || !formData.description) {
      showToast("Title and Description are required.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const uploadData = new FormData();
      if (stagedFile) uploadData.append("file", stagedFile);
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("tags", JSON.stringify(formData.tags.split(",").map(t => t.trim())));
      uploadData.append("category", formData.category);

      if (editingPDF) {
        await API.patch(`/admin/resources/pdf/${editingPDF.id}`, uploadData);
        showToast("Resource updated successfully.", "success");
      } else {
        await API.post("/admin/resources/pdf", uploadData);
        showToast("Resource uploaded successfully.", "success");
      }

      mutate();
      resetForm();
    } catch (err) {
      showToast("Upload failed. Verify storage configuration.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setIsUploadModalOpen(false);
    setEditingPDF(null);
    setStagedFile(null);
    setFormData({ title: "", description: "", tags: "", category: "Question Paper" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently purge this academic resource?")) return;
    try {
      await API.delete(`/admin/resources/pdf/${id}`);
      mutate();
      showToast("Resource purged from registry.", "success");
    } catch (err) {
      showToast("Purge failed.", "error");
    }
  };

  const filteredPDFs = pdfList.filter(pdf => 
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pdf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pdf.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatFileSize = (bytes: number | string) => {
    const b = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    if (isNaN(b)) return bytes;
    if (b === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="PDF Resources" 
        path={[{ label: "Home" }, { label: "Quizzes" }, { label: "PDF Section" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* ACTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Academic Repository</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Host, tag, and organize PDF assessments</p>
           </div>
           <button 
             onClick={() => { resetForm(); setIsUploadModalOpen(true); }}
             className="px-10 py-5 bg-[#7C3AED] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"
           >
              <Plus size={18} /> Provision New PDF
           </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <section className="relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search by Title, Tags, or Academic Level (e.g. 'Grade 10 2026')..." 
             className="w-full bg-white border border-gray-100 rounded-[2rem] pl-16 pr-8 py-6 text-sm focus:border-purple-600 outline-none transition-all shadow-sm italic font-bold"
           />
        </section>

        {/* RESOURCE GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredPDFs.length > 0 ? filteredPDFs.map((pdf) => (
             <div key={pdf.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group">
                <div className="p-10 space-y-8 flex flex-col h-full">
                   <div className="flex items-start justify-between">
                      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner group-hover:rotate-6 transition-transform">
                         <FileText size={24} />
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => { setEditingPDF(pdf); setFormData({ title: pdf.title, description: pdf.description, tags: pdf.tags.join(", "), category: pdf.category }); setIsUploadModalOpen(true); }}
                           className="p-3 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                         >
                            <Plus className="rotate-45" size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(pdf.id)}
                           className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                         >
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>

                   <div className="space-y-3 flex-1">
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-snug line-clamp-2">{pdf.title}</h3>
                      <p className="text-[11px] text-gray-400 font-bold italic leading-relaxed line-clamp-3">{pdf.description}</p>
                   </div>

                   <div className="flex flex-wrap gap-2">
                      {pdf.tags?.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100">
                           {tag}
                        </span>
                      ))}
                   </div>

                   <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Size: {formatFileSize(pdf.fileSize)}</span>
                         <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest italic">{pdf.uploadedAt}</span>
                      </div>
                      <button 
                        onClick={() => window.open(pdf.fileUrl, '_blank')}
                        className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95"
                        title="View PDF"
                      >
                         <ExternalLink size={18} />
                      </button>
                   </div>
                </div>
             </div>
           )) : (
             <div className="col-span-full py-32 flex flex-col items-center justify-center gap-6 text-gray-300 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <FileText size={64} className="opacity-20" />
                <div className="text-center space-y-2">
                   <p className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none">No matching academic resources found</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest italic">Adjust your search or provision a new PDF to the repository.</p>
                </div>
             </div>
           )}
        </section>
      </main>

      {/* UPLOAD / EDIT MODAL */}
      {(isUploadModalOpen || editingPDF) && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl space-y-10 animate-in zoom-in duration-500 relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <button 
                onClick={resetForm}
                className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-900 transition-all"
              >
                <X size={24} />
              </button>

              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                    {editingPDF ? "Update Resource" : "Provision New Resource"}
                 </h3>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic">100% Data-Driven Academic Repository</p>
              </div>

              <div className="space-y-8">
                 {/* FILE DROP ZONE */}
                 {!editingPDF && (
                   <div 
                     onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                     onDragLeave={() => setIsDragging(false)}
                     onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if(file?.type === "application/pdf") setStagedFile(file); }}
                     onClick={() => fileInputRef.current?.click()}
                     className={`p-12 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${
                       isDragging ? "border-purple-600 bg-purple-50" : "border-gray-100 bg-gray-50/50 hover:border-purple-200"
                     }`}
                   >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                      {stagedFile ? (
                        <div className="flex flex-col items-center gap-4 text-purple-600 animate-in zoom-in">
                           <CheckCircle2 size={40} />
                           <p className="text-[12px] font-black uppercase tracking-widest italic">{stagedFile.name}</p>
                        </div>
                      ) : (
                        <>
                           <UploadCloud size={48} className="text-gray-300" />
                           <div className="text-center space-y-1">
                              <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic">Drag & drop assessment PDF</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">Click to browse local files</p>
                           </div>
                        </>
                      )}
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Resource Title <span className="text-red-500">*</span></label>
                       <input 
                         type="text" 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         placeholder="e.g. Class 10 Mathematics Final 2026" 
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner"
                       />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Description / Academic Summary <span className="text-red-500">*</span></label>
                       <textarea 
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                         placeholder="Include academic level, year, and specific subject details..." 
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner min-h-[120px]"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Category Tags (Comma separated)</label>
                       <input 
                         type="text" 
                         value={formData.tags}
                         onChange={(e) => setFormData({...formData, tags: e.target.value})}
                         placeholder="Grade 10, Syllabus, 2026" 
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Primary Classification</label>
                       <select 
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner appearance-none cursor-pointer"
                       >
                          <option>Question Paper</option>
                          <option>Syllabus</option>
                          <option>Study Material</option>
                          <option>Reference Guide</option>
                       </select>
                    </div>
                 </div>

                 <button 
                   disabled={isSaving}
                   onClick={handleUploadSubmit}
                   className="w-full py-6 bg-gray-900 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest italic shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : editingPDF ? "Update Resource Metadata" : "Authorize & Upload Resource"}
                 </button>
              </div>
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
