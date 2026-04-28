"use client";

import { useEffect, useState, useRef } from "react";
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
  FileText,
  Smartphone,
  Info,
  Zap,
  Lock,
  X
} from "lucide-react";

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

  if (loading && !user) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
      <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px] italic leading-none">
        Synchronizing Identity Vault Node...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <UserHeader 
          title="Identity Core" 
          breadcrumbs={["Scholar", "Account Hub"]} 
        />

        <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1300px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
           
           {/* AVATAR HERO */}
           <div className="bg-white dark:bg-[#0a0f29] rounded-[4rem] p-16 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden group transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-600/5 dark:to-indigo-600/5 transition-all duration-700 group-hover:scale-110" />
              
              <div className="relative mt-12">
                 <div className="w-48 h-48 bg-blue-600 rounded-[3.5rem] flex items-center justify-center text-white text-7xl font-black shadow-2xl rotate-6 group-hover:rotate-0 transition-all duration-1000 overflow-hidden border-8 border-white dark:border-[#050816]">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="italic">{user?.name?.[0] || "S"}</span>
                    )}
                 </div>
                 <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-4 -right-4 w-16 h-16 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-4 border-white dark:border-[#050816] rounded-2xl flex items-center justify-center hover:scale-110 shadow-2xl transition-all active:scale-90 group-hover:rotate-12 duration-500">
                    <Camera size={28} />
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>

              <div className="mt-12 space-y-3">
                 <h2 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">{user?.name}</h2>
                 <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.3em] italic leading-none">Scholar Entity ID: NODE-{user?._id?.slice(-8).toUpperCase()}</p>
              </div>

              <div className="flex items-center gap-6 mt-10">
                 <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic bg-blue-50 dark:bg-blue-900/20 px-8 py-3 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm">
                    Institutional Scholar Protocol
                 </span>
                 <div className="flex items-center gap-3 px-6 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30 rounded-full text-[10px] font-black uppercase tracking-widest italic leading-none">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500" />
                    Grid Active
                 </div>
              </div>
           </div>

           {/* ACCOUNT GRID */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <div className="bg-white dark:bg-[#0a0f29] p-12 lg:p-16 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-16 transition-all duration-500">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Biometric Identity</h3>
                       <p className="text-[9px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Personal Metadata Synchronization</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30"><User size={24} /></div>
                 </div>
                 <div className="space-y-12">
                    <div className="flex items-center gap-8 group">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner"><User size={28} /></div>
                       <div className="flex-1 space-y-2">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">Institutional Alias</p>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editName} 
                              onChange={e => setEditName(e.target.value)}
                              className="w-full text-[18px] font-black text-gray-900 dark:text-white border-b-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-600 outline-none pb-2 mt-2 bg-transparent italic"
                            />
                          ) : (
                            <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none group-hover:text-blue-600 transition-colors duration-300">{user?.name}</p>
                          )}
                       </div>
                      </div>
                      <div className="flex items-center gap-8 group">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner"><FileText size={28} /></div>
                       <div className="flex-1 space-y-2">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">Neural Narrative (Bio)</p>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editBio} 
                              onChange={e => setEditBio(e.target.value)}
                              placeholder="Synchronize narrative metadata..."
                              className="w-full text-[18px] font-black text-gray-900 dark:text-white border-b-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-600 outline-none pb-2 mt-2 bg-transparent italic"
                            />
                          ) : (
                            <p className="text-lg font-black text-gray-400 dark:text-gray-600 italic leading-relaxed line-clamp-2">{user?.bio || "No narrative synchronized in grid."}</p>
                          )}
                       </div>
                    </div>
                     <div className="flex items-center gap-8 group">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner"><Mail size={28} /></div>
                        <div className="flex-1 space-y-2">
                           <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">Network Protocol (Email)</p>
                           <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none lowercase group-hover:text-blue-600 transition-colors duration-300">{user?.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8 group">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                           <Smartphone size={28} />
                        </div>
                        <div className="flex-1 space-y-2">
                           <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">Uplink Frequency (Phone)</p>
                           {isEditing ? (
                             <input 
                               type="text" 
                               value={editPhone} 
                               onChange={e => {
                                 const val = e.target.value.replace(/\D/g, "");
                                 if (val.length <= 10) setEditPhone(val);
                               }}
                               placeholder="10-digit numeric protocol"
                               className="w-full text-[18px] font-black text-gray-900 dark:text-white border-b-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-600 outline-none pb-2 mt-2 bg-transparent italic"
                             />
                           ) : (
                             <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none group-hover:text-blue-600 transition-colors duration-300">{user?.phone || "Registry Incomplete"}</p>
                           )}
                        </div>
                     </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-[#0a0f29] p-12 lg:p-16 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-16 transition-all duration-500">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Institutional Protocol</h3>
                       <p className="text-[9px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Security & Permissions Synchronization</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700"><Lock size={24} /></div>
                 </div>
                 <div className="space-y-12">
                    <div className="flex items-center gap-8 group">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-700 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-inner"><Shield size={28} /></div>
                       <div className="flex-1 space-y-2">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">Verification Integrity</p>
                          <div className="flex items-center justify-between">
                             <p className="text-lg font-black text-green-600 dark:text-green-400 uppercase italic leading-none">Authorized Institutional Node</p>
                             <CheckCircle2 size={20} className="text-green-600" />
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-8 group">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner"><Calendar size={28} /></div>
                       <div className="flex-1 space-y-2">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">Historical Commit (Joined)</p>
                          <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : "REGISTRY LEGACY"}</p>
                       </div>
                     </div>
                     <div className="flex flex-col gap-6 mt-6 pt-12 border-t border-gray-50 dark:border-gray-800">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm"><Zap size={28} /></div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic leading-none">Growth Identification</p>
                              <p className="text-[9px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Institutional Peer Synchronization</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex-1 min-w-0">
                              <span className={`block w-full text-[16px] font-black px-8 py-6 rounded-[1.5rem] border-2 transition-all duration-500 truncate italic leading-none ${user?.referralCode ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30" : "text-gray-300 dark:text-gray-800 bg-gray-50/50 dark:bg-[#050816] border-gray-100 dark:border-gray-800 tracking-[0.4em]"}`}>
                                 {user?.referralCode || "INACTIVE-NODE"}
                              </span>
                           </div>
                           
                           {user?.referralCode ? (
                             <button onClick={copyReferral} className="w-20 h-20 shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-[1.5rem] hover:bg-blue-700 shadow-2xl shadow-blue-900/30 transition-all active:scale-90 group">
                                {copied ? <CheckCircle2 size={32} /> : <Copy size={32} className="group-hover:rotate-12 transition-transform" />}
                             </button>
                           ) : (
                             <button onClick={handleGenerateReferral} className="px-10 h-20 flex items-center justify-center bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] hover:bg-blue-700 shadow-2xl shadow-blue-900/30 transition-all whitespace-nowrap italic active:scale-[0.98]">
                                Activate Node Profile
                             </button>
                           )}
                        </div>
                     </div>
                  </div>
              </div>
           </div>

           {/* ACTIONS */}
           <div className="flex flex-col sm:flex-row gap-8 pt-12 pb-12">
               <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className={`flex-1 py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all duration-500 shadow-xl active:scale-[0.98] flex items-center justify-center gap-6 italic border-2 ${isEditing ? "bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/30 text-red-500" : "bg-gray-900 dark:bg-gray-800 border-gray-900 dark:border-gray-700 text-white hover:bg-blue-600"}`}
               >
                 {isEditing ? (
                    <>Cancel Modification <X size={20} /></>
                 ) : (
                    <>Initiate Identity Protocol <Edit2 size={20} /></>
                 )}
               </button>
               {isEditing && (
                 <button 
                   onClick={saveProfile}
                   className="flex-1 py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/30 active:scale-[0.98] flex items-center justify-center gap-6 animate-in zoom-in-95 duration-500 italic"
                 >
                   Commit Identity Synchronization
                   <CheckCircle2 size={20} />
                 </button>
               )}
              <button 
                onClick={handleLogout}
                className="flex-1 py-8 bg-white dark:bg-[#0a0f29] border-2 border-red-50 dark:border-red-900/10 text-red-500 dark:text-red-600 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-6 italic active:scale-[0.98] shadow-sm"
              >
                <LogOut size={20} /> Terminate Neural Session
              </button>
           </div>

           <div className="flex items-center justify-center gap-6 text-gray-200 dark:text-gray-800 italic font-black uppercase tracking-[0.5em] text-[10px] pt-12">
              <div className="w-16 h-px bg-gray-50 dark:bg-gray-900" />
              Identity Vault Protocol v4.5.1
              <div className="w-16 h-px bg-gray-50 dark:bg-gray-900" />
           </div>
        </div>
    </div>
  );
}
