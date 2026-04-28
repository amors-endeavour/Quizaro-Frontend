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
    <div className={`bg-white dark:bg-[#0a0f29] border rounded-lg p-4 transition-all duration-300 group relative flex items-center gap-4 ${isSelected ? "border-blue-300 dark:border-blue-500/50 bg-blue-50/20 dark:bg-blue-900/10" : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"}`}>
      
      {/* SELECTION CHECKBOX */}
      <div 
        onClick={() => onSelect?.(!isSelected)}
        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-gray-700 hover:border-blue-400 bg-white dark:bg-gray-800"}`}
      >
        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>

      <div className="flex-1 flex items-center gap-4 min-w-0">
         <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
           <FileText size={20} />
         </div>

         <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-100 truncate">
              {title}
            </h3>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate uppercase mt-0.5 tracking-tight">
              {description || "No Categories Specified"}
            </p>
         </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-4">
           <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{date}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuestions(); }}
            className="px-3 py-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-all flex items-center gap-1.5"
          >
            <FileEdit size={12} /> Questions
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onAnalytics?.(); }}
            className="px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all flex items-center gap-1.5"
          >
            <BarChart3 size={12} /> Analytics
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onExport?.(); }}
            className="px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all flex items-center gap-1.5"
          >
            <Download size={12} /> Export
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
          >
            Edit
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onStatusToggle?.(status === "Published" ? "Draft" : "Published"); }}
            className={`px-3 py-1.5 text-[11px] font-bold rounded transition-all ${status === "Published" ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50" : "text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            {status}
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
