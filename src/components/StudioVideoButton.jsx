import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/api/supabase";

// the button's plates lean like the live table's rows; their content stands upright
const SK = { transform: "skewX(-12deg)" }, UNSK = { transform: "skewX(12deg)" };

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
  // after the round's last night the video sums up the whole round too ("והמחזור ה-4")
  const roundNo = round.name?.match(/\d+\s*$/)?.[0]?.trim();
  const roundEnd = summary && !round.canPredict && roundNo ? ` והמחזור ה-${roundNo}` : "";
  const video = round.video || round.studio_video_url; // a cache from before the summary videos has no `video`

  return (
    <>
      {/* slanted plates, like the live table's rows: gold play, the title on blue, the host, a red stripe */}
      <motion.button
        type="button"
        dir="ltr"
        onClick={() => { setEnded(false); setOpen(true); }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="studio-tv mx-auto flex h-14 w-full max-w-[340px] items-stretch gap-1 active:scale-[0.98] transition-transform"
        aria-label={summary ? `צפייה בסיכום הערב, ${round.name}` : `צפייה באולפן ${round.name}`}
      >
        <span className="grid w-14 place-items-center rounded-sm" style={{ ...SK, background: "linear-gradient(135deg,#fde047,#eab308)" }}>
          <span className="studio-tv__play flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#1b1400]" style={UNSK}>
            <span className="ml-0.5 border-y-[6px] border-l-[9px] border-y-transparent border-l-[#facc15]" />
          </span>
        </span>
        <span className="flex flex-1 items-center justify-end overflow-hidden rounded-sm px-3" style={{ ...SK, background: "linear-gradient(90deg,#1e2a78,#0b1440)" }}>
          <b dir="rtl" className="text-right text-[13px] font-black leading-tight text-white" style={UNSK}>{summary ? `סיכום משחקי ${round.day || "הערב"}${roundEnd}` : "אולפן ליגת האלופות"}</b>
        </span>
        <span className="w-16 overflow-hidden rounded-sm" style={SK}>
          <span className="block h-full w-[120%] -ml-[10%] bg-cover" style={{ ...UNSK, backgroundImage: "url(/champions/studio-host.jpg)", backgroundPosition: "center 28%" }} />
        </span>
        <span className="w-2.5 rounded-sm bg-red-600" style={SK} />
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
        .studio-tv__play { animation: studioPulse 1.8s infinite; }
        @keyframes studioPulse { 0% { box-shadow: 0 0 0 0 rgba(27,20,0,.55); } 100% { box-shadow: 0 0 0 10px rgba(27,20,0,0); } }
        @media (prefers-reduced-motion: reduce) { .studio-tv__play { animation: none; } }
      `}</style>
    </>
  );
}
