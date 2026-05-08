"use client";

import { FileText, MoreVertical, CheckCircle2, FileEdit, Trash2, Download, BarChart3 } from "lucide-react";

interface AdminTestCardProps {
  title: string;
  description?: string;
  date: string;
  status?: "Draft" | "Attempted" | "Published";
  isSelected?: boolean;
  onSelect?: (val: boolean) => void;
  onStatusToggle?: (newStatus: "Draft" | "Published") => void;
  onEdit: () => void;
  onQuestions: () => void;
  onDelete: () => void;
  onExport?: () => void;
  onAnalytics?: () => void;
}

export default function AdminTestCard({ 
  title, 
  description, 
  date, 
  status = "Published", 
  isSelected = false,
  onSelect,
  onStatusToggle,
  onEdit, 
  onQuestions, 
  onDelete,
  onExport,
  onAnalytics
}: AdminTestCardProps) {
  
  const statusColors = {
    Draft: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
    Attempted: "bg-blue-600 text-white",
    Published: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
  };

  return (
    <div className={`bg-white border rounded-[2rem] p-8 transition-all duration-500 group relative flex items-center gap-8 ${isSelected ? "border-blue-300 bg-blue-50/20" : "border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"}`}>
      
      {/* SELECTION CHECKBOX */}
      <div 
        onClick={() => onSelect?.(!isSelected)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20" : "border-gray-200 hover:border-blue-400 bg-white"}`}
      >
        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>

      <div className="flex-1 flex items-center gap-8 min-w-0">
         <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-600/20">
           <FileText size={28} />
         </div>

         <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-gray-900 truncate uppercase tracking-tighter italic leading-none mb-1">
              {title}
            </h3>
            <p className="text-[10px] font-black text-gray-400 truncate uppercase tracking-widest italic opacity-60">
              {description || "No Categories Specified"}
            </p>
         </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end mr-6">
           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{date}</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuestions(); }}
            className="px-6 py-3 text-[10px] font-black text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex items-center gap-3 uppercase tracking-widest italic border border-blue-100"
          >
            <FileEdit size={14} /> Questions
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onAnalytics?.(); }}
            className="px-6 py-3 text-[10px] font-black text-gray-500 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl transition-all flex items-center gap-3 uppercase tracking-widest italic border border-gray-100"
          >
            <BarChart3 size={14} /> Analytics
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onExport?.(); }}
            className="px-6 py-3 text-[10px] font-black text-gray-500 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl transition-all flex items-center gap-3 uppercase tracking-widest italic border border-gray-100"
          >
            <Download size={14} /> Export
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="px-6 py-3 text-[10px] font-black text-gray-500 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl transition-all uppercase tracking-widest italic border border-gray-100"
          >
            Edit
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onStatusToggle?.(status === "Published" ? "Draft" : "Published"); }}
            className={`px-6 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest italic border ${status === "Published" ? "text-green-600 bg-green-50 border-green-100 hover:bg-green-600 hover:text-white" : "text-gray-400 bg-gray-50 border-gray-100 hover:bg-gray-900 hover:text-white"}`}
          >
            {status}
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
