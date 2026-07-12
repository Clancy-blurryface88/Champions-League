
import React, { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { Round } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "../components/ParticleBackground";
import { LoaderBar } from "../components/ui/LoaderBar";
import { RoundsAnimatedList } from "../components/magicui/RoundsAnimatedList";
import { AnimatedStartButton } from "../components/AnimatedStartButton";
import SemifinalIntroVideo from "../components/SemifinalIntroVideo";

const SEMIFINAL_INTRO_SEEN_KEY = 'wc2026_semifinal_intro_seen';

export default function RoundsList() {
  const [rounds, setRounds] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRound, setPendingRound] = useState(null);
  const navigate = useNavigate();

  // Simple data load function
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication first
      const userData = await User.me().catch((err) => {
        console.log("User not authenticated:", err.message);
        return null;
      });

      if (!userData) {
        console.log("Redirecting to login...");
        await User.loginWithRedirect(window.location.href);
        return;
      }

      setUser(userData);

      // Load rounds
      const roundsData = await Round.list('order');
      setRounds(roundsData);

    } catch (error) {
      console.error("Error loading data:", error);

      if (error.response?.status === 403) {
        console.log("Auth error, redirecting...");
        await User.loginWithRedirect(window.location.href);
        return;
      }

      setError("שגיאה בטעינת הנתונים. אנא רענן את הדף.");
    }

    setLoading(false);
  };

  // Load data only once on mount
  useEffect(() => {
    loadData();
  }, []);

  const goToRound = (round) => {
    navigate(createPageUrl(`Predictions?round_id=${round.id}`));
  };

  const handleRoundClick = (round) => {
    const isSemifinal = round.name?.trim().toLowerCase() === 'semi final';
    const alreadySeenIntro = localStorage.getItem(SEMIFINAL_INTRO_SEEN_KEY) === 'true';

    if (isSemifinal && !alreadySeenIntro) {
      setPendingRound(round);
      return;
    }

    goToRound(round);
  };

  const handleIntroFinish = () => {
    // Only mark it seen once we know the intro actually ran (finished, was
    // skipped, or failed to load) — not just because we attempted to show it.
    localStorage.setItem(SEMIFINAL_INTRO_SEEN_KEY, 'true');
    if (pendingRound) goToRound(pendingRound);
    setPendingRound(null);
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen relative">
        <ParticleBackground />
        <div className="relative z-[1] flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-400 text-lg mb-4">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700">
              רענן דף
            </Button>
          </div>
        </div>
      </div>);

  }

  if (loading) return <LoadingScreen />;

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen relative">
        <ParticleBackground />
        <div className="relative z-[1] flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">ברוך הבא לליגת האלופות</h1>
            <Button onClick={() => User.loginWithRedirect(window.location.href)} className="bg-blue-600 hover:bg-blue-700">
              התחבר כדי להמשיך
            </Button>
          </div>
        </div>
      </div>);

  }

  const displayedRounds = user?.is_admin ? rounds : rounds.filter((r) => r.is_active);

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      <div className="relative z-[1] pt-16">
        <div className="max-w-4xl mx-auto px-4 pb-8 mt-6">
          {/* כפתור חזרה */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Rounds Section */}
          <div className="space-y-4">
            {displayedRounds.length === 0 ?
            <div className="text-center py-12">
                <p className="text-slate-400 text-lg">אין מחזורים זמינים כרגע</p>
                {user?.is_admin &&
              <p className="text-slate-500 text-sm mt-2">
                    עבור לפאנל הניהול כדי ליצור או להפעיל מחזורים
                  </p>
              }
              </div> :

            <RoundsAnimatedList delay={200} delayPerItem={400}>
                {displayedRounds.map((round) =>
              <div
                key={round.id}
                className="bg-slate-800/60 border border-slate-700 hover:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-xl">

                    <div className="px-6 py-2 flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <span className="text-blue-400 text-xl">{round.name}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <AnimatedStartButton
                      onClick={() => handleRoundClick(round)}>

                          לחץ להתחלה
                        </AnimatedStartButton>
                      </div>
                    </div>
                  </div>
              )}
              </RoundsAnimatedList>
            }
          </div>
        </div>
      </div>

      {pendingRound && <SemifinalIntroVideo onFinish={handleIntroFinish} />}
    </div>);

}
