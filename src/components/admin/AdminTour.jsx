import React, { useEffect, useState } from "react";
import { AppSettings } from "@/api/entities";
import OrbitSpinner from "@/components/OrbitSpinner";

// The round 5 tour (RoundTour.jsx): on / off for everyone, and "show it again to everyone" — what each
// device has seen is kept on the device, so the reset is a time: a part finished before it counts as not seen.
export default function AdminTour() {
  const [row, setRow] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const list = await AppSettings.list();
    setRow(list[0] || {});
  };
  useEffect(() => { load().catch(() => setRow({})); }, []);

  const save = async (patch, done) => {
    setBusy(true);
    setMsg("");
    try {
      const saved = row?.id ? await AppSettings.update(row.id, patch) : await AppSettings.create(patch);
      setRow(saved);
      setMsg(done);
    } catch (e) {
      setMsg(`שגיאה: ${e.message || e}`);
    }
    setBusy(false);
  };

  if (!row) return <div className="flex justify-center py-12"><OrbitSpinner size={40} /></div>;
  const on = row.tour_enabled !== false;
  const resetAt = row.tour_reset_at ? new Date(row.tour_reset_at) : null;

  return (
    <div dir="rtl" className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold text-white">הדרכת מחזור 5</h2>

      <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-white font-semibold">הדרכה פעילה</div>
          <div className="text-sm text-slate-400">כשכבוי, ההדרכה לא מופיעה לאף אחד</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          disabled={busy}
          onClick={() => save({ tour_enabled: !on }, on ? "ההדרכה כובתה" : "ההדרכה הופעלה")}
          className="relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50"
          style={{ background: on ? "#22c55e" : "#475569" }}
        >
          <span className="absolute top-1 h-5 w-5 rounded-full bg-white transition-all" style={{ right: on ? 4 : 24 }} />
        </button>
      </div>

      <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-3">
        <div>
          <div className="text-white font-semibold">איפוס צפייה לכולם</div>
          <div className="text-sm text-slate-400">ההדרכה תופיע שוב מההתחלה לכל המשתמשים, בכניסה הבאה למחזור 5</div>
          <div className="text-xs text-slate-500 mt-1">
            איפוס אחרון: {resetAt ? resetAt.toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" }) : "לא בוצע"}
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => save({ tour_reset_at: new Date().toISOString() }, "אופס – ההדרכה תופיע שוב לכולם")}
          className="w-full rounded-lg py-2.5 font-bold text-slate-900 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#fde047,#eab308)" }}
        >
          אפס צפייה לכולם
        </button>
      </div>

      {msg && <p className="text-sm text-emerald-400">{msg}</p>}
    </div>
  );
}
