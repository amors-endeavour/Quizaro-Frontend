"use client";

import { Folder, MoreVertical, LayoutGrid } from "lucide-react";

interface AdminFolderCardProps {
  name: string;
  count?: number;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AdminFolderCard({ name, count, onClick, onEdit, onDelete }: AdminFolderCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group active:scale-95 shadow-lg shadow-gray-50/50"
    >
      <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform shadow-xl shadow-blue-200">
        <Folder size={40} fill="currentColor" fillOpacity={0.4} />
      </div>

      <h3 className="text-sm font-black text-gray-900 tracking-[0.15em] uppercase leading-relaxed max-w-full truncate px-2">
        {name}
      </h3>
      
      {count !== undefined && (
        <span className="mt-2 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          {count} Items
        </span>
      )}
    </div>
  );
}
