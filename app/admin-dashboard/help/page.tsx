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
  HelpCircle
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-white">
      <AdminHeader 
        title="Institutional Support Hub" 
        path={[{ label: "Support" }, { label: "Resources" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1400px] mx-auto w-full space-y-12 animate-in fade-in duration-1000">
        
        {/* HERO SECTION */}
        <div className="relative bg-[#0b0f2a] border border-white/10 rounded-[3.5rem] p-12 lg:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-8">
              <LifeBuoy size={32} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
              Institutional <span className="text-blue-500">Support Hub</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed uppercase tracking-wide">
              Authorized personnel access only. Dedicated assistance for academic infrastructure and institutional governance.
            </p>
          </div>
        </div>

        {/* SUPPORT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Documentation */}
          <div className="bg-[#0b0f2a] border border-white/5 p-10 rounded-[3rem] hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <BookOpen className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">Documentation</h3>
            <p className="text-gray-500 text-xs font-bold leading-loose uppercase tracking-widest mb-8">
              Detailed academic schemas and administrative protocols for paper generation.
            </p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition">
              Explore Library <ExternalLink size={12} />
            </button>
          </div>

          {/* Technical Support */}
          <div className="bg-[#0b0f2a] border border-white/5 p-10 rounded-[3rem] hover:border-purple-500/30 transition-all group">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Zap className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">Rapid Assist</h3>
            <p className="text-gray-500 text-xs font-bold leading-loose uppercase tracking-widest mb-8">
              Priority technical intervention for platform infrastructure and resource syncing.
            </p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 hover:text-white transition">
              Contact Engineers <ExternalLink size={12} />
            </button>
          </div>

          {/* Governance Help */}
          <div className="bg-[#0b0f2a] border border-white/5 p-10 rounded-[3rem] hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">Governance Policy</h3>
            <p className="text-gray-500 text-xs font-bold leading-loose uppercase tracking-widest mb-8">
              Compliance guidelines for institutional security and student identity management.
            </p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 hover:text-white transition">
              View Policies <ExternalLink size={12} />
            </button>
          </div>

        </div>

        {/* FAQ & CONTACT */}
        <div className="bg-[#0b0f2a] border border-white/5 rounded-[3.5rem] p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1 space-y-8">
               <div className="flex items-center gap-4">
                  <HelpCircle className="text-gray-600" size={20} />
                  <h2 className="text-lg font-black uppercase tracking-widest italic">Core FAQ Matrix</h2>
               </div>
               
               <div className="space-y-6">
                  {[
                    "How to handle identity conflicts in Governance?",
                    "Syncing resource files across regional nodes",
                    "Overriding institutional access for scholars",
                    "Moderation protocols for administrative authorities"
                  ].map((q, i) => (
                    <div key={i} className="pb-6 border-b border-white/5 hover:border-white/10 transition cursor-pointer group">
                       <p className="text-gray-400 text-sm font-bold uppercase tracking-wide group-hover:text-white transition">
                         {q}
                       </p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="w-full lg:w-96 bg-white/5 rounded-[2.5rem] p-10 space-y-8 border border-white/5">
                <h3 className="text-sm font-black uppercase tracking-widest text-center italic">Direct Channel</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-5 bg-[#050816] rounded-2xl border border-white/5">
                      <Mail className="text-blue-400" size={20} />
                      <div>
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Email Assist</p>
                         <p className="text-xs font-bold uppercase tracking-wide">support@quizaro.io</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-5 bg-[#050816] rounded-2xl border border-white/5">
                      <MessageSquare className="text-purple-400" size={20} />
                      <div>
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Slack Hub</p>
                         <p className="text-xs font-bold uppercase tracking-wide">#institutional-help</p>
                      </div>
                   </div>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition">
                   Initiate Support Protocol
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
