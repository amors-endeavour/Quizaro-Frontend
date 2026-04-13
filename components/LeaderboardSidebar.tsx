"use client";

import React from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Sneha Kapur", score: 98 },
  { rank: 2, name: "Rahul Varma", score: 94 },
  { rank: 3, name: "Ananya Roy", score: 91 },
  { rank: 4, name: "Amit Sharma", score: 88 },
  { rank: 5, name: "Priya Das", score: 85 },
];

export default function LeaderboardSidebar() {
  return (
    <aside className="w-80 bg-white border-l border-gray-100 flex flex-col p-8 shrink-0 overflow-y-auto hidden xl:flex">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-50">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">Global Ranking</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Real-time Stats</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_LEADERBOARD.map((user) => (
          <div 
            key={user.rank}
            className={`group p-5 rounded-[2rem] border transition-all duration-300 flex items-center justify-between ${
              user.rank === 1 
                ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-100 shadow-2xl shadow-blue-100 -translate-y-1 scale-[1.02]" 
                : "bg-gray-50/50 border-gray-50 hover:bg-white hover:border-gray-100 hover:shadow-xl hover:shadow-gray-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                user.rank === 1 ? "bg-white/20" : "bg-white text-gray-400"
              }`}>
                {user.rank === 1 ? <Trophy size={16} /> : user.rank === 2 ? <Medal size={16} className="text-amber-500" /> : user.rank === 3 ? <Award size={16} className="text-blue-400" /> : user.rank}
              </div>
              <div>
                <p className={`text-[11px] font-black tracking-tight ${user.rank === 1 ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${user.rank === 1 ? "text-blue-100" : "text-gray-400"}`}>Score: {user.score}</p>
              </div>
            </div>

            {user.rank === 1 && (
              <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-blue-50">
                Top Rank
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shadow-gray-100 font-black text-sm">
          #42
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Your Position</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Percentile: 84%</p>
        </div>
      </div>

      <div className="mt-auto pt-10 text-center">
        <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.3em] italic">Competitive HUD v1.0</p>
      </div>
    </aside>
  );
}
