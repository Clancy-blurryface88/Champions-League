import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { Timeline } from "@/components/ui/timeline";

// ========== DEMO DATA — Korea Republic (Hebrew) ==========
const TEAM_DATA = {
  "Argentina": {
    color: "#75AADB",
    didYouKnow: [
      { icon: "🐐", text: "ליאונל מסי עשוי להפוך לשחקן הגברי הראשון שהשתתף ב-6 גביעי עולם שונים (2006–2026)." },
      { icon: "🏆", text: "ארגנטינה זכתה בשלושה תארים גדולים ברצף: קופה אמריקה 2021, גביע העולם 2022 וקופה אמריקה 2024." },
      { icon: "✋", text: "גול \"יד אלוהים\" של דייגו מראדונה נגד אנגליה ב-1986 נחשב לגול השנוי ביותר במחלוקת בהיסטוריית גביע העולם." },
      { icon: "⚡", text: "גמר גביע העולם 2022 (ארגנטינה 3–3 צרפת, 4–2 בפנדלים) נחשב לגמר הטוב ביותר שנערך אי פעם." },
      { icon: "🎯", text: "מסי מחזיק בשיא שערי גביע העולם עבור שחקן ארגנטינאי עם 13 שערים, עקף את שיאו של גבריאל בטיסוטה (10)." },
      { icon: "🧤", text: "שוער הנבחרת אמיליאנו מרטינס עצר 3 פנדלים לאורך גביע העולם 2022, כולל אחד בסדרת הפנדלים של הגמר מול צרפת." },
    ],
    historicMoments: [
      { year: 1930, text: "סיום במקום שני בגביע העולם הראשון בהיסטוריה באורוגוואי — הפסד 4–2 למארחות בגמר." },
      { year: 1978, text: "זכייה בתואר גביע העולם הראשון על אדמת הבית — ניצחון 3–1 על הולנד בגמר, כאשר מריו קמפס זרח." },
      { year: 1986, text: "תואר עולמי שני במקסיקו — הטורניר של דייגו מראדונה, כולל \"גול המאה\" נגד אנגליה." },
      { year: 1990, text: "סיום במקום שני באיטליה — הפסד 0–1 לגרמניה המערבית בגמר שנוי במחלוקת." },
      { year: 2014, text: "סיום במקום שני בברזיל — הפסד 0–1 לגרמניה בהארכה, בגול של מריו גוטצה." },
      { year: 2021, text: "מסי מרים את התואר הבינלאומי הגדול הראשון שלו כקפטן — זכייה בקופה אמריקה במרקנה." },
      { year: 2022, text: "תואר עולמי שלישי בקטאר — מסי הוכתר כשחקן הטוב ביותר בהיסטוריה בהופעה אגדית בגמר מול צרפת." },
      { year: 2024, text: "אלופת קופה אמריקה ברצף — ניצחון 1–0 על קולומביה בגמר במיאמי." },
    ],
  },
  "Korea Republic": {
    color: "#C60C30",
    didYouKnow: [
      { icon: "🥇", text: "קוריאה הדרומית היא המדינה האסייתית היחידה שהגיעה לחצי גמר גביע העולם, וסיימה במקום הרביעי ב-2002 כמארחת." },
      { icon: "🔥", text: "סון היונג-מין שבר את שיא ההופעות הכולל (137) שהיה בבעלות הונג מיונג-בו וצ'ה בום-קון, וממשיך לרדוף אחרי שיא ה-58 שערים של צ'ה." },
      { icon: "🇩🇪", text: "ב-2018 הדהימה קוריאה הדרומית את אלופת העולם המגנה גרמניה ב-2–0 בשלב הבתים, ופסלה אותה מהטורניר." },
      { icon: "🌍", text: "קוריאה הדרומית מחזיקה ברצף ההשתתפות הפעיל הארוך ביותר בגביע העולם באסיה — 11 טורנירים רצופים מאז 1986." },
      { icon: "💰", text: "העברתו של סון היונג-מין ל-LAFC ב-2025 תמורת 26.5 מיליון דולר קבעה שיא חדש בטרנספרים של MLS." },
      { icon: "🚀", text: "ינס קסטרופ, שנולד בגרמניה לאם קוריאנית, עבר לייצג את קוריאה הדרומית ב-2025 בהתאם לכללי הזכאות של פיפ\"א." },
    ],
    historicMoments: [
      { year: 1954, text: "בכורה בגביע העולם בשווייץ — הפסדים כבדים בשלב הבתים, כולל 0–9 להונגריה." },
      { year: 1986, text: "חזרה לגביע העולם לאחר היעדרות של 32 שנה — תחילתו של הרצף הבלתי נפסק." },
      { year: 2002, text: "כמארחת, הביסה את ספרד ואיטליה בדרך לחצי הגמר — הישג האסייתי הגדול ביותר בגביע העולם." },
      { year: 2010, text: "הגיעה לשמינית הגמר בדרום אפריקה, ונפלה בפני אורוגוואי 1–2." },
      { year: 2018, text: "הדהימה את גרמניה בניצחון 2–0 בקאזאן — אך בכל זאת נפסלה בשלב הבתים." },
      { year: 2022, text: "ניצחון דרמטי 2–1 על פורטוגל בדקות האחרונות העלה אותה לשמינית הגמר, שם הפסידה לברזיל 1–4." },
    ],
  },
};

export default function TeamInfoModal({ teamName, teamLogo, onClose }) {
  const dataKey = Object.keys(TEAM_DATA).find(k => k.toLowerCase() === teamName?.toLowerCase());
  const data = dataKey ? TEAM_DATA[dataKey] : null;

  const timelineData = data?.historicMoments.map(m => ({
    title: String(m.year),
    content: m.text,
  })) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#0f1923] border border-slate-700"
          dir="rtl"
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 left-4 z-10 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          {/* Flag reveal header */}
          <div
            className="flex flex-col items-center pt-10 pb-6 px-4"
            style={{ background: `linear-gradient(160deg, ${data?.color || '#1e3a5f'}22 0%, transparent 60%)` }}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-4"
            >
              <motion.div
                animate={{ boxShadow: [`0 0 0px ${data?.color || '#fff'}00`, `0 0 40px ${data?.color || '#fff'}88`, `0 0 0px ${data?.color || '#fff'}00`] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-full overflow-hidden border-4 border-white/20"
              >
                <TeamFlag logo={teamLogo} name={teamName} className="w-28 h-28" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white text-2xl font-bold"
            >
              {teamName}
            </motion.h2>

            {!data && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="text-slate-400 text-sm mt-2">
                נתונים יתווספו בקרוב
              </motion.p>
            )}
          </div>

          {data && (
            <div className="px-4 pb-8 space-y-6">

              {/* Did You Know */}
              <div>
                {/* כותרת מיושרת לימין: אימוג'י ימין, טקסט שמאלה ממנו */}
                <div className="flex items-center gap-2 mb-3" dir="ltr" style={{ justifyContent: 'flex-end' }}>
                  <h3 className="text-yellow-400 font-bold text-sm tracking-widest" dir="rtl">הידעת ?!</h3>
                  <span className="text-yellow-400 text-base">💡</span>
                </div>
                <div className="space-y-2">
                  {data.didYouKnow.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.2 }}
                      // dir="ltr" + justify-end: אימוג'י בימין, טקסט שמאלו
                      className="flex items-start gap-3 bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-700/40"
                      dir="ltr"
                      style={{ justifyContent: 'flex-end' }}
                    >
                      <p className="text-slate-300 text-sm leading-relaxed text-right flex-1">{item.text}</p>
                      <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700/50" />

              {/* Historic Moments */}
              <div>
                <div className="flex items-center gap-2 mb-4" dir="ltr" style={{ justifyContent: 'flex-end' }}>
                  <h3 className="text-blue-400 font-bold text-sm tracking-widest">רגעים היסטוריים</h3>
                  <span className="text-blue-400 text-base">🏛️</span>
                </div>
                <Timeline data={timelineData} />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
