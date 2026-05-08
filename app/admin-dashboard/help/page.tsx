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
    <div className="flex flex-col min-h-screen bg-[#fbfbfe] text-gray-900 transition-colors duration-500">
      <AdminHeader 
        title="Institutional Support Hub" 
        path={[{ label: "Governance" }, { label: "Support Protocol" }]} 
      />

      <div className="flex-1 overflow-y-auto p-10 lg:p-20 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
        
        {/* HERO SECTION */}
        <div className="relative bg-white border-2 border-gray-50 rounded-[5rem] p-16 lg:p-24 overflow-hidden shadow-sm transition-all duration-500 group">
          <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          
          <div className="relative z-10 max-w-4xl space-y-12">
            <div className="w-24 h-24 bg-blue-50 border-2 border-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:rotate-12 transition-transform duration-700">
              <LifeBuoy size={48} />
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none text-gray-900">
                Institutional <span className="text-blue-600">Support Hub</span>
              </h1>
              <p className="text-gray-400 text-xl font-black leading-relaxed uppercase tracking-[0.4em] italic">
                Authorized Personnel Only. Dedicated assistance for academic infrastructure and institutional governance.
              </p>
            </div>
          </div>
        </div>

        {/* SUPPORT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Documentation */}
          <div className="bg-white border-2 border-gray-50 p-16 rounded-[4.5rem] hover:border-blue-600 transition-all duration-500 group shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="w-20 h-20 bg-gray-50 border-2 border-gray-50 rounded-[2rem] flex items-center justify-center mb-12 group-hover:scale-110 transition-all duration-700 shadow-inner">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 italic text-gray-900">Documentation</h3>
              <p className="text-gray-500 text-[12px] font-black leading-relaxed uppercase tracking-[0.4em] mb-12 italic">
                Detailed academic schemas and administrative protocols for assessment generation and cluster management.
              </p>
            </div>
            <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-gray-900 transition-all italic leading-none group-hover:translate-x-4 duration-500">
              Explore Protocol Library <ExternalLink size={18} />
            </button>
          </div>

          {/* Technical Support */}
          <div className="bg-white border-2 border-gray-50 p-16 rounded-[4.5rem] hover:border-indigo-600 transition-all duration-500 group shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="w-20 h-20 bg-gray-50 border-2 border-gray-50 rounded-[2rem] flex items-center justify-center mb-12 group-hover:scale-110 transition-all duration-700 shadow-inner">
                <Zap className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 italic text-gray-900">Rapid Assist</h3>
              <p className="text-gray-500 text-[12px] font-black leading-relaxed uppercase tracking-[0.4em] mb-12 italic">
                Priority technical intervention for platform infrastructure, resource syncing, and node connectivity.
              </p>
            </div>
            <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-gray-900 transition-all italic leading-none group-hover:translate-x-4 duration-500">
              Contact Engineers <ExternalLink size={18} />
            </button>
          </div>

          {/* Governance Help */}
          <div className="bg-white border-2 border-gray-50 p-16 rounded-[4.5rem] hover:border-blue-400 transition-all duration-500 group shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="w-20 h-20 bg-gray-50 border-2 border-gray-50 rounded-[2rem] flex items-center justify-center mb-12 group-hover:scale-110 transition-all duration-700 shadow-inner">
                <ShieldCheck className="text-blue-500" size={32} />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 italic text-gray-900">Governance Policy</h3>
              <p className="text-gray-500 text-[12px] font-black leading-relaxed uppercase tracking-[0.4em] mb-12 italic">
                Compliance guidelines for institutional security, identity management, and administrative auditing.
              </p>
            </div>
            <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-blue-500 hover:text-gray-900 transition-all italic leading-none group-hover:translate-x-4 duration-500">
              View Policies <ExternalLink size={18} />
            </button>
          </div>

        </div>

        {/* FAQ & CONTACT */}
        <div className="bg-white border-2 border-gray-50 rounded-[5rem] p-16 lg:p-24 overflow-hidden relative shadow-sm transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-900" />
          
          <div className="flex flex-col xl:flex-row gap-24 relative z-10">
            <div className="flex-1 space-y-16">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-gray-50 border-2 border-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner"><HelpCircle size={36} /></div>
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-gray-900">Core FAQ Matrix</h2>
                     <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">Administrative common protocols</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  {[
                    "How to handle identity conflicts in Governance Matrix?",
                    "Syncing resource files across regional cloud nodes",
                    "Overriding institutional access for specific scholars",
                    "Moderation protocols for administrative authorities"
                  ].map((q, i) => (
                    <div key={i} className="p-10 bg-gray-50 border-2 border-gray-50 rounded-[3rem] hover:border-blue-600 transition-all cursor-pointer group flex items-center justify-between">
                       <p className="text-gray-600 text-sm font-black uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors italic leading-none">
                         {q}
                       </p>
                       <ChevronRight size={24} className="text-gray-100 group-hover:text-blue-600 transition-all group-hover:translate-x-4" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="w-full xl:w-[500px] bg-gray-50 rounded-[4rem] p-16 space-y-12 border-2 border-gray-50 shadow-inner flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-12 relative z-10">
                   <div className="space-y-3 text-center">
                      <h3 className="text-lg font-black uppercase tracking-[0.4em] italic text-gray-900 leading-none">Direct Channel</h3>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">24/7 Priority Administrative Uplink</p>
                   </div>
                   <div className="space-y-8">
                      <div className="flex items-center gap-8 p-8 bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-sm group hover:border-blue-600 transition-all">
                         <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Mail size={28} /></div>
                         <div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-none mb-3">Email Protocol</p>
                            <p className="text-[15px] font-black uppercase tracking-widest italic leading-none text-gray-900">support@quizaro.io</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8 p-8 bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-sm group hover:border-indigo-600 transition-all">
                         <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><MessageSquare size={28} /></div>
                         <div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-none mb-3">Internal Slack Hub</p>
                            <p className="text-[15px] font-black uppercase tracking-widest italic leading-none text-gray-900">#institutional-help</p>
                         </div>
                      </div>
                   </div>
                </div>
                <button className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 active:scale-95 transition-all italic hover:bg-blue-700 relative z-10">
                   Initiate Support Protocol
                </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-gray-200 italic font-black uppercase tracking-[0.6em] text-[11px] pt-8">
           <div className="w-20 h-0.5 bg-gray-50" />
           Quizaro Infrastructure Support Hub v4.5.1
           <div className="w-20 h-0.5 bg-gray-50" />
        </div>

      </div>
    </div>
  );
}
