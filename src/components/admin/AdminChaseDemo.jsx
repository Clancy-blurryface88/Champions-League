import React, { useState } from "react";
import { TrendingUp, Target, CheckCircle, XCircle, Minus, ChevronUp, Zap } from "lucide-react";

const MOCK_PLAYERS = [
  { id: 1, name: "יוסי כהן",    points: 198, position: 1 },
  { id: 2, name: "מיכל לוי",   points: 174, position: 2 },
  { id: 3, name: "דני אברהם",  points: 161, position: 3 },
  { id: 4, name: "אתה",         points: 145, position: 4, isMe: true },
  { id: 5, name: "רות שמיר",   points: 132, position: 5 },
];

const MOCK_REMAINING = [
  {
    id: 1, match: "ארגנטינה vs צרפת", round: "רבע גמר",
    myPick: "ארגנטינה", theirPick: "צרפת",
    myPoints: 5, theirPoints: 5, swing: true,
  },
  {
    id: 2, match: "ספרד vs ברזיל", round: "רבע גמר",
    myPick: "ספרד", theirPick: "ספרד",
    myPoints: 5, theirPoints: 5, swing: false,
  },
  {
    id: 3, match: "גרמניה vs אנגליה", round: "חצי גמר",
    myPick: "גרמניה", theirPick: "אנגליה",
    myPoints: 7, theirPoints: 7, swing: true,
  },
  {
    id: 4, match: "פורטוגל vs הולנד", round: "חצי גמר",
    myPick: "הולנד", theirPick: "הולנד",
    myPoints: 7, theirPoints: 7, swing: false,
  },
  {
    id: 5, match: "גמר: ארגנטינה vs גרמניה", round: "גמר",
    myPick: "ארגנטינה", theirPick: "גרמניה",
    myPoints: 10, theirPoints: 10, swing: true,
  },
];

const MAX_GAINABLE = MOCK_REMAINING.reduce((s, m) => s + m.myPoints, 0);
const MAX_SWING = MOCK_REMAINING.filter(m => m.swing).reduce((s, m) => s + m.myPoints + m.theirPoints, 0);

const getRankColor = (pos) => {
  if (pos === 1) return "#FFD700";
  if (pos === 2) return "#C0C0C0";
  if (pos === 3) return "#CD7F32";
  return "rgba(255,255,255,0.45)";
};

export default function AdminChaseDemo() {
  const [chasing, setChasing] = useState(null);

  const me = MOCK_PLAYERS.find(p => p.isMe);
  const target = chasing ? MOCK_PLAYERS.find(p => p.id === chasing) : null;
  const gap = target ? target.points - me.points : 0;
  const canOvertake = gap <= MAX_GAINABLE;
  const swingMatches = MOCK_REMAINING.filter(m => m.swing);

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">דמו: מה אני צריך לעקוף?</h2>
          <p className="text-slate-400 text-sm">הקלק על שחקן מעליך כדי לראות את הניתוח</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-3">טבלת מובילים</p>
          {MOCK_PLAYERS.map((player) => (
            <div
              key={player.id}
              onClick={() => !player.isMe && player.position < me.position && setChasing(player.id === chasing ? null : player.id)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                ${player.isMe ? "border-2 border-blue-500/60 bg-blue-500/10" : ""}
                ${!player.isMe && player.position < me.position ? "cursor-pointer hover:bg-slate-700/60" : ""}
                ${chasing === player.id ? "border border-yellow-400/50 bg-yellow-400/5" : "border border-transparent"}
              `}
            >
              <span className="text-lg font-black w-5 text-center" style={{ color: getRankColor(player.position) }}>
                {player.position}
              </span>
              <span className={`flex-1 text-sm font-semibold ${player.isMe ? "text-blue-300" : "text-slate-200"}`}>
                {player.name}
              </span>
              <span className="text-green-400 text-sm font-bold">{player.points} נק'</span>

              {!player.isMe && player.position < me.position && (
                <button
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all
                    ${chasing === player.id
                      ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/40"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                >
                  <Target className="w-3 h-3" />
                  לעקוף
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Chase Panel */}
        <div className="space-y-4">
          {!target ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center h-full min-h-[300px]">
              <Target className="w-10 h-10 text-slate-600" />
              <p className="text-slate-500 text-sm">בחר שחקן מעליך בטבלה<br />כדי לראות מה אתה צריך</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ChevronUp className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold text-sm">מרדף אחרי {target.name}</span>
                  </div>
                  {canOvertake ? (
                    <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> ניתן לעקוף
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-full">
                      <XCircle className="w-3 h-3" /> לא ניתן
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-900/60 rounded-xl p-3">
                    <p className="text-2xl font-black text-red-400">-{gap}</p>
                    <p className="text-[11px] text-slate-500 mt-1">פיגור נוכחי</p>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-3">
                    <p className="text-2xl font-black text-blue-400">+{MAX_GAINABLE}</p>
                    <p className="text-[11px] text-slate-500 mt-1">מקסימום שלי</p>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-3">
                    <p className="text-2xl font-black text-yellow-400">+{MAX_SWING}</p>
                    <p className="text-[11px] text-slate-500 mt-1">swing אפשרי</p>
                  </div>
                </div>

                {canOvertake && (
                  <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400 shrink-0" />
                    <p className="text-green-300 text-xs">
                      אם תצדק ב-{swingMatches.length} משחקי המפתח ו{target.name} יטעה — תעקוף ב-<strong>{MAX_SWING - gap} נקודות</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Swing Matches */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-3">משחקי מפתח — ניחשתם שונה</p>
                <div className="space-y-2">
                  {MOCK_REMAINING.map((match) => (
                    <div
                      key={match.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-xs
                        ${match.swing ? "bg-yellow-400/5 border border-yellow-400/20" : "bg-slate-900/40 border border-slate-700/50 opacity-50"}`}
                    >
                      <div className="shrink-0">
                        {match.swing
                          ? <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                          : <Minus className="w-3.5 h-3.5 text-slate-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-300 font-medium truncate">{match.match}</p>
                        <p className="text-slate-500">{match.round}</p>
                      </div>
                      <div className="text-left shrink-0 space-y-0.5">
                        <p className="text-blue-300">אני: <strong>{match.myPick}</strong></p>
                        <p className="text-orange-300">{target.name.split(" ")[0]}: <strong>{match.theirPick}</strong></p>
                      </div>
                      {match.swing && (
                        <span className="text-yellow-400 font-bold shrink-0">±{match.myPoints}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
