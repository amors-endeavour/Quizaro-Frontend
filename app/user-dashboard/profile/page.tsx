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
      setUser((prev: any) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
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


  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Reticulating Account Details...</div>;

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-900 font-sans overflow-hidden">
      <UserSidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Student Profile" 
          breadcrumbs={["Student", "Account Settings"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1000px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
           
           {/* AVATAR HERO */}
           <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl shadow-gray-100/50 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5" />
              
              <div className="relative mt-8">
                 <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-100 rotate-6 group-hover:rotate-0 transition-transform duration-500 overflow-hidden border-4 border-white">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0] || "S"
                    )}
                 </div>
                 <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-xl transition-all">
                    <Camera size={18} />
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>

              <h2 className="mt-8 text-3xl font-black text-gray-900 uppercase tracking-tighter">{user?.name}</h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2 italic shadow-sm bg-blue-50 px-4 py-1.5 rounded-full inline-block">
                 Institutional Candidate
              </p>
           </div>

           {/* ACCOUNT GRID */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 space-y-8">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                    <User size={16} /> Basic Identity
                 </h3>
                 <div className="space-y-6">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><User size={20} /></div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editName} 
                              onChange={e => setEditName(e.target.value)}
                              className="w-full text-sm font-black text-gray-900 border-b border-gray-200 focus:border-blue-500 outline-none pb-1 mt-1 bg-transparent"
                            />
                          ) : (
                            <p className="text-sm font-black text-gray-900">{user?.name}</p>
                          )}
                       </div>
                     </div>
                     <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><FileText size={20} /></div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Biography</p>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editBio} 
                              onChange={e => setEditBio(e.target.value)}
                              placeholder="Add a bio..."
                              className="w-full text-sm font-black text-gray-900 border-b border-gray-200 focus:border-blue-500 outline-none pb-1 mt-1 bg-transparent"
                            />
                          ) : (
                            <p className="text-sm font-black text-gray-900">{user?.bio || "No biography added yet."}</p>
                          )}
                       </div>
                    </div>
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><Mail size={20} /></div>
                        <div className="flex-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                           <p className="text-sm font-black text-gray-900">{user?.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </div>
                        <div className="flex-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                           {isEditing ? (
                             <input 
                               type="text" 
                               value={editPhone} 
                               onChange={e => setEditPhone(e.target.value)}
                               placeholder="Add phone..."
                               className="w-full text-sm font-black text-gray-900 border-b border-gray-200 focus:border-blue-500 outline-none pb-1 mt-1 bg-transparent"
                             />
                           ) : (
                             <p className="text-sm font-black text-gray-900">{user?.phone || "Not provided."}</p>
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
      </main>
    </div>
  );
}
