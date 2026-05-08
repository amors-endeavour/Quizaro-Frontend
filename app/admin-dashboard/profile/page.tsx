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
    <div className="min-h-screen bg-[#fbfbfe] flex flex-col items-center justify-center space-y-10 transition-colors duration-300">
      <div className="w-24 h-24 border-4 border-blue-50 border-t-blue-600 rounded-[2.5rem] animate-spin shadow-xl shadow-blue-600/5" />
      <p className="font-black animate-pulse text-blue-600 uppercase tracking-[0.5em] text-[12px] italic leading-none">
        Synchronizing Administrative Core...
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fbfbfe] text-gray-900 transition-colors duration-500">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader 
          title="Administrative Identity Hub" 
          path={[{ label: "Governance" }, { label: "Root Core" }]}
        />

        <div className="flex-1 overflow-y-auto p-10 lg:p-20 max-w-[1500px] mx-auto w-full space-y-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
           
           {/* AVATAR HERO */}
           <div className="bg-white rounded-[5.5rem] p-20 lg:p-32 border-2 border-gray-50 shadow-sm flex flex-col items-center text-center relative overflow-hidden group transition-all duration-700">
              <div className="absolute top-0 left-0 w-full h-3 bg-gray-900" />
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative">
                 <div className="w-56 h-56 bg-gray-900 rounded-[4rem] flex items-center justify-center text-white text-8xl font-black shadow-2xl rotate-6 group-hover:rotate-0 transition-all duration-1000 overflow-hidden border-8 border-white relative z-10">
                    {user?.name?.[0] || "A"}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                 </div>
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600 border-8 border-white rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-all duration-700 z-20">
                    <Shield size={40} />
                 </div>
              </div>

              <div className="mt-16 space-y-8 relative z-10">
                 <h2 className="text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors duration-700">{user?.name}</h2>
                 <div className="flex flex-wrap items-center justify-center gap-8">
                    <span className="text-[14px] font-black text-blue-600 uppercase tracking-[0.4em] italic bg-blue-50 px-12 py-5 rounded-full border-2 border-blue-50 shadow-sm">
                       Institutional Root Authority
                    </span>
                    <div className="flex items-center gap-5 px-8 py-4 bg-green-50 text-green-600 border-2 border-green-50 rounded-full text-[12px] font-black uppercase tracking-widest italic shadow-sm">
                       <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                       Grid Status: Active
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="bg-white p-16 lg:p-24 rounded-[5rem] border-2 border-gray-50 shadow-sm space-y-20 transition-all duration-700 group hover:border-blue-600">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border-2 border-blue-50 shadow-sm group-hover:rotate-12 transition-all duration-700"><User size={32} /></div>
                       <div className="space-y-2">
                          <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-[0.4em] italic leading-none">Identity Matrix</h3>
                          <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic leading-none">Candidate Registry Metadata</p>
                       </div>
                    </div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" />
                 </div>
                 
                 <div className="space-y-16">
                    <div className="space-y-5">
                        <p className="text-[12px] font-black text-gray-200 uppercase tracking-widest italic leading-none ml-3">Administrative Alias</p>
                        {isEditing ? (
                          <div className="relative group/input">
                             <input 
                               type="text" 
                               value={editName} 
                               onChange={e => setEditName(e.target.value)}
                               className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] px-10 py-7 outline-none focus:border-blue-600 transition-all font-black text-2xl text-gray-900 italic shadow-inner"
                               placeholder="Ex: Command Node"
                             />
                          </div>
                        ) : (
                          <div className="px-10 py-8 bg-gray-50/50 rounded-[2rem] border-2 border-transparent group-hover:border-gray-50 transition-all">
                             <p className="text-3xl font-black text-gray-900 italic leading-none tabular-nums">{user?.name}</p>
                          </div>
                        )}
                    </div>
                    <div className="space-y-5">
                        <p className="text-[12px] font-black text-gray-200 uppercase tracking-widest italic leading-none ml-3">Network Protocol (Email)</p>
                        <div className="px-10 py-8 bg-gray-50/50 rounded-[2rem] border-2 border-transparent group-hover:border-gray-50 transition-all flex items-center justify-between">
                           <p className="text-2xl font-black text-gray-900 italic leading-none lowercase tracking-tight">{user?.email}</p>
                           <Mail size={24} className="text-gray-100" />
                        </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-16 lg:p-24 rounded-[5rem] border-2 border-gray-50 shadow-sm space-y-20 transition-all duration-700 group hover:border-gray-900">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border-2 border-gray-50 shadow-sm group-hover:rotate-12 transition-all duration-700"><Shield size={32} /></div>
                       <div className="space-y-2">
                          <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-[0.4em] italic leading-none">Security Matrix</h3>
                          <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic leading-none">Authority & Clearance Protocol</p>
                       </div>
                    </div>
                    <div className="px-8 py-3 bg-blue-50 text-blue-600 border-2 border-blue-50 rounded-xl text-[11px] font-black uppercase tracking-widest italic">Encrypted Session</div>
                 </div>

                 <div className="space-y-16">
                    <div className="flex items-center justify-between bg-gray-50/50 p-10 rounded-[2.5rem] group/row hover:bg-white transition-all border-2 border-transparent hover:border-gray-50 shadow-inner hover:shadow-xl hover:shadow-gray-900/5">
                       <div className="space-y-3">
                          <p className="text-[12px] font-black text-gray-200 uppercase tracking-widest italic leading-none">Authority Level</p>
                          <p className="text-2xl font-black text-blue-600 uppercase tracking-tighter italic leading-none">Master Governance Root</p>
                       </div>
                       <Zap size={32} className="text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-50/50 p-10 rounded-[2.5rem] group/row hover:bg-white transition-all border-2 border-transparent hover:border-gray-50 shadow-inner hover:shadow-xl hover:shadow-gray-900/5">
                       <div className="space-y-3">
                          <p className="text-[12px] font-black text-gray-200 uppercase tracking-widest italic leading-none">Registry Inception</p>
                          <div className="flex items-center gap-5">
                             <Calendar size={22} className="text-gray-900" />
                             <p className="text-2xl font-black text-gray-900 italic leading-none tabular-nums">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : "INSTITUTIONAL EPOCH"}</p>
                          </div>
                       </div>
                       <Activity size={32} className="text-gray-900 group-hover:scale-110 transition-transform" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col xl:flex-row gap-12 pb-20">
               <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className="flex-[1.5] py-10 bg-gray-900 text-white border-2 border-transparent rounded-[3.5rem] font-black text-[15px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-gray-900/20 active:scale-[0.98] flex items-center justify-center gap-8 italic group"
               >
                 {isEditing ? "Abort Identity Modification" : "Initiate Identity Update Protocol"}
                 <Edit2 size={32} className="group-hover:rotate-12 transition-transform" />
               </button>
               
               {isEditing && (
                 <button 
                   onClick={saveProfile}
                   className="flex-1 py-10 bg-blue-600 text-white rounded-[3.5rem] font-black text-[15px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 active:scale-[0.98] flex items-center justify-center gap-8 animate-in zoom-in-95 duration-700 italic"
                 >
                   Commit Modifications
                   <CheckCircle2 size={32} />
                 </button>
               )}

              <button 
                onClick={handleLogout}
                className="flex-1 py-10 bg-white border-2 border-red-50 text-red-600 rounded-[3.5rem] font-black text-[15px] uppercase tracking-[0.2em] hover:bg-red-50 transition-all flex items-center justify-center gap-8 italic active:scale-[0.98] shadow-sm"
              >
                <LogOut size={32} /> Terminate Root Session
              </button>
           </div>
        </div>
      </div>

      {/* STATUS OVERLAY */}
      {statusMsg && (
        <div className={`fixed bottom-16 left-16 z-[700] px-16 py-10 rounded-[4rem] border-2 shadow-2xl animate-in slide-in-from-left-16 duration-700 flex items-center gap-10 backdrop-blur-3xl bg-white/95 transition-all ${statusMsg.type === 'success' ? "border-green-100 text-green-700" : "border-red-100 text-red-600"}`}>
           <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl ${statusMsg.type === 'success' ? "bg-green-50" : "bg-red-50"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
           </div>
           <p className="text-[16px] font-black uppercase tracking-widest italic leading-none">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
