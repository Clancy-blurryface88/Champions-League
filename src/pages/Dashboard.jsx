import React, { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import TournamentHeader from "../components/TournamentHeader";
import AppBackground from "../components/AppBackground";
import { LoaderBar } from "../components/ui/LoaderBar";
// Import the new button component - this import is no longer needed but will be removed by user on a later refactor
import { RoundsMarquee } from "../components/RoundsMarquee"; // NEW: Import RoundsMarquee
import { Round } from "@/api/entities"; // NEW: Import Round entity
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/ui/LottieAnimation";
import RoundInsightsTicker from "../components/RoundInsightsTicker";
import LiveLeaderboard from "../components/LiveLeaderboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rounds, setRounds] = useState([]);
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

      // NEW: Load rounds for marquee
      try {
        const roundsData = await Round.list('order');
        setRounds(roundsData);
      } catch (roundsError) {
        console.error("Error loading rounds:", roundsError);
        setRounds([]); // Ensure rounds is an empty array on error
      }

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

  const handleAdminPanel = () => {
    navigate(createPageUrl("Admin"));
  };

  const handleRoundSelect = (round) => {
    navigate(createPageUrl(`Predictions?round_id=${round.id}`));
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen relative">
        <AppBackground />
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
        <AppBackground />
        <div className="relative z-[1] flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">ברוך הבא ל-World Cup 2026</h1>
            <Button onClick={() => User.loginWithRedirect(window.location.href)} className="bg-blue-600 hover:bg-blue-700">
              התחבר כדי להמשיך
            </Button>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-[calc(100vh-7rem)] relative flex flex-col">
      <AppBackground />

      <div className="relative z-[1] flex-1 flex flex-col items-center justify-center w-full gap-10 md:gap-16 pt-8 pb-12">
        <TournamentHeader />

        {/* Live Leaderboard Section — same table/effects as the live panel */}
        <div className="w-full max-w-md mx-auto px-4">
          <LiveLeaderboard />
        </div>

        {/* Rounds Marquee Section */}
        {rounds.length > 0 && (
          <div className="w-full max-w-6xl mx-auto px-4">
            <RoundsMarquee rounds={rounds} user={user} onRoundClick={handleRoundSelect} />
          </div>
        )}

        {/* Admin Panel Button */}
        {user?.is_admin && (
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="flex justify-center">
              <Button
                onClick={handleAdminPanel}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600"
                variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        )}

      </div>

      <div className="relative z-[1] mt-auto w-full">
        <RoundInsightsTicker user={user} />
      </div>
    </div>
  );
}