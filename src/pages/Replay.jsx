import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import AdminNightReplay from "@/components/admin/AdminNightReplay";

// Participants' "הילוך חוזר" page. Opened from the gold button at the bottom
// of a finished round (?round_id=…) or from the end-of-night push (?date=…).
export default function ReplayPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  // Opened straight from a push there's no history to go back to.
  const back = () => (window.history.length > 1 ? navigate(-1) : navigate(createPageUrl("Dashboard")));

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="max-w-xl mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={back}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all"
            aria-label="חזרה"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <AdminNightReplay publicMode roundId={params.get("round_id")} initialDate={params.get("date")} />
      </div>
    </div>
  );
}
