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
    <div className="min-h-screen bg-[#fbfbfe] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-50 border-t-blue-600 rounded-[1.8rem] animate-spin shadow-xl shadow-blue-600/5" />
      <p className="font-black animate-pulse text-blue-600 uppercase tracking-[0.5em] text-[11px] italic leading-none">
        Synchronizing Neural Repository...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbfe] text-gray-900 transition-colors duration-300">
      <AdminHeader 
        title="Neural Repository" 
        path={[{ label: "Governance" }, { label: "Repository" }]} 
      />

      <div className="flex-1 overflow-y-auto p-10 lg:p-20 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
         
         {/* HEADER ACTION HUD */}
         <section className="bg-white border-2 border-gray-50 p-14 lg:p-20 rounded-[5rem] shadow-sm relative overflow-hidden group transition-all duration-500">
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-center justify-between">
                <div className="space-y-8 flex-1">
                   <div className="space-y-3">
                      <h2 className="text-5xl font-black tracking-tighter uppercase italic text-gray-900 leading-none">Document Infrastructure</h2>
                      <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Governance of PDFs, Question Papers, and Academic Schemas</p>
                   </div>
                   
                   {/* Search Box */}
                   <div className="relative max-w-2xl group">
                      <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={28} />
                      <input 
                        type="text" 
                        placeholder="Search Intelligence Registry..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-[3rem] py-8 pl-24 pr-12 text-md font-black text-gray-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 italic shadow-inner"
                      />
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 w-full xl:w-auto">
                  <button 
                    onClick={() => setShowAutoIngestModal(true)}
                    className="flex-1 xl:flex-none px-12 py-8 bg-gray-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-5 hover:bg-blue-600 transition-all shadow-2xl shadow-gray-900/20 active:scale-95 italic"
                  >
                    <Zap size={22} className="text-blue-400" /> AI Auto-Ingest
                  </button>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex-1 xl:flex-none px-14 py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-5 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 active:scale-95 italic"
                  >
                    <Plus size={22} /> Deploy Resource
                  </button>
                </div>
             </div>
         </section>

         {/* RESOURCE GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {loading ? (
               [1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className="h-[450px] bg-white border-2 border-gray-50 rounded-[4rem] animate-pulse shadow-sm" />
               ))
            ) : filteredResources.length === 0 ? (
               <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 py-48 text-center bg-white rounded-[5rem] border-4 border-dashed border-gray-50 flex flex-col items-center gap-10 shadow-sm">
                  <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-100 shadow-inner">
                    <FileText size={56} />
                  </div>
                  <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] italic">No intelligence nodes matching query found in repository</p>
               </div>
            ) : (
               filteredResources.map((res) => (
                  <div key={res._id} className="bg-white border-2 border-gray-50 p-12 rounded-[4rem] shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-700 group relative flex flex-col">
                     <div className="absolute top-10 right-12 flex items-center gap-3">
                        {res.isFree ? (
                           <span className="flex items-center gap-3 px-6 py-2 bg-green-50 text-green-600 border-2 border-green-50 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-sm"><Globe size={14} /> Public Access</span>
                        ) : (
                           <span className="flex items-center gap-3 px-6 py-2 bg-amber-50 text-amber-600 border-2 border-amber-50 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-sm"><Lock size={14} /> Restricted Node</span>
                        )}
                     </div>

                     <div className="w-20 h-20 bg-blue-50 border-2 border-blue-50 text-blue-600 rounded-[1.8rem] flex items-center justify-center mb-12 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                        <FileText size={36} />
                     </div>
                     
                     <div className="space-y-3 mb-10">
                        <h4 className="text-3xl font-black text-gray-900 leading-none tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors duration-500">{res.title}</h4>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic">{res.category}</p>
                     </div>
                     
                     <p className="text-[14px] text-gray-500 font-black mb-16 line-clamp-3 italic leading-relaxed opacity-80">{res.description || "Foundational academic document node preserved in institutional registry."}</p>
                     
                     <div className="flex w-full gap-6 mt-auto pt-10 border-t-2 border-gray-50">
                        <a 
                          href={res.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 py-6 bg-gray-900 text-white hover:bg-blue-600 rounded-[1.8rem] flex items-center justify-center gap-4 transition-all text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-gray-900/20 italic active:scale-95"
                        >
                           <Download size={20} className="text-blue-400" /> Fetch PDF
                        </a>
                        <button 
                          onClick={() => handleDeleteResource(res._id)}
                          className="w-16 h-16 shrink-0 bg-red-50 text-red-600 border-2 border-red-50 rounded-[1.8rem] flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                           <Trash2 size={24} />
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>

      </div>

      {/* AUTO-INGEST MODAL 🤖 */}
      {showAutoIngestModal && (
         <div className="fixed inset-0 z-[500] bg-gray-900/30 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="bg-white border-2 border-gray-50 rounded-[5rem] p-20 max-w-2xl w-full shadow-2xl space-y-16 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar relative">
               <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-pulse" />
               <div className="text-center space-y-6 pt-6">
                  <div className="w-28 h-28 bg-blue-50 text-blue-600 border-4 border-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-900/10 rotate-6 hover:rotate-0 transition-transform duration-700">
                     <Zap size={56} />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Neural Ingestion Protocol</h3>
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic">AI-Powered Institutional Synthesis Loop</p>
                  </div>
               </div>

               <form onSubmit={handleAutoIngest} className="space-y-12">
                  <div className="space-y-5">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Source Intelligence (PDF Payload)</label>
                     <input 
                        type="file"
                        accept=".pdf"
                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-6 outline-none text-[12px] font-black text-gray-900 italic shadow-inner"
                        id="auto-pdf-upload"
                        required
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Synthesis Title</label>
                        <input 
                           required
                           className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-6 outline-none focus:border-blue-500 text-sm font-black text-gray-900 italic placeholder:text-gray-200 shadow-inner"
                           placeholder="Ex: Advanced Matrix Synthesis"
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                     <div className="space-y-5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Categorization</label>
                        <input 
                           className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-6 outline-none focus:border-blue-500 text-sm font-black text-gray-900 italic placeholder:text-gray-200 shadow-inner"
                           placeholder="Ex: Academic Governance"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                        />
                     </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-6 bg-blue-50/50 p-10 rounded-[3rem] border-2 border-blue-50">
                       <div className="h-3.5 w-full bg-white rounded-full overflow-hidden shadow-inner p-1">
                          <div className="h-full bg-blue-600 transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] rounded-full animate-pulse" style={{ width: `${uploadProgress}%` }} />
                       </div>
                       <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] text-center italic">Scanning Neural Pathways... {uploadProgress}%</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-8 pt-8">
                     <button 
                        type="button"
                        onClick={() => setShowAutoIngestModal(false)}
                        className="flex-1 py-8 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all italic active:scale-95 border-2 border-transparent hover:border-gray-100"
                     >
                        Abort Protocol
                     </button>
                     <button 
                        type="submit"
                        disabled={isUploading}
                        className="flex-[1.5] py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/40 disabled:opacity-50 flex items-center justify-center gap-6 italic active:scale-95"
                     >
                        <Zap size={24} /> {isUploading ? "Ingesting..." : "Commence Ingestion"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* ADD RESOURCE MODAL 🔥 */}
      {showAddModal && (
         <div className="fixed inset-0 z-[500] bg-gray-900/30 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="bg-white border-2 border-gray-50 rounded-[5rem] p-20 max-w-2xl w-full shadow-2xl space-y-16 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar relative">
               <div className="absolute top-0 left-0 w-full h-3 bg-blue-600" />
               <div className="text-center space-y-6 pt-6">
                  <div className="w-28 h-28 bg-gray-50 text-gray-300 border-4 border-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-gray-900/5 rotate-6">
                     <Plus size={56} />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Resource Deposit</h3>
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Provisioning Intelligence Core to Registry</p>
                  </div>
               </div>

               <form onSubmit={handleAddResource} className="space-y-12">
                  {/* File Upload Section */}
                  <div className="space-y-5">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Asset Payload (PDF)</label>
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
                           className={`w-full h-56 border-4 border-dashed rounded-[4rem] flex flex-col items-center justify-center gap-8 cursor-pointer transition-all duration-700 ${isUploading ? "bg-gray-50 border-gray-50 opacity-50" : "bg-gray-50 border-gray-50 hover:border-blue-400 hover:bg-white"}`}
                        >
                           {isUploading ? (
                              <div className="flex flex-col items-center gap-6">
                                 <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                                 <p className="text-[12px] font-black text-blue-600 uppercase tracking-widest italic">Encrypting... {uploadProgress}%</p>
                              </div>
                           ) : (
                              <>
                                 <div className="w-20 h-20 bg-white border-2 border-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-200 group-hover:text-blue-600 transition-all duration-700 shadow-sm">
                                    <Plus size={40} />
                                 </div>
                                 <p className="text-[11px] font-black text-gray-300 group-hover:text-gray-900 uppercase tracking-[0.3em] italic">Drop PDF or click to browse</p>
                              </>
                           )}
                        </label>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="md:col-span-2 space-y-5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Protocol Title</label>
                        <input 
                           required
                           className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-6 outline-none focus:border-blue-500 text-sm font-black text-gray-900 italic placeholder:text-gray-200 shadow-inner"
                           placeholder="Ex: Physics 2024 Final Registry"
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                     <div className="md:col-span-2 space-y-5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Vault Access Point (URL)</label>
                        <input 
                           required
                           className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-6 outline-none focus:border-blue-500 text-[12px] font-bold font-mono text-blue-600/70 truncate shadow-inner"
                           placeholder="https://institutional-vault.com/..."
                           value={formData.fileUrl}
                           onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                        />
                     </div>
                     <div className="space-y-5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Categorization</label>
                        <input 
                           className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-6 outline-none focus:border-blue-500 text-sm font-black text-gray-900 italic placeholder:text-gray-200 shadow-inner"
                           placeholder="Ex: Institutional Exams"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                        />
                     </div>
                     <div className="space-y-5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Access Protocol</label>
                        <div className="relative">
                           <select 
                              className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-6 outline-none focus:border-blue-500 text-[11px] font-black text-gray-900 uppercase tracking-widest appearance-none cursor-pointer italic shadow-inner"
                              value={formData.isFree ? "true" : "false"}
                              onChange={(e) => setFormData({...formData, isFree: e.target.value === "true"})}
                           >
                              <option value="true">Public / Free</option>
                              <option value="false">Restricted (Vault Access)</option>
                           </select>
                           <ChevronRight size={18} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 pointer-events-none" />
                        </div>
                     </div>
                     <div className="md:col-span-2 space-y-5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic leading-none">Contextual Narrative</label>
                        <textarea 
                           className="w-full bg-gray-50 border-2 border-gray-50 rounded-[3rem] px-10 py-8 outline-none focus:border-blue-500 text-sm font-black text-gray-900 italic h-40 resize-none placeholder:text-gray-200 shadow-inner"
                           placeholder="Provide metadata for the intelligence node..."
                           value={formData.description}
                           onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-8 pt-8">
                     <button 
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 py-8 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all italic active:scale-95 border-2 border-transparent hover:border-gray-100"
                     >
                        Abort Deposit
                     </button>
                     <button 
                        type="submit"
                        disabled={isUploading}
                        className="flex-[1.5] py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/40 disabled:opacity-50 italic active:scale-95"
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
        <div className={`fixed bottom-12 left-12 z-[600] px-12 py-8 rounded-[3rem] border-2 shadow-2xl animate-in slide-in-from-left-10 duration-700 flex items-center gap-8 backdrop-blur-3xl bg-white/90 ${statusMsg.type === 'success' ? "border-green-50 text-green-700" : "border-red-50 text-red-600"}`}>
           <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-lg ${statusMsg.type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
           </div>
           <p className="text-[12px] font-black uppercase tracking-[0.2em] italic">{statusMsg.text}</p>
        </div>
      )}

      {/* AUTO-INGEST MODAL 🤖 */}
      {showAutoIngestModal && (
         <div className="fixed inset-0 z-[500] bg-gray-900/40 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
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
         <div className="fixed inset-0 z-[500] bg-gray-900/40 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
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
