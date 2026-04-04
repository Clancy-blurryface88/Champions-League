
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Loader2, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvokeLLM } from "@/api/functions";
// הפעלה מחדש של כל האינטגרציות הספציפיות
import { sofascoreApi } from "@/api/functions";
import { flashscoresApi } from "@/api/functions";
import { freeFootballApi } from "@/api/functions";
import { liveSportRealTimeApi } from "@/api/functions";
import { liveEventsApi } from "@/api/functions";
import { soccerAnalysisApi } from "@/api/functions";
import { footballPredictionApi } from "@/api/functions";
import { liveFootballDataApi } from "@/api/functions";
import { searchGptApi } from "@/api/functions"; 
import ReactMarkdown from "react-markdown";

const CHATBOT_AVATAR = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bae5d8a0c_football-player_5281682.png";

export default function FootballChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "שלום ! אני הצ'אטבוט הרשמי של הטורניר 🏆\n\n כעת אני מחובר למקורות מידע מתקדמים:\n📊 Sofascore - סטטיסטיקות מפורטות\n⚽ Flashscores - תוצאות חיות\n🏟️ LiveSport - נתוני משחקים\n🎯 Soccer Analysis - ניתוחים מקצועיים\n\nשאל אותי כל דבר על כדורגל ואקבל לך מידע מדויק ועדכני!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // מיפוי פונקציות API לפי שם
  const apiMap = {
    'sofascoreApi': sofascoreApi,
    'flashscoresApi': flashscoresApi,
    'freeFootballApi': freeFootballApi,
    'liveSportRealTimeApi': liveSportRealTimeApi,
    'liveEventsApi': liveEventsApi,
    'soccerAnalysisApi': soccerAnalysisApi,
    'footballPredictionApi': footballPredictionApi,
    'liveFootballDataApi': liveFootballDataApi,
    'searchGptApi': searchGptApi
  };

  // שלב 1: זיהוי כוונות באמצעות LLM - מעודכן עם פרמטרים ספציפיים
  const analyzeUserIntent = async (question) => {
    try {
      console.log("🔍 מנתח כוונת משתמש:", question);
      
      const intentPrompt = `אתה מערכת זיהוי כוונות לצ'אטבוט כדורגל מתקדם.
      
קבל את השאלה הבאה ונתח איזה מקור מידע הכי מתאים לענות עליה.

השאלה: "${question}"

מקורות המידע הזמינים ופעולות אפשריות:

1. sofascoreApi - אפשרויות:
   - live_matches (משחקים חיים)
   - match_details (פרטי משחק ספציפי, דורש matchId)
   - match_statistics (סטטיסטיקות משחק, דורש matchId)
   - team_info (מידע על קבוצה, דורש teamId)
   - champions_league_matches (משחקי ליגת האלופות)

2. flashscoresApi - אפשרויות:
   - live_matches (משחקים חיים)
   - today_matches (משחקי היום)
   - yesterday_matches (משחקי אתמול)
   - tomorrow_matches (משחקי מחר)
   - match_details (פרטי משחק, דורש matchId)

3. freeFootballApi - אפשרויות:
   - live_events (אירועים חיים)
   - daily_matches (משחקי יום ספציפי, דורש date)
   - league_matches (משחקי ליגה, דורש leagueId)

4. liveSportRealTimeApi - אפשרויות:
   - live_matches (משחקים חיים)
   - team_matches (משחקי קבוצה, דורש teamId)
   - league_standings (דירוגי ליגה, דורש leagueId)

5. footballPredictionApi - אפשרויות:
   - get_today_predictions (תחזיות להיום)
   - get_predictions (תחזיות כלליות)

6. searchGptApi - אפשרויות:
   - search_football (חיפוש כללי בכדורגל)
   - champions_league_update (עדכוני ליגת האלופות)

7. general_search - חיפוש כללי באינטרנט

נתח את השאלה והחזר JSON בפורמט הבא:
{
  "api_to_use": "שם_API",
  "parameters": {
    "action": "הפעולה_הספציפית_מהרשימה_למעלה",
    "matchId": "אם נדרש מזהה משחק",
    "teamId": "אם נדרש מזהה קבוצה", 
    "leagueId": "אם נדרש מזהה ליגה",
    "date": "אם נדרש תאריך בפורמט YYYY-MM-DD",
    "query": "השאלה המקורית אם זה searchGptApi"
  },
  "confidence": "גבוה/בינוני/נמוך",
  "reasoning": "הסבר קצר למה בחרת ב-API ובפעולה הספציפית"
}

דוגמאות:
- "איזה משחקים יש היום?" -> flashscoresApi עם action: "today_matches"
- "מה התוצאות החיות?" -> sofascoreApi עם action: "live_matches"
- "תחזיות למשחקים" -> footballPredictionApi עם action: "get_today_predictions"
- "מה קורה בליגת האלופות?" -> searchGptApi עם action: "champions_league_update"

אם השאלה כללית מדי או לא ברור, החזר "api_to_use": "general_search".`;

      const intentResult = await InvokeLLM({
        prompt: intentPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            api_to_use: { type: "string" },
            parameters: { 
              type: "object",
              properties: {
                action: { type: "string" },
                matchId: { type: "string" },
                teamId: { type: "string" },
                leagueId: { type: "string" },
                date: { type: "string" },
                query: { type: "string" }
              }
            },
            confidence: { type: "string" },
            reasoning: { type: "string" }
          }
        }
      });

      console.log("📋 תוצאת ניתוח כוונה:", intentResult);
      return intentResult;

    } catch (error) {
      console.error("❌ שגיאה בניתוח כוונה:", error);
      return {
        api_to_use: "general_search",
        parameters: { query: question },
        confidence: "נמוך",
        reasoning: "שגיאה בניתוח - חזרה לחיפוש כללי"
      };
    }
  };

  // שלב 2: הפעלת API ספציפי - עם טיפול משופר בשגיאות
  const callSpecificAPI = async (apiName, parameters) => {
    try {
      console.log(`🚀 קורא ל-${apiName} עם פרמטרים:`, parameters);
      
      if (!apiMap[apiName]) {
        console.error(`❌ API ${apiName} לא נמצא במיפוי`);
        return null;
      }

      const apiFunction = apiMap[apiName];
      const { data, status, error } = await apiFunction(parameters);

      // בדיקה אם הAPI החזיר שגיאה
      if (error || (data && data.error)) { // Changed data.success to data.error check
        console.error(`❌ שגיאה ב-${apiName}:`, error || data.error);
        return null;
      }

      // בדיקה אם הAPI החזיר נתונים ריקים או שדה 'data' ריק או לא קיים
      if (!data || !data.data || (Array.isArray(data.data) && data.data.length === 0) || (typeof data.data === 'object' && Object.keys(data.data).length === 0)) {
        console.log(`⚠️ ${apiName} החזיר נתונים ריקים או לא רלוונטיים.`);
        return null;
      }

      console.log(`✅ ${apiName} הוחזר בהצלחה:`, data);
      return { data, status };

    } catch (error) {
      console.error(`❌ שגיאה בקריאה ל-${apiName}:`, error);
      return null;
    }
  };

  // שלב 3: סיכום נתונים באמצעות LLM
  const summarizeData = async (originalQuestion, apiData, apiName, reasoning) => {
    try {
      console.log("📝 מסכם נתונים עבור שאלה:", originalQuestion);

      const summaryPrompt = `אתה Predict-R ChatBot 🤖 - מומחה כדורגל מקצועי עם ידע מקיף בליגת האלופות 2024-25.

השאלה המקורית של המשתמש: "${originalQuestion}"

קיבלתי נתונים מ-${apiName} (${reasoning}):
${JSON.stringify(apiData, null, 2)}

משימתך:
1. נתח את הנתונים שקיבלת
2. ענה על השאלה המקורית של המשתמש בעברית
3. הצג את המידע בצורה ברורה, מאורגנת ומעניינת
4. השתמש באמוג'י רלוונטי לכדורגל (⚽🏆📊🎯⭐)
5. אם הנתונים לא מספיקים או לא רלוונטיים, אמר את זה בכנות

הנחיות עיצוב:
- השתמש בכותרות וברשימות כשמתאים
- הדגש מספרים ונתונים חשובים
- תן הקשר למידע (תאריכים, שמות קבוצות וכו')
- היה מקצועי אבל גם נגיש

ענה בעברית בלבד:`;

      const summary = await InvokeLLM({
        prompt: summaryPrompt
      });

      console.log("📋 סיכום הנתונים הושלם");
      return summary;

    } catch (error) {
      console.error("❌ שגיאה בסיכום נתונים:", error);
      return `😔 מצטער, קרתה שגיאה בעיבוד הנתונים מ-${apiName}. אנא נסה שאלה אחרת.`;
    }
  };

  // הפונקציה העיקרית המעודכנת עם fallback משופר
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("🤖 מתחיל עיבוד שאלה חכם:", currentQuestion);
      
      // שלב 1: ניתוח כוונה
      const intentAnalysis = await analyzeUserIntent(currentQuestion);
      
      let finalResponse = "";

      // שלב 2: האם נמצא API ספציפי מתאים?
      if (intentAnalysis.api_to_use && 
          intentAnalysis.api_to_use !== "general_search" && 
          apiMap[intentAnalysis.api_to_use] &&
          intentAnalysis.confidence !== "נמוך") {
        
        console.log(`🎯 נמצא API מתאים: ${intentAnalysis.api_to_use} (אמינות: ${intentAnalysis.confidence})`);
        
        // שלב 3: קריאה לAPI הספציפי
        const apiResult = await callSpecificAPI(intentAnalysis.api_to_use, intentAnalysis.parameters);
        
        if (apiResult && apiResult.data) { // Check for both apiResult and apiResult.data because callSpecificAPI now returns null if data is empty or an error
          // שלב 4: סיכום הנתונים
          finalResponse = await summarizeData(
            currentQuestion, 
            apiResult.data, 
            intentAnalysis.api_to_use,
            intentAnalysis.reasoning
          );
        } else {
          console.log("⚠️ API לא החזיר נתונים שימושיים, חוזר לחיפוש כללי");
          finalResponse = await fallbackToGeneralSearch(currentQuestion);
        }
      } else {
        console.log("🌐 משתמש בחיפוש כללי:", intentAnalysis.reasoning);
        finalResponse = await fallbackToGeneralSearch(currentQuestion);
      }

      // הוספת התשובה לצ'אט
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: finalResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("❌ שגיאה כללית בעיבוד:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: `😔 מצטער, קרתה שגיאה טכנית. אנא נסה שוב בעוד כמה שניות.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  // פונקציית fallback משופרת לחיפוש כללי
  const fallbackToGeneralSearch = async (question) => {
    try {
      console.log("🌐 מבצע חיפוש כללי באינטרנט");
      
      const enhancedPrompt = `אתה Predict-R ChatBot 🤖 - מומחה כדורגל מקצועי עם ידע מקיף בליגת האלופות 2024-25.
        
אתה מתמחה בכל הנושאים הבאים:
🏆 ליגת האלופות 2024-25 - כל המידע העדכני
⚽ תוצאות משחקים ועמדות בטבלאות
📊 סטטיסטיקות מפורטות של קבוצות ושחקנים
🎯 תחזיות ואנליזות מקצועיות למשחקים
👤 מידע על שחקנים, הרכבים והעברות
📰 חדשות כדורגל עדכניות
🔍 ניתוח ביצועים והשוואות

ענה תמיד בעברית, בצורה מקצועית ומפורטת.
אם אין לך מידע עדכני על נושא מסוים, תציין זאת בכנות.

שאלת המשתמש: ${question}`;

      const result = await InvokeLLM({
        prompt: enhancedPrompt,
        add_context_from_internet: true
      });
      
      return result;
      
    } catch (error) {
      console.error("❌ שגיאה בחיפוש כללי:", error);
      return `😔 מצטער, לא הצלחתי לקבל מידע כרגע. אנא נסה שאלה אחרת.`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex justify-center"
      >
        <Button
          onClick={toggleExpanded}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          🤖 Predict-R ChatBot מתקדם
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-3">
              <img 
                src={CHATBOT_AVATAR} 
                alt="Predict-R ChatBot" 
                className="w-10 h-10 object-contain bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-1"
              />
              <div>
                <span className="text-xl">Predict-R ChatBot 🤖</span>
                <div className="text-sm text-blue-300 font-normal">מחובר ל-9 מקורות מידע מתקדמים + חיפוש אינטרנט</div>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpanded}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Messages Container */}
          <div className="h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-green-500 to-green-700' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <img src={CHATBOT_AVATAR} alt="Predict-R ChatBot" className="w-5 h-5 object-contain" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-green-600 to-green-700 text-white'
                        : 'bg-slate-700/80 text-slate-100'
                    }`}>
                      {message.type === 'bot' ? (
                        <ReactMarkdown
                          className="prose prose-invert prose-sm max-w-none"
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-slate-200">{children}</li>,
                            strong: ({ children }) => <strong className="text-blue-300 font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="text-yellow-300">{children}</em>,
                            code: ({ children }) => <code className="bg-slate-600 px-1 py-0.5 rounded text-blue-200">{children}</code>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <img src={CHATBOT_AVATAR} alt="Predict-R ChatBot" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="bg-slate-700/80 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-slate-300">מנתח שאלה ומחפש במקורות המתקדמים...</span>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="שאל אותי על ליגת האלופות או כל נושא כדורגל..."
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
