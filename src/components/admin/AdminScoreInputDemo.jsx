import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

// ── Shared shell ───────────────────────────────────────────────────────────────
const BOX_BASE = {
  background: "rgba(15,20,45,0.85)",
  backdropFilter: "blur(12px)",
  borderRadius: 14,
};

function ArrowBtn({ dir, onClick }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.8 }}
      className="flex items-center justify-center text-amber-400 hover:opacity-70 transition-opacity">
      {dir === "up" ? <ChevronUp className="w-5 h-5" strokeWidth={2.5} /> : <ChevronDown className="w-5 h-5" strokeWidth={2.5} />}
    </motion.button>
  );
}

// Each design gets: value, onUp, onDown
// renders the box + arrows

// ── 25 designs ────────────────────────────────────────────────────────────────

// 1. Current (Bebas Neue, slide)
function D1({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)", boxShadow:"inset 0 2px 8px rgba(0,0,0,0.4)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ y:-14,opacity:0,scale:0.7 }} animate={{ y:0,opacity:1,scale:1 }} exit={{ y:14,opacity:0,scale:0.7 }}
            transition={{ type:"spring", stiffness:500, damping:30 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 2. Flip card 3D
function D2({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.12)", perspective:300 }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ rotateX:90,opacity:0 }} animate={{ rotateX:0,opacity:1 }} exit={{ rotateX:-90,opacity:0 }}
            transition={{ duration:0.25, ease:"easeOut" }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1, display:"block" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 3. Scale pop
function D3({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ scale:0,opacity:0 }} animate={{ scale:[0,1.3,1],opacity:1 }} exit={{ scale:0,opacity:0 }}
            transition={{ duration:0.3, ease:"easeOut" }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 4. Blur focus
function D4({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ filter:"blur(12px)",opacity:0,scale:1.2 }} animate={{ filter:"blur(0px)",opacity:1,scale:1 }} exit={{ filter:"blur(12px)",opacity:0,scale:0.8 }}
            transition={{ duration:0.3 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 5. Slot machine (fast scroll strip)
function D5({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center overflow-hidden" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ y:-40 }} animate={{ y:0 }} exit={{ y:40 }}
            transition={{ type:"spring", stiffness:700, damping:40 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 6. Rotate Y (coin flip)
function D6({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)", perspective:200 }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ rotateY:90,opacity:0 }} animate={{ rotateY:0,opacity:1 }} exit={{ rotateY:-90,opacity:0 }}
            transition={{ duration:0.28, ease:"easeOut" }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1, display:"block" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 7. Glow flash
function D7({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v}
            initial={{ opacity:0, textShadow:"0 0 40px rgba(255,255,255,1)" }}
            animate={{ opacity:1, textShadow:"0 0 0px rgba(255,255,255,0)" }}
            exit={{ opacity:0 }}
            transition={{ duration:0.5 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 8. Typewriter (counter)
function D8({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v}
            initial={{ clipPath:"inset(0 100% 0 0)", opacity:1 }}
            animate={{ clipPath:"inset(0 0% 0 0)", opacity:1 }}
            exit={{ clipPath:"inset(0 0 0 100%)", opacity:1 }}
            transition={{ duration:0.2 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1, display:"block" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 9. Elastic bounce
function D9({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ scale:0,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0,opacity:0 }}
            transition={{ type:"spring", stiffness:280, damping:8 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 10. Gold shimmer font
function D10({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(212,175,55,0.3)", boxShadow:"inset 0 0 20px rgba(212,175,55,0.05)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ y:-14,opacity:0 }} animate={{ y:0,opacity:1 }} exit={{ y:14,opacity:0 }}
            transition={{ type:"spring", stiffness:500, damping:30 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, lineHeight:1, background:"linear-gradient(180deg,#ffd700,#b8860b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 11. Thin serif
function D11({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1px solid rgba(255,255,255,0.08)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:10 }}
            transition={{ duration:0.25 }}
            style={{ fontFamily:"Georgia,serif", fontSize:44, color:"white", fontWeight:300, lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 12. Monospace green (terminal)
function D12({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1px solid rgba(74,222,128,0.3)", boxShadow:"0 0 12px rgba(74,222,128,0.08), inset 0 0 20px rgba(0,20,10,0.5)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ opacity:0,scale:1.4 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:0.6 }}
            transition={{ duration:0.2 }}
            style={{ fontFamily:"'Courier New',monospace", fontSize:44, color:"#4ade80", lineHeight:1, textShadow:"0 0 10px rgba(74,222,128,0.6)" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 13. Neon blue
function D13({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <motion.div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE }}
        animate={{ boxShadow:["0 0 0 1px rgba(0,200,255,0.5), 0 0 12px rgba(0,200,255,0.2)","0 0 0 1.5px rgba(0,200,255,0.8), 0 0 20px rgba(0,200,255,0.35)","0 0 0 1px rgba(0,200,255,0.5), 0 0 12px rgba(0,200,255,0.2)"] }}
        transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ y:-14,opacity:0 }} animate={{ y:0,opacity:1 }} exit={{ y:14,opacity:0 }}
            transition={{ type:"spring", stiffness:500, damping:30 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"#00c8ff", lineHeight:1, textShadow:"0 0 16px rgba(0,200,255,0.8)" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 14. Glass pill
function D14({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(20px)", border:"1.5px solid rgba(255,255,255,0.25)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.3)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ scale:0,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0,opacity:0 }}
            transition={{ type:"spring", stiffness:400, damping:20 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:44, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 15. Retro 7-segment
function D15({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ background:"rgba(5,10,5,0.95)", border:"1px solid rgba(255,80,0,0.3)", borderRadius:8, boxShadow:"inset 0 0 20px rgba(0,0,0,0.8)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.05 }}
            style={{ fontFamily:"'Courier New',monospace", fontSize:52, color:"#ff5000", lineHeight:1, textShadow:"0 0 10px rgba(255,80,0,0.8), 0 0 30px rgba(255,80,0,0.4)", fontWeight:"bold" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 16. Diagonal wipe
function D16({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center overflow-hidden" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v}
            initial={{ clipPath:"polygon(100% 0,100% 0,100% 100%,100% 100%)", opacity:1 }}
            animate={{ clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)", opacity:1 }}
            exit={{ clipPath:"polygon(0 0,0 0,0 100%,0 100%)", opacity:1 }}
            transition={{ duration:0.25, ease:"easeInOut" }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1, display:"block" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 17. Heartbeat
function D17({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ opacity:0,scale:0 }} animate={{ opacity:1,scale:[0,1.3,0.85,1.1,1] }} exit={{ opacity:0,scale:0 }}
            transition={{ duration:0.6, ease:"easeOut" }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 18. Fade only
function D18({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1px solid rgba(255,255,255,0.07)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"rgba(255,255,255,0.85)", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 19. Large italic serif
function D19({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1px solid rgba(255,255,255,0.08)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ y:-12,opacity:0,skewX:-5 }} animate={{ y:0,opacity:1,skewX:0 }} exit={{ y:12,opacity:0 }}
            transition={{ duration:0.3, ease:[0.23,1,0.32,1] }}
            style={{ fontFamily:"Georgia,serif", fontSize:52, color:"white", fontStyle:"italic", fontWeight:"bold", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 20. Outlined stroke
function D20({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ y:-14,opacity:0,scale:0.8 }} animate={{ y:0,opacity:1,scale:1 }} exit={{ y:14,opacity:0 }}
            transition={{ type:"spring", stiffness:500, damping:30 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, lineHeight:1, color:"transparent", WebkitTextStroke:"2px white" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 21. Split halves
function D21({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center overflow-hidden relative" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.div key={v} className="absolute inset-0 flex items-center justify-center" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}>
            <div className="relative overflow-hidden" style={{ height:52 }}>
              <motion.div initial={{ y:-26 }} animate={{ y:0 }} transition={{ type:"spring", stiffness:600, damping:35 }}
                style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>{v}</motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 22. Pixel / blocky
function D22({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ background:"rgba(5,8,20,0.95)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:8, boxShadow:"inset 0 0 20px rgba(99,102,241,0.05)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v}
            initial={{ opacity:0, filter:"blur(0px)", scale:2 }}
            animate={{ opacity:1, filter:"blur(0px)", scale:1 }}
            exit={{ opacity:0, scale:0.5 }}
            transition={{ duration:0.2 }}
            style={{ fontFamily:"monospace", fontSize:52, color:"#818cf8", lineHeight:1, letterSpacing:"-2px", fontWeight:"bold", imageRendering:"pixelated" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 23. Gradient text rainbow
function D23({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={v} initial={{ y:-14,opacity:0 }} animate={{ y:0,opacity:1 }} exit={{ y:14,opacity:0 }}
            transition={{ type:"spring", stiffness:500, damping:30 }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, lineHeight:1, background:"linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 24. Glitch
function D24({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ ...BOX_BASE, border:"1.5px solid rgba(255,255,255,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={v}
            initial={{ opacity:0,x:0 }}
            animate={{ opacity:1, x:[0,-4,4,-2,0], filter:["hue-rotate(0deg)","hue-rotate(90deg)","hue-rotate(-60deg)","hue-rotate(0deg)"] }}
            exit={{ opacity:0 }}
            transition={{ duration:0.35, ease:"easeOut" }}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"white", lineHeight:1 }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// 25. Newspaper / stamp
function D25({ v, up, dn }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowBtn dir="up" onClick={up} />
      <div className="w-14 h-20 flex items-center justify-center" style={{ background:"rgba(240,230,200,0.06)", border:"2px solid rgba(200,180,120,0.3)", borderRadius:8 }}>
        <AnimatePresence mode="wait">
          <motion.span key={v}
            initial={{ scale:2.5, opacity:0, rotate:-5 }}
            animate={{ scale:1, opacity:1, rotate:0 }}
            exit={{ scale:0.5, opacity:0 }}
            transition={{ type:"spring", stiffness:400, damping:22 }}
            style={{ fontFamily:"'Times New Roman',serif", fontSize:52, color:"rgba(245,220,150,0.9)", lineHeight:1, fontWeight:"bold" }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <ArrowBtn dir="dn" onClick={dn} />
    </div>
  );
}

// ── Catalog ────────────────────────────────────────────────────────────────────
const DESIGNS = [
  { id:1,  name:"Slide (נוכחי)",     tag:"נוכחי",      desc:"הספרה עולה/יורדת כמו slide, גופן Bebas Neue", C:D1 },
  { id:2,  name:"3D Flip X",         tag:"היפוך",      desc:"ספרה מתהפכת על ציר X כמו לוח מודעות", C:D2 },
  { id:3,  name:"Scale Pop",         tag:"קפיצה",      desc:"מתחילה קטנה, גדלה מעבר לגודל ומתייצבת", C:D3 },
  { id:4,  name:"Blur Focus",        tag:"מיקוד",      desc:"מתחיל מטושטש ומתחדד", C:D4 },
  { id:5,  name:"Slot Machine",      tag:"מכונה",      desc:"ספרות גוללות מהר כמו מכונת מזל", C:D5 },
  { id:6,  name:"Coin Flip Y",       tag:"מטבע",       desc:"מתהפכת על ציר Y כמו מטבע", C:D6 },
  { id:7,  name:"Glow Flash",        tag:"הבזק",       desc:"מופיעה עם הבזק לבן שדוהה", C:D7 },
  { id:8,  name:"Typewriter Wipe",   tag:"מחיקה",      desc:"נחשפת/נמחקת עם clip-path אופקי", C:D8 },
  { id:9,  name:"Elastic Bounce",    tag:"אלסטי",      desc:"spring עם damping נמוך — bounce מוגזם", C:D9 },
  { id:10, name:"Gold Gradient",     tag:"זהב",        desc:"גופן Bebas + גרדיאנט זהב מלמעלה למטה", C:D10 },
  { id:11, name:"Thin Serif",        tag:"סריף",       desc:"גופן Georgia דק ואלגנטי", C:D11 },
  { id:12, name:"Terminal Green",    tag:"טרמינל",     desc:"monospace ירוק עם glow — סגנון מסוף", C:D12 },
  { id:13, name:"Neon Blue",         tag:"ניאון",      desc:"ציאן זוהר עם pulse על הקופסה", C:D13 },
  { id:14, name:"Glass Pill",        tag:"קפסולה",     desc:"קופסה עגולה עם glassmorphism חזק", C:D14 },
  { id:15, name:"Retro 7-Seg",       tag:"רטרו",       desc:"סגנון תצוגת LCD/LED אורנג' קלאסי", C:D15 },
  { id:16, name:"Diagonal Wipe",     tag:"אלכסון",     desc:"נחשפת עם wipe אלכסוני", C:D16 },
  { id:17, name:"Heartbeat",         tag:"פולס",       desc:"מופיעה עם דופק: גדול→קטן→גדול→מייצב", C:D17 },
  { id:18, name:"Fade Only",         tag:"עדין",       desc:"fade בלבד — מינימלי לחלוטין", C:D18 },
  { id:19, name:"Bold Italic Serif", tag:"נטוי",       desc:"Georgia bold italic עם skew בכניסה", C:D19 },
  { id:20, name:"Outlined Stroke",   tag:"מתאר",       desc:"ספרה שקופה עם קו מתאר לבן", C:D20 },
  { id:21, name:"Smooth Curtain",    tag:"וילון",       desc:"נחשפת מלמטה למעלה כמו וילון", C:D21 },
  { id:22, name:"Pixel Indigo",      tag:"פיקסל",      desc:"monospace סגול עם scale-in", C:D22 },
  { id:23, name:"Rainbow Gradient",  tag:"קשת",        desc:"גרדיאנט כתום-ורוד-סגול על הספרה", C:D23 },
  { id:24, name:"Glitch",            tag:"גליץ׳",       desc:"רטט דיגיטלי עם hue-rotate בכניסה", C:D24 },
  { id:25, name:"Stamp / Print",     tag:"בול",        desc:"מגיעה מגדולה כמו חותמת, סגנון עיתון", C:D25 },
];

const TAG_COLORS = {
  "נוכחי":"#94a3b8","היפוך":"#c084fc","קפיצה":"#fb923c","מיקוד":"#cbd5e1","מכונה":"#fbbf24",
  "מטבע":"#e2e8f0","הבזק":"#fde68a","מחיקה":"#60a5fa","אלסטי":"#34d399","זהב":"#f59e0b",
  "סריף":"#a5b4fc","טרמינל":"#4ade80","ניאון":"#22d3ee","קפסולה":"#f0abfc","רטרו":"#f97316",
  "אלכסון":"#86efac","פולס":"#f87171","עדין":"#64748b","נטוי":"#d8b4fe","מתאר":"#e2e8f0",
  "וילון":"#67e8f9","פיקסל":"#818cf8","קשת":"#f9a8d4","גליץ׳":"#6ee7b7","בול":"#d97706",
};

function DesignCard({ design, selected, onClick }) {
  const [val, setVal] = useState(3);
  const up = () => setVal(v => (v + 1) % 10);
  const dn = () => setVal(v => v === 0 ? 9 : v - 1);
  const { C } = design;

  return (
    <motion.div
      className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-700/60 hover:border-slate-500"}`}
      style={{ background: "#080c1a" }}
      whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}>
      <div className="py-4 px-2 flex items-center justify-center min-h-[130px]"
        style={{ background: "linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
        {/* Two inputs side by side like real score */}
        <div className="flex items-center gap-3">
          <C v={val} up={up} dn={dn} />
          <span className="text-slate-500 font-bold text-xl">—</span>
          <C v={Math.max(0, val - 1)} up={up} dn={dn} />
        </div>
      </div>
      <div className="px-2.5 py-2 border-t border-slate-800 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{design.id}</span>
          <span className="text-[10px] font-semibold text-white truncate">{design.name}</span>
        </div>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background:`${TAG_COLORS[design.tag]}15`, color:TAG_COLORS[design.tag], border:`1px solid ${TAG_COLORS[design.tag]}30` }}>
          {design.tag}
        </span>
      </div>
    </motion.div>
  );
}

export default function AdminScoreInputDemo() {
  const [selected, setSelected] = useState(null);
  const [detailVal, setDetailVal] = useState(3);

  const selectedDesign = DESIGNS.find(d => d.id === selected);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🔢 סגנונות ספרה — 25 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">לחץ על החיצים בכל כרטיס כדי לראות את האנימציה בפעולה. לחץ על כרטיס לפרטים.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {DESIGNS.map(d => (
          <DesignCard key={d.id} design={d} selected={selected === d.id} onClick={() => setSelected(d.id === selected ? null : d.id)} />
        ))}
      </div>

      <AnimatePresence>
        {selectedDesign && (
          <motion.div key={selected}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
            className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-center flex-wrap"
            style={{ background:"rgba(8,12,26,0.98)", boxShadow:"0 0 30px rgba(99,102,241,0.1)" }}>
            <div className="flex-shrink-0 rounded-xl p-4 flex items-center gap-3"
              style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              <selectedDesign.C v={detailVal} up={() => setDetailVal(v=>(v+1)%10)} dn={() => setDetailVal(v=>v===0?9:v-1)} />
              <span className="text-slate-500 font-bold text-2xl">—</span>
              <selectedDesign.C v={Math.max(0,detailVal-1)} up={() => setDetailVal(v=>(v+1)%10)} dn={() => setDetailVal(v=>v===0?9:v-1)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-bold text-white text-lg">#{selectedDesign.id} — {selectedDesign.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background:`${TAG_COLORS[selectedDesign.tag]}15`, color:TAG_COLORS[selectedDesign.tag] }}>{selectedDesign.tag}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{selectedDesign.desc}</p>
              <button onClick={() => setSelected(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
