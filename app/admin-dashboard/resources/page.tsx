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
  Layers
} from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  category: string;
  isFree?: boolean;
  testId?: string;
  createdAt?: string;
}

export default function AdminResources() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'alert' | 'error'} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    category: "General",
    fileType: "pdf",
    isFree: true,
    testId: ""
  });
  
  const [allTests, setAllTests] = useState<any[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);

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

  const fetchTests = async () => {
    try {
      const { data } = await API.get("/admin/tests");
      setAllTests(data);
    } catch (err) {
      console.error("Failed to load tests");
    }
  };

  useEffect(() => {
    if (!isAuthChecked) return;
    fetchResources();
    fetchTests();
  }, [isAuthChecked]);

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
    
    setIsUploading(true); // Re-use loading state for processing
    setStatusMsg({ text: "Initiating Intelligent Ingestion...", type: "success" });

    try {
      // 1. Create Resource
      const { data: resource } = await API.post("/admin/resource/add", formData);
      
      // 2. Create Linked Test
      setStatusMsg({ text: "Synthesizing Assessment Architecture...", type: "success" });
      const { data: test } = await API.post("/test/create", {
        title: formData.title,
        description: formData.description || `Synthesized from ${formData.title}`,
        category: formData.category,
        duration: 30,
        price: 0,
        fileUrl: formData.fileUrl
      });

      // 3. Link them
      await API.put(`/admin/resource/${resource._id}`, { testId: test._id });

      // 4. AI Extraction
      setStatusMsg({ text: "AI is scanning for questions...", type: "success" });
      const { data: questions } = await API.post("/admin/ai/extract", { fileUrl: formData.fileUrl });

      // 5. Bulk Save Questions
      setStatusMsg({ text: `Ingesting ${questions.length} questions into registry...`, type: "success" });
      await Promise.all(questions.map((q: any) => 
        API.post(`/question/add/${test._id}`, { ...q, questionText: q.questionText })
      ));

      setStatusMsg({ text: "Ingestion Complete! Launching Studio...", type: "success" });
      
      setTimeout(() => {
        router.push(`/admin-dashboard/${test._id}`);
      }, 1500);

    } catch (err) {
      console.error("Ingestion failure:", err);
      setStatusMsg({ text: "Ingestion failed. Proceeding to Manual Studio.", type: "error" });
      setTimeout(() => setShowAddModal(false), 3000);
      fetchResources();
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkTest = async (testId: string) => {
    if (!activeResourceId) return;
    try {
       await API.put(`/admin/resource/${activeResourceId}`, { testId });
       setStatusMsg({ text: "Assessment linkage synchronized.", type: "success" });
       setIsLinkModalOpen(false);
       fetchResources();
       setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
       setStatusMsg({ text: "Linkage failed.", type: "error" });
       setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleIntelligentFetch = async (res: Resource) => {
    try {
      if (res.testId) {
        router.push(`/admin-dashboard/${res.testId}`);
        return;
      }

      // If no testId, attempt to find a test with the same title
      const allT = await API.get("/admin/tests");
      const existingTest = allT.data.find((t: any) => t.title.toLowerCase().trim() === res.title.toLowerCase().trim());

      if (existingTest) {
        // Link it automatically
        await API.put(`/admin/resource/${res._id}`, { testId: existingTest._id });
        router.push(`/admin-dashboard/${existingTest._id}`);
      } else {
        // Create a new draft test automatically
        setStatusMsg({ text: "Synthesizing New Assessment Logic...", type: "success" });
        const { data: newTest } = await API.post("/test/create", {
          title: res.title,
          description: res.description || "Synthesized from PDF asset.",
          category: res.category,
          duration: 30,
          price: 0, // Required by backend validation
          fileUrl: res.fileUrl // Bind the PDF immediately
        });

        // Link the resource to the new test
        await API.put(`/admin/resource/${res._id}`, { testId: newTest._id });
        
        router.push(`/admin-dashboard/${newTest._id}`);
      }
    } catch (err) {
      console.error("Intelligent fetch failure:", err);
      // Fallback: just open the PDF
      window.open(res.fileUrl, "_blank");
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


  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-white">
      <AdminHeader 
        title="Neural Repository" 
        path={[{ label: "Intelligence" }, { label: "Repository" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in duration-1000">
         
         {/* HEADER ACTION HUD */}
         <section className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="space-y-4 flex-1">
                   <div className="space-y-1">
                      <h2 className="text-3xl font-black tracking-tighter uppercase italic">Document Infrastructure</h2>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Manage PDFs, Question Papers, and Academic Schemas</p>
                   </div>
                   
                   {/* Search Box */}
                   <div className="relative max-w-xl group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search Intelligence Registry..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-xs font-black text-white focus:outline-none focus:border-cyan-400/50 transition-all placeholder:text-gray-700 italic tracking-widest uppercase"
                      />
                   </div>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-10 py-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-cyan-900/30 active:scale-95 whitespace-nowrap"
                >
                   <Plus size={18} /> Deploy New Resource
                </button>
             </div>
         </section>

         {/* RESOURCE GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {loading ? (
               [1,2,3,4].map(i => (
                 <div key={i} className="h-96 bg-white/5 border border-white/10 rounded-[3rem] animate-pulse shadow-2xl" />
               ))
            ) : filteredResources.length === 0 ? (
               <div className="md:col-span-3 xl:col-span-4 py-32 text-center bg-white/5 rounded-[3.5rem] border border-dashed border-white/10 opacity-30">
                  <FileText size={48} className="mx-auto mb-4" />
                  <p className="text-[11px] font-black uppercase tracking-widest">No intelligence resources on file matching query</p>
               </div>
            ) : (
               filteredResources.map((res) => (
                  <div key={res._id} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl backdrop-blur-md group hover:bg-[#0b0f2a] hover:border-cyan-400/30 transition-all duration-500 relative flex flex-col">
                     <div className="absolute top-6 right-8 flex items-center gap-2">
                        {res.isFree ? (
                           <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/10 rounded-full text-[8px] font-black uppercase tracking-widest"><Globe size={10} /> Public</span>
                        ) : (
                           <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/10 rounded-full text-[8px] font-black uppercase tracking-widest"><Lock size={10} /> Protected</span>
                        )}
                     </div>

                     <div className="w-16 h-16 bg-white/5 border border-white/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-cyan-400 group-hover:text-black transition-all duration-500">
                        <FileText size={28} />
                     </div>
                     
                     <div className="space-y-1 mb-6">
                        <h4 className="text-xl font-black text-white leading-tight tracking-tighter uppercase italic group-hover:text-cyan-400 transition-colors">{res.title}</h4>
                        <p className="text-[9px] font-black text-cyan-400/50 uppercase tracking-widest">{res.category}</p>
                     </div>
                     
                     <p className="text-[11px] text-gray-500 font-bold mb-10 line-clamp-2 italic leading-relaxed font-black uppercase tracking-tight">{res.description || "Foundational academic document node."}</p>
                     
                     <div className="flex w-full gap-3 mt-auto">
                        <button 
                           onClick={() => handleIntelligentFetch(res)}
                           className="flex-1 py-4 bg-cyan-400 text-black hover:bg-white rounded-2xl flex items-center justify-center gap-2 transition-all text-[9px] font-black uppercase tracking-widest shadow-lg shadow-cyan-900/20"
                        >
                           <Layers size={14} /> Enter Studio
                        </button>
                        <a 
                           href={res.fileUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="w-14 h-14 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl flex items-center justify-center transition-all"
                           title="Raw PDF View"
                        >
                           <Download size={16} />
                        </a>
                        <button 
                          onClick={() => handleDeleteResource(res._id)}
                          className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>

      </div>

      {/* ADD RESOURCE MODAL 🔥 */}
      {showAddModal && (
         <div className="fixed inset-0 z-[500] bg-[#050816]/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-[#0b0f2a] border border-white/10 rounded-[3.5rem] p-12 max-w-xl w-full shadow-2xl space-y-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] no-scrollbar">
               <div className="text-center">
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Initiate Resource Deposit</h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Uploading Intelligence Core to Registry</p>
               </div>

               <form onSubmit={handleAddResource} className="space-y-6">
                  {/* File Upload Section */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset Payload (PDF)</label>
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
                           className={`w-full h-32 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${isUploading ? "bg-white/5 border-white/10 opacity-50" : "bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08]"}`}
                        >
                           {isUploading ? (
                              <div className="flex flex-col items-center gap-3">
                                 <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
                                 <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Encrypting... {uploadProgress}%</p>
                              </div>
                           ) : (
                              <>
                                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-cyan-400 transition-colors">
                                    <Plus size={24} />
                                 </div>
                                 <p className="text-[9px] font-black text-gray-500 group-hover:text-white uppercase tracking-widest">Drop PDF here or click to browse</p>
                              </>
                           )}
                        </label>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Protocol Title</label>
                        <input 
                           required
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 text-sm font-black text-white italic placeholder:text-gray-700"
                           placeholder="Ex: Physics 2024 Final Paper"
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categorization</label>
                        <input 
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 text-sm font-black text-white italic placeholder:text-gray-700"
                           placeholder="Ex: Entrance Exams"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Registry Access</label>
                        <select 
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 text-[10px] font-black text-white uppercase tracking-widest"
                           value={formData.isFree ? "true" : "false"}
                           onChange={(e) => setFormData({...formData, isFree: e.target.value === "true"})}
                        >
                           <option value="true" className="bg-[#0b0f2a]">Public / Free</option>
                           <option value="false" className="bg-[#0b0f2a]">Protected (Internal Only)</option>
                        </select>
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contextual Description</label>
                        <textarea 
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 text-sm font-black text-white italic h-24 resize-none placeholder:text-gray-700"
                           placeholder="Brief description of the intelligence node..."
                           value={formData.description}
                           onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button 
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 py-6 bg-white/5 text-gray-500 hover:text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                     >
                        Abort Protocol
                     </button>
                     <button 
                        type="submit"
                        disabled={isUploading}
                        className="flex-1 py-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-cyan-900/40 disabled:opacity-50"
                     >
                        Deploy to Grid
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Global Persistence HUD */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[600] px-10 py-6 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-5 backdrop-blur-2xl ${statusMsg.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
           </div>
           <p className="text-[11px] font-black uppercase tracking-widest">{statusMsg.text}</p>
        </div>
      )}

      {/* LINK TEST MODAL 🔥 */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="bg-[#0a0f1d] border border-white/10 rounded-[4.5rem] p-16 max-w-2xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] space-y-12 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Bind to Assessment</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase italic mt-2">Select a paper to link with this resource</p>
                 </div>
                 <button onClick={() => setIsLinkModalOpen(false)} className="text-gray-500 hover:text-white text-3xl font-light">×</button>
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                 {allTests.length === 0 ? (
                    <p className="text-center py-10 text-gray-600 font-black uppercase text-[10px] tracking-widest italic">No Institutional Papers Found</p>
                 ) : (
                    allTests.map((test: any) => (
                       <button 
                         key={test._id}
                         onClick={() => handleLinkTest(test._id)}
                         className="w-full p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/10 hover:border-cyan-400/30 transition-all group"
                       >
                          <div className="text-left">
                             <h4 className="text-sm font-black text-white uppercase italic group-hover:text-cyan-400 transition-colors">{test.title}</h4>
                             <p className="text-[9px] text-gray-600 font-bold uppercase italic">{test.category} • {test.duration} MIN</p>
                          </div>
                          <Layers size={18} className="text-gray-700 group-hover:text-cyan-400 transition-colors" />
                       </button>
                    ))
                 )}
              </div>

              <button 
                onClick={() => router.push('/admin-dashboard/tests')}
                className="w-full py-6 bg-white/5 border border-dashed border-white/10 rounded-3xl text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all italic"
              >
                 + Create New Paper First
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
