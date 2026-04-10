"use client";

import { FileText, MoreVertical, CheckCircle2, FileEdit, Trash2 } from "lucide-react";

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
  onDelete 
}: AdminTestCardProps) {
  
  const statusColors = {
    Draft: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    Attempted: "bg-blue-600 text-white",
    Published: "bg-green-100 text-green-700 hover:bg-green-200"
  };

  return (
    <div className={`bg-white border rounded-3xl p-6 transition-all duration-500 group relative flex items-center gap-6 ${isSelected ? "border-blue-500 shadow-xl shadow-blue-50 bg-blue-50/10" : "border-gray-100/80 hover:shadow-2xl hover:shadow-gray-100/50"}`}>
      
      {/* SELECTION CHECKBOX */}
      <div 
        onClick={() => onSelect?.(!isSelected)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-100" : "border-gray-200 hover:border-blue-400"}`}
      >
        {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
      </div>

      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-5 flex-1 min-w-0">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:scale-110"}`}>
             <FileText size={24} />
           </div>

           <div className="truncate">
              <h3 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition truncate uppercase tracking-tight">
                {title}
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60">
                {description || "Independent Session"}
              </p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-gray-400 font-mono opacity-50 mb-1">{date}</span>
             <button 
               disabled={status === "Attempted"}
               onClick={() => {
                 if (status !== "Attempted") {
                   onStatusToggle?.(status === "Published" ? "Draft" : "Published");
                 }
               }}
               className={`text-[9px] uppercase font-black tracking-[0.15em] px-4 py-1.5 rounded-xl transition-all ${statusColors[status]} ${status !== "Attempted" ? "cursor-pointer" : "cursor-default opacity-80"}`}
             >
               {status === "Attempted" ? "Live session active" : status}
             </button>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <button 
              onClick={onQuestions}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              <FileEdit size={14} />
              Studio
            </button>
            <button 
              onClick={onEdit}
              className="w-10 h-10 border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 rounded-xl flex items-center justify-center transition-all group/opt"
            >
              <MoreVertical size={16} className="group-hover/opt:scale-125 transition-transform" />
            </button>
            <button 
              onClick={onDelete}
              className="w-10 h-10 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
