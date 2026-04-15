"""
generate_briefs.py
Generates pre-match AI briefs (Hebrew) for WC2026 matches using Claude API.

Usage:
  python generate_briefs.py --all              # All matches without a brief
  python generate_briefs.py --scheduled        # Matches within 60hrs, no brief yet
  python generate_briefs.py --refresh          # Regenerate ALL briefs (overwrites)
  python generate_briefs.py --refresh ID1 ID2  # Regenerate specific match IDs
"""

import os
import sys
import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ── Load .env ────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env", override=True)
    load_dotenv(Path(__file__).parent.parent / ".env", override=True)
    load_dotenv(Path(__file__).parent.parent / ".env.local", override=True)
except ImportError:
    pass  # fallback to OS env vars

from supabase import create_client
import anthropic

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

# ── Clients ──────────────────────────────────────────────────────────
SUPABASE_URL      = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY      = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    sys.exit("❌  Missing SUPABASE_URL / SUPABASE_SERVICE_KEY")
if not ANTHROPIC_API_KEY:
    sys.exit("❌  Missing ANTHROPIC_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
claude   = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ── CLI args ─────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Generate WC2026 pre-match briefs (Hebrew)")
group  = parser.add_mutually_exclusive_group(required=True)
group.add_argument("--all",       action="store_true")
group.add_argument("--scheduled", action="store_true")
group.add_argument("--refresh",   nargs="*", metavar="MATCH_ID")
args = parser.parse_args()

# ── Helpers ───────────────────────────────────────────────────────────
def get_briefed_ids():
    rows = supabase.table("ai_briefs").select("match_id").execute()
    return {r["match_id"] for r in rows.data}


def get_matches():
    fields = "id, team_a, team_b, match_date, league, location"

    if args.refresh is not None:
        if args.refresh:
            data = supabase.table("matches").select(fields).in_("id", args.refresh).execute().data
            print(f"Refresh: {len(data)} match(es) by ID")
            return data
        data = supabase.table("matches").select(fields).execute().data
        print(f"Refresh: all {len(data)} matches")
        return data

    briefed = get_briefed_ids()

    if args.scheduled:
        now    = datetime.now(timezone.utc)
        cutoff = now + timedelta(hours=60)
        data   = (supabase.table("matches").select(fields)
                  .gte("match_date", now.isoformat())
                  .lte("match_date", cutoff.isoformat())
                  .execute().data)
        data   = [m for m in data if m["id"] not in briefed]
        print(f"Scheduled: {len(data)} match(es) within 60 hrs need briefs")
        return data

    if args.all:
        data = supabase.table("matches").select(fields).execute().data
        data = [m for m in data if m["id"] not in briefed]
        print(f"All: {len(data)} match(es) missing briefs")
        return data

    return []


# ── Prompts ───────────────────────────────────────────────────────────
SYSTEM_PROMPT = """אתה אנליסט כדורגל חד שכותב סיכומי טרום משחק לגביע העולם 2026.
הסגנון שלך: סוחף, דעתני, שיחתי — כמו וואטסאפ קבוצתי של חברים שמבינים כדורגל, לא עיתון.

כללים מחייבים:
- כתוב בעברית תקנית ונכונה בלבד.
- אפס Markdown. ללא כוכביות, הדגשות, כותרות, מקפים כרשימה. פרוזה זורמת בלבד.
- היה דעתני — קח עמדה ותמוך בה.
- עד 220 מילה.
- אל תמציא נתונים סטטיסטיים ספציפיים שאינך בטוח בהם. אם אינך בטוח, נסח כהתרשמות כללית.

מבנה הסיכום (פרוזה רציפה, ללא כותרות):
1. פתיחה מסעירה — מה עומד על הכף, מה האווירה סביב המשחק הזה
2. רקע על שתי הנבחרות — כוחות, חולשות, סגנון
3. היסטוריה ראש בראש — אם נפגשו: מתי ומה היה. אם לא: אמור זאת ומה זה אומר
4. שחקן מפתח מכל צד — מי יכול לשנות את התמונה
5. תחזית: אחוזי ניצחון (בית / תיקו / חוץ) + תוצאה משוערת + המלצה אחת חדה"""


def build_prompt(match):
    home    = match["team_a"]
    away    = match["team_b"]
    stage   = match.get("league") or "שלב הבתים"
    dt_str  = match.get("match_date", "")
    loc     = match.get("location") or ""

    # Format date nicely
    try:
        dt  = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        date_label = dt.strftime("%d/%m/%Y %H:%M UTC")
    except Exception:
        date_label = dt_str

    location_line = f" | {loc}" if loc else ""

    return (
        f"כתוב סיכום טרום משחק עבור:\n\n"
        f"{home} נגד {away} | {stage} | {date_label}{location_line}\n\n"
        f"השתמש בידע שלך על שתי הנבחרות לפי המבנה שתואר."
    )


# ── Generate ──────────────────────────────────────────────────────────
def generate_brief(match):
    resp = claude.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_prompt(match)}],
    )
    return resp.content[0].text.strip()


# ── Main ──────────────────────────────────────────────────────────────
matches = get_matches()

if not matches:
    print("No matches to process. Done!")
    sys.exit(0)

success, failed = 0, 0

for match in matches:
    home = match["team_a"]
    away = match["team_b"]
    print(f"⏳  Generating: {home} vs {away} …")

    try:
        brief = generate_brief(match)
        supabase.table("ai_briefs").upsert(
            {
                "match_id":     match["id"],
                "brief_he":     brief,
                "generated_at": datetime.now(timezone.utc).isoformat(),
            },
            on_conflict="match_id",
        ).execute()
        print(f"  ✓  Saved: {home} vs {away}")
        success += 1
    except Exception as e:
        print(f"  ✗  Error for {home} vs {away}: {e}")
        failed += 1

print(f"\nDone!  ✓ {success} generated   ✗ {failed} failed")
