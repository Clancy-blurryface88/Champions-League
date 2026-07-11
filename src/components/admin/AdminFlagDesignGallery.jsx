import React from "react";

// Sample teams — good visual spread of colors/patterns for comparing frames.
const CODES = ["br", "de", "jp", "ar"];

// Raw flag-icons element (bypasses TeamFlag's own rounding/shadow so each
// variant below has full control over the shape).
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

// Generic style-driven variant — covers most shape/border/filter treatments.
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

// ── Variants needing extra markup beyond a plain style object ───────────────

function RowRibbonCorner() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: 10 }}>
          <Flag code={code} style={{ borderRadius: 10 }} />
          <span className="absolute" style={{
            top: 6, right: -16, width: 56, transform: 'rotate(45deg)', textAlign: 'center',
            background: '#f5c518', color: '#000', fontSize: 8, fontWeight: 900, padding: '1px 0',
          }}>TOP</span>
        </div>
      ))}
    </Row>
  );
}

function RowTicketNotch() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative" style={{ borderRadius: 10, border: '1.5px dashed #f5c518', padding: 4 }}>
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: '#0a1220' }} />
          <Flag code={code} style={{ borderRadius: 6 }} />
        </div>
      ))}
    </Row>
  );
}

function RowPolaroid() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="flex flex-col items-center" style={{ background: '#f5f5f0', padding: '5px 5px 10px', borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,.4)' }}>
          <Flag code={code} size={44} style={{ borderRadius: 0 }} />
          <span style={{ fontSize: 7, color: '#333', marginTop: 3, fontFamily: 'monospace', textTransform: 'uppercase' }}>{code}</span>
        </div>
      ))}
    </Row>
  );
}

function RowCornerChip() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="flex flex-col items-center gap-1">
          <Flag code={code} style={{ borderRadius: '50%', border: '2px solid #334155' }} />
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase" style={{ background: '#1e293b', color: '#94a3b8' }}>{code}</span>
        </div>
      ))}
    </Row>
  );
}

function RowPennant() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="flex items-center">
          <div className="w-1 self-stretch" style={{ background: '#475569' }} />
          <Flag code={code} style={{ clipPath: 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowHUDCorners() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative p-1">
          <Flag code={code} style={{ borderRadius: 4 }} />
          <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5" style={{ borderTop: '2px solid #22d3ee', borderLeft: '2px solid #22d3ee' }} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5" style={{ borderTop: '2px solid #22d3ee', borderRight: '2px solid #22d3ee' }} />
          <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5" style={{ borderBottom: '2px solid #22d3ee', borderLeft: '2px solid #22d3ee' }} />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5" style={{ borderBottom: '2px solid #22d3ee', borderRight: '2px solid #22d3ee' }} />
        </div>
      ))}
    </Row>
  );
}

function RowLaurel() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
          <span className="absolute text-lg" style={{ left: -4 }}>🌿</span>
          <Flag code={code} size={40} style={{ borderRadius: '50%', border: '2px solid #FFD700' }} />
          <span className="absolute text-lg" style={{ right: -4, transform: 'scaleX(-1)' }}>🌿</span>
        </div>
      ))}
    </Row>
  );
}

function RowSpeechBubble() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative" style={{ marginBottom: 6 }}>
          <Flag code={code} style={{ borderRadius: 12, border: '1.5px solid #475569' }} />
          <span className="absolute" style={{
            bottom: -6, left: '50%', marginLeft: -5, width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #475569',
          }} />
        </div>
      ))}
    </Row>
  );
}

function RowPassportStamp() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{ transform: 'rotate(-8deg)', border: '2px dashed #ef4444', borderRadius: '50%', padding: 3, opacity: .9 }}>
          <Flag code={code} style={{ borderRadius: '50%', filter: 'sepia(.3) contrast(1.1)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowSplitDuoTone() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative overflow-hidden" style={{ borderRadius: 10, width: 48, height: 48 }}>
          <Flag code={code} style={{ borderRadius: 0, filter: 'grayscale(1)' }} />
          <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}>
            <Flag code={code} style={{ borderRadius: 0 }} />
          </div>
        </div>
      ))}
    </Row>
  );
}

function RowPixelSteps() {
  return (
    <Row>
      {CODES.map((code) => (
        <Flag key={code} code={code} style={{
          clipPath: 'polygon(0 20%, 20% 20%, 20% 0, 100% 0, 100% 80%, 80% 80%, 80% 100%, 0 100%)',
          imageRendering: 'pixelated',
        }} />
      ))}
    </Row>
  );
}

function RowHolographic() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} style={{
          borderRadius: 10, padding: 2,
          background: 'linear-gradient(120deg,#f0f,#0ff,#ff0,#f0f)',
        }}>
          <Flag code={code} style={{ borderRadius: 8, display: 'block' }} />
        </div>
      ))}
    </Row>
  );
}

function RowGrayToColor() {
  return (
    <Row>
      {CODES.map((code) => (
        <Flag key={code} code={code} style={{ borderRadius: 8, filter: 'grayscale(.85)', transition: 'filter .3s' }} className="hover:!grayscale-0" />
      ))}
    </Row>
  );
}

function RowSpotlight() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative" style={{ borderRadius: '50%', overflow: 'hidden' }}>
          <Flag code={code} style={{ borderRadius: '50%' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.35), transparent 55%)' }} />
        </div>
      ))}
    </Row>
  );
}

function RowGlowBehind() {
  return (
    <Row>
      {CODES.map((code) => (
        <div key={code} className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
          <span className="absolute inset-0 rounded-full" style={{ background: '#f5c518', filter: 'blur(14px)', opacity: .45 }} />
          <Flag code={code} style={{ borderRadius: '50%', position: 'relative' }} />
        </div>
      ))}
    </Row>
  );
}

// ── 50 variant definitions ───────────────────────────────────────────────

const VARIANTS = [
  { label: "עיגול קלאסי", sub: "מסגרת עגולה + צל עדין", render: () => <StyledRow style={{ borderRadius: '50%', border: '2px solid #334155', boxShadow: '0 4px 10px rgba(0,0,0,.4)' }} /> },
  { label: "משושה", sub: "צורת כוורת", render: () => <StyledRow style={{ clipPath: 'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%)' }} /> },
  { label: "מגן", sub: "מחודד מלמטה כמו סמל נבחרת", render: () => <StyledRow style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)' }} /> },
  { label: "יהלום", sub: "ריבוע מסובב 45 מעלות", render: () => <StyledRow style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }} /> },
  { label: "סרט גלי", sub: "קצה תחתון גלי", render: () => <StyledRow style={{ clipPath: 'polygon(0 0,100% 0,100% 80%,80% 100%,60% 80%,40% 100%,20% 80%,0 100%)' }} /> },
  { label: "ריבוע + טבעת זוהרת", sub: "מסגרת פינות מעוגלות עם הילה", render: () => <StyledRow style={{ borderRadius: 10, boxShadow: '0 0 0 3px #0a1220, 0 0 0 5px #f5c518' }} /> },
  { label: "ריבוע חד", sub: "בלי עיגול פינות בכלל", render: () => <StyledRow style={{ borderRadius: 0, border: '1px solid #334155' }} /> },
  { label: "מתומן", sub: "8 צלעות", render: () => <StyledRow style={{ clipPath: 'polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)' }} /> },
  { label: "מקבילית", sub: "סקיו אלכסוני", render: () => <StyledRow wrapperStyle={{ transform: 'skewX(-10deg)' }} style={{ borderRadius: 4 }} /> },
  { label: "חץ קדימה", sub: "קצה ימני מחודד", render: () => <StyledRow style={{ clipPath: 'polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)' }} /> },
  { label: "טבעת כפולה", sub: "שתי מסגרות מקיפות", render: () => <StyledRow style={{ borderRadius: '50%', boxShadow: '0 0 0 2px #0a1220, 0 0 0 4px #94a3b8, 0 0 0 6px #0a1220, 0 0 0 8px #475569' }} /> },
  { label: "טבעת קונית", sub: "מסגרת גרדיאנט מסתובב", render: () => <StyledRow wrapperStyle={{ borderRadius: '50%', padding: 3, background: 'conic-gradient(#f5c518,#ef4444,#22d3ee,#f5c518)' }} style={{ borderRadius: '50%', display: 'block' }} /> },
  { label: "זוהר ניאון", sub: "צל זוהר סביב עיגול", render: () => <StyledRow style={{ borderRadius: '50%', boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee88' }} /> },
  { label: "זכוכית מטושטשת", sub: "שכבת שקיפות מעל הדגל", render: () => (
    <Row>{CODES.map(code => (
      <div key={code} className="relative" style={{ borderRadius: 10, overflow: 'hidden' }}>
        <Flag code={code} style={{ borderRadius: 0 }} />
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(1px)' }} />
      </div>
    ))}</Row>
  ) },
  { label: "תבליט תלת-ממד", sub: "צללית פנימית", render: () => <StyledRow style={{ borderRadius: 10, boxShadow: 'inset 0 2px 4px rgba(255,255,255,.3), inset 0 -3px 6px rgba(0,0,0,.5)' }} /> },
  { label: "פולארויד", sub: "מסגרת לבנה + תווית קוד מדינה", render: RowPolaroid },
  { label: "מטבע/מדליה", sub: "טבעת זהב עבה", render: () => <StyledRow style={{ borderRadius: '50%', border: '4px solid #FFD700', boxShadow: 'inset 0 0 4px rgba(0,0,0,.5)' }} /> },
  { label: "קצה קרוע", sub: "מתאר לא סדיר", render: () => <StyledRow style={{ clipPath: 'polygon(0 5%,10% 0,25% 4%,40% 0,55% 5%,70% 1%,85% 4%,100% 0,100% 95%,85% 100%,70% 96%,55% 100%,40% 97%,25% 100%,10% 96%,0 100%)' }} /> },
  { label: "כרטיס כניסה מנוקב", sub: "חריר עגול מלמעלה", render: RowTicketNotch },
  { label: "תג פינה", sub: "רצועת פינה אלכסונית", render: RowRibbonCorner },
  { label: "תווית מתחת", sub: "צ'יפ קוד מדינה מתחת לעיגול", render: RowCornerChip },
  { label: "ריבוע מסובב", sub: "כרטיס שלם ביהלום", render: () => <StyledRow wrapperStyle={{ transform: 'rotate(45deg)' }} style={{ borderRadius: 6 }} /> },
  { label: "דגלון על מוט", sub: "פס אנכי + משולש", render: RowPennant },
  { label: "זרקור", sub: "הילת אור עדינה בפינה", render: RowSpotlight },
  { label: "זכוכית סדוקה", sub: "קווים אלכסוניים דקים", render: () => <StyledRow style={{ borderRadius: 8, backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,.15) 0 1px, transparent 1px 14px)', backgroundBlendMode: 'overlay' }} /> },
  { label: "מסגרת עץ", sub: "גוון חום חרוט", render: () => <StyledRow wrapperStyle={{ padding: 4, borderRadius: 10, background: 'linear-gradient(135deg,#7c4a24,#5c3317)' }} style={{ borderRadius: 6, display: 'block' }} /> },
  { label: "מסגרת כרום", sub: "גרדיאנט מתכתי כסוף", render: () => <StyledRow wrapperStyle={{ padding: 3, borderRadius: '50%', background: 'linear-gradient(135deg,#e2e8f0,#64748b,#e2e8f0)' }} style={{ borderRadius: '50%', display: 'block' }} /> },
  { label: "טבעת זהב", sub: "מדליה זהובה עבה", render: () => <StyledRow wrapperStyle={{ padding: 4, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD700,#F5C518,#B8860B)' }} style={{ borderRadius: '50%', display: 'block' }} /> },
  { label: "מתאר מקווקו", sub: "גבול עגול מנוקד", render: () => <StyledRow style={{ borderRadius: '50%', border: '2px dashed #f5c518' }} /> },
  { label: "דהייה בקצוות", sub: "מסכת פייד עגולה", render: () => <StyledRow style={{ borderRadius: 8, maskImage: 'radial-gradient(circle, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, #000 70%, transparent 100%)' }} /> },
  { label: "בול דואר", sub: "מסגרת מנוקדת + פינות ישרות", render: () => <StyledRow style={{ borderRadius: 2, border: '3px dotted #94a3b8' }} /> },
  { label: "באנר קשתי", sub: "עקום עליון ותחתון", render: () => <StyledRow style={{ borderRadius: '50% 50% 20% 20% / 30% 30% 15% 15%' }} /> },
  { label: "קיפול אוריגמי", sub: "משולש קיפול בפינה", render: () => (
    <Row>{CODES.map(code => (
      <div key={code} className="relative overflow-hidden" style={{ borderRadius: 8 }}>
        <Flag code={code} style={{ borderRadius: 0 }} />
        <div className="absolute top-0 right-0" style={{ width: 0, height: 0, borderTop: '14px solid rgba(255,255,255,.85)', borderLeft: '14px solid transparent' }} />
      </div>
    ))}</Row>
  ) },
  { label: "משושה ניאון", sub: "מתאר זוהר טורקיז", render: () => <StyledRow style={{ clipPath: 'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%)', boxShadow: '0 0 8px #22d3ee' }} /> },
  { label: "פיצול דו-גוני", sub: "חצי צבע חצי אפור", render: RowSplitDuoTone },
  { label: "HUD פינות", sub: "סוגריים זוויתיים בכל פינה", render: RowHUDCorners },
  { label: "סרט ניצחון אלכסוני", sub: "פס ניצחון על הדגל", render: RowRibbonCorner },
  { label: "ספיה וינטג'", sub: "גוון חום עתיק", render: () => <StyledRow style={{ borderRadius: 8, filter: 'sepia(.6) contrast(1.05)' }} /> },
  { label: "אפור→צבע בהובר", sub: "ניגודיות נטענת במעבר עכבר", render: RowGrayToColor },
  { label: "זוהר מאחור", sub: "הילת blur צבעונית מאחורי העיגול", render: RowGlowBehind },
  { label: "פאזל", sub: "בליטה בסגנון פאזל בקצה", render: () => <StyledRow style={{ clipPath: 'polygon(0 0,40% 0,40% 15%,60% 15%,60% 0,100% 0,100% 100%,0 100%)' }} /> },
  { label: "פס תחתון מודגש", sub: "ריבוע + קו הדגשה מתחת", render: () => (
    <Row>{CODES.map(code => (
      <div key={code} className="flex flex-col items-center gap-1">
        <Flag code={code} style={{ borderRadius: 8 }} />
        <span className="w-6 h-0.5 rounded" style={{ background: '#f5c518' }} />
      </div>
    ))}</Row>
  ) },
  { label: "זר דפנה", sub: "עלים משני צדי המדליה", render: RowLaurel },
  { label: "משושה מתכתי", sub: "מסגרת גרדיאנט מתכת סביב משושה", render: () => <StyledRow wrapperStyle={{ padding: 3, clipPath: 'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%)', background: 'linear-gradient(135deg,#e2e8f0,#64748b)' }} style={{ clipPath: 'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%)', display: 'block' }} /> },
  { label: "בועת דיבור", sub: "כרטיס עם זנב פונה מטה", render: RowSpeechBubble },
  { label: "חותמת דרכון", sub: "מסובב עם מסגרת מקווקוות אדומה", render: RowPassportStamp },
  { label: "פיצול אלכסוני", sub: "בלוק אלכסוני חופף", render: () => (
    <Row>{CODES.map(code => (
      <div key={code} className="relative" style={{ borderRadius: 8, overflow: 'hidden' }}>
        <Flag code={code} style={{ borderRadius: 0 }} />
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0,35% 0,20% 100%,0 100%)', background: 'rgba(255,255,255,.25)' }} />
      </div>
    ))}</Row>
  ) },
  { label: "פיקסל-ארט", sub: "קצוות מדורגים בסגנון 8-בית", render: RowPixelSteps },
  { label: "מדבקה הולוגרפית", sub: "מסגרת גרדיאנט צבעוני חולף", render: RowHolographic },
  { label: "מינימלי שטוח", sub: "בלי מסגרת ובלי צל - קו בסיס להשוואה", render: () => <StyledRow style={{ borderRadius: 4 }} /> },
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

export default function AdminFlagDesignGallery() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🚩 50 עיצובי דגלים לנבחרות</h2>
        <p className="text-slate-400 text-sm">
          50 חלופות להצגת דגל נבחרת (צורה, מסגרת, אפקט) עם אותן 4 דוגמאות (ברזיל, גרמניה, יפן, ארגנטינה) בכל וריאנט להשוואה קלה.
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
