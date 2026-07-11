import React from "react";

// Round 3 — unlike rounds 1-2, the OUTER shape stays fixed here: a plain
// rounded square (matching the real TeamFlag default) with the same 3D
// emboss bevel that's now live on every flag in the app. Only the overlay
// effect on top changes — glass, tint, glow, texture, etc.
const CODES = ["br", "de", "jp", "ar"];
const SIZE = 56;
const RADIUS = 8;
const EMBOSS_SHADOW = 'inset 0 1px 1px rgba(255,255,255,.4), inset 0 -2px 3px rgba(0,0,0,.5), inset 1px 0 1px rgba(255,255,255,.15), inset -1px 0 2px rgba(0,0,0,.35)';

function BaseSquare({ code, overlayStyle, overlay, outerStyle }) {
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE, borderRadius: RADIUS, overflow: 'hidden', ...outerStyle }}>
      <span
        className={`fi fi-${code} fis`}
        style={{ display: 'block', width: SIZE, height: SIZE, fontSize: SIZE, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {overlayStyle && <div className="absolute inset-0 pointer-events-none" style={overlayStyle} />}
      {overlay}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: EMBOSS_SHADOW }} />
    </div>
  );
}

function Row({ overlayStyle, overlay, outerStyle }) {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center py-2">
      {CODES.map((code) => <BaseSquare key={code} code={code} overlayStyle={overlayStyle} overlay={overlay?.(code)} outerStyle={outerStyle} />)}
    </div>
  );
}

const dots = (spots, size, color) => (
  <>{spots.map(([x, y], i) => (
    <span key={i} className="absolute rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, boxShadow: `0 0 3px ${color}` }} />
  ))}</>
);

const VARIANTS = [
  { label: "זכוכית מבעבעת", sub: "בועות קטנות שקופות עם הבהוב", overlayStyle: { backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,.55) 0 3px, transparent 4px), radial-gradient(circle at 62% 58%, rgba(255,255,255,.4) 0 2px, transparent 3px), radial-gradient(circle at 80% 22%, rgba(255,255,255,.45) 0 2.5px, transparent 3.5px)' } },
  { label: "זכוכית כפור", sub: "גוון קרח כחלחל שקוף", overlayStyle: { background: 'rgba(191,219,254,.28)' } },
  { label: "זכוכית מטושטשת עבה", sub: "blur חזק כמו זכוכית חלבית", overlayStyle: { background: 'rgba(255,255,255,.32)', backdropFilter: 'blur(3px)' } },
  { label: "טיפות טל", sub: "טיפות מים קטנות עם ברק", overlay: () => (
    <>{[[18,22],[58,52],[78,18]].map(([x,y],i) => (
      <span key={i} className="absolute rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: 6, height: 6, background: 'rgba(255,255,255,.75)', boxShadow: '0 1px 2px rgba(0,0,0,.35)' }} />
    ))}</>
  ) },
  { label: "זכוכית צבעונית", sub: "רשת חלוקה כמו ויטראז'", overlayStyle: { backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 14px), repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 1px, transparent 1px 14px)' } },
  { label: "סדק בזכוכית", sub: "קווי שבר דקים", overlayStyle: { backgroundImage: 'linear-gradient(105deg, transparent 48%, rgba(255,255,255,.55) 49%, transparent 50%), linear-gradient(75deg, transparent 60%, rgba(255,255,255,.4) 61%, transparent 62%)' } },
  { label: "השתקפות כפולה", sub: "שני פסי אור אלכסוניים", overlayStyle: { backgroundImage: 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,.32) 28%, transparent 36%, transparent 55%, rgba(255,255,255,.22) 63%, transparent 71%)' } },
  { label: "ניצוץ עדשה", sub: "הבהוב אור עגול בפינה", overlayStyle: { background: 'radial-gradient(circle at 28% 24%, rgba(255,255,255,.85) 0 4px, rgba(255,255,255,.25) 5px 11px, transparent 13px)' } },
  { label: "טבעת גבול זוהרת", sub: "מסגרת פנימית זוהרת תכלת", overlay: () => <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 0 2px rgba(56,189,248,.6), inset 0 0 8px rgba(56,189,248,.45)' }} /> },
  { label: "זכוכית נוזלית", sub: "טשטוש עדין וסטורציה מוגברת", overlayStyle: { backdropFilter: 'blur(.5px) saturate(1.35)', background: 'rgba(255,255,255,.05)' } },
  { label: "פסי גשם", sub: "קווי גשם אלכסוניים דקים", overlayStyle: { backgroundImage: 'repeating-linear-gradient(75deg, rgba(255,255,255,.28) 0 1px, transparent 1px 6px)' } },
  { label: "גוון כחול", sub: "שכבת צבע כחולה שקופה", overlayStyle: { background: 'rgba(59,130,246,.28)' } },
  { label: "גוון ירוק", sub: "שכבת צבע ירוקה שקופה", overlayStyle: { background: 'rgba(34,197,94,.28)' } },
  { label: "גוון סגול", sub: "שכבת צבע סגולה שקופה", overlayStyle: { background: 'rgba(168,85,247,.28)' } },
  { label: "זכוכית מט", sub: "ערפול עדין ללא ברק", overlayStyle: { background: 'rgba(255,255,255,.16)' } },
  { label: "ברק חזק", sub: "כתם אור בוהק בפינה", overlayStyle: { background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,.9), transparent 38%)' } },
  { label: "מסגרת כרום + ברק", sub: "גבול מתכתי עם שכבת אור", outerStyle: { boxShadow: '0 0 0 2px #cbd5e1, 0 0 0 3px #64748b' }, overlayStyle: { background: 'linear-gradient(rgba(255,255,255,.3), transparent 55%)' } },
  { label: "פסים שקופים", sub: "שכבות אלכסוניות דקות", overlayStyle: { backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.14) 0 6px, transparent 6px 12px)' } },
  { label: "השתקפות חלון", sub: "צלב אור עדין כמו זגוגית", overlay: () => (
    <>
      <span className="absolute inset-x-0" style={{ top: '10%', height: '10%', background: 'rgba(255,255,255,.22)' }} />
      <span className="absolute inset-y-0" style={{ left: '42%', width: '10%', background: 'rgba(255,255,255,.16)' }} />
    </>
  ) },
  { label: "ערפל בפינה", sub: "עננת אור דהה מפינה אחת", overlayStyle: { background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,.4), transparent 55%)' } },
  { label: "ברק הולוגרפי עדין", sub: "גוונים חולפים בעצימות נמוכה", overlayStyle: { background: 'conic-gradient(from 45deg, rgba(255,0,255,.15), rgba(0,255,255,.15), rgba(255,255,0,.15), rgba(255,0,255,.15))', mixBlendMode: 'overlay' } },
  { label: "אבק כוכבים", sub: "נקודות ברק זעירות מפוזרות", overlay: () => dots([[16,18],[70,58],[42,80],[85,40]], 2, '#ffffff') },
  { label: "סדקי קרח", sub: "קווי שבר קרירים בגוון תכלת", overlayStyle: { backgroundImage: 'linear-gradient(100deg, transparent 40%, rgba(191,219,254,.6) 41%, transparent 42%), linear-gradient(160deg, transparent 55%, rgba(191,219,254,.5) 56%, transparent 57%)' } },
  { label: "מסגרת ניאון זוהרת", sub: "זוהר טורקיז מסביב לריבוע", outerStyle: { boxShadow: '0 0 8px #22d3ee, 0 0 16px rgba(34,211,238,.4)', border: '1px solid #22d3ee' } },
  { label: "נצנצים ורודים", sub: "גוון ורוד + נקודות ברק", overlayStyle: { background: 'rgba(236,72,153,.2)' }, overlay: () => dots([[20,25],[65,55],[45,75]], 2, '#fbcfe8') },
  { label: "השתקפות שמיים", sub: "פס גרדיאנט שמימי בראש הריבוע", overlayStyle: { background: 'linear-gradient(rgba(147,197,253,.5), transparent 35%)' } },
  { label: "זכוכית מעושנת", sub: "גוון כהה שקוף", overlayStyle: { background: 'rgba(0,0,0,.38)' } },
  { label: "זוהר נר חם", sub: "אור ענברי רך מלמטה", overlayStyle: { background: 'radial-gradient(circle at 50% 100%, rgba(251,191,36,.45), transparent 60%)' } },
  { label: "ברק פנינה", sub: "גרדיאנט פסטלי עדין ומשתנה", overlayStyle: { background: 'linear-gradient(135deg, rgba(255,182,193,.18), rgba(173,216,230,.18), rgba(221,160,221,.18))' } },
  { label: "נצנוצי פינה", sub: "שני סימוני ברק בפינות מנוגדות", overlay: () => (
    <>
      <span className="absolute" style={{ top: 4, left: 4, width: 6, height: 6, background: 'radial-gradient(circle, #fff, transparent 70%)' }} />
      <span className="absolute" style={{ bottom: 4, right: 4, width: 6, height: 6, background: 'radial-gradient(circle, #fff, transparent 70%)' }} />
    </>
  ) },
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

export default function AdminFlagDesignGallery3() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🚩💎 30 אפקטי זכוכית - צורה מרובעת קבועה</h2>
        <p className="text-slate-400 text-sm">
          בניגוד לגלריות הקודמות, כאן הצורה נשארת קבועה - ריבוע מעוגל עם התבליט התלת-ממדי שכבר חי באפליקציה. משתנה רק שכבת האפקט הנוספת מעל (זכוכית, גוון, ברק, טקסטורה).
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {VARIANTS.map(({ label, sub, overlayStyle, overlay, outerStyle }, idx) => (
          <Frame key={idx} id={idx + 1} title={label} subtitle={sub}>
            <Row overlayStyle={overlayStyle} overlay={overlay} outerStyle={outerStyle} />
          </Frame>
        ))}
      </div>
    </div>
  );
}
