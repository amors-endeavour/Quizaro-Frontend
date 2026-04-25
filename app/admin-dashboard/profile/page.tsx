"use client";

import { useEffect, useState } from "react";
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
  Settings as SettingsIcon
} from "lucide-react";
import { useRef } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black animate-pulse text-cyan-400 uppercase tracking-widest text-[10px]">Initializing Admin Core...</div>;

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-500">
        <AdminHeader 
          title="Administrative Core" 
          path={[{ label: "Identity", href: "/admin-dashboard/profile" }]}
          tabs={[
            { id: 'identity', label: 'Identity', icon: <User size={14} /> },
            { id: 'security', label: 'Security', icon: <Shield size={14} /> }
          ]}
          activeTab="identity"
          onTabChange={() => {}}
        />

        <div className="p-8 lg:p-12 max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500 w-full">
           
           {/* AVATAR HERO */}
           <div className="bg-white/5 rounded-[3rem] p-16 border border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-5" />
              
              <div className="relative mt-8">
                 <div className="w-32 h-32 bg-cyan-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl transition-all duration-700 overflow-hidden border-4 border-white/10">
                    {user?.name?.[0] || "A"}
                 </div>
              </div>

              <h2 className="mt-8 text-3xl font-black text-white uppercase tracking-tighter italic group-hover:text-cyan-400 transition-colors">{user?.name}</h2>
              <p className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em] mt-4 italic bg-cyan-400/10 px-6 py-2 rounded-full border border-cyan-400/20 inline-block">
                 Master Administrator Entity
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-lg space-y-8 backdrop-blur-md">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                    <User size={16} className="text-cyan-400" /> Identity Data
                 </h3>
                 <div className="space-y-8">
                    <div className="group">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Administrative Name</p>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={e => setEditName(e.target.value)}
                            className="w-full text-sm font-black text-white border-b border-white/10 focus:border-cyan-400 outline-none pb-1 bg-transparent"
                          />
                        ) : (
                          <p className="text-sm font-black text-white italic">{user?.name}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Network Email</p>
                        <p className="text-sm font-black text-white">{user?.email}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-lg space-y-8 backdrop-blur-md">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                    <Shield size={16} className="text-cyan-400" /> Security Matrix
                 </h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Access Role</p>
                          <p className="text-sm font-black text-cyan-400 uppercase tracking-tighter">Institutional Admin</p>
                       </div>
                       <Shield className="text-cyan-400 shadow-cyan-400" size={24} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">System Joined</p>
                       <p className="text-sm font-black text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-6">
               <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className="flex-1 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-xl active:scale-95"
               >
                 {isEditing ? "Discard Modifications" : "Edit Admin Profile"}
               </button>
               {isEditing && (
                 <button 
                   onClick={saveProfile}
                   className="flex-1 py-5 bg-cyan-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl active:scale-95 shadow-cyan-900/20"
                 >
                   Commit Changes
                 </button>
               )}
              <button 
                onClick={handleLogout}
                className="flex-1 py-5 bg-red-500/5 border border-red-500/20 text-red-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                Terminate Session
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
