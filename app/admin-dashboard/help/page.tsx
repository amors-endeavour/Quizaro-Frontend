"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  BookOpen, 
  Search, 
  Terminal, 
  Users, 
  Zap, 
  Globe, 
  Database, 
  CreditCard, 
  ExternalLink, 
  Download, 
  Mail, 
  MessageSquare,
  ChevronDown,
  Info,
  Bug,
  Send
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHelpPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bugForm, setBugForm] = useState({ subject: "", description: "" });

  const helpSections = [
    {
      id: "dashboard",
      title: "Admin Dashboard: Live Governance",
      icon: <Terminal size={22} />,
      content: "The dashboard provides real-time telemetry from the database matrix. Total Revenue represents the SUM of all completed transactions across {Payment_Provider}. Active Participants reflects the unique COUNT of students who have committed at least one assessment node to the registry in the last 7 cycles.",
      link: "/admin-dashboard"
    },
    {
      id: "users",
      title: "User Management: Provisioning Protocol",
      icon: <Users size={22} />,
      content: "To provision a new entity, navigate to the User Registry and select 'Authorize New User'. All placeholders must be cleared before commitment. The Green Tick indicates a validated identity with active session tokens; a Red Cross signifies a restricted or banned node. Permanent Deletion is a terminal action and cannot be reversed—always verify the {Entity_ID} before execution.",
      link: "/admin-dashboard/users"
    },
    {
      id: "quizzes-paid",
      title: "Quizzes (Paid): Hierarchical Workflow",
      icon: <Zap size={22} />,
      content: "Paid assessments operate on a strict nested hierarchy: 1. Create a {Series_Title} container. 2. Navigate to 'Manage Papers' to define individual assessment units. 3. Enter the MCQ Builder for each paper. IMPORTANT: The system enforces single-node editing—ensure one paper is committed before initiating the next sequence.",
      link: "/admin-dashboard/quizzes/paid"
    },
    {
      id: "quizzes-unpaid",
      title: "Quizzes (Unpaid): Flat Assessment Matrix",
      icon: <Globe size={22} />,
      content: "Unpaid assessments utilize a flat registry structure. Unlike paid series, these papers are listed directly and link straight to the MCQ configuration view. This bypasses the series intermediate to allow for rapid deployment of free institutional content.",
      link: "/admin-dashboard/quizzes/unpaid"
    },
    {
      id: "pdf",
      title: "Academic Repository: PDF & Resource Hub",
      icon: <Database size={22} />,
      content: "The repository serves as a metadata-driven hub for static academic resources. When uploading a {Resource_File}, you must assign mandatory category tags (e.g., 'Grade 10', '2026'). The search functionality indexes these tags and the {Resource_Description} to provide instantaneous retrieval in the student library.",
      link: "/admin-dashboard/quizzes/pdf"
    },
    {
      id: "analytics",
      title: "Payments & Analytics: Financial Intelligence",
      icon: <CreditCard size={22} />,
      content: "Financial intelligence is visualized through the Revenue Inflow and Portfolio Distribution charts. Before performing any structural cleanups or data purges, use the 'Download Registry' action to generate a secure CSV backup of all transaction nodes.",
      link: "/admin-dashboard/payments"
    }
  ];

  const filteredSections = helpSections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8f9fd] overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          title="Operational Manual" 
          path={[{ label: "Governance" }, { label: "Registry Protocol" }]} 
        />

        <div className="flex-1 overflow-y-auto no-scrollbar">
           <div className="p-8 lg:p-14 max-w-[1400px] mx-auto space-y-16 animate-in fade-in duration-1000 pb-32">
              
              {/* HERO & SEARCH */}
              <div className="bg-white p-12 lg:p-20 rounded-[4rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-12">
                 <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#7C3AED]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                 
                 <div className="space-y-8 flex-1 relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-[#7C3AED] text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-900/40"><BookOpen size={32} /></div>
                       <div>
                          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Admin Guide</h1>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic mt-2">Institutional Governance & System Manual</p>
                       </div>
                    </div>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest italic leading-relaxed max-w-2xl">
                       This manual serves as the authoritative operational guide for the {"{Platform_Name}"} administration. Access protocols, data commitment, and registry purges must follow the guidelines outlined below.
                    </p>
                 </div>

                 <div className="w-full xl:w-[500px] relative z-10">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300">
                       <Search size={24} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Locate operational protocols..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#7C3AED] focus:bg-white rounded-[2.5rem] py-7 pl-20 pr-10 text-base font-black text-gray-900 outline-none transition-all placeholder:text-gray-300 italic shadow-inner"
                    />
                 </div>
              </div>

              {/* MANUAL SECTIONS */}
              <div className="grid grid-cols-1 gap-8">
                 {filteredSections.map((section) => (
                    <motion.div 
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-[3.5rem] border border-gray-100 p-10 lg:p-12 shadow-sm hover:border-purple-200 hover:shadow-xl transition-all duration-700 group flex flex-col md:flex-row gap-10 items-start md:items-center justify-between"
                    >
                       <div className="flex items-center gap-10 flex-1 min-w-0">
                          <div className="w-20 h-20 bg-purple-50 text-[#7C3AED] rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-inner shrink-0">
                             {section.icon}
                          </div>
                          <div className="space-y-4 flex-1">
                             <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{section.title}</h3>
                             <p className="text-[13px] text-gray-500 font-bold italic leading-relaxed uppercase tracking-tight line-clamp-3">
                                {section.content.split(/({.*?})/).map((part, i) => 
                                   part.startsWith('{') ? <span key={i} className="text-[#7C3AED] font-black">{part}</span> : part
                                )}
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={() => router.push(section.link)}
                         className="px-10 py-5 bg-gray-50 text-gray-400 group-hover:bg-purple-600 group-hover:text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest italic flex items-center gap-4 transition-all shadow-sm active:scale-95"
                       >
                          Take me there <ExternalLink size={16} />
                       </button>
                    </motion.div>
                 ))}

                 {filteredSections.length === 0 && (
                    <div className="py-40 text-center bg-gray-50/50 rounded-[5rem] border-4 border-dashed border-gray-100 flex flex-col items-center gap-8">
                       <Search size={64} className="text-gray-100" />
                       <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] italic">No Protocol Matches Your Query Node</p>
                    </div>
                 )}
              </div>

              {/* REPORT A BUG SECTION */}
              <div id="report-bug" className="bg-gray-900 rounded-[5rem] p-16 lg:p-24 relative overflow-hidden group shadow-2xl shadow-purple-900/20">
                 <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#7C3AED]/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
                 
                 <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                    <div className="flex-1 space-y-8">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white/5 border border-white/10 text-purple-400 rounded-3xl flex items-center justify-center"><Bug size={32} /></div>
                          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Technical Feedback</h2>
                       </div>
                       <p className="text-gray-400 font-bold uppercase tracking-widest italic leading-relaxed text-sm">
                          Detected a protocol anomaly or system instability? Report it directly to the technical team. Every submission is logged with a {"{Trace_ID}"} for registry integrity.
                       </p>
                       <div className="flex items-center gap-10 pt-8 border-t border-white/5">
                          <div className="flex items-center gap-4">
                             <Mail size={20} className="text-purple-400" />
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">sys-ops@quizaro.io</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <MessageSquare size={20} className="text-blue-400" />
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">#support-uplink</p>
                          </div>
                       </div>
                    </div>

                    <div className="w-full lg:w-[500px] space-y-8 bg-white/5 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                       <div className="space-y-4">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Issue Subject</label>
                          <input 
                            type="text" 
                            placeholder="Brief protocol description..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-purple-500 transition-all text-sm italic"
                            value={bugForm.subject}
                            onChange={(e) => setBugForm({...bugForm, subject: e.target.value})}
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Detailed Logs</label>
                          <textarea 
                            rows={4}
                            placeholder="Define the anomaly sequence..."
                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-white font-bold outline-none focus:border-purple-500 transition-all text-sm italic resize-none"
                            value={bugForm.description}
                            onChange={(e) => setBugForm({...bugForm, description: e.target.value})}
                          />
                       </div>
                       <button className="w-full py-6 bg-[#7C3AED] text-white rounded-2xl font-black text-[12px] uppercase tracking-widest italic shadow-xl shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                          Submit Protocol Report <Send size={18} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-gray-200">
                 <div className="flex items-center gap-6">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Registry Manual Version 4.5.1 // Status: Optimized</p>
                 </div>
                 <button className="flex items-center gap-6 px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest italic hover:bg-[#7C3AED] transition-all shadow-2xl shadow-purple-900/10 active:scale-95 group">
                    Download Admin Guide (PDF) <Download size={22} className="group-hover:translate-y-1 transition-transform duration-500" />
                 </button>
              </div>

           </div>
        </div>
      </main>
    </div>
  );
}
