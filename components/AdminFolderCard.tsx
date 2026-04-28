"use client";

import { Folder, MoreVertical, LayoutGrid, Trash2 } from "lucide-react";

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
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group relative active:scale-[0.98]"
    >
      {/* Folder Icon Section */}
      <div className="flex-1 flex items-center justify-center py-12 bg-gray-50/30">
        <div className="text-blue-600 transition-transform group-hover:scale-110 duration-300">
          <Folder size={64} fill="currentColor" fillOpacity={0.8} />
        </div>
      </div>

      {/* Name Section */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-center text-center min-h-[70px]">
        <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider leading-tight">
          {name}
        </h3>
      </div>
      
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
