import React, { useState } from "react";
import { supabase } from "@/api/supabase";
import { Trash2, RefreshCw, AlertTriangle, CheckCircle2, Users, MessageSquare, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RESET_SECTIONS = [
  {
    id: "predictions",
    icon: MessageSquare,
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/10",
    title: "ניחושים",
    description: "מחיקת כל הניחושים שהוגשו על ידי המשתמשים",
    tables: ["predictions"],
    confirmText: "מחק את כל הניחושים",
    details: "פעולה זו תמחק את כל הניחושים שהוגשו. המשתמשים יוכלו להגיש ניחושים מחדש.",
  },
  {
    id: "scores",
    icon: Star,
    color: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/10",
    title: "ניקוד",
    description: "איפוס ניקוד כל המשתמשים לאפס",
    tables: ["user_stats", "profiles_points"],
    confirmText: "אפס את כל הניקוד",
    details: "פעולה זו תמחק את טבלת user_stats ותאפס את total_points של כל הפרופילים לאפס.",
  },
  {
    id: "users",
    icon: Users,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    title: "משתמשים",
    description: "מחיקת כל פרופילי המשתמשים (לא חשבונות Google)",
    tables: ["profiles"],
    confirmText: "מחק את כל הפרופילים",
    details: "מחיקת השורות מטבלת profiles. המשתמשים עדיין יוכלו להתחבר עם Google — פרופיל חדש ייווצר אוטומטית.",
  },
  {
    id: "full",
    icon: Zap,
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/10",
    title: "ריסט מלא",
    description: "מחיקת ניחושים + ניקוד + פרופילים — הכל יחד",
    tables: ["predictions", "user_stats", "profiles"],
    confirmText: "ריסט מלא — מחק הכל",
    details: "שלב 1: מחק predictions → שלב 2: מחק user_stats → שלב 3: אפס total_points בפרופילים → שלב 4: מחק profiles. מחזורים ומשחקים ולוגואים נשמרים.",
  },
];

export default function AdminReset() {
  const [confirming, setConfirming] = useState(null); // section id being confirmed
  const [loading, setLoading] = useState(null);
  const [results, setResults] = useState({}); // id -> { success, message }

  const handleReset = async (section) => {
    setLoading(section.id);
    setResults((prev) => ({ ...prev, [section.id]: null }));

    try {
      if (section.id === "predictions") {
        const { error } = await supabase.from("predictions").delete().not("id", "is", null);
        if (error) throw error;
        setResults((prev) => ({ ...prev, [section.id]: { success: true, message: "כל הניחושים נמחקו בהצלחה." } }));
      }

      else if (section.id === "scores") {
        // 1. מחק user_stats
        const { error: e1 } = await supabase.from("user_stats").delete().not("id", "is", null);
        if (e1) throw e1;
        // 2. אפס ניקוד בפרופילים
        const { error: e2 } = await supabase.from("profiles").update({
          total_points: 0,
          correct_scores: 0,
          correct_winners: 0,
          prediction_count: 0,
        }).not("id", "is", null);
        if (e2) throw e2;
        setResults((prev) => ({ ...prev, [section.id]: { success: true, message: "ניקוד כל המשתמשים אופס בהצלחה." } }));
      }

      else if (section.id === "users") {
        const { error } = await supabase.from("profiles").delete().not("id", "is", null);
        if (error) throw error;
        setResults((prev) => ({ ...prev, [section.id]: { success: true, message: "כל הפרופילים נמחקו. המשתמשים ייוצרו מחדש בכניסה הבאה." } }));
      }

      else if (section.id === "full") {
        // סדר חשוב: predictions → user_stats → profiles
        const { error: e1 } = await supabase.from("predictions").delete().not("id", "is", null);
        if (e1) throw e1;
        const { error: e2 } = await supabase.from("user_stats").delete().not("id", "is", null);
        if (e2) throw e2;
        const { error: e3 } = await supabase.from("profiles").delete().not("id", "is", null);
        if (e3) throw e3;
        setResults((prev) => ({ ...prev, [section.id]: { success: true, message: "ריסט מלא בוצע בהצלחה. מחזורים, משחקים ולוגואים נשמרו." } }));
      }
    } catch (err) {
      setResults((prev) => ({ ...prev, [section.id]: { success: false, message: `שגיאה: ${err.message}` } }));
    } finally {
      setLoading(null);
      setConfirming(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="w-6 h-6 text-red-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Reset Center</h2>
          <p className="text-slate-400 text-sm">פעולות בלתי הפיכות — קרא היטב לפני ביצוע</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RESET_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isConfirming = confirming === section.id;
          const isLoading = loading === section.id;
          const result = results[section.id];

          return (
            <Card key={section.id} className={`bg-slate-800/60 border ${section.borderColor}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">{section.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-0.5">{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-500 text-xs leading-relaxed">{section.details}</p>

                {result && (
                  <div className={`flex items-start gap-2 p-2 rounded-lg text-xs ${result.success ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {result.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <span>{result.message}</span>
                  </div>
                )}

                {!isConfirming ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirming(section.id)}
                    className={`w-full border ${section.borderColor} ${section.color} bg-transparent hover:bg-slate-700/50`}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {section.confirmText}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-yellow-400 text-xs font-semibold text-center">⚠️ האם אתה בטוח? פעולה זו בלתי הפיכה</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReset(section)}
                        disabled={isLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "כן, בצע"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirming(null)}
                        disabled={isLoading}
                        className="flex-1 border-slate-600 text-slate-300"
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-slate-900/60 border border-slate-700/50">
        <CardContent className="pt-4">
          <h3 className="text-slate-300 font-semibold text-sm mb-3">מה נשמר בכל מקרה</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "מחזורים", emoji: "🏆" },
              { label: "משחקים", emoji: "⚽" },
              { label: "לוגואים", emoji: "🏳️" },
            ].map((item) => (
              <div key={item.label} className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                <div className="text-lg">{item.emoji}</div>
                <div className="text-green-400 text-xs font-medium mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
