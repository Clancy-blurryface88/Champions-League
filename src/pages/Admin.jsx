
import React, { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Target, Trophy, Calculator, Image, Users, User as UserIcon, Eye, BarChart3, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminRounds from "../components/admin/AdminRounds";
import AdminMatches from "../components/admin/AdminMatches";
import AdminLogos from "../components/admin/AdminLogos";
import AdminPredictions from "../components/admin/AdminPredictions";
import AdminUsers from "../components/admin/AdminUsers";
import AdminScoring from "../components/admin/AdminScoring";
import AdminMatchPredictions from "../components/admin/AdminMatchPredictions";
import AdminLiveData from "../components/admin/AdminLiveData";
import AdminImportMatches from "../components/admin/AdminImportMatches";
import AdminReset from "../components/admin/AdminReset";
import { LoaderBar } from "../components/ui/LoaderBar";

// Sidebar Navigation Item Component
const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={`w-full justify-start text-base px-4 py-6 transition-all duration-200 ${
      isActive
        ? "bg-slate-700/50 text-white font-semibold"
        : "text-slate-400 hover:bg-slate-700/30 hover:text-white"
    }`}
  >
    <Icon className="w-5 h-5 mr-4" />
    {label}
  </Button>
);

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('rounds');
  const [contentKey, setContentKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (!currentUser?.is_admin) {
        navigate(createPageUrl("Dashboard"));
        return;
      }
    } catch (error) {
      navigate(createPageUrl("Dashboard"));
      return;
    }
    setLoading(false);
  };

  if (loading) return <LoadingScreen />;

  const renderContent = () => {
    switch (activeView) {
      case 'rounds': return <AdminRounds />;
      case 'matches': return <AdminMatches />;
      case 'predictions': return <AdminPredictions />;
      case 'match-predictions': return <AdminMatchPredictions />;
      case 'users': return <AdminUsers />;
      case 'logos': return <AdminLogos />;
      case 'scoring': return <AdminScoring onUpdateComplete={() => {}} />;
      case 'live-data': return <AdminLiveData />;
      case 'import': return <AdminImportMatches />;
      case 'reset': return <AdminReset />;
      default: return <AdminRounds />;
    }
  };

  const navItems = [
    { id: 'rounds', label: 'Rounds', icon: Target },
    { id: 'matches', label: 'Matches', icon: Trophy },
    { id: 'predictions', label: 'User Predictions', icon: Users },
    { id: 'match-predictions', label: 'View by Match', icon: Eye },
    { id: 'users', label: 'Manage Users', icon: UserIcon },
    { id: 'logos', label: 'Team Logos', icon: Image },
    { id: 'scoring', label: 'Calculate Scores', icon: Calculator },
    { id: 'live-data', label: 'Live Data Test', icon: BarChart3 },
    { id: 'import', label: 'ייבוא משחקים', icon: Download },
    { id: 'reset',   label: 'Reset Center',  icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400">Manage tournament settings and data</p>
          </div>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
               <h3 className="text-sm font-semibold text-slate-500 uppercase px-4 pt-2">NAVIGATION</h3>
               {navItems.map((item) => (
                 <NavItem
                   key={item.id}
                   icon={item.icon}
                   label={item.label}
                   isActive={activeView === item.id}
                   onClick={() => setActiveView(item.id)}
                 />
               ))}
            </div>
          </aside>

          {/* Content — key forces remount when scoring completes */}
          <main className="flex-1">
            <div key={`${activeView}-${contentKey}`}>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
