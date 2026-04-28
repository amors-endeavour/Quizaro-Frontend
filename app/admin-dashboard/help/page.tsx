"use client";

import AdminHeader from "@/components/AdminHeader";
import { 
  LifeBuoy, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronRight,
  Info
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminHeader 
        title="Institutional Support Hub" 
        path={[{ label: "Governance" }, { label: "Support Protocol" }]} 
      />

      <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
        
        {/* HERO SECTION */}
        <div className="relative bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[4rem] p-12 lg:p-16 overflow-hidden shadow-sm transition-all duration-500 group">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          
          <div className="relative z-10 max-w-3xl space-y-8">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-[2rem] flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm group-hover:rotate-12 transition-transform duration-500">
              <LifeBuoy size={40} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-gray-900 dark:text-white">
                Institutional <span className="text-blue-600 dark:text-blue-400">Support Hub</span>
              </h1>
              <p className="text-gray-400 dark:text-gray-500 text-lg font-black leading-relaxed uppercase tracking-widest italic">
                Authorized Personnel Only. Dedicated assistance for academic infrastructure and institutional governance.
              </p>
            </div>
          </div>
        </div>

        {/* SUPPORT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Documentation */}
          <div className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-12 rounded-[3.5rem] hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-500 group shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-gray-900 dark:text-white">Documentation</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] font-black leading-relaxed uppercase tracking-widest mb-10 italic">
                Detailed academic schemas and administrative protocols for assessment generation and cluster management.
              </p>
            </div>
            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all italic leading-none group-hover:translate-x-2 duration-300">
              Explore Protocol Library <ExternalLink size={14} />
            </button>
          </div>

          {/* Technical Support */}
          <div className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-12 rounded-[3.5rem] hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-500 group shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <Zap className="text-indigo-600 dark:text-indigo-400" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-gray-900 dark:text-white">Rapid Assist</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] font-black leading-relaxed uppercase tracking-widest mb-10 italic">
                Priority technical intervention for platform infrastructure, resource syncing, and node connectivity.
              </p>
            </div>
            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all italic leading-none group-hover:translate-x-2 duration-300">
              Contact Engineers <ExternalLink size={14} />
            </button>
          </div>

          {/* Governance Help */}
          <div className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 p-12 rounded-[3.5rem] hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-500 group shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <ShieldCheck className="text-cyan-600 dark:text-cyan-400" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-gray-900 dark:text-white">Governance Policy</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] font-black leading-relaxed uppercase tracking-widest mb-10 italic">
                Compliance guidelines for institutional security, identity management, and administrative auditing.
              </p>
            </div>
            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all italic leading-none group-hover:translate-x-2 duration-300">
              View Policies <ExternalLink size={14} />
            </button>
          </div>

        </div>

        {/* FAQ & CONTACT */}
        <div className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[4rem] p-12 lg:p-16 overflow-hidden relative shadow-sm transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />
          
          <div className="flex flex-col xl:flex-row gap-20">
            <div className="flex-1 space-y-10">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm"><HelpCircle size={24} /></div>
                  <div className="space-y-1">
                     <h2 className="text-xl font-black uppercase tracking-widest italic leading-none text-gray-900 dark:text-white">Core FAQ Matrix</h2>
                     <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">Administrative common protocols</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                    "How to handle identity conflicts in Governance Matrix?",
                    "Syncing resource files across regional cloud nodes",
                    "Overriding institutional access for specific scholars",
                    "Moderation protocols for administrative authorities"
                  ].map((q, i) => (
                    <div key={i} className="p-8 bg-gray-50 dark:bg-[#050816]/30 border border-gray-100 dark:border-gray-800/50 rounded-3xl hover:border-blue-200 dark:hover:border-blue-500/30 transition-all cursor-pointer group flex items-center justify-between">
                       <p className="text-gray-600 dark:text-gray-400 text-xs font-black uppercase tracking-widest group-hover:text-gray-900 dark:group-hover:text-white transition-colors italic leading-none">
                         {q}
                       </p>
                       <ChevronRight size={18} className="text-gray-200 dark:text-gray-800 group-hover:text-blue-600 transition-all group-hover:translate-x-2" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="w-full xl:w-[400px] bg-gray-50 dark:bg-[#050816]/50 rounded-[3rem] p-12 space-y-10 border border-gray-100 dark:border-gray-800 shadow-inner flex flex-col justify-between">
                <div className="space-y-10">
                   <div className="space-y-2 text-center">
                      <h3 className="text-sm font-black uppercase tracking-[0.3em] italic text-gray-900 dark:text-white leading-none">Direct Channel</h3>
                      <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">24/7 Priority Administrative Uplink</p>
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-6 p-6 bg-white dark:bg-[#0a0f29] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-blue-200 transition-all">
                         <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Mail size={20} /></div>
                         <div>
                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic leading-none mb-2">Email Protocol</p>
                            <p className="text-xs font-black uppercase tracking-widest italic leading-none text-gray-900 dark:text-white">support@quizaro.io</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6 p-6 bg-white dark:bg-[#0a0f29] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-indigo-200 transition-all">
                         <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><MessageSquare size={20} /></div>
                         <div>
                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic leading-none mb-2">Internal Slack Hub</p>
                            <p className="text-xs font-black uppercase tracking-widest italic leading-none text-gray-900 dark:text-white">#institutional-help</p>
                         </div>
                      </div>
                   </div>
                </div>
                <button className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all italic hover:bg-blue-700">
                   Initiate Support Protocol
                </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-gray-300 dark:text-gray-800 italic font-black uppercase tracking-[0.4em] text-[10px] pt-4">
           <div className="w-12 h-px bg-gray-50 dark:bg-gray-900" />
           Quizaro Infrastructure Support Hub v4.5.1
           <div className="w-12 h-px bg-gray-50 dark:bg-gray-900" />
        </div>

      </div>
    </div>
  );
}
