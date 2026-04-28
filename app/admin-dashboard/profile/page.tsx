"use client";

import { useEffect, useState, useRef } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Camera,
  LogOut,
  ChevronRight,
  Edit2,
  FileText,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertCircle,
  Zap,
  Activity,
  ArrowRight
} from "lucide-react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const u = data.user || data;
        setUser(u);
        setEditName(u.name || "");
        setEditBio(u.bio || "");
      } catch (err) {
        console.error("Admin Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

  const saveProfile = async () => {
    try {
      await API.put("/user/profile", { name: editName, bio: editBio });
      setUser((prev: any) => ({ ...prev, name: editName, bio: editBio }));
      setIsEditing(false);
      setStatusMsg({ text: "Identity Matrix Updated Successfully.", type: "success" });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ text: "Governance Protocol Update Failure.", type: "error" });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic leading-none">
        Synchronizing Administrative Core...
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader 
          title="Administrative Identity Hub" 
          path={[{ label: "Governance" }, { label: "Root Core" }]}
        />

        <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1300px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
           
           {/* AVATAR HERO */}
           <div className="bg-white dark:bg-[#0a0f29] rounded-[4.5rem] p-16 lg:p-24 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden group transition-all duration-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative">
                 <div className="w-48 h-48 bg-blue-600 rounded-[3.5rem] flex items-center justify-center text-white text-7xl font-black shadow-2xl rotate-6 group-hover:rotate-0 transition-all duration-1000 overflow-hidden border-8 border-white dark:border-[#050816] relative z-10">
                    {user?.name?.[0] || "A"}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                 </div>
                 <div className="absolute -bottom-4 -right-4 w-18 h-18 bg-white dark:bg-gray-800 border-4 border-gray-50 dark:border-gray-900 rounded-[1.5rem] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xl group-hover:scale-110 transition-all duration-700 z-20">
                    <Shield size={32} />
                 </div>
              </div>

              <div className="mt-12 space-y-6 relative z-10">
                 <h2 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-700">{user?.name}</h2>
                 <div className="flex flex-wrap items-center justify-center gap-6">
                    <span className="text-[12px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em] italic bg-blue-50/50 dark:bg-blue-900/10 px-10 py-4 rounded-full border-2 border-blue-100 dark:border-blue-800/30 shadow-sm">
                       Institutional Root Authority
                    </span>
                    <div className="flex items-center gap-4 px-6 py-3.5 bg-green-50/50 dark:bg-green-900/10 text-green-600 dark:text-green-500 border-2 border-green-100 dark:border-green-800/30 rounded-full text-[11px] font-black uppercase tracking-widest italic shadow-sm">
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                       Grid Status: Active
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white dark:bg-[#0a0f29] p-12 lg:p-16 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-16 transition-all duration-700 group hover:border-blue-600/30">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 shadow-sm group-hover:rotate-12 transition-all duration-500"><User size={28} /></div>
                       <div className="space-y-1">
                          <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] italic leading-none">Identity Matrix</h3>
                          <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Candidate Registry Metadata</p>
                       </div>
                    </div>
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-ping" />
                 </div>
                 
                 <div className="space-y-12">
                    <div className="space-y-4">
                        <p className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none ml-2">Administrative Alias</p>
                        {isEditing ? (
                          <div className="relative group/input">
                             <input 
                               type="text" 
                               value={editName} 
                               onChange={e => setEditName(e.target.value)}
                               className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-8 py-6 outline-none focus:border-blue-600 transition-all font-black text-xl text-gray-900 dark:text-white italic shadow-inner"
                               placeholder="Ex: Command Node"
                             />
                          </div>
                        ) : (
                          <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#050816]/50 rounded-3xl border-2 border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-800 transition-all">
                             <p className="text-2xl font-black text-gray-900 dark:text-white italic leading-none tabular-nums">{user?.name}</p>
                          </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <p className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none ml-2">Network Protocol (Email)</p>
                        <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#050816]/50 rounded-3xl border-2 border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-800 transition-all flex items-center justify-between">
                           <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none lowercase tracking-tight">{user?.email}</p>
                           <Mail size={20} className="text-gray-200 dark:text-gray-800" />
                        </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-[#0a0f29] p-12 lg:p-16 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-16 transition-all duration-700 group hover:border-blue-600/30">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30 shadow-sm group-hover:rotate-12 transition-all duration-500"><Shield size={28} /></div>
                       <div className="space-y-1">
                          <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] italic leading-none">Security Matrix</h3>
                          <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Authority & Clearance Protocol</p>
                       </div>
                    </div>
                    <div className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 rounded-xl text-[10px] font-black uppercase tracking-widest italic">Encrypted Session</div>
                 </div>

                 <div className="space-y-12">
                    <div className="flex items-center justify-between bg-gray-50/50 dark:bg-[#050816]/50 p-8 rounded-3xl group/row hover:bg-white dark:hover:bg-gray-800 transition-all border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                       <div className="space-y-2">
                          <p className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none">Authority Level</p>
                          <p className="text-xl font-black text-blue-600 dark:text-blue-500 uppercase tracking-tighter italic leading-none">Master Governance Root</p>
                       </div>
                       <Zap size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-50/50 dark:bg-[#050816]/50 p-8 rounded-3xl group/row hover:bg-white dark:hover:bg-gray-800 transition-all border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                       <div className="space-y-2">
                          <p className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none">Registry Inception</p>
                          <div className="flex items-center gap-4">
                             <Calendar size={18} className="text-indigo-500" />
                             <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none tabular-nums">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : "INSTITUTIONAL EPOCH"}</p>
                          </div>
                       </div>
                       <Activity size={24} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col xl:flex-row gap-10 pb-20">
               <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className="flex-[1.5] py-9 bg-gray-900 dark:bg-[#0a0f29] text-white border-2 border-transparent dark:border-gray-800 rounded-[3rem] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/10 active:scale-[0.98] flex items-center justify-center gap-6 italic group"
               >
                 {isEditing ? "Abort Identity Modification" : "Initiate Identity Update Protocol"}
                 <Edit2 size={24} className="group-hover:rotate-12 transition-transform" />
               </button>
               
               {isEditing && (
                 <button 
                   onClick={saveProfile}
                   className="flex-1 py-9 bg-blue-600 text-white rounded-[3rem] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98] flex items-center justify-center gap-6 animate-in zoom-in-95 duration-500 italic"
                 >
                   Commit Modifications
                   <CheckCircle2 size={24} />
                 </button>
               )}

              <button 
                onClick={handleLogout}
                className="flex-1 py-9 bg-white dark:bg-[#0a0f29] border-2 border-red-50 dark:border-red-900/10 text-red-600 dark:text-red-500 rounded-[3rem] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-6 italic active:scale-[0.98] shadow-sm"
              >
                <LogOut size={24} /> Terminate Root Session
              </button>
           </div>
        </div>
      </div>

      {/* STATUS OVERLAY */}
      {statusMsg && (
        <div className={`fixed bottom-12 left-12 z-[700] px-12 py-8 rounded-[3.5rem] border-2 shadow-2xl animate-in slide-in-from-left-12 duration-700 flex items-center gap-8 backdrop-blur-3xl bg-white/90 dark:bg-[#0a0f29]/90 transition-all ${statusMsg.type === 'success' ? "border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400" : "border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"}`}>
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${statusMsg.type === 'success' ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
           </div>
           <p className="text-[14px] font-black uppercase tracking-widest italic leading-none">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
