"use client";

import { Folder, Trash2 } from "lucide-react";

interface AdminFolderCardProps {
  name: string;
  count?: number;
  description?: string;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AdminFolderCard({ name, count, description, onClick, onEdit, onDelete }: AdminFolderCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-[#0a0f29] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer flex flex-col group relative active:scale-[0.98]"
    >
      {/* Folder Icon Section */}
      <div className="flex-1 flex items-center justify-center py-10 bg-gray-50/30 dark:bg-gray-800/30">
        <div className="text-blue-600 dark:text-blue-500 transition-transform group-hover:scale-110 duration-300">
          <Folder size={64} fill="currentColor" fillOpacity={0.85} />
        </div>
      </div>

      {/* Name + Count Section */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 flex flex-col items-center text-center gap-1 min-h-[72px]">
        <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider leading-tight line-clamp-2">
          {name}
        </h3>
        {description ? (
          <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium leading-tight line-clamp-1">{description}</p>
        ) : (
          <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">
            {count !== undefined ? `${count} item${count !== 1 ? 's' : ''}` : ''}
          </span>
        )}
      </div>
      
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
