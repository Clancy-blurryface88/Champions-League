import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock upcoming matches — cycled through by every variant below so the
// transition styles can be compared on identical content.
const MATCHES = [
  { a: "br", an: "ברזיל", b: "de", bn: "גרמניה", day: "שישי", time: "20:00" },
  { a: "jp", an: "יפן", b: "ar", bn: "ארגנטינה", day: "שבת", time: "17:00" },
  { a: "fr", an: "צרפת", b: "es", bn: "ספרד", day: "שבת", time: "22:00" },
  { a: "it", an: "איטליה", b: "us", bn: "ארה\"ב", day: "ראשון", time: "18:30" },
];

function useCycle(intervalMs = 2600) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIndex((i) => (i + 1) % MATCHES.length), intervalMs);
    return () => clearInterval(iv);
  }, [intervalMs]);
  return index;
}

function Dots({ index }) {
  return (
    <div className="flex items-center gap-1.5 mt-3">
      {MATCHES.map((_, i) => (
        <span key={i} className="rounded-full transition-all" style={{
          width: i === index ? 14 : 6, height: 6,
          background: i === index ? '#f5c518' : 'rgba(255,255,255,.2)',
        }} />
      ))}
    </div>
  );
}

function CardBody({ m }) {
  return (
    <div className="px-6 py-5 flex flex-col items-center gap-3" style={{ minWidth: 260 }}>
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.35)' }}>
        <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">המשחק הבא</span>
      </div>
      <div className="flex items-center gap-4" dir="ltr">
        <div className="flex flex-col items-center gap-1 w-16">
          <span className={`fi fi-${m.a} fis rounded-md`} style={{ width: 36, height: 36, fontSize: 36 }} />
          <span className="text-slate-400 text-[10px]">{m.an}</span>
        </div>
        <span className="text-slate-500 font-bold text-xs">VS</span>
        <div className="flex flex-col items-center gap-1 w-16">
          <span className={`fi fi-${m.b} fis rounded-md`} style={{ width: 36, height: 36, fontSize: 36 }} />
          <span className="text-slate-400 text-[10px]">{m.bn}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-slate-400 text-[10px]">{m.day}</div>
        <div className="text-white text-base font-black" dir="ltr">{m.time}</div>
      </div>
    </div>
  );
}

function CardShell({ children }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(245,197,24,0.4)',
      boxShadow: '0 0 30px rgba(245,197,24,0.1), 0 10px 30px rgba(0,0,0,0.6)',
    }}>
      {children}
    </div>
  );
}

// ── 1. Carousel slide ────────────────────────────────────────────────────
function VariantCarousel() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160 }}>
          <AnimatePresence mode="popLayout">
            <motion.div key={index} className="absolute inset-0"
              initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
              <CardBody m={MATCHES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

// ── 2. 3D flip (Y-axis) ──────────────────────────────────────────────────
function VariantFlip3D() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160, perspective: 800 }}>
          <AnimatePresence mode="wait">
            <motion.div key={index} className="absolute inset-0"
              initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}>
              <CardBody m={MATCHES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

// ── 3. Crossfade + scale pulse ───────────────────────────────────────────
function VariantCrossfade() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160 }}>
          <AnimatePresence mode="wait">
            <motion.div key={index} className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45 }}>
              <CardBody m={MATCHES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

// ── 4. Card peel / stack (tinder-style) ──────────────────────────────────
function VariantPeel() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160 }}>
          <AnimatePresence>
            <motion.div key={index} className="absolute inset-0"
              initial={{ y: 20, scale: 0.92, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ x: 120, rotate: 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
              <CardBody m={MATCHES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

// ── 5. Rolodex flip (X-axis) ─────────────────────────────────────────────
function VariantRolodex() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160, perspective: 800 }}>
          <AnimatePresence mode="wait">
            <motion.div key={index} className="absolute inset-0"
              initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}>
              <CardBody m={MATCHES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

// ── 6. Odometer vertical scroll ──────────────────────────────────────────
function VariantOdometer() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160 }}>
          <AnimatePresence mode="popLayout">
            <motion.div key={index} className="absolute inset-0"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
              <CardBody m={MATCHES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

// ── 7. Zoom through ───────────────────────────────────────────────────────
function VariantZoom() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160 }}>
          <AnimatePresence mode="popLayout">
            <motion.div key={index} className="absolute inset-0"
              initial={{ scale: 0.5, opacity: 0, filter: 'blur(8px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 1.6, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}>
              <CardBody m={MATCHES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

// ── 8. Curtain wipe ────────────────────────────────────────────────────────
function VariantCurtain() {
  const index = useCycle();
  return (
    <div className="flex flex-col items-center">
      <CardShell>
        <div className="relative overflow-hidden" style={{ width: 260, height: 160 }}>
          {MATCHES.map((m, i) => i === index && (
            <motion.div key={i} className="absolute inset-0"
              initial={{ clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}>
              <CardBody m={m} />
            </motion.div>
          ))}
        </div>
      </CardShell>
      <Dots index={index} />
    </div>
  );
}

const VARIANTS = [
  { label: "קרוסלה - החלקה אופקית", sub: "כרטיס חדש נכנס מהצד, הישן גולש החוצה", Comp: VariantCarousel },
  { label: "היפוך תלת-ממדי (Y)", sub: "מסתובב כמו לוח תוצאות דרמטי", Comp: VariantFlip3D },
  { label: "דהייה עדינה + פולס", sub: "שקט ומינימליסטי, פחות 'מרעיש'", Comp: VariantCrossfade },
  { label: "קילוף קלפים (Tinder)", sub: "הקלף הישן נגרר החוצה באלכסון", Comp: VariantPeel },
  { label: "רולודקס (היפוך X)", sub: "מסתובב אנכית כמו קלנדר שולחני ישן", Comp: VariantRolodex },
  { label: "גלילה כמו מונה", sub: "תוכן גולש אנכית כמו ספרת אודומטר", Comp: VariantOdometer },
  { label: "זום מבעד", sub: "משתחרר קדימה ומיטשטש, הבא נכנס מטושטש וממוקד", Comp: VariantZoom },
  { label: "וילון נחשף", sub: "הכרטיס הבא נחשף בגלילה משמאל לימין", Comp: VariantCurtain },
];

function Frame({ id, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 flex flex-col items-center gap-3">
      <div className="self-stretch">
        <h3 className="text-white font-bold text-sm">{id}. {title}</h3>
        <p className="text-slate-500 text-xs">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default function AdminNextMatchAnimationDemo() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🔄 8 סגנונות מעבר לכרטיס "המשחק הבא"</h2>
        <p className="text-slate-400 text-sm">
          כל כרטיס כאן רץ בפועל ומתחלף אוטומטית כל כ-2.6 שניות בין 4 משחקים לדוגמה, כדי שתוכל לראות ולהשוות בין הסגנונות בזמן אמת.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {VARIANTS.map(({ label, sub, Comp }, idx) => (
          <Frame key={idx} id={idx + 1} title={label} subtitle={sub}>
            <Comp />
          </Frame>
        ))}
      </div>
    </div>
  );
}
