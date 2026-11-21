import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/api/supabase";
import { NAME, NewspaperOverlay, useNewspaperFonts } from "./Newspaper";

// The way into "מבט לאלופות" on the home screen (22.11.2026, the user's pick: design 2 with effect 2ג) — a tiny front
// page: the round, the paper's name and the date, the headline, and a red rotated stamp "לקריאה ←" with a ring that
// keeps pinging out. Shown from the issue's publish time (the database lets participants read only published
// issues whose time has come) for 40 hours, so the next night's issue takes its place.
const INK = "#1a1410", RED = "#b3261e";
const paper = "radial-gradient(130% 90% at 30% 10%, #faf5e8, #f3ecdc 60%, #e6dcc6)";
const FR = "'Frank Ruhl Libre', serif";
const SHOW_MS = 40 * 3600e3;

export default function NewspaperButton({ onVisible }) {
  useNewspaperFonts();
  const [issue, setIssue] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    supabase.from("newspaper_issues").select("*").eq("status", "published").eq("rehearsal", false).lte("publish_at", new Date().toISOString())
      .order("publish_at", { ascending: false }).limit(1)
      .then(({ data }) => { const i = data?.[0]; if (alive && i && Date.now() - new Date(i.publish_at).getTime() < SHOW_MS) setIssue(i); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  React.useEffect(() => { onVisible?.(!!issue); }, [issue]);
  if (!issue) return null;
  const f = issue.facts || {}, t = issue.texts || {};
  const round = f.round?.name?.replace(/League Phase\s*-\s*/i, "מחזור ") || "";
  return <>
    <motion.button type="button" onClick={() => setOpen(true)} whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      dir="rtl" aria-label={`${NAME}: ${t.headline || ""}`} className="mx-auto mb-3 flex w-full max-w-[340px] flex-col"
      style={{ height: 64, background: paper, color: INK, padding: "6px 10px", boxShadow: "0 8px 20px rgba(0,0,0,.45)" }}>
      <div className="flex justify-between" style={{ fontFamily: FR, fontSize: 9, fontWeight: 700, borderBottom: `2px solid ${INK}`, paddingBottom: 1 }}><span>{round}</span><span style={{ fontWeight: 900, fontSize: 11 }}>{NAME}</span><span>{f.dm}</span></div>
      <div className="flex flex-1 items-center justify-between">
        <span style={{ fontFamily: FR, fontWeight: 900, fontSize: 21, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.headline}</span>
        <span className="relative" style={{ display: "inline-grid", placeItems: "center", flexShrink: 0 }}>
          <motion.span className="absolute inset-0" style={{ border: `2px solid ${RED}`, borderRadius: 4 }} animate={{ scale: [1, 1.45], opacity: [0.8, 0] }} transition={{ duration: 1.3, repeat: Infinity }} />
          <span style={{ fontFamily: FR, fontSize: 12, fontWeight: 900, color: "#fff", background: RED, padding: "3px 9px", borderRadius: 4, transform: "rotate(-4deg)", whiteSpace: "nowrap" }}>לקריאה ←</span></span></div>
    </motion.button>
    {createPortal(<AnimatePresence>{open && <NewspaperOverlay issue={issue} onClose={() => setOpen(false)} />}</AnimatePresence>, document.body)}
  </>;
}
