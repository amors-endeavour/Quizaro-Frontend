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
        const { data } = await API.get("/user/leaderboard");
        // Check if data is array or has leaderboard property
        const list = Array.isArray(data) ? data : data.leaderboard || [];
        setLeaderboard(list.slice(0, 5).map((u: any, idx: number) => ({
          rank: idx + 1,
          name: u.name,
          score: u.points || 0
        })));
        setUserStats({ 
          rank: list.findIndex((u: any) => u.name === "You") + 1 || null, 
          percentile: 0 
        });
      } catch (err) {
        console.error("Leaderboard acquisition failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <aside className="w-80 bg-white border-l-2 border-gray-50 flex flex-col p-10 shrink-0 overflow-y-auto hidden xl:flex transition-all duration-300 relative shadow-sm">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 border-2 border-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none italic">Global Matrix</h3>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-2 italic leading-none">Institutional Pulse</p>
        </div>
      </div>

      <div className="space-y-5 flex-1">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-6">
             <Activity size={40} className="text-blue-600 animate-spin opacity-50" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Accessing Grid...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-24 text-center">
             <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-gray-400 italic">Awaiting Initial <br/> Performance Data</p>
          </div>
        ) : (
          leaderboard.map((user) => (
            <div 
              key={user.rank}
              className={`group p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between cursor-pointer ${
                user.rank === 1 
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-900/30 -translate-y-1 scale-[1.05]" 
                  : "bg-gray-50 border-gray-50 hover:bg-white hover:border-blue-600 hover:shadow-xl"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 shadow-sm border ${
                  user.rank === 1 ? "bg-white/20 text-white border-white/20" : "bg-white border-gray-100 text-gray-500"
                }`}>
                  {user.rank === 1 ? <Trophy size={20} /> : user.rank === 2 ? <Medal size={20} className="text-amber-500" /> : user.rank === 3 ? <Award size={20} className="text-blue-600" /> : user.rank}
                </div>
                <div>
                  <p className={`text-sm font-black tracking-tighter uppercase italic leading-none ${user.rank === 1 ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-2 leading-none ${user.rank === 1 ? "text-blue-100" : "text-gray-400"}`}>Score: {user.score}%</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && userStats.rank !== null && (
        <div className="mt-12 p-8 bg-blue-50 rounded-[3rem] border-2 border-blue-100 flex items-center gap-5 animate-in slide-in-from-bottom-5 duration-700 shadow-sm">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/30 font-black text-lg italic border-2 border-white/20">
            #{userStats.rank}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic leading-none">Your Identity Position</p>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest italic leading-none">Percentile: {userStats.percentile}%</p>
          </div>
        </div>
      )}

      <div className="mt-12 pt-10 border-t-2 border-gray-50 text-center">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-relaxed">Institutional HUD <br/> v4.5.1 Live</p>
      </div>
    </aside>
  );
}
