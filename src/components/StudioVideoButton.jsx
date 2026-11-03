import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/api/supabase";

// TV noise for the screen ("snow"), drawn once as an SVG tile
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")";

// The round's studio video is offered from the moment it is uploaded until every
// participant has predicted all of the round's matches, or at the latest until its
// first kickoff. Returns the round to show, or null.
async function findStudioRound(rounds) {
  const withVideo = rounds.filter((r) => r.studio_video_url);
  if (!withVideo.length) return null;
  // all the checks at once, not one after the other
  const [{ count: players }, ...perRound] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    ...withVideo.map(async (round) => {
      const { data: matches } = await supabase.from("matches").select("id, match_date").eq("round_id", round.id);
      if (!matches?.length) return null;
      const firstKickoff = Math.min(...matches.map((m) => new Date(m.match_date).getTime()));
      if (Date.now() >= firstKickoff) return null;
      const { count: predicted } = await supabase.from("predictions").select("id", { count: "exact", head: true }).in("match_id", matches.map((m) => m.id));
      return { round, firstKickoff, predicted, total: matches.length };
    }),
  ]);
  const hit = perRound.find((x) => x && !(players && x.predicted >= players * x.total));
  return hit ? { ...hit.round, video: hit.round.studio_video_url, kind: "studio", firstKickoff: hit.firstKickoff } : null;
}

// The night's summary video (rounds.summary_video_url) is offered from its upload until the
// next kickoff after it (the second night), and for 48 hours at most when no match follows.
async function findSummaryRound(rounds) {
  const latest = rounds.filter((r) => r.summary_video_url && r.summary_video_at)
    .sort((a, b) => new Date(b.summary_video_at) - new Date(a.summary_video_at))[0];
  if (!latest) return null;
  const at = new Date(latest.summary_video_at).getTime();
  const { data: next } = await supabase.from("matches").select("match_date, round_id")
    .gt("match_date", latest.summary_video_at).order("match_date").limit(1);
  const until = Math.min(next?.[0] ? new Date(next[0].match_date).getTime() : Infinity, at + 48 * 3600e3);
  if (Date.now() >= until) return null;
  // after the video, "predict now" only when the round still has a match to predict
  const canPredict = next?.[0]?.round_id === latest.id;
  // the night it sums up: the day of the last kickoff before the upload ("יום שלישי")
  const { data: prev } = await supabase.from("matches").select("match_date")
    .eq("round_id", latest.id).lt("match_date", latest.summary_video_at).order("match_date", { ascending: false }).limit(1);
  const day = prev?.[0] ? new Date(prev[0].match_date).toLocaleDateString("he-IL", { weekday: "long", timeZone: "Asia/Jerusalem" }) : "";
  return { ...latest, video: latest.summary_video_url, kind: "summary", canPredict, day, firstKickoff: until };
}

// the studio video before a round comes first; otherwise the latest night summary
async function findVideo(rounds) {
  return (await findStudioRound(rounds)) || (await findSummaryRound(rounds));
}

// the last answer is remembered, so on the next visit the TV is there from the first frame
const CACHE = "studio_tv_round";
const readCache = () => {
  try { const c = JSON.parse(localStorage.getItem(CACHE) || "null"); return c && Date.now() < c.firstKickoff ? c : null; } catch { return null; }
};
const writeCache = (r) => { try { r ? localStorage.setItem(CACHE, JSON.stringify(r)) : localStorage.removeItem(CACHE); } catch {} };

export default function StudioVideoButton({ rounds, onPredict, onVisible }) {
  const [round, setRound] = useState(readCache);
  const [open, setOpen] = useState(false);
  const [ended, setEnded] = useState(false);

  // the layout tightens in the same frame the TV appears
  useEffect(() => { onVisible?.(!!round); }, [round]);

  useEffect(() => {
    let alive = true;
    if (!rounds.length) return;
    findVideo(rounds).then((r) => { if (!alive) return; setRound(r); writeCache(r); }).catch(() => {});
    return () => { alive = false; };
  }, [rounds]);

  if (!round) return null;
  const summary = round.kind === "summary";
  const video = round.video || round.studio_video_url; // a cache from before the summary videos has no `video`

  return (
    <>
      {/* a small TV with snow that switches on, the host behind it; centered under the rounds */}
      <motion.button
        type="button"
        onClick={() => { setEnded(false); setOpen(true); }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="studio-tv mx-auto block w-full max-w-[340px] rounded-xl p-[5px] bg-[#111827] shadow-[0_0_0_1px_#374151,0_12px_30px_rgba(0,0,0,0.7)] active:scale-[0.98] transition-transform"
        aria-label={summary ? `צפייה בסיכום הערב, ${round.name}` : `צפייה באולפן ${round.name}`}
      >
        <div className="studio-tv__screen relative h-[118px] rounded-lg overflow-hidden bg-center bg-cover" style={{ backgroundImage: "url(/champions/studio-host.jpg)", backgroundPosition: "center 28%" }}>
          <div className="studio-tv__snow absolute inset-0 mix-blend-overlay" style={{ backgroundImage: NOISE }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px)" }} />
          <span className="absolute top-2 right-2 inline-flex items-center gap-1.5 rounded-[3px] bg-red-600 px-2 py-px text-[11px] font-bold tracking-[0.12em] text-white" style={{ fontFamily: "Oswald, sans-serif" }}>
            <i className="studio-tv__dot h-1.5 w-1.5 rounded-full bg-white" />LIVE
          </span>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-2.5 py-2" style={{ background: "linear-gradient(0deg, rgba(2,6,23,.9), transparent)" }}>
            <b className="text-[15px] font-black text-white">{summary ? `📺 סיכום משחקי ${round.day || "הערב"}` : "📺 אולפן ליגת האלופות"}</b>
            <span className="studio-tv__play flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400">
              <span className="ml-0.5 border-y-[7px] border-l-[11px] border-y-transparent border-l-[#1b1400]" />
            </span>
          </div>
        </div>
      </motion.button>

      {/* rendered on <body>, above the app's top bars (ticker, menu), so the X is always reachable */}
      {createPortal(<AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center"
            style={{ zIndex: 2147483000 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {/* loaded only now, on tap, so the home screen stays light */}
            <video
              src={video}
              poster="/champions/studio-host.jpg"
              className="h-full w-full object-contain"
              autoPlay playsInline controls
              onEnded={() => setEnded(true)}
            />
            <button type="button" onClick={() => setOpen(false)} aria-label="סגירה"
              className="absolute top-[max(14px,env(safe-area-inset-top))] left-3.5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
              <X className="h-5 w-5" />
            </button>
            {ended && (!summary || round.canPredict) && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => { setOpen(false); onPredict(round); }}
                className="absolute inset-x-8 bottom-[max(84px,calc(env(safe-area-inset-bottom)+64px))] rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 py-3.5 text-lg font-black text-[#1b1400]"
              >
                לנחש עכשיו ⚽
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>, document.body)}

      <style>{`
        .studio-tv__snow { opacity: .3; animation: studioSnow .25s steps(2) infinite, studioChannel 5s infinite; }
                .studio-tv__dot { animation: studioBlink 1s infinite; }
        .studio-tv__play { animation: studioPulse 1.8s infinite; }
        @keyframes studioSnow { 50% { background-position: 40px 20px; } }
        /* channel switch: every few seconds a moment of full snow, then the host again */
        @keyframes studioChannel { 0%, 84%, 100% { opacity: .3; } 86%, 92% { opacity: 1; mix-blend-mode: normal; } }
        @keyframes studioBlink { 50% { opacity: .2; } }
        @keyframes studioPulse { 0% { box-shadow: 0 0 0 0 rgba(250,204,21,.55); } 100% { box-shadow: 0 0 0 14px rgba(250,204,21,0); } }
        @media (prefers-reduced-motion: reduce) { .studio-tv__snow, .studio-tv__dot, .studio-tv__play { animation: none; } }
      `}</style>
    </>
  );
}
