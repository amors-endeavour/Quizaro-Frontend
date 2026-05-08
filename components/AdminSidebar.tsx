"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[150]"
          onClick={onClose}
        />
      )}

      {/* TEXT-ONLY SIDEBAR */}
      <div className={`
        fixed top-0 left-0 z-[200]
        w-[300px] min-h-screen bg-white border-r border-gray-200
        flex flex-col transition-transform duration-500
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* HEADER ELEMENTS FROM IMAGE */}
        <div className="p-10 border-b border-black/10">
          <h2 className="text-[12px] font-bold text-black uppercase tracking-[0.2em] mb-2">GLOBAL MATRIX</h2>
          <p className="text-[10px] text-black/50 uppercase tracking-widest">INSTITUTIONAL PULSE</p>
        </div>

        {/* CONTENT ELEMENTS FROM IMAGE */}
        <div className="flex-1 p-10 flex flex-col justify-center text-center">
          <p className="text-[10px] font-medium text-black/40 uppercase tracking-[0.3em] leading-relaxed">
            AWAITING INITIAL<br/>PERFORMANCE DATA
          </p>
        </div>

        {/* FOOTER ELEMENTS FROM IMAGE */}
        <div className="p-10 border-t border-black/10">
           <div className="mb-8">
              <p className="text-[9px] text-black/30 uppercase tracking-widest leading-loose">
                INSTITUTIONAL HUB<br/>V4.5.1 LIVE
              </p>
           </div>
           
           <button
             onClick={() => setShowLogoutModal(true)}
             className="text-[10px] font-bold text-black uppercase tracking-widest hover:underline"
           >
             LOGOUT
           </button>
        </div>
      </div>

      {/* MINIMAL LOGOUT MODAL */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[1000] bg-white/80 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white border border-gray-200 p-16 max-w-md w-full shadow-lg text-center space-y-10">
               <h3 className="text-xl font-bold text-black uppercase tracking-widest">TERMINATE SESSION</h3>
               <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                    className="w-full py-4 bg-black text-white font-bold text-[10px] uppercase tracking-widest"
                  >
                     CONFIRM
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-4 bg-gray-100 text-black font-bold text-[10px] uppercase tracking-widest"
                  >
                     CANCEL
                  </button>
               </div>
            </div>
         </div>
      )}
    </>
  );
}
