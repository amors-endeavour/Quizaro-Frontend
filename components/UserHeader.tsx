"use client";

import { Bell, HelpCircle, ChevronRight, LayoutGrid, Calendar } from "lucide-react";

interface UserHeaderProps {
  title: string;
  breadcrumbs: string[];
}

export default function UserHeader({ title, breadcrumbs }: UserHeaderProps) {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');

  return (
    <div className="bg-[#050816] border-b border-white/10 flex flex-col sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      {/* Upper Utility Navbar */}
      <div className="px-8 h-18 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 py-5 border-b-2 border-cyan-500 text-cyan-400 font-black text-[11px] uppercase tracking-widest">
            <LayoutGrid size={14} />
            My Dashboard
          </div>
          <div 
            onClick={() => window.location.href = "/contact"}
            className="text-gray-500 font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all cursor-pointer"
          >
            Support Center
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3 text-red-400 bg-red-400/10 border border-red-400/20 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest group cursor-pointer animate-in fade-in zoom-in duration-700">
               <Bell size={14} className="group-hover:rotate-12 transition-transform" />
               New Updates (5)
           </div>
           <div className="w-px h-6 bg-white/10" />
           <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-gray-500 tracking-tighter">
              <Calendar size={14} className="text-cyan-500" />
              {dateStr}
           </div>
        </div>
      </div>

      {/* Main Breadcrumb & Branding Header */}
      <div className="px-8 py-6 flex items-center justify-between bg-[#050816] w-full">
         <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] font-sans">
               {breadcrumbs.map((crumb, idx) => (
                 <div key={idx} className="flex items-center gap-2.5">
                    <span className={idx === breadcrumbs.length - 1 ? "text-white" : "hover:text-cyan-400 cursor-pointer transition-colors"}>
                       {crumb}
                    </span>
                    {idx < breadcrumbs.length - 1 && <ChevronRight size={10} className="text-white/20" strokeWidth={3} />}
                 </div>
               ))}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter leading-none">{title}</h2>
         </div>

         <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 text-gray-400 border border-white/10 rounded-2xl shadow-sm hover:bg-cyan-500 hover:text-white transition-all cursor-pointer">
               <HelpCircle size={20} />
            </div>
         </div>
      </div>
    </div>
  );
}
