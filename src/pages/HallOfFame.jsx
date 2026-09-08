import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { HallOfFame } from "@/api/entities";
import HallOfFameView from "@/components/HallOfFame/HallOfFameView";
import CircleLoader from "@/components/CircleLoader";

export default function HallOfFamePage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    HallOfFame.list("sort_order")
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="w-7 h-7 flex-shrink-0" style={{ color: "#f5c518" }} />
          <h1 className="text-2xl sm:text-3xl font-black text-white text-center" style={{ fontFamily: "'Syne', sans-serif" }}>
            היכל התהילה
          </h1>
          <Medal className="w-7 h-7 flex-shrink-0" style={{ color: "#f5c518" }} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <CircleLoader size={50} />
          </div>
        ) : (
          <HallOfFameView entries={entries} showTitle={false} />
        )}
      </div>
    </div>
  );
}
