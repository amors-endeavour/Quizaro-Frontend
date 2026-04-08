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
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Accessing User Directory...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader 
        title="Student Directory" 
        path={[{ label: "Console" }, { label: "Users" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1600px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
         
         {/* FILTER HUB */}
         <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 relative group w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
               <input
                 type="text"
                 placeholder="Search by name, email or ID..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-100/30 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-bold text-gray-900"
               />
            </div>
            <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/30">
               <button 
                 onClick={() => setFilterRole("all")}
                 className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterRole === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:text-gray-600"}`}
               >All Roles</button>
               <button 
                 onClick={() => setFilterRole("student")}
                 className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterRole === "student" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:text-gray-600"}`}
               >Students</button>
            </div>
         </div>

         {/* USER TABLE (IMAGE #1 LIST STYLE) */}
         <section className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 overflow-hidden">
            <div className="px-12 py-10 border-b border-gray-50 flex items-center justify-between">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Users size={18} />
                  Institutional Membership
               </h3>
               <div className="flex items-center gap-4 bg-gray-50/50 px-6 py-2 rounded-full border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Population:</span>
                  <span className="text-xs font-black text-gray-900">{filteredUsers.length}</span>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50">
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User Profile</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Exams Passed</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Total Points</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right pr-16">Joined Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredUsers.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-12 py-20 text-center text-gray-400 font-bold italic">No records found matching your query.</td>
                       </tr>
                     ) : (
                       filteredUsers.map((user) => (
                         <tr key={user._id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                            <td className="px-12 py-8">
                               <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                     {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                     <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{user.name}</p>
                                     <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-bold">
                                        <Mail size={12} className="opacity-50" />
                                        {user.email}
                                     </div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-12 py-8">
                               <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                 user.role === "admin" 
                                   ? "bg-purple-50 text-purple-600 border-purple-100" 
                                   : "bg-blue-50 text-blue-600 border-blue-100"
                               }`}>
                                 {user.role}
                               </span>
                            </td>
                            <td className="px-12 py-8 text-center font-black text-xs text-gray-400 group-hover:text-gray-900 transition-colors">
                               {user.totalTestsAttempted}
                            </td>
                            <td className="px-12 py-8 text-center font-black text-xs text-gray-400 group-hover:text-blue-600 transition-colors">
                               {user.totalScore}
                            </td>
                            <td className="px-12 py-8 text-right pr-16">
                               <div className="flex items-center gap-3 justify-end text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                  <Calendar size={14} className="opacity-50" />
                                  {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
    </div>
  );
}
