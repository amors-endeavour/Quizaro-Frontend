"use client";

import { MessageCircle, HelpCircle, X } from "lucide-react";
import { useState } from "react";

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 w-[280px] mb-2 animate-in zoom-in duration-300 transform-gpu origin-bottom-right">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Quick Support</h4>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 transition"><X size={16} /></button>
           </div>
           <p className="text-[11px] font-bold text-gray-500 leading-relaxed mb-6 italic">How can we help you today? Our support team is online.</p>
           
            <div className="space-y-3">
               <button 
                  onClick={() => window.open("https://wa.me/919999999999?text=Hello%20Quizaro%20Support!%20I%20need%20help.", "_blank")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-[#25D366] text-white rounded-xl shadow-lg shadow-green-100 hover:scale-[1.03] transition-all duration-200"
               >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center"><MessageCircle size={14} fill="white" /></div>
                  <span className="text-[11px] font-black uppercase tracking-widest">Connect on WhatsApp</span>
               </button>
               <button 
                  onClick={() => window.location.href = window.location.pathname.includes("admin") ? "/admin-dashboard/help" : "/contact"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-lg shadow-gray-200 hover:scale-[1.03] transition-all duration-200"
               >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center"><HelpCircle size={14} fill="white" /></div>
                  <span className="text-[11px] font-black uppercase tracking-widest">Open Help Center</span>
               </button>
            </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? "bg-red-500 shadow-red-200" : "bg-[#00a884] shadow-green-200"}`}
      >
        {isOpen ? <X size={28} className="text-white" /> : <MessageCircle size={28} className="text-white" fill="white" />}
        {!isOpen && (
          <div className="absolute -top-1 -left-1 w-6 h-6 bg-white border-2 border-[#00a884] rounded-full flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-[#00a884]">Help</span>
          </div>
        )}
      </button>
    </div>
  );
}
