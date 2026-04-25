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

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest text-[10px]">Initializing Admin Core...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-500">
        <AdminHeader 
          title="Administrative Core" 
          tabs={["Identity", "Security"]}
          activeTab="Identity"
          onTabChange={() => {}}
        />

        <div className="p-8 lg:p-12 max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500 w-full">
           
           {/* AVATAR HERO */}
           <div className="bg-white rounded-[3rem] p-16 border border-gray-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5" />
              
              <div className="relative mt-8">
                 <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl transition-all duration-700 overflow-hidden border-4 border-white">
                    {user?.name?.[0] || "A"}
                 </div>
              </div>

              <h2 className="mt-8 text-3xl font-black text-gray-900 uppercase tracking-tighter italic">{user?.name}</h2>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] mt-4 italic bg-blue-50 px-6 py-2 rounded-full border border-blue-100 inline-block">
                 Master Administrator Entity
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-lg space-y-8">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                    <User size={16} /> Identity Data
                 </h3>
                 <div className="space-y-8">
                    <div className="group">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Administrative Name</p>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={e => setEditName(e.target.value)}
                            className="w-full text-sm font-black text-gray-900 border-b border-gray-100 focus:border-blue-600 outline-none pb-1 bg-transparent"
                          />
                        ) : (
                          <p className="text-sm font-black text-gray-900 italic">{user?.name}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Network Email</p>
                        <p className="text-sm font-black text-gray-900">{user?.email}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-lg space-y-8">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                    <Shield size={16} /> Security Matrix
                 </h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Access Role</p>
                          <p className="text-sm font-black text-blue-600 uppercase tracking-tighter">Institutional Admin</p>
                       </div>
                       <Shield className="text-blue-600" size={24} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">System Joined</p>
                       <p className="text-sm font-black text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-6">
               <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className="flex-1 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
               >
                 {isEditing ? "Discard Modifications" : "Edit Admin Profile"}
               </button>
               {isEditing && (
                 <button 
                   onClick={saveProfile}
                   className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                 >
                   Commit Changes
                 </button>
               )}
              <button 
                onClick={handleLogout}
                className="flex-1 py-5 border-2 border-red-50 text-red-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all"
              >
                Terminate Session
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
