import TeamFlag from "@/components/TeamFlag";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export default function MatchScoringRulesModal({ isOpen, onClose, match }) {
  if (!match) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white p-6 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="tracking-tight text-center text-xl font-bold text-white flex items-center justify-center gap-2">ניקוד


          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="space-y-6">
            {/* Match teams display */}
            <div className="flex items-start justify-center w-full p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-start gap-3 flex-1 justify-end">
                <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-10 h-10 " />
                <div className="text-slate-50 text-sm font-medium text-left leading-tight pt-2.5">
                  {match.team_a.split(' ').map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                </div>
              </div>
              
              <div className="text-white font-bold text-lg mx-6 pt-1.5">VS</div>
              
              <div className="flex items-start gap-3 flex-1 justify-start">
                <div className="text-slate-50 text-sm font-medium text-right leading-tight pt-2.5">
                  {match.team_b.split(' ').map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                </div>
                <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-10 h-10 " />
              </div>
            </div>

            {/* Match outcome points */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400 flex items-center justify-center gap-2 border-b border-slate-600 pb-2">
                <Trophy className="w-5 h-5" />
                תוצאת המשחק
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="font-medium">ניצחון ביתי</span>
                  <Badge className="bg-green-600/30 text-green-300 px-3 py-1 text-sm font-bold">
                    {match.home_win_points || 0} נקודות
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="font-medium">תיקו</span>
                  <Badge className="bg-slate-700 text-slate-50 px-3 py-1 text-sm font-bold inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80">
                    {match.draw_points || 0} נקודות
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="font-medium">ניצחון חוץ</span>
                  <Badge className="bg-blue-600/30 text-blue-300 px-3 py-1 text-sm font-bold">
                    {match.away_win_points || 0} נקודות
                  </Badge>
                </div>
              </div>
            </div>

            {/* BTTS points */}
            <div className="space-y-4">
              <h3 className="text-green-400 pb-2 text-lg font-semibold flex items-center justify-center gap-2 border-b border-slate-600">שתי קבוצות כובשות


              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="text-green-400 font-medium">כן </span>
                  <Badge className="bg-slate-700 text-green-400 px-3 py-1 text-sm font-bold inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80">
                    {match.btts_yes_points || 0} נקודות
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="text-rose-500 font-medium">לא </span>
                  <Badge className="bg-gray-600/30 text-rose-500 px-3 py-1 text-sm font-bold inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80">
                    {match.btts_no_points || 0} נקודות
                  </Badge>
                </div>
              </div>
            </div>

            {/* Goals range points */}
            <div className="space-y-4">
              <h3 className="text-sky-400 pb-2 text-lg font-semibold flex items-center justify-center gap-2 border-b border-slate-600">טווח שערים במשחק


              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="font-medium">0-2 שערים סה"כ</span>
                  <Badge className="bg-gray-700 text-blue-400 px-3 py-1 text-sm font-bold inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80">
                    {match.goals_0_2_points || 0} נקודות
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="font-medium">3-4 שערים סה"כ</span>
                  <Badge className="bg-gray-700 text-blue-400 px-3 py-1 text-sm font-bold inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80">
                    {match.goals_3_4_points || 0} נקודות
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-700/40 p-3 rounded-lg flex-row-reverse">
                  <span className="font-medium">5+ שערים סה"כ</span>
                  <Badge className="bg-gray-700 text-blue-400 px-3 py-1 text-sm font-bold inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80">
                    {match.goals_5_plus_points || 0} נקודות
                  </Badge>
                </div>
              </div>
            </div>

            {/* Footer note with extra spacing */}
            <div className="text-slate-800 pt-4 pb-2 text-sm border-t border-slate-600">
              ניקוד זה נקבע על ידי מנהל הטורניר
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);

}