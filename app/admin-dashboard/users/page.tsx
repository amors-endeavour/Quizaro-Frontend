"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreVertical,
  Mail,
  Calendar,
  Award
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalTestsAttempted: number;
  totalScore: number;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvData, setCsvData] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        if (role !== "admin") {
          router.replace("/admin-login");
        }
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!csvData.trim()) return;
    try {
      const rows = csvData.trim().split("\n").map(r => r.split(","));
      const usersToImport = rows.map(r => ({ name: r[0], email: r[1], password: r[2] || "Quizaro123" }));
      
      await Promise.all(usersToImport.map(u => API.post("/user/register", u)));
      setShowImportModal(false);
      setCsvData("");
      fetchUsers();
    } catch {
      alert("Bulk import partially failed. Check connectivity.");
    }
  };

  const handleUserStatus = async (id: string, status: string) => {
    try {
      if (status === "delete") {
        if (!confirm("Are you sure? This is irreversible.")) return;
        await API.delete(`/admin/user/${id}`);
      } else {
        await API.put(`/admin/user/${id}`, { status });
      }
      fetchUsers();
    } catch {
      alert("Action failed");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Accessing Intelligence Directory...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader 
        title="Student Command Center" 
        path={[{ label: "Console" }, { label: "User Directory" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1700px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
         
         {/* FILTER HUB & ACTIONS */}
         <div className="flex flex-col xl:flex-row items-center gap-8">
            <div className="flex-1 relative group w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
               <input
                 type="text"
                 placeholder="Locate student by name, institutional ID, or encrypted email..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-100/30 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-bold text-gray-900"
               />
            </div>
            <div className="flex items-center gap-4 w-full xl:w-auto">
               <div className="flex items-center gap-2 bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 flex-1 xl:flex-initial">
                  <button 
                    onClick={() => setFilterRole("all")}
                    className={`px-8 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterRole === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:text-gray-600"}`}
                  >Broadcaster</button>
                  <button 
                    onClick={() => setFilterRole("student")}
                    className={`px-8 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterRole === "student" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:text-gray-600"}`}
                  >Cohort</button>
               </div>
               <button 
                 onClick={() => setShowImportModal(true)}
                 className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 active:scale-95 flex items-center gap-3 whitespace-nowrap"
               >
                 <Award size={16} className="text-blue-400" />
                 Bulk Onboarding
               </button>
            </div>
         </div>

         {/* USER TABLE (IMAGE #1 LIST STYLE) */}
         <section className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-100/30 overflow-hidden">
            <div className="px-14 py-11 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                  <Users size={20} className="text-blue-600" />
                  Cohort Surveillance Grid
               </h3>
               <div className="flex items-center gap-4 bg-white px-8 py-2.5 rounded-full border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Population:</span>
                  <span className="text-sm font-black text-gray-900 tracking-tighter">{filteredUsers.length}</span>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/30 px-14 border-b border-gray-50 font-sans">
                        <th className="px-14 py-7 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Identity</th>
                        <th className="px-14 py-7 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="px-14 py-7 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Score Delta</th>
                        <th className="px-14 py-7 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right pr-20">Control Center</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                     {filteredUsers.length === 0 ? (
                       <tr>
                         <td colSpan={4} className="px-14 py-32 text-center text-gray-300 font-bold uppercase tracking-widest text-xs italic">Awaiting Registry Inputs...</td>
                       </tr>
                     ) : (
                       filteredUsers.map((user) => (
                         <tr key={user._id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                            <td className="px-14 py-9">
                               <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-[1.3rem] flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                     {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                     <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{user.name}</p>
                                     <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400 font-bold">
                                        <Mail size={12} className="opacity-50" />
                                        {user.email}
                                     </div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-14 py-9">
                               <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                 user.role === "admin" 
                                   ? "bg-purple-100 text-purple-700 border-purple-200" 
                                   : "bg-green-50 text-green-700 border-green-100"
                               }`}>
                                 {user.role}
                               </span>
                            </td>
                            <td className="px-14 py-9 text-center">
                               <p className="text-xl font-black text-gray-900 tracking-tighter">{user.totalScore}</p>
                               <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Accumulated</p>
                            </td>
                            <td className="px-14 py-9 text-right pr-20">
                               <div className="flex items-center gap-3 justify-end opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                  <button onClick={() => handleUserStatus(user._id, "suspend")} className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Search size={16} /></button>
                                  <button onClick={() => handleUserStatus(user._id, "delete")} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><MoreVertical size={16} /></button>
                                  <button className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-50">Profile</button>
                               </div>
                            </td>
                         </tr>
                       ))
                     )}
                  </tbody>
               </table>
            </div>
         </section>
      </div>

      {/* BULK IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-gray-100">
              <div className="px-12 py-10 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Cohort Batch Ingestion</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Onboard hundreds of students at once</p>
                 </div>
                 <button onClick={() => setShowImportModal(false)} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900">×</button>
              </div>
              <div className="p-12 space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">CSV Data Stream (Name, Email, Password)</label>
                    <textarea 
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                      placeholder="Sankalp Swaroop, sankalp@example.com, Pass123&#10;John Doe, john@example.com, Quizaro11..."
                      className="w-full h-64 bg-gray-50 border border-gray-100 rounded-3xl p-8 outline-none focus:border-blue-500 font-mono text-xs font-bold transition-all resize-none"
                    />
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowImportModal(false)} className="flex-1 py-5 border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition">Abort</button>
                    <button onClick={handleBulkImport} className="flex-2 px-14 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl shadow-blue-200">Finalize Rollout</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

