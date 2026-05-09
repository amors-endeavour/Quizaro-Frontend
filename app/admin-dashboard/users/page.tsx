"use client";

import { useState, useMemo, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserPlus, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  MoreVertical, 
  ChevronRight,
  Trash2,
  XCircle,
  ShieldAlert,
  ArrowUpDown,
  Mail,
  Calendar,
  Clock,
  ExternalLink
} from "lucide-react";

// MOCK DATA GENERATOR
const generateMockUsers = () => {
  const statuses = ["Active", "Inactive"];
  const names = [
    { name: "Aarav Sharma", handle: "@aarav.sharma", avatar: "A" },
    { name: "Priya Patel", handle: "@priya.patel", avatar: "P" },
    { name: "Rohan Mehta", handle: "@rohan.mehta", avatar: "R" },
    { name: "Sneha Iyer", handle: "@sneha.iyer", avatar: "S" },
    { name: "Vikram Singh", handle: "@vikram.singh", avatar: "V" },
    { name: "Kavya Nair", handle: "@kavya.nair", avatar: "K" },
    { name: "Manish Verma", handle: "@manish.verma", avatar: "M" },
    { name: "Ananya Das", handle: "@ananya.das", avatar: "A" },
    { name: "Darshan Joshi", handle: "@darshan.joshi", avatar: "D" },
    { name: "Neha Kapoor", handle: "@neha.kapoor", avatar: "N" },
  ];

  return Array.from({ length: 125 }, (_, i) => {
    const userSeed = names[i % names.length];
    const status = i < 5 ? "Active" : statuses[Math.floor(Math.random() * statuses.length)];
    const joinedDate = new Date();
    joinedDate.setMonth(joinedDate.getMonth() - Math.floor(Math.random() * 12));
    
    return {
      id: `USR-${1000 + i}`,
      name: userSeed.name,
      handle: userSeed.handle,
      email: `${userSeed.name.toLowerCase().replace(" ", ".")}@example.com`,
      status: status,
      joinedOn: joinedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastActive: `${Math.floor(Math.random() * 23) + 1} hours ago`,
      avatar: userSeed.avatar,
      color: ["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-green-100 text-green-600", "bg-orange-100 text-orange-600"][Math.floor(Math.random() * 4)]
    };
  });
};

const allUsers = generateMockUsers();

export default function UsersManagementPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const itemsPerPage = 10;

  // FILTERED DATA
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'deactivate') => {
    setIsBulkLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`${action} users:`, selectedUsers);
    setSelectedUsers([]);
    setIsBulkLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader title="Users" path={[{ label: "Dashboard" }, { label: "Users" }]} />

      <main className="p-10 lg:p-14 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* STATISTICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Total Users", value: "1,250", sub: "All registered users", icon: <Users size={24} />, color: "purple" },
             { label: "Active Users", value: "1,078", sub: "86% of total users", icon: <UserCheck size={24} />, color: "green", health: "text-green-600" },
             { label: "Inactive Users", value: "172", sub: "14% of total users", icon: <UserMinus size={24} />, color: "orange", health: "text-orange-500" },
             { label: "New Users (This Month)", value: "96", sub: "12% of total users", icon: <UserPlus size={24} />, color: "blue", health: "text-blue-600" },
           ].map((stat, idx) => (
             <div key={idx} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col gap-8 group hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                   <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${
                     stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                     stat.color === 'green' ? 'bg-green-50 text-green-600' :
                     stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                   }`}>
                      {stat.icon}
                   </div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 italic">{stat.label}</p>
                      <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter leading-none">{stat.value}</h3>
                   </div>
                </div>
                <p className={`text-[11px] font-bold uppercase tracking-widest italic ${stat.health || "text-gray-300"}`}>
                   {stat.sub}
                </p>
             </div>
           ))}
        </div>

        {/* TABLE CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div className="flex items-center gap-5 flex-1 max-w-2xl">
              <div className="relative flex-1">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search users..." 
                   className="w-full bg-white border border-gray-100 rounded-2xl pl-16 pr-8 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300 font-bold italic"
                 />
              </div>
              <button className="flex items-center gap-4 px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-500 uppercase tracking-widest italic shadow-sm hover:border-purple-200 transition-all">
                 <Filter size={18} className="text-gray-400" /> Filter <ChevronRight size={14} className="rotate-90" />
              </button>
              <button className="flex items-center gap-4 px-8 py-4 bg-[#7C3AED] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic shadow-lg shadow-purple-900/20 active:scale-95 transition-all">
                 <Plus size={18} /> Add User
              </button>
           </div>
           
           <div className="flex items-center gap-4 self-end lg:self-auto">
              <button className="flex items-center gap-4 px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-500 uppercase tracking-widest italic shadow-sm hover:border-purple-200 transition-all">
                 <Download size={18} /> Export <ChevronRight size={14} className="rotate-90" />
              </button>
           </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[600px] flex flex-col">
           
           {/* BULK ACTIONS BAR */}
           {selectedUsers.length > 0 && (
             <div className="absolute top-0 left-0 w-full bg-purple-600 px-12 py-8 flex items-center justify-between animate-in slide-in-from-top-full duration-500 z-50">
                <div className="flex items-center gap-8">
                   <button onClick={() => setSelectedUsers([])} className="text-white hover:rotate-90 transition-transform">
                      <XCircle size={24} />
                   </button>
                   <p className="text-white text-[13px] font-black uppercase tracking-widest italic">
                      {selectedUsers.length} Users Selected
                   </p>
                </div>
                <div className="flex items-center gap-6">
                   <button 
                     onClick={() => handleBulkAction('deactivate')}
                     disabled={isBulkLoading}
                     className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all disabled:opacity-50"
                   >
                      Deactivate
                   </button>
                   <button 
                     onClick={() => handleBulkAction('delete')}
                     disabled={isBulkLoading}
                     className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                   >
                      {isBulkLoading ? "Processing..." : "Delete Permanently"}
                   </button>
                </div>
             </div>
           )}

           <div className="p-12 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">All Users</h3>
           </div>

           <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-12 py-8 w-20">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                            onChange={toggleSelectAll}
                            className="w-5 h-5 rounded-md border-gray-300 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                          />
                       </th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">User</th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Email</th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Joined On</th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Last Active</th>
                       <th className="px-12 py-8 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className={`group hover:bg-gray-50 transition-all duration-500 cursor-pointer ${selectedUsers.includes(user.id) ? "bg-purple-50/50" : ""}`}>
                         <td className="px-12 py-8">
                            <input 
                              type="checkbox" 
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleSelectUser(user.id)}
                              className="w-5 h-5 rounded-md border-gray-300 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                            />
                         </td>
                         <td className="px-12 py-8">
                            <div className="flex items-center gap-5">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm italic shadow-sm border border-black/5 ${user.color}`}>
                                  {user.avatar}
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[15px] font-black text-gray-900 uppercase tracking-tighter italic leading-none">{user.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{user.handle}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-12 py-8">
                            <p className="text-[13px] font-bold text-gray-500 lowercase italic">{user.email}</p>
                         </td>
                         <td className="px-12 py-8">
                            <span className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                              user.status === 'Active' ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-500 border-red-100"
                            }`}>
                               {user.status}
                            </span>
                         </td>
                         <td className="px-12 py-8">
                            <p className="text-[13px] font-black text-gray-500 uppercase italic leading-none">{user.joinedOn}</p>
                         </td>
                         <td className="px-12 py-8">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic leading-none">{user.lastActive}</p>
                         </td>
                         <td className="px-12 py-8 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"><Eye size={18} /></button>
                               <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical size={18} /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* PAGINATION FOOTER */}
           <div className="p-12 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
              <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic">
                 Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex items-center gap-3">
                 <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(p => p - 1)}
                   className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all disabled:opacity-30 shadow-sm"
                 >
                    <ChevronRight size={18} className="rotate-180" />
                 </button>
                 
                 {[1, 2, 3, "...", 125].map((p, i) => (
                   <button 
                     key={i}
                     onClick={() => typeof p === 'number' && setCurrentPage(p)}
                     className={`w-11 h-11 rounded-xl text-[11px] font-black transition-all ${
                       currentPage === p ? "bg-purple-600 text-white shadow-xl shadow-purple-900/20" : "bg-white border border-gray-100 text-gray-400 hover:border-purple-200"
                     } ${typeof p !== 'number' ? 'cursor-default' : ''} shadow-sm`}
                   >
                      {p}
                   </button>
                 ))}

                 <button 
                   disabled={currentPage === 125}
                   onClick={() => setCurrentPage(p => p + 1)}
                   className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all disabled:opacity-30 shadow-sm"
                 >
                    <ChevronRight size={18} />
                 </button>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
