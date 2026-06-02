import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Users, ChevronRight, Zap, Star, Eye, TrendingUp, Award } from "lucide-react";

// ── Shared footer shell ────────────────────────────────────────────────────────
function Shell({ children, topLine = "linear-gradient(90deg,transparent,rgba(255,200,50,0.5) 20%,rgba(255,200,50,0.5) 80%,transparent)" }) {
  return (
    <div className="relative rounded-b-xl overflow-hidden" style={{ background:"linear-gradient(145deg,rgba(30,58,138,0.45),rgba(8,15,45,0.92))" }}>
      <div className="absolute top-0 left-4 right-4 h-[2px]" style={{ background: topLine }} />
      <div className="flex">
        {children}
      </div>
    </div>
  );
}

function Sep({ style = {} }) {
  return <div className="w-[2px] my-1.5 flex-shrink-0" style={{ background:'rgba(255,200,50,0.45)', ...style }} />;
}

// ── 50 button designs ──────────────────────────────────────────────────────────

const D = [
  // 1 — Current
  { id:1, name:"נוכחי", tag:"צהוב",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold tracking-wide" style={{color:"rgba(255,200,50,0.7)"}}>1 X 2</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold tracking-wide" style={{color:"rgba(255,200,50,0.7)"}}>ניחושים</button>
      </Shell>
    )},
  // 2 — White
  { id:2, name:"לבן נקי", tag:"לבן",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-white/60 hover:text-white">1 X 2</button>
        <Sep style={{background:"rgba(255,255,255,0.12)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-white/60 hover:text-white">ניחושים</button>
      </Shell>
    )},
  // 3 — Gradient text
  { id:3, name:"גרדיאנט", tag:"גרדיאנט",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg,#fbbf24,#f472b6)"}}>1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg,#f472b6,#818cf8)"}}>ניחושים</span>
        </button>
      </Shell>
    )},
  // 4 — With icons
  { id:4, name:"עם אייקונים", tag:"אייקונים",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <BarChart2 className="w-3 h-3"/><span className="text-xs font-semibold">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <Users className="w-3 h-3"/><span className="text-xs font-semibold">ניחושים</span>
        </button>
      </Shell>
    )},
  // 5 — Pill style
  { id:5, name:"גלולה", tag:"פיל",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-2.5">
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:"rgba(255,200,50,0.12)",color:"rgba(255,200,50,0.8)",border:"1px solid rgba(255,200,50,0.25)"}}>1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-2.5">
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:"rgba(255,200,50,0.12)",color:"rgba(255,200,50,0.8)",border:"1px solid rgba(255,200,50,0.25)"}}>ניחושים</span>
        </button>
      </Shell>
    )},
  // 6 — Uppercase spaced
  { id:6, name:"CAPS רווח", tag:"קפס",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-[10px] font-black tracking-[0.2em] text-white/50">1 X 2</button>
        <Sep style={{background:"rgba(255,255,255,0.1)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-[10px] font-black tracking-[0.2em] text-white/50">ניחושים</button>
      </Shell>
    )},
  // 7 — Emerald green
  { id:7, name:"ירוק אמרלד", tag:"ירוק",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(52,211,153,0.5) 20%,rgba(52,211,153,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-emerald-400/70">1 X 2</button>
        <Sep style={{background:"rgba(52,211,153,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-emerald-400/70">ניחושים</button>
      </Shell>
    )},
  // 8 — Blue
  { id:8, name:"כחול", tag:"כחול",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(96,165,250,0.5) 20%,rgba(96,165,250,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-blue-400/70">1 X 2</button>
        <Sep style={{background:"rgba(96,165,250,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-blue-400/70">ניחושים</button>
      </Shell>
    )},
  // 9 — Pink
  { id:9, name:"ורוד", tag:"ורוד",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(244,114,182,0.5) 20%,rgba(244,114,182,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-pink-400/70">1 X 2</button>
        <Sep style={{background:"rgba(244,114,182,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-pink-400/70">ניחושים</button>
      </Shell>
    )},
  // 10 — Full background on hover simulation
  { id:10, name:"רקע פול", tag:"רקע",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{background:"rgba(255,200,50,0.1)",color:"rgba(255,200,50,0.85)"}}>1 X 2</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{background:"rgba(255,200,50,0.06)",color:"rgba(255,200,50,0.6)"}}>ניחושים</button>
      </Shell>
    )},
  // 11 — Arrow suffix
  { id:11, name:"חץ", tag:"חץ",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1 py-3 text-amber-400/70">
          <span className="text-xs font-semibold">1 X 2</span><ChevronRight className="w-3 h-3"/>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1 py-3 text-amber-400/70">
          <span className="text-xs font-semibold">ניחושים</span><ChevronRight className="w-3 h-3"/>
        </button>
      </Shell>
    )},
  // 12 — Dot prefix
  { id:12, name:"נקודה", tag:"נקודה",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60"/>
          <span className="text-xs font-semibold">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60"/>
          <span className="text-xs font-semibold">ניחושים</span>
        </button>
      </Shell>
    )},
  // 13 — Outlined pill
  { id:13, name:"פיל מסגרת", tag:"מסגרת",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-2.5">
          <span className="text-xs font-bold px-4 py-1 rounded-full border border-white/15 text-white/50">1 X 2</span>
        </button>
        <Sep style={{background:"rgba(255,255,255,0.08)"}}/>
        <button className="flex-1 flex items-center justify-center py-2.5">
          <span className="text-xs font-bold px-4 py-1 rounded-full border border-white/15 text-white/50">ניחושים</span>
        </button>
      </Shell>
    )},
  // 14 — Neon glow text
  { id:14, name:"ניאון", tag:"ניאון",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(0,240,255,0.5) 20%,rgba(0,240,255,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold" style={{color:"#00f0ff",textShadow:"0 0 10px rgba(0,240,255,0.7)"}}>1 X 2</button>
        <Sep style={{background:"rgba(0,240,255,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold" style={{color:"#00f0ff",textShadow:"0 0 10px rgba(0,240,255,0.7)"}}>ניחושים</button>
      </Shell>
    )},
  // 15 — Different color per button
  { id:15, name:"צבע שונה לכל", tag:"שני צבעים",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-blue-400/75">1 X 2</button>
        <Sep style={{background:"rgba(255,255,255,0.1)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-emerald-400/75">ניחושים</button>
      </Shell>
    )},
  // 16 — With count badge
  { id:16, name:"עם מספר", tag:"badge",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <span className="text-xs font-semibold">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <span className="text-xs font-semibold">ניחושים</span>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{background:"rgba(255,200,50,0.2)",color:"rgba(255,200,50,0.9)"}}>12</span>
        </button>
      </Shell>
    )},
  // 17 — Underline style
  { id:17, name:"קו תחתון", tag:"underline",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(255,255,255,0.12) 20%,rgba(255,255,255,0.12) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-white/55" style={{borderBottom:"1.5px solid rgba(255,200,50,0.5)",margin:"0 12px"}}>1 X 2</button>
        <Sep style={{background:"rgba(255,255,255,0.08)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-white/40" style={{borderBottom:"1.5px solid transparent",margin:"0 12px"}}>ניחושים</button>
      </Shell>
    )},
  // 18 — Zap icon
  { id:18, name:"ברק + כוכב", tag:"זאפ",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1 py-3 text-amber-400/70">
          <Zap className="w-3 h-3"/><span className="text-xs font-bold">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1 py-3 text-amber-400/70">
          <Star className="w-3 h-3"/><span className="text-xs font-bold">ניחושים</span>
        </button>
      </Shell>
    )},
  // 19 — Muted slate
  { id:19, name:"מעומעם", tag:"מעומעם",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(255,255,255,0.08) 20%,rgba(255,255,255,0.08) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-[10px] font-medium text-slate-500">1 X 2</button>
        <Sep style={{background:"rgba(255,255,255,0.07)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-[10px] font-medium text-slate-500">ניחושים</button>
      </Shell>
    )},
  // 20 — Bold large
  { id:20, name:"גדול ועבה", tag:"גדול",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-sm font-black text-amber-400/75">1 X 2</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-sm font-black text-amber-400/75">ניחושים</button>
      </Shell>
    )},
  // 21 — Silver metallic
  { id:21, name:"כסף", tag:"כסף",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(203,213,225,0.5) 20%,rgba(203,213,225,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"#94a3b8"}}>1 X 2</button>
        <Sep style={{background:"rgba(203,213,225,0.3)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"#94a3b8"}}>ניחושים</button>
      </Shell>
    )},
  // 22 — Rose gold
  { id:22, name:"רוז גולד", tag:"רוז",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(253,164,175,0.5) 20%,rgba(253,164,175,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"#fda4af"}}>1 X 2</button>
        <Sep style={{background:"rgba(253,164,175,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"#fda4af"}}>ניחושים</button>
      </Shell>
    )},
  // 23 — Eye icon + trending
  { id:23, name:"עין + טרנד", tag:"אייקון",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1 py-3 text-amber-400/70">
          <Eye className="w-3 h-3"/><span className="text-xs font-semibold">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1 py-3 text-amber-400/70">
          <TrendingUp className="w-3 h-3"/><span className="text-xs font-semibold">ניחושים</span>
        </button>
      </Shell>
    )},
  // 24 — Two-line stacked
  { id:24, name:"שתי שורות", tag:"מוערם",
    render:()=>(
      <Shell>
        <button className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5">
          <span className="text-[8px] text-amber-400/40 font-medium">סיכויים</span>
          <span className="text-xs font-bold text-amber-400/70">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5">
          <span className="text-[8px] text-amber-400/40 font-medium">משתתפים</span>
          <span className="text-xs font-bold text-amber-400/70">ניחושים</span>
        </button>
      </Shell>
    )},
  // 25 — Full background split
  { id:25, name:"רקע חלוק", tag:"חלוק",
    render:()=>(
      <div className="relative rounded-b-xl overflow-hidden flex">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold" style={{background:"rgba(255,200,50,0.12)",color:"rgba(255,200,50,0.85)"}}>1 X 2</button>
        <div className="w-[2px]" style={{background:"rgba(255,200,50,0.3)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold text-white/40" style={{background:"rgba(255,255,255,0.03)"}}>ניחושים</button>
      </div>
    )},
  // 26 — Glassmorphism buttons
  { id:26, name:"זכוכית", tag:"גלס",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-lg" style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.65)"}}>1 X 2</span>
        </button>
        <Sep style={{background:"rgba(255,255,255,0.08)"}}/>
        <button className="flex-1 flex items-center justify-center py-2.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-lg" style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.65)"}}>ניחושים</span>
        </button>
      </Shell>
    )},
  // 27 — Award icon
  { id:27, name:"גביע + משתמשים", tag:"גביע",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <Award className="w-3.5 h-3.5"/><span className="text-xs font-semibold">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <Users className="w-3.5 h-3.5"/><span className="text-xs font-semibold">ניחושים</span>
        </button>
      </Shell>
    )},
  // 28 — Thin light
  { id:28, name:"דק ועדין", tag:"עדין",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(255,255,255,0.1) 20%,rgba(255,255,255,0.1) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-[10px] font-light tracking-widest text-white/35">1 X 2</button>
        <Sep style={{background:"rgba(255,255,255,0.07)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-[10px] font-light tracking-widest text-white/35">ניחושים</button>
      </Shell>
    )},
  // 29 — Purple violet
  { id:29, name:"סגול", tag:"סגול",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(192,132,252,0.5) 20%,rgba(192,132,252,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(192,132,252,0.75)"}}>1 X 2</button>
        <Sep style={{background:"rgba(192,132,252,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(192,132,252,0.75)"}}>ניחושים</button>
      </Shell>
    )},
  // 30 — Teal
  { id:30, name:"טיל", tag:"טיל",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(45,212,191,0.5) 20%,rgba(45,212,191,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(45,212,191,0.75)"}}>1 X 2</button>
        <Sep style={{background:"rgba(45,212,191,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(45,212,191,0.75)"}}>ניחושים</button>
      </Shell>
    )},
  // 31 — No separator
  { id:31, name:"ללא מפריד", tag:"פתוח",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70">1 X 2</button>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70">ניחושים</button>
      </Shell>
    )},
  // 32 — Rounded separator
  { id:32, name:"נקודה במרכז", tag:"נקודה",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70">1 X 2</button>
        <div className="flex items-center"><span className="w-1 h-1 rounded-full bg-amber-400/40"/></div>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70">ניחושים</button>
      </Shell>
    )},
  // 33 — Icon only
  { id:33, name:"אייקון בלבד", tag:"אייקון",
    render:()=>(
      <Shell>
        <button className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-amber-400/70">
          <BarChart2 className="w-4 h-4"/>
          <span className="text-[8px] font-medium">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-amber-400/70">
          <Users className="w-4 h-4"/>
          <span className="text-[8px] font-medium">ניחושים</span>
        </button>
      </Shell>
    )},
  // 34 — Serif font
  { id:34, name:"גופן Serif", tag:"סריף",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-sm text-amber-400/70" style={{fontFamily:"Georgia,serif",fontStyle:"italic"}}>1 X 2</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-sm text-amber-400/70" style={{fontFamily:"Georgia,serif",fontStyle:"italic"}}>ניחושים</button>
      </Shell>
    )},
  // 35 — Active left button
  { id:35, name:"כפתור פעיל", tag:"פעיל",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold" style={{background:"rgba(255,200,50,0.15)",color:"rgba(255,200,50,0.9)"}}>1 X 2</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-white/30">ניחושים</button>
      </Shell>
    )},
  // 36 — Orange
  { id:36, name:"כתום", tag:"כתום",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(251,146,60,0.5) 20%,rgba(251,146,60,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(251,146,60,0.75)"}}>1 X 2</button>
        <Sep style={{background:"rgba(251,146,60,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(251,146,60,0.75)"}}>ניחושים</button>
      </Shell>
    )},
  // 37 — All caps small
  { id:37, name:"קפס קטן", tag:"קפס",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-[9px] font-black uppercase tracking-[0.15em] text-amber-400/65">Odds</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-[9px] font-black uppercase tracking-[0.15em] text-amber-400/65">Picks</button>
      </Shell>
    )},
  // 38 — Gradient split different
  { id:38, name:"גרדיאנט שונה", tag:"גרדיאנט",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg,#60a5fa,#34d399)"}}>1 X 2</span>
        </button>
        <Sep style={{background:"rgba(255,255,255,0.1)"}}/>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg,#fbbf24,#f97316)"}}>ניחושים</span>
        </button>
      </Shell>
    )},
  // 39 — Diamond separator
  { id:39, name:"יהלום מפריד", tag:"יהלום",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70">1 X 2</button>
        <div className="flex items-center px-1"><span className="text-amber-400/40 text-xs">◆</span></div>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70">ניחושים</button>
      </Shell>
    )},
  // 40 — Coral
  { id:40, name:"קורל", tag:"קורל",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(252,165,165,0.5) 20%,rgba(252,165,165,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(252,165,165,0.75)"}}>1 X 2</button>
        <Sep style={{background:"rgba(252,165,165,0.35)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(252,165,165,0.75)"}}>ניחושים</button>
      </Shell>
    )},
  // 41 — Mono spaced
  { id:41, name:"Monospace", tag:"מונו",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs text-green-400/70" style={{fontFamily:"monospace"}}>1 X 2</button>
        <Sep style={{background:"rgba(74,222,128,0.3)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs text-green-400/70" style={{fontFamily:"monospace"}}>ניחושים</button>
      </Shell>
    )},
  // 42 — Shimmer text
  { id:42, name:"שימר", tag:"שימר",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(90deg,#fbbf24,#fff9,#fbbf24)",backgroundSize:"200% 100%",animation:"shine 2s linear infinite"}}>1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(90deg,#fbbf24,#fff9,#fbbf24)",backgroundSize:"200% 100%",animation:"shine 2s linear infinite",animationDelay:"1s"}}>ניחושים</span>
        </button>
      </Shell>
    )},
  // 43 — Amber glow text shadow
  { id:43, name:"גלואו טקסט", tag:"גלואו",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold" style={{color:"rgba(255,200,50,0.9)",textShadow:"0 0 12px rgba(255,200,50,0.6)"}}>1 X 2</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold" style={{color:"rgba(255,200,50,0.9)",textShadow:"0 0 12px rgba(255,200,50,0.6)"}}>ניחושים</button>
      </Shell>
    )},
  // 44 — Hebrew styled
  { id:44, name:"עברי בלבד", tag:"עברי",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70" dir="rtl">יחס ✦</button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold text-amber-400/70" dir="rtl">✦ ניחושים</button>
      </Shell>
    )},
  // 45 — White gradient text
  { id:45, name:"לבן גרדיאנט", tag:"לבן",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(255,255,255,0.2) 20%,rgba(255,255,255,0.2) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(180deg,#ffffff,rgba(255,255,255,0.4))"}}>1 X 2</span>
        </button>
        <Sep style={{background:"rgba(255,255,255,0.15)"}}/>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(180deg,#ffffff,rgba(255,255,255,0.4))"}}>ניחושים</span>
        </button>
      </Shell>
    )},
  // 46 — Pulsing dot + text
  { id:46, name:"פולס + טקסט", tag:"פולס",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <motion.span className="w-1.5 h-1.5 rounded-full bg-amber-400" animate={{opacity:[1,0.3,1]}} transition={{duration:1.5,repeat:Infinity}}/>
          <span className="text-xs font-semibold">1 X 2</span>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-400/70">
          <motion.span className="w-1.5 h-1.5 rounded-full bg-amber-400" animate={{opacity:[1,0.3,1]}} transition={{duration:1.5,repeat:Infinity,delay:0.75}}/>
          <span className="text-xs font-semibold">ניחושים</span>
        </button>
      </Shell>
    )},
  // 47 — Fire gradient
  { id:47, name:"אש", tag:"אש",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(249,115,22,0.5) 20%,rgba(249,115,22,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(180deg,#fbbf24,#ef4444)"}}>1 X 2</span>
        </button>
        <Sep style={{background:"rgba(249,115,22,0.4)"}}/>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(180deg,#fbbf24,#ef4444)"}}>ניחושים</span>
        </button>
      </Shell>
    )},
  // 48 — Ice blue
  { id:48, name:"קרח", tag:"קרח",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(186,230,253,0.5) 20%,rgba(186,230,253,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(186,230,253,0.75)"}}>1 X 2</button>
        <Sep style={{background:"rgba(186,230,253,0.3)"}}/>
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-semibold" style={{color:"rgba(186,230,253,0.75)"}}>ניחושים</button>
      </Shell>
    )},
  // 49 — Minimal dots only
  { id:49, name:"נקודות בלבד", tag:"דוטס",
    render:()=>(
      <Shell>
        <button className="flex-1 flex items-center justify-center gap-2 py-3">
          <span className="w-2 h-2 rounded-full bg-amber-400/50"/>
          <span className="text-xs font-semibold text-amber-400/70">1 X 2</span>
          <span className="w-2 h-2 rounded-full bg-amber-400/50"/>
        </button>
        <Sep/>
        <button className="flex-1 flex items-center justify-center gap-2 py-3">
          <span className="w-2 h-2 rounded-full bg-amber-400/50"/>
          <span className="text-xs font-semibold text-amber-400/70">ניחושים</span>
          <span className="w-2 h-2 rounded-full bg-amber-400/50"/>
        </button>
      </Shell>
    )},
  // 50 — Galaxy gradient
  { id:50, name:"גלקסיה", tag:"גלקסיה",
    render:()=>(
      <Shell topLine="linear-gradient(90deg,transparent,rgba(167,139,250,0.5) 20%,rgba(236,72,153,0.5) 80%,transparent)">
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg,#818cf8,#c084fc,#f472b6)"}}>1 X 2</span>
        </button>
        <Sep style={{background:"linear-gradient(to bottom,rgba(167,139,250,0.5),rgba(236,72,153,0.5))"}}/>
        <button className="flex-1 flex items-center justify-center py-3">
          <span className="text-xs font-bold bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(135deg,#f472b6,#c084fc,#818cf8)"}}>ניחושים</span>
        </button>
      </Shell>
    )},
];

const TAG_COLORS={
  "צהוב":"#fbbf24","לבן":"#f8fafc","גרדיאנט":"#c084fc","אייקונים":"#60a5fa","פיל":"#f9a8d4",
  "קפס":"#94a3b8","ירוק":"#4ade80","כחול":"#60a5fa","ורוד":"#f472b6","רקע":"#fbbf24",
  "חץ":"#e2e8f0","נקודה":"#fde68a","מסגרת":"#94a3b8","ניאון":"#22d3ee","שני צבעים":"#86efac",
  "badge":"#fb923c","underline":"#fbbf24","זאפ":"#fbbf24","מעומעם":"#64748b","גדול":"#fbbf24",
  "כסף":"#cbd5e1","רוז":"#fda4af","אייקון":"#60a5fa","מוערם":"#fbbf24","חלוק":"#fbbf24",
  "גלס":"#e0f2fe","גביע":"#fbbf24","עדין":"#475569","סגול":"#c084fc","טיל":"#2dd4bf",
  "פתוח":"#94a3b8","נקודה":"#fbbf24","אייקון":"#818cf8","סריף":"#fde68a","פעיל":"#fbbf24",
  "כתום":"#fb923c","קורל":"#fca5a5","מונו":"#4ade80","שימר":"#fbbf24","גלואו":"#fbbf24",
  "עברי":"#fbbf24","פולס":"#f59e0b","אש":"#f97316","קרח":"#bae6fd","דוטס":"#fbbf24","גלקסיה":"#a78bfa",
  "קפס":"#94a3b8","יהלום":"#fde68a",
};

export default function AdminButtonDemo() {
  const [selected, setSelected] = useState(null);
  const sel = D.find(d=>d.id===selected);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🎛️ עיצובי כפתורים — 50 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">עיצובים לכפתורי "1 X 2" ו"ניחושים" בתחתית כרטיסיית המשחק. לחץ לפרטים.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {D.map(d=>(
          <motion.div key={d.id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected===d.id?"border-indigo-500 ring-2 ring-indigo-500/30":"border-slate-800 hover:border-slate-600"}`}
            style={{background:"#080c1a"}}
            whileHover={{y:-2}} whileTap={{scale:0.98}}
            onClick={()=>setSelected(d.id===selected?null:d.id)}>
            <div className="px-3 pt-3 pb-0" style={{background:"linear-gradient(135deg,#0d1220,#0a0f1a)"}}>
              <d.render/>
            </div>
            <div className="px-3 py-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-600 font-mono">#{d.id}</span>
                <span className="text-xs font-semibold text-white truncate">{d.name}</span>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{background:`${TAG_COLORS[d.tag]||"#888"}18`,color:TAG_COLORS[d.tag]||"#888",border:`1px solid ${TAG_COLORS[d.tag]||"#888"}30`}}>
                {d.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {sel&&(
          <motion.div key={selected}
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}}
            className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-center flex-wrap"
            style={{background:"rgba(8,12,26,0.98)",boxShadow:"0 0 30px rgba(99,102,241,0.1)"}}>
            <div className="w-64 flex-shrink-0 rounded-xl overflow-hidden px-3 pt-3 pb-0" style={{background:"linear-gradient(135deg,#0d1220,#0a0f1a)"}}>
              <sel.render/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-white text-lg">#{sel.id} — {sel.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{background:`${TAG_COLORS[sel.tag]||"#888"}18`,color:TAG_COLORS[sel.tag]||"#888"}}>{sel.tag}</span>
              </div>
              <button onClick={()=>setSelected(null)} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
