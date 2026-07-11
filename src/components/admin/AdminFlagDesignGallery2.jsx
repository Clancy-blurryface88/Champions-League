import React from "react";

// Round 2 — 30 more flag frame/effect concepts, continuing from the first
// 50-design gallery with themes not covered there (seals, stitching, retro
// screens, map pins, textures, etc).
const CODES = ["br", "de", "jp", "ar"];

function Flag({ code, size = 48, style, className = "" }) {
  return (
    <span
      className={`fi fi-${code} fis ${className}`}
      style={{ display: 'inline-block', width: size, height: size, fontSize: size, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
    />
  );
}

function Row({ children }) {
  return <div className="flex items-center gap-3 flex-wrap justify-center py-2">{children}</div>;
}

function StyledRow({ style, wrapperStyle }) {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={wrapperStyle}>
          <Flag code={code} style={style} />
        </div>
      ))}
    </Row>
  );
}

// ── custom-markup variants ──────────────────────────────────────────────────

function RowRippleRings() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ borderRadius: '50%', boxShadow: '0 0 0 2px rgba(245,197,24,.15), 0 0 0 5px rgba(245,197,24,.1), 0 0 0 8px rgba(245,197,24,.05)' }}>
          <Flag code={code} style={{ borderRadius: '50%' }} />
        </div>
      ))}
    </Row>
  );
}

function RowFootballStitch() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ borderRadius: '50%', border: '2px dashed #fff', padding: 2 }}>
          <Flag code={code} style={{ borderRadius: '50%' }} />
        </div>
      ))}
    </Row>
  );
}

function RowEnvelopeSeal() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: 8 }}>
          <Flag code={code} style={{ borderRadius: 0 }} />
          <div className="absolute top-0 left-0 right-0" style={{ height: 16, background: 'rgba(255,255,255,.85)', clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowStar() {
  const star = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
  return <StyledRow style={{ clipPath: star }} />;
}

function RowCloud() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ borderRadius: '60% 60% 60% 20% / 60% 60% 40% 40%' }}>
          <Flag code={code} style={{ borderRadius: '60% 60% 60% 20% / 60% 60% 40% 40%' }} />
        </div>
      ))}
    </Row>
  );
}

function RowAchievementRibbon() {
  return (
    <Row>
      {CODES.map((code) => (
        <Flag key={code} code={code} style={{ clipPath: 'polygon(50% 0, 100% 20%, 100% 100%, 50% 82%, 0 100%, 0 20%)' }} />
      ))}
    </Row>
  );
}

function RowHangingFlag() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="flex flex-col items-center">
          <span className="w-0.5 h-2" style={{ background: '#94a3b8' }} />
          <Flag code={code} size={40} style={{ borderRadius: 2, clipPath: 'polygon(0 0,100% 0,100% 85%,83% 100%,67% 85%,50% 100%,33% 85%,17% 100%,0 85%)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowRetroTV() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: '40% / 25%', border: '3px solid #1e293b' }}>
          <Flag code={code} style={{ borderRadius: 0 }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 1px, transparent 1px 3px)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowCircuitCorners() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative">
          <Flag code={code} style={{ borderRadius: 2 }} />
          <span className="absolute -top-1 -left-1 w-2 h-2" style={{ borderTop: '2px solid #22c55e', borderLeft: '2px solid #22c55e' }} />
          <span className="absolute -bottom-1 -right-1 w-2 h-2" style={{ borderBottom: '2px solid #22c55e', borderRight: '2px solid #22c55e' }} />
          <span className="absolute top-1/2 -left-2 w-2 h-0.5" style={{ background: '#22c55e' }} />
          <span className="absolute top-1/2 -right-2 w-2 h-0.5" style={{ background: '#22c55e' }} />
        </div>
      ))}
    </Row>
  );
}

function RowWaxSeal() {
  return <StyledRow style={{ borderRadius: '50%', boxShadow: 'inset 0 3px 6px rgba(0,0,0,.6), inset 0 -2px 4px rgba(255,255,255,.15), 0 2px 4px rgba(0,0,0,.5)' }} />;
}

function RowCompassRose() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative">
          <Flag code={code} style={{ borderRadius: '50%' }} />
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[8px]" style={{ color: '#f5c518' }}>N</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[8px]" style={{ color: '#f5c518' }}>S</span>
        </div>
      ))}
    </Row>
  );
}

function RowBarcodeUnder() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="flex flex-col items-center gap-1">
          <Flag code={code} style={{ borderRadius: 4 }} />
          <div style={{ width: 40, height: 6, backgroundImage: 'repeating-linear-gradient(90deg,#334155 0 1px,transparent 1px 2px)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowQRCorners() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative">
          <Flag code={code} style={{ borderRadius: 2 }} />
          {[['top-0 left-0'], ['top-0 right-0'], ['bottom-0 left-0']].map(([pos], i) => (
            <span key={i} className={`absolute ${pos} w-2.5 h-2.5`} style={{ border: '1.5px solid #fff', margin: 2 }} />
          ))}
        </div>
      ))}
    </Row>
  );
}

function RowRadarSweep() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: '50%' }}>
          <Flag code={code} style={{ borderRadius: '50%' }} />
          <div className="absolute inset-0" style={{ background: 'conic-gradient(from 0deg, rgba(34,197,94,.35), transparent 70deg)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowMapPin() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ transform: 'rotate(45deg)', borderRadius: '50% 50% 0 50%', overflow: 'hidden', border: '2px solid #ef4444' }}>
          <div style={{ transform: 'rotate(-45deg) scale(1.4)' }}>
            <Flag code={code} style={{ borderRadius: 0 }} />
          </div>
        </div>
      ))}
    </Row>
  );
}

function RowShieldEmblem() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative">
          <Flag code={code} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)' }} />
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-[7px]" style={{ background: '#f5c518' }}>★</span>
        </div>
      ))}
    </Row>
  );
}

function RowPostcardTag() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative" style={{ background: '#f5f5f0', padding: 4, borderRadius: 2 }}>
          <span className="absolute -top-2 left-2 w-2 h-2 rounded-full border" style={{ borderColor: '#94a3b8' }} />
          <Flag code={code} size={40} style={{ borderRadius: 0 }} />
        </div>
      ))}
    </Row>
  );
}

function RowPeelCorner() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative">
          <Flag code={code} style={{ borderRadius: 6 }} />
          <div className="absolute" style={{ bottom: -3, right: -3, width: 12, height: 12, background: 'rgba(0,0,0,.35)', clipPath: 'polygon(0 100%,100% 100%,100% 0)', borderRadius: '0 0 4px 0' }} />
        </div>
      ))}
    </Row>
  );
}

function RowHalftone() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: 6 }}>
          <Flag code={code} style={{ borderRadius: 0 }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,.35) 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
        </div>
      ))}
    </Row>
  );
}

function RowMarble() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ padding: 3, borderRadius: 8, background: 'linear-gradient(135deg,#e2e8f0,#94a3b8,#f1f5f9,#64748b)' }}>
          <Flag code={code} style={{ borderRadius: 5, display: 'block' }} />
        </div>
      ))}
    </Row>
  );
}

function RowDenim() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ padding: 3, borderRadius: 8, background: 'repeating-linear-gradient(45deg,#1e3a8a,#1e3a8a 2px,#1e40af 2px,#1e40af 4px)' }}>
          <Flag code={code} style={{ borderRadius: 5, display: 'block' }} />
        </div>
      ))}
    </Row>
  );
}

function RowJerseyTag() {
  return (
    <Row>
      {CODES.map((code, i) => (
        <div key={code} className="relative flex flex-col items-center" style={{ background: '#1e293b', borderRadius: 8, padding: '4px 8px' }}>
          <Flag code={code} size={36} style={{ borderRadius: 4 }} />
          <span className="text-[9px] font-black text-white mt-0.5">#{i + 1}</span>
        </div>
      ))}
    </Row>
  );
}

function RowRadioDial() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative" style={{ borderRadius: '50%' }}>
          <Flag code={code} style={{ borderRadius: '50%' }} />
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 1px #475569', backgroundImage: 'repeating-conic-gradient(#475569 0deg 2deg, transparent 2deg 18deg)', opacity: .5, mixBlendMode: 'overlay' }} />
        </div>
      ))}
    </Row>
  );
}

function RowCameraIris() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative" style={{ borderRadius: '50%', border: '2px solid #334155' }}>
          <Flag code={code} style={{ borderRadius: '50%' }} />
          <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0)', background: 'rgba(0,0,0,.35)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowAppIcon() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: 12, boxShadow: '0 3px 8px rgba(0,0,0,.5)' }}>
          <Flag code={code} style={{ borderRadius: 0 }} />
          <div className="absolute inset-x-0 top-0" style={{ height: '45%', background: 'linear-gradient(rgba(255,255,255,.35), transparent)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowSunsetRing() {
  return <StyledRow wrapperStyle={{ padding: 3, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)' }} style={{ borderRadius: '50%', display: 'block' }} />;
}

function RowMirror() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="flex" style={{ borderRadius: 6, overflow: 'hidden' }}>
          <Flag code={code} size={24} style={{ borderRadius: 0 }} />
          <div style={{ transform: 'scaleX(-1)' }}><Flag code={code} size={24} style={{ borderRadius: 0 }} /></div>
        </div>
      ))}
    </Row>
  );
}

function RowAirmail() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ padding: 3, borderRadius: 6, background: 'repeating-linear-gradient(45deg,#ef4444 0 6px,#fff 6px 12px,#1d4ed8 12px 18px,#fff 18px 24px)' }}>
          <Flag code={code} style={{ borderRadius: 3, display: 'block' }} />
        </div>
      ))}
    </Row>
  );
}

function RowGlossySweep() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: 8 }}>
          <Flag code={code} style={{ borderRadius: 0 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,.4) 45%, transparent 60%)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowChunkyPixel() {
  return <StyledRow style={{ imageRendering: 'pixelated', filter: 'contrast(1.1) saturate(1.3)', clipPath: 'polygon(0 0,90% 0,90% 10%,100% 10%,100% 100%,10% 100%,10% 90%,0 90%)' }} />;
}

const VARIANTS = [
  { label: "טבעות אדווה", sub: "טבעות מרוכזות שקופות סביב עיגול", render: RowRippleRings },
  { label: "תפר כדורגל", sub: "מסגרת מקווקוות לבנה כמו תפרי כדור", render: RowFootballStitch },
  { label: "חותם מכתב", sub: "קיפול משולש עליון כמו מעטפה", render: RowEnvelopeSeal },
  { label: "כוכב חמש קודקודים", sub: "מסגרת בצורת כוכב", render: RowStar },
  { label: "ענן דיבור", sub: "צורת בועה גמישה", render: RowCloud },
  { label: "סרט הישג", sub: "מחודד למטה כמו מדליית זכייה", render: RowAchievementRibbon },
  { label: "דגל תלוי על מוט", sub: "פרנזים גליים בתחתית", render: RowHangingFlag },
  { label: "מסך טלוויזיה רטרו", sub: "פינות עגולות מוגזמות + פסי סריקה", render: RowRetroTV },
  { label: "פינות מעגל מודפס", sub: "חיבורי PCB בכל פינה", render: RowCircuitCorners },
  { label: "חותם שעווה", sub: "שקיעה עמוקה כמו חותם ישן", render: RowWaxSeal },
  { label: "רוזט מצפן", sub: "אותיות N/S בקצוות העיגול", render: RowCompassRose },
  { label: "ברקוד מתחת", sub: "פס ברקוד קטן מתחת לדגל", render: RowBarcodeUnder },
  { label: "סמני פינה QR", sub: "שלושה ריבועי מסגרת בפינות", render: RowQRCorners },
  { label: "סריקת מכ״ם", sub: "אלומת conic-gradient חולפת", render: RowRadarSweep },
  { label: "סיכת מפה", sub: "צורת טיפה מסתובבת כמו פין מפה", render: RowMapPin },
  { label: "מגן + סמל כוכב", sub: "תג כוכב קטן בפינת המגן", render: RowShieldEmblem },
  { label: "גלויה עם תווית חוט", sub: "רקע קרם + חור תלייה", render: RowPostcardTag },
  { label: "מדבקה קלופה", sub: "פינה נקלפת עם צל", render: RowPeelCorner },
  { label: "נקודות הלפטון", sub: "דוגמת נקודות קומיקס מעל הדגל", render: RowHalftone },
  { label: "מסגרת שיש", sub: "גרדיאנט אבן עם ורידים", render: RowMarble },
  { label: "מסגרת ג'ינס", sub: "מרקם דנים כחול פסים אלכסוניים", render: RowDenim },
  { label: "תג משחקן", sub: "כרטיסיה עם מספר חולצה", render: RowJerseyTag },
  { label: "חוגת רדיו", sub: "סימוני טיק סביב היקף העיגול", render: RowRadioDial },
  { label: "עדשת מצלמה", sub: "להב צל חלקי בסגנון צמצם", render: RowCameraIris },
  { label: "אייקון אפליקציה", sub: "ריבוע מעוגל עם ברק זכוכית עליון", render: RowAppIcon },
  { label: "טבעת שקיעה", sub: "גרדיאנט כתום-ורוד-סגול", render: RowSunsetRing },
  { label: "מראה כפולה", sub: "חצי דגל + שיקוף אופקי", render: RowMirror },
  { label: "דואר אוויר", sub: "מסגרת פסים אדום-כחול אלכסוניים", render: RowAirmail },
  { label: "ברק זכוכית חולף", sub: "פס אור אלכסוני על הדגל", render: RowGlossySweep },
  { label: "פיקסל גס", sub: "רזולוציה נמוכה + קצוות מדורגים", render: RowChunkyPixel },
];

function Frame({ id, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 flex flex-col gap-2">
      <div>
        <h3 className="text-white font-bold text-sm">{id}. {title}</h3>
        <p className="text-slate-500 text-xs">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default function AdminFlagDesignGallery2() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🚩🔥 30 עוד יותר - עיצובי דגלים</h2>
        <p className="text-slate-400 text-sm">
          המשך לגלריה הראשונה (50 עיצובים) - הפעם עם חותמות, מרקמים, וצורות מיוחדות שלא הופיעו קודם.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {VARIANTS.map(({ label, sub, render: Render }, idx) => (
          <Frame key={idx} id={idx + 1} title={label} subtitle={sub}>
            <Render />
          </Frame>
        ))}
      </div>
    </div>
  );
}
