import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import NightReplay from "@/components/NightReplay";

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
        <NightReplay roundId={params.get("round_id")} initialDate={params.get("date")} onBack={back} />
      </div>
    </div>
  );
}
