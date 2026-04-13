import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64, mediaType = "image/jpeg" } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing ANTHROPIC_API_KEY" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `אתה מנתח טבלת אודס/ניקוד של ליגת ניחושים לכדורגל.
בתמונה יש טבלה עם תוצאות ספציפיות (למשל 1:0, 2:1, 0:0 וכו') ולכל תוצאה יש מספר (אודס/נקודות).
עמודה "1" = ניצחון קבוצת הבית, עמודה "X" = תיקו, עמודה "2" = ניצחון קבוצת האורחים.

חלץ את כל הזוגות תוצאה:ניקוד והחזר JSON בלבד בפורמט הבא:
{"1:0": 18.5, "2:0": 23.0, "0:0": 21.0, "other": 8.5}

חוקים:
- המפתח הוא תמיד "home:away" (קבוצת בית:קבוצת חוץ)
- הערך הוא המספר שמופיע ליד התוצאה
- "Any other score" או "אחר" → מפתח "other"
- החזר JSON בלבד, ללא markdown, ללא הסברים.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: "Claude API error", details: err }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "Could not parse JSON", raw: text }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const scoring = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify({ success: true, scoring }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
