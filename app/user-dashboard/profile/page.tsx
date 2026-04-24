"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
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
  Copy,
  CheckCircle2,
  FileText
} from "lucide-react";
import { useRef } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const u = data.user || data;
        setUser(u);
        setEditName(u.name || "");
        setEditBio(u.bio || "");
        setEditPhone(u.phone || "");
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/user-login";
  };

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await API.post("/user/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser((prev: any) => ({ ...prev, avatar: res.data.avatar }));
    } catch (err) {
      console.error("Avatar error", err);
    }
  };

  const saveProfile = async () => {
    try {
      await API.put("/user/profile", { name: editName, bio: editBio, phone: editPhone });
      setUser((prev: any) => ({ ...prev, name: editName, bio: editBio, phone: editPhone }));
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const copyReferral = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateReferral = async () => {
    try {
      const { data } = await API.post("/user/referral");
      setUser((prev: any) => ({ ...prev, referralCode: data.referralCode }));
    } catch (err) {
      console.error("Referral generation failed", err);
    }
  };


  return (
    <>
        <UserHeader 
          title="Identity Registry" 
          breadcrumbs={["Intelligence", "Account Core"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
           
           {/* AVATAR HERO */}
           <div className="bg-white/5 rounded-[4rem] p-16 border border-white/10 shadow-2xl backdrop-blur-3xl flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-10" />
              
              <div className="relative mt-8">
                 <div className="w-40 h-40 bg-cyan-600 rounded-[3rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl rotate-6 group-hover:rotate-0 transition-all duration-700 overflow-hidden border-4 border-[#050816]">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0] || "S"
                    )}
                 </div>
                 <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-black border border-white/10 rounded-2xl flex items-center justify-center hover:scale-110 shadow-xl transition-all">
                    <Camera size={20} />
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>

              <h2 className="mt-10 text-4xl font-black text-white uppercase tracking-tighter italic">{user?.name}</h2>
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mt-4 italic bg-cyan-400/10 px-6 py-2 rounded-full border border-cyan-400/20 inline-block">
                 Institutional Intelligence Node
              </p>
           </div>

           {/* ACCOUNT GRID */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-4 italic mb-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
                    Biometric Identity
                 </h3>
                 <div className="space-y-8">
                    <div className="flex items-center gap-8 group">
                       <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-cyan-600 group-hover:text-white transition-all"><User size={22} /></div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Cognitive Alias</p>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editName} 
                              onChange={e => setEditName(e.target.value)}
                              className="w-full text-sm font-black text-white border-b border-white/10 focus:border-cyan-400 outline-none pb-1 mt-1 bg-transparent"
                            />
                          ) : (
                            <p className="text-sm font-black text-white italic">{user?.name}</p>
                          )}
                       </div>
                     </div>
                     <div className="flex items-center gap-8 group">
                       <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-cyan-600 group-hover:text-white transition-all"><FileText size={22} /></div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Neural Narrative (Bio)</p>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editBio} 
                              onChange={e => setEditBio(e.target.value)}
                              placeholder="Add narrative..."
                              className="w-full text-sm font-black text-white border-b border-white/10 focus:border-cyan-400 outline-none pb-1 mt-1 bg-transparent"
                            />
                          ) : (
                            <p className="text-sm font-black text-white/60 italic leading-relaxed">{user?.bio || "No narrative established."}</p>
                          )}
                       </div>
                    </div>
                     <div className="flex items-center gap-8 group">
                        <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-cyan-600 group-hover:text-white transition-all"><Mail size={22} /></div>
                        <div className="flex-1">
                           <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Network Protocol (Email)</p>
                           <p className="text-sm font-black text-white">{user?.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8 group">
                        <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </div>
                        <div className="flex-1">
                           <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Secure Uplink (Phone)</p>
                           {isEditing ? (
                             <input 
                               type="text" 
                               value={editPhone} 
                               onChange={e => {
                                 const val = e.target.value.replace(/\D/g, "");
                                 if (val.length <= 10) setEditPhone(val);
                               }}
                               placeholder="10-digit mobile number"
                               className="w-full text-sm font-black text-white border-b border-white/10 focus:border-cyan-400 outline-none pb-1 mt-1 bg-transparent"
                             />
                           ) : (
                             <p className="text-sm font-black text-white">{user?.phone || "Not linked."}</p>
                           )}
                        </div>
                     </div>
                  </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 space-y-8">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                    <Shield size={16} /> Security & System
                 </h3>
                 <div className="space-y-6">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><Shield size={20} /></div>
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Account Status</p>
                          <p className="text-sm font-black text-green-600 flex items-center gap-2">Verified Academic <ChevronRight size={14} /></p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><Calendar size={20} /></div>
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registration Date</p>
                          <p className="text-sm font-black text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-6 mt-6">
                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><CheckCircle2 size={20} /></div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Referral Code</p>
                           <div className="flex gap-2 mt-1">
                             <div className="flex-1 min-w-0">
                                <span className={user?.referralCode ? "text-sm font-black text-blue-600 bg-white px-3 py-2 rounded truncate flex-1 border border-blue-100 block" : "text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-2 rounded truncate flex-1 border border-gray-100 block italic tracking-widest uppercase"}>
                                   {user?.referralCode || "Inactive Node"}
                                </span>
                             </div>
                             
                             {user?.referralCode ? (
                               <button onClick={copyReferral} className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                               </button>
                             ) : (
                               <button onClick={handleGenerateReferral} className="px-4 h-10 flex items-center justify-center bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all whitespace-nowrap">
                                  Activate Code
                               </button>
                             )}
                           </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* ACTIONS */}
           <div className="flex flex-col md:flex-row gap-6">
               <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className="flex-1 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
               >
                 {isEditing ? "Cancel Modification" : "Modify Identity Data"}
               </button>
               {isEditing && (
                 <button 
                   onClick={saveProfile}
                   className="flex-1 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                 >
                   Save Final Changes
                 </button>
               )}
              <button 
                onClick={handleLogout}
                className="flex-1 py-6 border-2 border-red-50 text-red-500 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-3"
              >
                <LogOut size={18} /> Close Session
              </button>
           </div>
        </div>
    </>
  );
}
