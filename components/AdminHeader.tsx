"use client";

import { Search, Settings, Filter, Plus, Bell, ChevronRight, LayoutGrid, List, BarChart3, LogOut, Home, User, Sun, Moon, Monitor, ArrowLeft, Terminal, Shield, Menu } from "lucide-react";
import { getInitials } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { useSidebar } from "@/app/context/SidebarContext";

interface AdminHeaderProps {
  title: string;
  path: { label: string; href?: string }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: { id: string; label: string; icon?: React.ReactNode }[];
  onNew?: () => void;
  onNewBtnLabel?: string;
  onSettings?: () => void;
  onFilter?: () => void;
  onSearchChange?: (val: string) => void;
}

export default function AdminHeader({ 
  title, 
  path, 
  activeTab, 
  onTabChange, 
  tabs,
  onNew, 
  onNewBtnLabel,
  onSettings, 
  onFilter, 
  onSearchChange
}: AdminHeaderProps) {
  const { open: openSidebar } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ type: string; id: string; name: string; extra?: string; icon: any }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock Data for Global Search
  const mockSearchData = {
    quizzes: [
      { id: "1", name: "Science Fundamentals", subject: "Science" },
      { id: "2", name: "JavaScript Advanced", subject: "Computer Science" },
      { id: "3", name: "JEE Mains 2025 Mock", subject: "Entrance" },
      { id: "4", name: "AI Ethics & Logic", subject: "Technology" }
    ],
    users: [
      { id: "u1", name: "Aarav Mehta", email: "aarav@gmail.com" },
      { id: "u2", name: "Priya Sharma", email: "priya@gmail.com" },
      { id: "u3", name: "Sankalp Swaroop", email: "sankalp@quizaro.com" }
    ],
    payments: [
      { id: "#TXN-1024", name: "Transaction #1024", user: "Aarav Mehta" },
      { id: "#TXN-1025", name: "Transaction #1025", user: "Priya Sharma" }
    ]
  };

  useEffect(() => {
    setMounted(true);
    API.get("/user/profile").then(res => setUser(res.data.user || res.data)).catch(() => {});
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results: any[] = [];

      // Filter Quizzes
      mockSearchData.quizzes.forEach(q => {
        if (q.name.toLowerCase().includes(query) || q.subject.toLowerCase().includes(query)) {
          results.push({ type: "Quizzes", id: q.id, name: q.name, extra: q.subject, icon: <LayoutGrid size={14} /> });
        }
      });

      // Filter Users
      mockSearchData.users.forEach(u => {
        if (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)) {
          results.push({ type: "Users", id: u.id, name: u.name, extra: u.email, icon: <User size={14} /> });
        }
      });

      // Filter Payments
      mockSearchData.payments.forEach(p => {
        if (p.id.toLowerCase().includes(query) || p.user.toLowerCase().includes(query)) {
          results.push({ type: "Payments", id: p.id, name: p.id, extra: p.user, icon: <BarChart3 size={14} /> });
        }
      });

      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result: any) => {
    setSearchQuery("");
    setShowResults(false);
    if (result.type === "Quizzes") router.push(`/admin-dashboard/quizzes/unpaid`); // Simplified for demo
    if (result.type === "Users") router.push(`/admin-dashboard/users`);
    if (result.type === "Payments") router.push(`/admin-dashboard/payments`);
  };

  const displayTabs = tabs || [
    { id: 'intelligence', label: 'Paper Registry', icon: <LayoutGrid size={14} /> },
    { id: 'analysis', label: 'Clinical Analysis', icon: <BarChart3 size={14} /> }
  ];

  return (
    <div className="bg-white border-b border-gray-100 flex flex-col sticky top-0 z-[110] transition-all duration-500 shadow-sm">
      <div className="px-8 h-20 flex items-center justify-between gap-12">
        
        {/* MOBILE MENU TRIGGER */}
        <button 
          onClick={openSidebar}
          className="md:hidden p-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
        >
           <Menu size={20} />
        </button>

        {/* SEARCH BAR (Matching Image 1) */}
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            value={searchQuery}
            onFocus={() => setShowResults(true)}
            placeholder="Search quizzes, users, payments..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-14 py-3.5 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
            >
              <LogOut size={16} className="rotate-45" /> {/* Using LogOut as a placeholder for X */}
            </button>
          )}

          {/* SEARCH RESULTS DROPDOWN */}
          {showResults && searchQuery && (
            <div className="absolute top-[120%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300 z-[200]">
              <div className="max-h-[400px] overflow-y-auto">
                {isSearching ? (
                  <div className="p-10 flex items-center justify-center gap-3 text-gray-400">
                     <Plus size={18} className="animate-spin" />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-4">
                    {["Quizzes", "Users", "Payments"].map(category => {
                      const categoryResults = searchResults.filter(r => r.type === category);
                      if (categoryResults.length === 0) return null;
                      return (
                        <div key={category} className="mb-4 last:mb-0">
                          <p className="px-6 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{category}</p>
                          {categoryResults.map(result => (
                            <button
                              key={result.id + result.type}
                              onClick={() => handleResultClick(result)}
                              className="w-full px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-all text-left group"
                            >
                              <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                 {result.icon}
                              </div>
                              <div className="flex-1">
                                <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter italic">{result.name}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{result.extra}</p>
                              </div>
                              <ChevronRight size={14} className="text-gray-200 group-hover:text-blue-600 transition-all" />
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-10 text-center space-y-2">
                     <p className="text-sm font-black text-gray-900 uppercase italic leading-none">No results found</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">We couldn't find anything for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* UTILITIES & PROFILE (Matching Image 1) */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
              <Moon size={20} />
            </button>
            <div className="relative">
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <Bell size={20} />
              </button>
              <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</div>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100" />

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-2xl transition-all group"
            >
              <div className="text-right hidden sm:block">
                <h4 className="text-sm font-bold text-gray-900 leading-none">Admin</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                {user ? getInitials(user.name) : <User size={22} />}
              </div>
            </button>
            
            {showMenu && (
              <div className="absolute top-[120%] right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top-6 duration-700 z-[200]">
                 <div className="space-y-2">
                    <button 
                      onClick={() => { setShowMenu(false); router.push("/admin-dashboard/settings"); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all duration-500 uppercase tracking-widest border border-transparent"
                    >
                       <div className="flex items-center gap-3">
                          <Settings size={16} /> Admin Settings
                       </div>
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-500 uppercase tracking-widest border border-transparent"
                    >
                       <div className="flex items-center gap-3">
                          <LogOut size={16} /> Log out
                       </div>
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COGNITIVE NAVIGATION TABS */}
      {onTabChange && (
        <div className="px-10 flex items-center gap-12 overflow-x-auto no-scrollbar relative">
          <div className="absolute left-0 bottom-0 h-px w-full bg-gray-50" />
          {displayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-4 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-b-4 whitespace-nowrap italic relative group ${
                activeTab === tab.id 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-400 hover:text-gray-900"
              }`}
            >
              <span className={`transition-all duration-500 ${activeTab === tab.id ? "scale-110 rotate-3" : "group-hover:scale-110"}`}>
                 {tab.icon}
              </span>
              {tab.label}
              {activeTab === tab.id && (
                 <div className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_12px_#2563eb]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
