"use client";

import { FileText, MoreVertical, CheckCircle2, FileEdit } from "lucide-react";

interface AdminTestCardProps {
  title: string;
  description?: string;
  date: string;
  status?: "Draft" | "Attempted" | "Published";
  onEdit: () => void;
  onQuestions: () => void;
  onDelete: () => void;
}

export default function AdminTestCard({ 
  title, 
  description, 
  date, 
  status = "Published", 
  onEdit, 
  onQuestions, 
  onDelete 
}: AdminTestCardProps) {
  
  const statusColors = {
    Draft: "bg-gray-100 text-gray-500",
    Attempted: "bg-blue-600 text-white",
    Published: "bg-green-100 text-green-700"
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300 group relative">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
          <FileText size={24} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition truncate capitalize">
              {title}
            </h3>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md ${statusColors[status]}`}>
                {status === "Attempted" ? "Test Attempted" : status}
              </span>
              <span className="text-[10px] font-bold text-gray-400 font-mono">
                {date}
              </span>
            </div>
          </div>

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 truncate">
            {description || "No specific test series linked"}
          </p>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
            <button 
              onClick={onQuestions}
              className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              <FileEdit size={14} />
              Questions
            </button>
            <button 
              onClick={onEdit}
              className="px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors text-xs font-bold"
            >
              Settings
            </button>
            <button 
              onClick={onDelete}
              className="px-3 py-1.5 text-red-400 hover:text-red-600 transition-colors text-xs font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
