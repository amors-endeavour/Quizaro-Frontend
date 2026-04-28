"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  FileText, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
  Zap,
  ChevronRight,
  Info
} from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  category: string;
  isFree?: boolean;
  createdAt?: string;
}

export default function AdminResources() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAutoIngestModal, setShowAutoIngestModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    category: "General",
    fileType: "pdf",
    isFree: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toString().toLowerCase();
        if (role !== "admin") {
          router.replace("/admin-login");
          return;
        }
        setIsAuthChecked(true);
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    fetchResources();
  }, [isAuthChecked]);

  const fetchResources = async () => {
    try {
      const { data } = await API.get("/user/resources");
      setResources(data);
    } catch (err) {
      console.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadData = new FormData();
      uploadData.append("postImage", file);

      const { data } = await API.post("/admin/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });

      setFormData({ ...formData, fileUrl: data.url, title: file.name.replace(".pdf", "") });
      setStatusMsg({ text: "Intelligence File Encrypted & Buffered.", type: "success" });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ text: "Upload Protocol Breach.", type: "error" });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileUrl) {
      setStatusMsg({ text: "No File Payload Detected.", type: "error" });
      return;
    }
    try {
      await API.post("/admin/resource/add", formData);
      setStatusMsg({ text: "Intelligence Resource Deployed.", type: "success" });
      setShowAddModal(false);
      setFormData({ title: "", description: "", fileUrl: "", category: "General", fileType: "pdf", isFree: true });
      fetchResources();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ text: "Deployment Failed.", type: "error" });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleAutoIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('auto-pdf-upload') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      setStatusMsg({ text: "No PDF Payload Detected.", type: "error" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadData = new FormData();
      uploadData.append("postImage", file);
      uploadData.append("title", formData.title);
      uploadData.append("category", formData.category);

      await API.post("/admin/auto-ingest", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });

      setStatusMsg({ text: "Intelligence Scanned & MCQs Generated.", type: "success" });
      setShowAutoIngestModal(false);
      setFormData({ title: "", description: "", fileUrl: "", category: "General", fileType: "pdf", isFree: true });
      fetchResources();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ text: "Ingestion Protocol Failed.", type: "error" });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Confirm immediate resource termination?")) return;
    try {
      await API.delete(`/admin/resource/${id}`);
      setResources(resources.filter(r => r._id !== id));
      setStatusMsg({ text: "Resource Scrubbed Successfully.", type: "success" });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ text: "Scrubbing Protocol Failed.", type: "error" });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    res.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && resources.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
      <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px]">
        Synchronizing Neural Repository...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminHeader 
        title="Neural Repository" 
        path={[{ label: "Governance" }, { label: "Repository" }]} 
      />

      <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
         
         {/* HEADER ACTION HUD */}
         <section className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-12 lg:p-16 rounded-[4rem] shadow-sm relative overflow-hidden group transition-all duration-500">
             <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-center justify-between">
                <div className="space-y-6 flex-1">
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">Document Infrastructure</h2>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">Governance of PDFs, Question Papers, and Academic Schemas</p>
                   </div>
                   
                   {/* Search Box */}
                   <div className="relative max-w-2xl group">
                      <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-blue-600 transition-colors" size={24} />
                      <input 
                        type="text" 
                        placeholder="Search Intelligence Registry..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] py-6 pl-20 pr-10 text-md font-black text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 italic shadow-inner"
                      />
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
                  <button 
                    onClick={() => setShowAutoIngestModal(true)}
                    className="flex-1 xl:flex-none px-10 py-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-lg active:scale-95 italic"
                  >
                    <Zap size={20} /> AI Auto-Ingest
                  </button>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex-1 xl:flex-none px-12 py-7 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 active:scale-95 italic"
                  >
                    <Plus size={20} /> Deploy Resource
                  </button>
                </div>
             </div>
         </section>

         {/* RESOURCE GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
               [1,2,3,4].map(i => (
                 <div key={i} className="h-96 bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[3rem] animate-pulse" />
               ))
            ) : filteredResources.length === 0 ? (
               <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 py-32 text-center bg-white dark:bg-[#0a0f29] rounded-[4rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center gap-6">
                  <FileText size={64} className="text-gray-100 dark:text-gray-900" />
                  <p className="text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic">No intelligence nodes matching query found in repository</p>
               </div>
            ) : (
               filteredResources.map((res) => (
                  <div key={res._id} className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-500 group relative flex flex-col">
                     <div className="absolute top-8 right-10 flex items-center gap-2">
                        {res.isFree ? (
                           <span className="flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30 rounded-full text-[9px] font-black uppercase tracking-widest italic"><Globe size={12} /> Public Access</span>
                        ) : (
                           <span className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30 rounded-full text-[9px] font-black uppercase tracking-widest italic"><Lock size={12} /> Restricted Node</span>
                        )}
                     </div>

                     <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <FileText size={28} />
                     </div>
                     
                     <div className="space-y-2 mb-8">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tighter uppercase italic group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{res.title}</h4>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">{res.category}</p>
                     </div>
                     
                     <p className="text-[12px] text-gray-500 dark:text-gray-400 font-black mb-12 line-clamp-3 italic leading-relaxed">{res.description || "Foundational academic document node preserved in institutional registry."}</p>
                     
                     <div className="flex w-full gap-4 mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                        <a 
                          href={res.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 py-5 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm italic"
                        >
                           <Download size={16} /> Fetch PDF
                        </a>
                        <button 
                          onClick={() => handleDeleteResource(res._id)}
                          className="w-14 h-14 shrink-0 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>

      </div>

      {/* AUTO-INGEST MODAL 🤖 */}
      {showAutoIngestModal && (
         <div className="fixed inset-0 z-[500] bg-[#050816]/60 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[4rem] p-16 max-w-2xl w-full shadow-2xl space-y-12 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar">
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Neural Ingestion Protocol</h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">AI will scan PDF intelligence and synthesize MCQs automatically</p>
               </div>

               <form onSubmit={handleAutoIngest} className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Source Intelligence (PDF Payload)</label>
                     <input 
                        type="file"
                        accept=".pdf"
                        className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl px-8 py-5 outline-none text-[11px] font-black text-gray-900 dark:text-white italic"
                        id="auto-pdf-upload"
                        required
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Synthesis Title</label>
                        <input 
                           required
                           className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500 text-sm font-black text-gray-900 dark:text-white italic placeholder:text-gray-300 dark:placeholder:text-gray-700"
                           placeholder="Ex: Advanced Matrix Synthesis"
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Categorization</label>
                        <input 
                           className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500 text-sm font-black text-gray-900 dark:text-white italic placeholder:text-gray-300 dark:placeholder:text-gray-700"
                           placeholder="Ex: Academic Governance"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                        />
                     </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-4 bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-800/30">
                       <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-blue-600 transition-all duration-500 shadow-sm shadow-blue-500" style={{ width: `${uploadProgress}%` }} />
                       </div>
                       <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center italic">Scanning Neural Pathways... {uploadProgress}%</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-6 pt-6">
                     <button 
                        type="button"
                        onClick={() => setShowAutoIngestModal(false)}
                        className="flex-1 py-7 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all italic active:scale-95"
                     >
                        Abort Protocol
                     </button>
                     <button 
                        type="submit"
                        disabled={isUploading}
                        className="flex-[1.5] py-7 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-4 italic active:scale-95"
                     >
                        <Zap size={20} /> {isUploading ? "Ingesting..." : "Commence Ingestion"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* ADD RESOURCE MODAL 🔥 */}
      {showAddModal && (
         <div className="fixed inset-0 z-[500] bg-[#050816]/60 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[4rem] p-16 max-w-2xl w-full shadow-2xl space-y-12 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar">
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Resource Deposit</h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">Provisioning Intelligence Core to Registry</p>
               </div>

               <form onSubmit={handleAddResource} className="space-y-10">
                  {/* File Upload Section */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Asset Payload (PDF)</label>
                     <div className="relative group">
                        <input 
                           type="file"
                           accept=".pdf"
                           onChange={handleFileUpload}
                           className="hidden"
                           id="pdf-upload"
                           disabled={isUploading}
                        />
                        <label 
                           htmlFor="pdf-upload"
                           className={`w-full h-40 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-500 ${isUploading ? "bg-gray-50 dark:bg-[#050816] border-gray-100 dark:border-gray-800 opacity-50" : "bg-gray-50 dark:bg-[#050816] border-gray-100 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800"}`}
                        >
                           {isUploading ? (
                              <div className="flex flex-col items-center gap-4">
                                 <div className="w-14 h-14 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                                 <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Encrypting... {uploadProgress}%</p>
                              </div>
                           ) : (
                              <>
                                 <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-600 transition-all duration-500 shadow-sm">
                                    <Plus size={32} />
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white uppercase tracking-widest italic">Drop PDF or click to browse</p>
                              </>
                           )}
                        </label>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Protocol Title</label>
                        <input 
                           required
                           className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500 text-sm font-black text-gray-900 dark:text-white italic placeholder:text-gray-300 dark:placeholder:text-gray-700"
                           placeholder="Ex: Physics 2024 Final Registry"
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                     <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Vault Access Point (URL)</label>
                        <input 
                           required
                           className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500 text-[11px] font-bold font-mono text-blue-600/70 dark:text-blue-400/70 truncate"
                           placeholder="https://institutional-vault.com/..."
                           value={formData.fileUrl}
                           onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Categorization</label>
                        <input 
                           className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500 text-sm font-black text-gray-900 dark:text-white italic placeholder:text-gray-300 dark:placeholder:text-gray-700"
                           placeholder="Ex: Institutional Exams"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Access Protocol</label>
                        <select 
                           className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500 text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest appearance-none cursor-pointer italic"
                           value={formData.isFree ? "true" : "false"}
                           onChange={(e) => setFormData({...formData, isFree: e.target.value === "true"})}
                        >
                           <option value="true">Public / Free</option>
                           <option value="false">Restricted (Vault Access)</option>
                        </select>
                     </div>
                     <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Contextual Narrative</label>
                        <textarea 
                           className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-[2rem] px-8 py-6 outline-none focus:border-blue-500 text-sm font-black text-gray-900 dark:text-white italic h-32 resize-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
                           placeholder="Provide metadata for the intelligence node..."
                           value={formData.description}
                           onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-6">
                     <button 
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 py-7 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all italic active:scale-95"
                     >
                        Abort Deposit
                     </button>
                     <button 
                        type="submit"
                        disabled={isUploading}
                        className="flex-[1.5] py-7 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 italic active:scale-95"
                     >
                        Deploy to Registry
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Persistence HUD */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[600] px-10 py-7 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-6 backdrop-blur-3xl bg-white/80 dark:bg-gray-900/80 ${statusMsg.type === 'success' ? "border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400" : "border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"}`}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
           </div>
           <p className="text-[11px] font-black uppercase tracking-widest italic">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
