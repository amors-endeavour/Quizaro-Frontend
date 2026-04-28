"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Medal, Award, TrendingUp, Activity } from "lucide-react";
import API from "@/app/lib/api";

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
}

export default function LeaderboardSidebar() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userStats, setUserStats] = useState({ rank: null, percentile: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get("/admin/leaderboard/global");
        setLeaderboard(data.leaderboard || []);
        setUserStats({ 
          rank: data.userRank, 
          percentile: data.percentile 
        });
      } catch (err) {
        console.error("Leaderboard acquisition failed");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <aside className="w-80 bg-white dark:bg-[#050816] border-l border-gray-100 dark:border-gray-800 flex flex-col p-10 shrink-0 overflow-y-auto hidden xl:flex transition-all duration-300">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-gray-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-blue-800/30 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/5">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none italic">Global Matrix</h3>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-2 italic leading-none">Institutional Pulse</p>
        </div>
      </div>

      <div className="space-y-5 flex-1">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-6">
             <Activity size={40} className="text-blue-600 dark:text-blue-400 animate-spin opacity-50" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 italic">Accessing Grid...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-24 text-center">
             <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-gray-400 dark:text-gray-700 italic">Awaiting Initial <br/> Performance Data</p>
          </div>
        ) : (
          leaderboard.map((user) => (
            <div 
              key={user.rank}
              className={`group p-6 rounded-[2.5rem] border transition-all duration-500 flex items-center justify-between cursor-pointer ${
                user.rank === 1 
                  ? "bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-900/30 -translate-y-1 scale-[1.05]" 
                  : "bg-gray-50 dark:bg-[#0a0f29] border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-xl"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${
                  user.rank === 1 ? "bg-white/20 text-white" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {user.rank === 1 ? <Trophy size={20} /> : user.rank === 2 ? <Medal size={20} className="text-amber-500" /> : user.rank === 3 ? <Award size={20} className="text-blue-600 dark:text-blue-400" /> : user.rank}
                </div>
                <div>
                  <p className={`text-sm font-black tracking-tighter uppercase italic leading-none ${user.rank === 1 ? "text-white" : "text-gray-900 dark:text-white"}`}>{user.name}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-2 leading-none ${user.rank === 1 ? "text-blue-100" : "text-gray-400 dark:text-gray-500"}`}>Score: {user.score}%</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && userStats.rank !== null && (
        <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] border border-blue-100 dark:border-blue-800/30 flex items-center gap-5 animate-in slide-in-from-bottom-5 duration-700 backdrop-blur-md">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/30 font-black text-lg italic">
            #{userStats.rank}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Your Identity Position</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest italic leading-none">Percentile: {userStats.percentile}%</p>
          </div>
        </div>
      )}

      <div className="mt-12 pt-10 border-t border-gray-50 dark:border-gray-800 text-center">
        <p className="text-[10px] text-gray-300 dark:text-gray-700 font-black uppercase tracking-widest italic leading-relaxed">Institutional HUD <br/> v4.5.1 Live</p>
      </div>
    </aside>
  );
}
