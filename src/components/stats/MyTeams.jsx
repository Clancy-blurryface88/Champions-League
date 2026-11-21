import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { User, Prediction, Match } from "@/api/entities";
import { teamPoints } from "@/utils/teamAffinity";
import { teamEn } from "@/utils/teamHe";

// "הקבוצות שלי" in the statistics dashboard (22.11.2026, design 1 simplified): which teams' games brought the
// player the most points — a win pick counts for the winner, a draw for both teams. The tile shows the top three;
// the sheet lists every team, and a tap on a row opens its games.

const NUM = "var(--num-font)", GOLD = "#facc15", ease = [0.23, 1, 0.32, 1];
const ROW_BG = { background: "linear-gradient(160deg, rgba(19,37,74,0.88), rgba(15,29,58,0.88))", border: "1px solid rgba(148,163,184,0.16)", boxShadow: "0 8px 28px rgba(0,0,0,0.30)" };
const Num = ({ children, s = 14, c = "#fff" }) => <span dir="ltr" style={{ fontFamily: NUM, fontWeight: 800, fontSize: s, color: c, fontVariantNumeric: "tabular-nums" }}>{children}</span>;
const Crest = ({ src, s = 22 }) => (src ? <img src={src} alt="" style={{ width: s, height: s, objectFit: "contain", flexShrink: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))" }} /> : null);

// the player's teams, loaded once (shared by the tile and the sheet)
let cache = null;
export function useMyTeams() {
  const [teams, setTeams] = React.useState(cache);
  React.useEffect(() => {
    if (cache) return;
    let alive = true;
    (async () => {
      const me = await User.me();
      const [preds, matches] = await Promise.all([Prediction.filter({ user_id: me.id }), Match.list()]);
      cache = teamPoints(preds, matches);
      if (alive) setTeams(cache);
    })().catch(() => alive && setTeams([]));
    return () => { alive = false; };
  }, []);
  return teams;
}

export function MyTeamsTile({ teams }) {
  if (!teams) return <div style={{ height: 62 }} />;
  if (!teams.length) return <p className="mt-1 text-[11.5px] text-slate-400">יופיע אחרי המשחקים הראשונים</p>;
  return (
    <>
      <div className="mt-2 flex items-center justify-around">
        {teams.slice(0, 3).map((t) => (
          <div key={t.team} className="flex flex-col items-center gap-0.5"><Crest src={t.logo} s={30} /><Num s={13} c={GOLD}>{t.pts.toFixed(1)}</Num></div>
        ))}
      </div>
      <p className="mt-1 text-center text-[11px] text-slate-400">הקבוצות שהביאו לך הכי הרבה נקודות</p>
    </>
  );
}

function Games({ t }) {
  return (
    <div className="grid gap-1" style={{ padding: "8px 2px 4px" }}>
      {t.list.map((g, i) => (
        <div key={i} dir="ltr" className="flex items-center gap-2" style={{ padding: "6px 8px", borderRadius: 9, background: "rgba(255,255,255,.04)", fontSize: 11.5 }}>
          <Crest src={g.match.team_a_logo} s={16} />
          <span style={{ color: "#e2e8f0", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{teamEn(g.match.team_a)} – {teamEn(g.match.team_b)}</span>
          <Crest src={g.match.team_b_logo} s={16} />
          <span style={{ flex: 1 }} />
          <Num s={12} c="#93c5fd">{g.pick}</Num><Num s={12}>{g.actual}</Num>
          <span dir="rtl" style={{ fontSize: 9.5, fontWeight: 900, padding: "1px 5px", borderRadius: 5, background: "rgba(148,163,184,.18)", color: "#cbd5e1", whiteSpace: "nowrap" }}>{g.kind === "draw" ? "תיקו" : "ניצחון"}</span>
          <Num s={12.5} c={g.pts > 0 ? GOLD : "rgba(255,255,255,.4)"}>{g.pts.toFixed(2)}</Num>
        </div>
      ))}
    </div>
  );
}

export function MyTeamsSheet({ teams }) {
  const [open, setOpen] = React.useState(null);
  if (!teams) return null;
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 900, color: GOLD, margin: "0 2px 2px" }}><span>💰</span><span>מביאות נקודות</span></div>
      {teams.map((t, i) => (
        <div key={t.team}>
          <motion.button type="button" onClick={() => setOpen(open === i ? null : i)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.04 }}
            className="w-full flex items-center gap-3" style={{ padding: "10px 12px", borderRadius: 14, ...ROW_BG, textAlign: "right", border: open === i ? "1px solid rgba(250,204,21,.4)" : ROW_BG.border }}>
            <Crest src={t.logo} s={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div dir="ltr" style={{ fontSize: 14, fontWeight: 900, color: "#fff", textAlign: "right" }}>{teamEn(t.team)}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>
                {t.games} משחקים{t.win.n ? ` · ניצחון ${t.win.n}` : ""}{t.draw.n ? ` · תיקו ${t.draw.n}` : ""}
              </div>
            </div>
            <Num s={22} c={GOLD}>{t.pts.toFixed(2)}</Num>
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="grid place-items-center" style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.7)" }}>
              <ChevronDown size={15} />
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} style={{ overflow: "hidden" }}>
                <Games t={t} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
