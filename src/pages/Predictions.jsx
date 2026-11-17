import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import OrbitSpinner from "@/components/OrbitSpinner";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { User } from "@/api/entities";
import { AiBrief } from "@/api/entities";
import { ArrowLeft, Check, HelpCircle, Eye, Sparkles, ChevronDown, Dices, History, Play } from "lucide-react";
import AiBriefModal from "@/components/AiBriefModal"; // ADDED Eye icon
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import moment from "moment";
import "moment/locale/he";
import ScoreInput from "../components/predictions/ScoreInput";
import { LiquidGlassCard } from "../components/ui/liquid-glass";
import PredictionSummary from "../components/predictions/PredictionSummary";
import { GlowButton } from "../components/ui/GlowButton";
import { BgAnimateButton } from "../components/ui/bg-animate-button";
import { useNavigate, useLocation } from 'react-router-dom';
import MatchScoringRulesModal from "../components/MatchScoringRulesModal";
import MatchPredictionsModal from "../components/MatchPredictionsModal"; // ADDED MatchPredictionsModal import
import CrowdWisdomStats from "../components/predictions/CrowdWisdomStats";
import MatchOddsBar from "../components/predictions/MatchOddsBar";
import MatchArenaSection from "../components/predictions/MatchArenaSection";
import DaysBar from "../components/predictions/DaysBar";
import CardActions from "../components/predictions/CardActions";
import MatchDateTag from "../components/predictions/MatchDateTag";
import CountdownSwap from "../components/predictions/CountdownSwap";
import RankSheen from "../components/predictions/RankSheen";
import RoundStories from "../components/predictions/RoundStories";
import { storySlide } from "../components/predictions/storySlide";
import RoundHeader from "../components/predictions/RoundHeader";
import TeamFlag from "@/components/TeamFlag";
import LeagueTableModal from "@/components/LeagueTableModal";
import { PREDICTION_LOCK_MINUTES } from "@/config/tournament";
import TeamInfoModal from "@/components/TeamInfoModal";
import TeamFixturesModal from "@/components/TeamFixturesModal";
import { loadLeagueTableOverride, applyOverride } from '@/utils/standingsOverride';
import { calcStandings } from '@/utils/standings';
import { STAGES, DIRECT_R16_CUTOFF, PLAYOFF_CUTOFF } from '@/config/tournament';
import { pickWeightedScore } from '@/utils/pickWeightedScore';

// the (Home) / (Away) labels under the crests: Exo 2, italic
const HOME_AWAY_FONT = { fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontStyle: 'italic', fontSize: 11, letterSpacing: '0.02em' };


// --- Standings helper: single flat league table, no groups ---
function _computeTeamPositions(allMatches, leagueTableOverride = []) {
  const leaguePhaseMatches = allMatches.filter(m => m.stage === STAGES.LEAGUE_PHASE);
  const standings = applyOverride(calcStandings(leaguePhaseMatches), leagueTableOverride);
  const positions = {};
  standings.forEach((team, idx) => {
    const pos = idx + 1;
    const color = pos <= DIRECT_R16_CUTOFF ? '#4ade80'
                : pos <= PLAYOFF_CUTOFF ? '#facc15'
                : '#f87171';
    positions[team.name] = { pos, color };
  });
  return positions;
}

export default function Predictions() {
  const [currentRound, setCurrentRound] = useState(null);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  // NEW: Add state for scoring rules modal
  const [showScoringRulesModal, setShowScoringRulesModal] = useState(false);
  const [rulesOriginRect, setRulesOriginRect] = useState(null);
  const [selectedMatchForRules, setSelectedMatchForRules] = useState(null);
  // NEW: Add state for predictions modal
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [showLeagueTable, setShowLeagueTable] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const sheetDrag = useDragControls();
  const [leagueTableHighlight, setLeagueTableHighlight] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [fixturesTeam, setFixturesTeam] = useState(null); // { name, logo_url } — opens TeamFixturesModal
  const [fixturesLeagueMatches, setFixturesLeagueMatches] = useState([]);
  const [fixturesLogosByName, setFixturesLogosByName] = useState({});
  const [selectedMatchForPredictions, setSelectedMatchForPredictions] = useState(null);
  const [briefs, setBriefs] = useState({});
  const [selectedMatchForBrief, setSelectedMatchForBrief] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [expandedDates, setExpandedDates] = useState(null); // null = not yet initialized
  const [forcedClosed, setForcedClosed] = useState(new Set());
  const [arenaOpen, setArenaOpen] = useState(new Set());
  const [allMatchesForForm, setAllMatchesForForm] = useState([]);
  const [arenaMatchesLoading, setArenaMatchesLoading] = useState(false);
  const arenaMatchesLoadedRef = useRef(false);
  const [teamPositions, setTeamPositions] = useState({});
  const [activeDateKey, setActiveDateKey] = useState(null);
  const dateRefs = useRef({});
  const dateTabRefs = useRef({});
  const matchGridRefs = useRef({});
  const matchCardRefs = useRef({});
  const initialScrollDone = useRef(false);
  const dateStripRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);

  const urlParams = new URLSearchParams(window.location.search);
  const roundId = urlParams.get('round_id');

  const navigate = useNavigate();
  // opened from a screen in the app → shown as a sheet over it (App.jsx keeps that screen rendered)
  const asSheet = !!useLocation().state?.background;

  useEffect(() => {
    if (roundId) {
      const hasAnimated = localStorage.getItem(`animated_round_${roundId}`);
      if (!hasAnimated) {
        setShouldAnimate(true);
        localStorage.setItem(`animated_round_${roundId}`, 'true');
      } else {
        setShouldAnimate(false);
      }
    }
  }, [roundId]);

  // Update current time every second for countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to check if a match is locked (PREDICTION_LOCK_MINUTES before start)
  const isMatchLocked = (matchDate) => {
    const now = new Date();
    const matchTime = new Date(matchDate);
    const lockTime = new Date(matchTime.getTime() - PREDICTION_LOCK_MINUTES * 60 * 1000);
    return now >= lockTime;
  };

  // Replay availability: a round is played over several evenings (Israel dates).
  // An evening counts as over once every one of its matches is finished or kicked
  // off 2.5h+ ago — the same rule the replay page uses to list its nights.
  const roundOver = matches.length > 0 && matches.every((match) => match.is_finished);
  const lastOverNight = useMemo(() => {
    const ilDate = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(d);
    const played = (m) => m.is_finished || Date.parse(m.match_date) < Date.now() - 2.5 * 3600e3;
    const byNight = new Map();
    matches.forEach((m) => { if (!m.match_date) return; const k = ilDate(new Date(m.match_date)); byNight.set(k, [...(byNight.get(k) || []), m]); });
    const over = [...byNight].filter(([, list]) => list.every(played)).map(([k]) => k).sort();
    return over.length ? over[over.length - 1] : null;
  }, [matches]);
  const nightLabel = (key) => `${key.slice(8, 10)}/${key.slice(5, 7)}`;
  const openNightReplay = () => navigate(createPageUrl(`Replay?round_id=${roundId}&date=${lastOverNight}`));

  // Load all match data on mount: team positions + form history
  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const [allData, { override }] = await Promise.all([
          Match.list('match_date'),
          loadLeagueTableOverride(),
        ]);
        setAllMatchesForForm(allData.filter(m => m.is_finished && m.actual_score_a != null));
        arenaMatchesLoadedRef.current = true;
        setTeamPositions(_computeTeamPositions(allData, override));
      } catch(e) { console.error(e); }
    };
    loadMatchData();
  }, []);

  // The arena opens as a bottom sheet over the page (MatchArenaSection).
  const toggleArena = (matchId) => {
    setArenaOpen(prev => {
      const next = new Set(prev);
      next.has(matchId) ? next.delete(matchId) : next.add(matchId);
      return next;
    });
  };

  // MODIFIED: Enhanced to return breakdown of time units while preserving all existing logic
  // Also added textColor and bgColor for status display
  const getTimeUntilLock = (matchDate) => {
    const now = currentTime;
    const matchTime = new Date(matchDate);
    const lockTime = new Date(matchTime.getTime() - PREDICTION_LOCK_MINUTES * 60 * 1000);

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let status;
    let text;
    let textColor;
    let bgColor;

    if (now >= matchTime) {
      status = 'finished';
      text = 'המשחק נעול / הסתיים';
      textColor = 'text-blue-400';
      bgColor = 'bg-blue-900/50';
    } else if (now >= lockTime) {
      status = 'locked';
      text = 'נעול להימור';
      textColor = 'text-red-400';
      bgColor = 'bg-red-900/50';
    } else {
      const timeLeft = lockTime.getTime() - now.getTime();
      const duration = moment.duration(timeLeft);

      days = Math.floor(duration.asDays());
      hours = duration.hours();
      minutes = duration.minutes();
      seconds = duration.seconds();

      if (days >= 1 || hours >= 1) {
        text = `עוד ${days > 0 ? `${days} ימים, ` : ''}${hours} שעות ו-${minutes} דקות`;
        status = 'active'; // This is 'open' in the outline's context
        textColor = 'text-green-400';
        bgColor = 'bg-green-900/50';
      } else if (minutes > 0) {
        text = `ע עוד ${minutes} דקות ו-${seconds} שניות`;
        status = 'warning';
        textColor = 'text-orange-400';
        bgColor = 'bg-orange-900/50';
      } else {
        text = `עוד ${seconds} שניות!`;
        status = 'urgent';
        textColor = 'text-red-400';
        bgColor = 'bg-red-900/50';
      }
    }

    return {
      status,
      text,
      days,
      hours,
      minutes,
      seconds,
      textColor,
      bgColor
    };
  };

  // Auto-scroll the date strip to center active tab — after paint
  useEffect(() => {
    if (!activeDateKey) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const tab = dateTabRefs.current[activeDateKey];
        const strip = dateStripRef.current;
        if (!tab || !strip) return;
        const scrollLeft = tab.offsetLeft - strip.offsetWidth / 2 + tab.offsetWidth / 2;
        strip.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      });
    });
  }, [activeDateKey]);

  // Scroll content to today's match cards — waits for Framer Motion animation to finish
  useEffect(() => {
    if (initialScrollDone.current) return;
    if (!activeDateKey || !expandedDates) return;
    if (storyModeRef.current) return;
    initialScrollDone.current = true;
    // Until the round's first day (usually Tuesday) is over, the page opens at the top: the
    // round header and the days bar first, nothing to jump to yet.
    const firstDay = matchesByDate[sortedDateKeys[0]] || [];
    if (firstDay.some((m) => !m.is_finished)) return;
    const key = activeDateKey;
    setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const dayMatches = matchesByDate[key] || [];
      const lockedMatches = dayMatches.filter(m => isMatchLocked(m.match_date));
      const lastLocked = lockedMatches[lockedMatches.length - 1];
      const el = (lastLocked && matchCardRefs.current[lastLocked.id])
        || matchGridRefs.current[key]
        || dateRefs.current[key];
      if (!el) return;
      isProgrammaticScrollRef.current = true;
      const elTop = el.getBoundingClientRect().top;
      const containerTop = container.getBoundingClientRect().top;
      container.scrollTop += elTop - containerTop - 20;
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 900);
    }, 450);
  }, [activeDateKey, expandedDates]);

  // Scroll spy — update active date tab while scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (isProgrammaticScrollRef.current || storyModeRef.current) return;
      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + 220;

      let activeKey = null;
      for (const [key, el] of Object.entries(dateRefs.current)) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          activeKey = key;
        }
      }
      if (activeKey) setActiveDateKey(activeKey);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [loading]); // re-attach after loading completes and DOM is ready

  const loadRoundData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const currentUser = await User.me();
      setUser(currentUser);

      const [rounds, roundMatches] = await Promise.all([
      Round.filter({ id: roundId }),
      Match.filter({ round_id: roundId })]
      );

      if (rounds.length === 0) {
        setError('מחזור לא נמצא');
        setLoading(false);
        return;
      }

      setCurrentRound(rounds[0]);
      const sortedMatches = roundMatches.sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
      setMatches(sortedMatches);

      // Load AI briefs for all matches in this round
      const matchIds = sortedMatches.map(m => m.id);
      AiBrief.forMatches(matchIds).then(briefRows => {
        const briefMap = {};
        briefRows.forEach(b => { briefMap[b.match_id] = b; });
        setBriefs(briefMap);
      }).catch(() => {}); // silent fail - briefs are optional

      const userPredictions = await Prediction.filter({
        user_id: currentUser.id
      });

      const predictionsMap = {};
      let hasSubmittedPredictions = false;

      const latestPredictions = {};
      userPredictions.forEach((prediction) => {
        const key = `${prediction.user_id}_${prediction.match_id}`;
        if (!latestPredictions[key] ||
        new Date(prediction.created_at) > new Date(latestPredictions[key].created_at)) {
          latestPredictions[key] = prediction;
        }
      });

      Object.values(latestPredictions).forEach((prediction) => {
        const matchExists = roundMatches.some((match) => match.id === prediction.match_id);
        if (matchExists) {
          predictionsMap[prediction.match_id] = {
            predicted_score_a: prediction.predicted_score_a,
            predicted_score_b: prediction.predicted_score_b,
            prediction_id: prediction.id
          };
          hasSubmittedPredictions = true;
        }
      });

      setPredictions(predictionsMap);
      setSubmitted(hasSubmittedPredictions);
      setShowSummary(false);

    } catch (error) {
      console.error("Error loading round data:", error);
      setError('שגיאה בטעינת נתוני המחזור');
    }

    setLoading(false);
  }, [roundId]);

  useEffect(() => {
    if (roundId) {
      loadRoundData();
    }
  }, [roundId, loadRoundData]);

  const handlePredictionChange = (matchId, field, value) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    if (isMatchLocked(match.match_date)) return;

    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }));
  };

  // Group matches by calendar date
  const matchesByDate = useMemo(() => {
    const groups = {};
    matches.forEach(match => {
      const key = moment(match.match_date).format('YYYY-MM-DD');
      if (!groups[key]) groups[key] = [];
      groups[key].push(match);
    });
    return groups;
  }, [matches]);

  const sortedDateKeys = useMemo(() => Object.keys(matchesByDate).sort(), [matchesByDate]);

  // Every round (and every future one) uses the "stories" layout: a strip of the round's matches on
  // top, and one match card at a time below it (picked in the strip, or by swiping the card sideways).
  // The strip's circles: big crests in grey; the chosen match's colour opens out from the centre.
  const storyMode = !!currentRound;
  const storyCircle = 'bigReveal';
  const storyModeRef = useRef(false);
  storyModeRef.current = storyMode;
  const [storyId, setStoryId] = useState(null);
  const storyFlat = useMemo(() => sortedDateKeys.flatMap((k) => matchesByDate[k]), [sortedDateKeys, matchesByDate]);
  const storyStatus = (m) => {
    const p = predictions[m.id];
    if (p && p.predicted_score_a != null && p.predicted_score_b != null) return 'done';
    return isMatchLocked(m.match_date) ? 'missed' : 'todo';
  };
  // the crests reveal (first visit to a round) plays on each card the first time it is shown, not again
  const revealedRef = useRef(new Set());
  const pickStory = (id) => {
    if (storyId && storyId !== id) revealedRef.current.add(storyId);
    if (storyId) storyDirRef.current = storyFlat.findIndex((m) => m.id === id) >= storyFlat.findIndex((m) => m.id === storyId) ? 1 : -1;
    setStoryId(id);
    const m = matches.find((x) => x.id === id);
    if (m) setActiveDateKey(moment(m.match_date).format('YYYY-MM-DD'));
  };
  const storyDirRef = useRef(1); // 1 = going to the next match, -1 = to the previous one
  const storyStep = (d) => {
    storyDirRef.current = d;
    const i = storyFlat.findIndex((m) => m.id === storyId);
    const j = Math.max(0, Math.min(storyFlat.length - 1, i + d));
    if (storyFlat[j] && j !== i) pickStory(storyFlat[j].id);
  };
  // open on the first match still waiting for a prediction (or the next one to play)
  useEffect(() => {
    if (!storyMode || storyId || !storyFlat.length) return;
    const first = storyFlat.find((m) => storyStatus(m) === 'todo') || storyFlat.find((m) => !m.is_finished) || storyFlat[storyFlat.length - 1];
    pickStory(first.id);
  }, [storyMode, storyFlat]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize expanded dates: expand today + future, collapse past
  useEffect(() => {
    if (sortedDateKeys.length === 0) return;
    const today = moment().startOf('day');
    const initial = new Set(sortedDateKeys.filter(k => !moment(k).isBefore(today)));
    if (initial.size === 0) initial.add(sortedDateKeys[sortedDateKeys.length - 1]);
    setExpandedDates(initial);
    // Set active date to today or first upcoming
    const firstOpen = sortedDateKeys.find(k => !moment(k).isBefore(today)) || sortedDateKeys[sortedDateKeys.length - 1];
    setActiveDateKey(firstOpen);
  }, [sortedDateKeys.join(',')]);

  const toggleDate = (dateKey) => {
    const hasLocked = matchesByDate[dateKey]?.some(m => isMatchLocked(m.match_date));
    const currentlyOpen = !forcedClosed.has(dateKey) && (expandedDates?.has(dateKey) || hasLocked);

    if (currentlyOpen) {
      setForcedClosed(prev => new Set([...prev, dateKey]));
      setExpandedDates(prev => { const next = new Set(prev); next.delete(dateKey); return next; });
    } else {
      setForcedClosed(prev => { const next = new Set(prev); next.delete(dateKey); return next; });
      setExpandedDates(prev => new Set([...prev, dateKey]));
    }
  };

  const scrollToDate = (dateKey) => {
    setActiveDateKey(dateKey);
    isProgrammaticScrollRef.current = true;
    // Ensure section is open
    setExpandedDates(prev => {
      const next = new Set(prev);
      next.add(dateKey);
      return next;
    });
    setTimeout(() => {
      dateRefs.current[dateKey]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 900);
    }, 50);
  };

  // Helper: does a date have unlocked matches with missing predictions?
  const dateHasMissingPredictions = (dateKey) => {
    return (matchesByDate[dateKey] || []).some(m => {
      if (isMatchLocked(m.match_date)) return false;
      const p = predictions[m.id];
      return !p || p.predicted_score_a == null || p.predicted_score_b == null;
    });
  };

  const areAllPredictionsComplete = () => {
    const availableMatches = matches.filter((match) => !isMatchLocked(match.match_date));

    return availableMatches.every((match) => {
      const prediction = predictions[match.id];
      return prediction &&
      prediction.predicted_score_a !== undefined &&
      prediction.predicted_score_a !== null &&
      prediction.predicted_score_b !== undefined &&
      prediction.predicted_score_b !== null;
    });
  };

  const predictionProgress = () => {
    const available = matches.filter((match) => !isMatchLocked(match.match_date));
    const filled = available.filter((match) => {
      const p = predictions[match.id];
      return p && p.predicted_score_a != null && p.predicted_score_b != null;
    });
    return { filled: filled.length, total: available.length };
  };

  const handleSubmit = () => {
    // The button will be disabled if predictions are not complete, so no alert needed here.
    setShowSummary(true);
  };

  const handleConfirmPredictions = async () => {
    console.log("🚀 Starting handleConfirmPredictions");
    setSaving(true);
    setError('');

    try {
      const predictionPromises = matches.map(async (match) => {
        if (isMatchLocked(match.match_date)) {
          return;
        }

        const prediction = predictions[match.id];
        if (!prediction ||
        prediction.predicted_score_a === undefined ||
        prediction.predicted_score_a === null ||
        prediction.predicted_score_b === undefined ||
        prediction.predicted_score_b === null) {
          return;
        }

        const predictionData = {
          match_id: match.id,
          user_id: user.id,
          predicted_score_a: prediction.predicted_score_a,
          predicted_score_b: prediction.predicted_score_b
        };

        if (prediction.prediction_id) {
          return await Prediction.update(prediction.prediction_id, {
            predicted_score_a: prediction.predicted_score_a,
            predicted_score_b: prediction.predicted_score_b
          });
        }
        const created = await Prediction.create(predictionData);
        setPredictions(prev => ({
          ...prev,
          [match.id]: { ...prev[match.id], prediction_id: created.id }
        }));
        return created;
      }).filter(Boolean);

      await Promise.all(predictionPromises);

      console.log("✅ Predictions saved successfully, starting animation");

      // Reset saving state first
      setSaving(false);

      // Close the summary modal
      setShowSummary(false);

      // Show success animation
      console.log("🎬 Setting showSubmissionSuccess to true");
      setShowSubmissionSuccess(true);

      // Navigate after animation
      setTimeout(() => {
        console.log("🔄 Navigating to Dashboard after animation");
        navigate(createPageUrl("Dashboard")); // Use navigate instead of window.location.href
      }, 2000); // Increased to 2 seconds to make sure we see it

    } catch (error) {
      console.error("❌ Error saving predictions:", error);
      setError('שגיאה בשמירת הניחושים. אנא נסה שוב.');
      setSaving(false);
    }
  };

  const handleCancelPredictions = () => {
    setShowSummary(false);
  };

  // NEW: Handle scoring rules modal open
  const handleShowScoringRules = (match) => {
    // the panel grows out of this match card
    setRulesOriginRect(matchCardRefs.current[match.id]?.getBoundingClientRect() || null);
    setSelectedMatchForRules(match);
    setShowScoringRulesModal(true);
  };

  // NEW: Handle scoring rules modal close
  const handleCloseScoringRules = () => {
    setShowScoringRulesModal(false);
    setSelectedMatchForRules(null);
  };

  // NEW: Handle predictions modal open
  const handleShowPredictions = (match) => {
    setSelectedMatchForPredictions(match);
    setShowPredictionsModal(true);
  };

  // NEW: Handle predictions modal close
  const handleClosePredictions = () => {
    setShowPredictionsModal(false);
    setSelectedMatchForPredictions(null);
  };

  // Opens TeamFixturesModal for the clicked team's logo — fetches league-phase
  // matches fresh each time (small dataset, keeps it simple and always current).
  const handleTeamLogoClick = async (teamName, teamLogo) => {
    try {
      const leagueMatches = await Match.filter({ stage: STAGES.LEAGUE_PHASE });
      const logosByName = {};
      leagueMatches.forEach((m) => {
        logosByName[m.team_a] = m.team_a_logo;
        logosByName[m.team_b] = m.team_b_logo;
      });
      setFixturesLeagueMatches(leagueMatches);
      setFixturesLogosByName(logosByName);
      setFixturesTeam({ name: teamName, logo_url: teamLogo });
    } catch (error) {
      console.error("Error loading team fixtures:", error);
    }
  };



  if (loading) return <LoadingScreen />;

  if (!currentRound) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">מחזור לא נמצא</p>
          </div>
        </div>
      </div>);

  }

  // The round page opens as a bottom sheet under the app's top bar (108px): it slides up, and the handle at its top closes it —
  // tap it, or drag it down (far enough or fast enough) and the sheet slides away, then back.
  const closeSheet = () => setSheetClosing(true);
  return (
    <>
    {asSheet && (
      <motion.div
        className="fixed inset-0"
        style={{ zIndex: 29, background: 'rgba(2,6,23,0.6)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: sheetClosing ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        onClick={closeSheet}
      />
    )}
    <motion.div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: asSheet ? 30 : undefined, top: '108px', background: 'linear-gradient(135deg, #0d2b52 0%, #050d1c 100%)', borderRadius: '22px 22px 0 0', borderTop: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 -8px 30px rgba(0,0,0,0.5)' }}
      initial={{ y: '100%' }}
      animate={{ y: sheetClosing ? '100%' : 0 }}
      transition={{ duration: sheetClosing ? 0.28 : 0.42, ease: sheetClosing ? [0.4, 0, 1, 1] : [0.32, 0.72, 0, 1] }}
      onAnimationComplete={() => { if (sheetClosing) { if (window.history.state?.idx > 0) navigate(-1); else navigate('/'); } }}
      drag="y"
      dragControls={sheetDrag}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.9 }}
      onDragEnd={(e, info) => { if (info.offset.y > 120 || info.velocity.y > 600) closeSheet(); }}
    >
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-4xl mx-auto px-4 py-4 pb-20" style={{ paddingTop: '6px' }}>
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          {/* the sheet's handle: tap or drag down to close */}
          <div
            onPointerDown={(e) => sheetDrag.start(e)}
            onClick={closeSheet}
            className="flex justify-center py-2 cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            role="button"
            aria-label="סגירה"
          >
            <span className="block h-1 w-14 rounded-full" style={{ background: '#60a5fa', boxShadow: '0 0 10px rgba(96,165,250,0.9)' }} />
          </div>
          <div className="mt-3">
            <RoundHeader name={currentRound?.name} sent={submitted} />
          </div>
        </div>

        {error &&
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        }



        {/* The stories strip alone, on the round's own background (the table is a tab in the match arena) */}
        {storyMode && storyId && expandedDates !== null && (
          <RoundStories dateKeys={sortedDateKeys} matchesByDate={matchesByDate} selectedId={storyId} onSelect={pickStory} statusOf={storyStatus} circle={storyCircle} />
        )}

        {/* Week Strip */}
        {!storyMode && expandedDates !== null && sortedDateKeys.length > 0 && (
          <div
            className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-2 mb-2"
            style={{
              background: 'rgba(5,10,20,0.35)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
          <DaysBar
            dateKeys={sortedDateKeys}
            activeKey={activeDateKey}
            onPick={scrollToDate}
            onTable={() => { setLeagueTableHighlight({}); setShowLeagueTable(true); }}
            stripRef={dateStripRef}
            tabRef={(key, el) => { dateTabRefs.current[key] = el; }}
          />
          </div>
        )}

        {/* Matches grouped by date */}
        {expandedDates !== null && (
        <div className="space-y-4">
          {sortedDateKeys.map(dateKey => {
            const dayMatches = matchesByDate[dateKey];
            const isPast = moment(dateKey).isBefore(moment().startOf('day'));
            const isToday = moment(dateKey).isSame(moment(), 'day');
            const lockedCount = dayMatches.filter(m => isMatchLocked(m.match_date)).length;
            const allLocked = lockedCount === dayMatches.length;
            const hasLockedMatches = lockedCount > 0;
            const isOpen = storyMode || (!forcedClosed.has(dateKey) && (expandedDates.has(dateKey) || hasLockedMatches));
            if (storyMode && !dayMatches.some((m) => m.id === storyId)) return null;
            const openCount = dayMatches.length - lockedCount;

            const dayOfWeek = moment(dateKey).locale('he').format('dddd');
            const dayDate   = moment(dateKey).locale('he').format('D MMMM');

            return (
              <div key={dateKey}>
                {/* Date header */}
                <button
                  ref={el => dateRefs.current[dateKey] = el}
                  onClick={() => toggleDate(dateKey)}
                  className="w-full group"
                  style={{ scrollMarginTop: '195px', display: storyMode ? 'none' : undefined }}
                >
                  {/* Gradient line top */}
                  <div className="h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent mb-3" />

                  <div className="flex items-center px-1 mb-3">
                    {/* Left line */}
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />

                    {/* Center pill */}
                    <div
                      className="mx-3 flex items-center gap-3 px-4 py-2 rounded-2xl"
                      style={{
                        background: isToday
                          ? 'linear-gradient(135deg,rgba(9, 122, 220,0.15),rgba(9, 122, 220,0.05))'
                          : isPast
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(255,255,255,0.06)',
                        border: isToday
                          ? '1px solid rgba(9, 122, 220,0.35)'
                          : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {/* Date text */}
                      <div className="flex flex-col items-center gap-0.5">
                        {isToday ? (
                          <span className="text-xs font-bold text-sky-400 whitespace-nowrap">היום</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-xs font-bold whitespace-nowrap ${isPast ? 'text-slate-500' : 'text-white'}`}>
                              {dayOfWeek}
                            </span>
                            <span className={`text-xs font-bold whitespace-nowrap ${isPast ? 'text-slate-500' : 'text-white'}`}>
                              {dayDate}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Chevron */}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-all duration-300 ${
                          isPast ? 'text-slate-600' : 'text-slate-400'
                        } group-hover:text-white ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Right line */}
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                </button>

                {/* Matches grid for this date */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div ref={el => matchGridRefs.current[dateKey] = el} className="relative grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 pb-2">
                        <AnimatePresence initial={false} mode="popLayout" custom={storyDirRef.current}>
                        {(storyMode ? dayMatches.filter((m) => m.id === storyId) : dayMatches).map((match, index) => {
            const isLocked = isMatchLocked(match.match_date);
            const timeInfo = getTimeUntilLock(match.match_date);
            const prediction = predictions[match.id] || {};

            return (
              <motion.div
                key={match.id}
                ref={el => matchCardRefs.current[match.id] = el}
                // stories: the card follows the finger sideways; let go far / fast enough and it slides out
                // while the next one slides in from the other side. Right-to-left app: dragging to the
                // right brings the next match (the one to the left in the strip), to the left the previous.
                {...(storyMode ? {
                  custom: storyDirRef.current,
                  variants: storySlide().variants,
                  initial: 'enter',
                  animate: 'center',
                  exit: 'exit',
                  transition: storySlide().transition,
                  drag: 'x',
                  dragDirectionLock: true,
                  dragConstraints: { left: 0, right: 0 },
                  dragElastic: 0.7,
                  onDragEnd: (e, info) => {
                    const go = info.offset.x > 70 || info.velocity.x > 450 ? 1 : info.offset.x < -70 || info.velocity.x < -450 ? -1 : 0;
                    if (go) storyStep(go);
                  },
                } : {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: index * 0.06 },
                })}
                className="h-full">

                <div className="h-full relative overflow-hidden" style={{ borderRadius: 18 }}>
                <LiquidGlassCard
                  borderRadius="18px"
                  shadowIntensity="lg"
                  glowIntensity="xs"
                  className={`relative transition-all duration-300 h-full flex flex-col overflow-hidden ${isLocked ? 'opacity-65' : ''}`}
                  style={{
                    background: isLocked ? 'rgba(10,18,35,0.45)' : 'rgba(5,10,18,0.75)',
                    // stories: the card slides and is dragged; a blurred backdrop under a moving card
                    // flickered on phones, and with one card on screen there is little behind it to blur
                    ...(storyMode ? { backdropFilter: 'none', WebkitBackdropFilter: 'none' } : {}),
                  }}
                >
                  {/* Champions League starball background art — alternates between two
                      variants by card position so a grid of matches isn't visually flat */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(/champions/${index % 2 === 0 ? 'match-card-bg-2.webp' : 'match-card-bg-3.webp'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.5,
                    }} />

                  {/* Noise texture overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />
                  {/* While the match is open, the countdown pill takes turns with the kick-off time and
                      date (CountdownSwap). Once it's locked or over there's no countdown, so the date
                      and kick-off hang from the card's top edge instead. */}
                  {(timeInfo.status === 'locked' || timeInfo.status === 'finished') && <MatchDateTag date={match.match_date} />}
                  {/* relative + z: the card content sits above the starball art and the glass overlays (they used to paint over it) */}
                  <CardContent className="relative z-[2] p-5 pt-12 flex-1 flex flex-col justify-between">
                    {!(timeInfo.status === 'locked' || timeInfo.status === 'finished') && (
                    // raised 28px into the room above; the extra bottom margin keeps everything below in place
                    <div className="flex justify-center" style={{ marginTop: -28, marginBottom: 40 }}>
                      <CountdownSwap timeInfo={timeInfo} date={match.match_date} compact={storyMode} />
                    </div>
                    )}

                    {/* Separator below group badge */}
                    <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)' }} />

                    {/* Teams & Score Input */}
                    <div className="py-3 px-1">
                      <div
                        className="w-full grid gap-x-2"
                        style={{ gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', gridTemplateRows: 'auto auto' }}
                      >
                        {/* Row 1: flags */}
                        <div className="flex justify-center items-center pt-[22px]"
                             style={{ gridColumn: 1, gridRow: 1 }}>
                          <motion.div
                            onClick={() => handleTeamLogoClick(match.team_a, match.team_a_logo)}
                            className="cursor-pointer"
                            animate={{ filter: [
                              'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                              'drop-shadow(0 0 18px rgba(255,255,255,0.75)) drop-shadow(0 8px 20px rgba(0,0,0,0.8))',
                              'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                            ]}}
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
                            <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-[77px] h-[77px]" animate={shouldAnimate && !(storyMode && revealedRef.current.has(match.id))} rounded="md" />
                          </motion.div>
                        </div>

                        {/* Score — spans both rows, centered */}
                        <div className="flex items-center gap-2 px-1"
                             style={{ gridColumn: 2, gridRow: '1 / 3', alignSelf: 'center', marginTop: -10 }}>
                          {!isLocked ? (
                            <>
                              <ScoreInput
                                value={prediction.predicted_score_a}
                                onChange={(value) => handlePredictionChange(match.id, 'predicted_score_a', value)}
                                hasError={!areAllPredictionsComplete() && (prediction.predicted_score_a === undefined || prediction.predicted_score_a === null)} />
                              <span className="text-slate-400 font-bold text-lg">-</span>
                              <ScoreInput
                                value={prediction.predicted_score_b}
                                onChange={(value) => handlePredictionChange(match.id, 'predicted_score_b', value)}
                                hasError={!areAllPredictionsComplete() && (prediction.predicted_score_b === undefined || prediction.predicted_score_b === null)} />
                            </>
                          ) : (
                            <>
                              {/* locked: the saved prediction in the same frame as the open picker, without arrows */}
                              <ScoreInput value={prediction.predicted_score_a} locked />
                              <span className="text-slate-400 font-bold text-lg">-</span>
                              <ScoreInput value={prediction.predicted_score_b} locked />
                            </>
                          )}
                        </div>

                        <div className="flex justify-center items-center pt-[22px]"
                             style={{ gridColumn: 3, gridRow: 1 }}>
                          <motion.div
                            onClick={() => handleTeamLogoClick(match.team_b, match.team_b_logo)}
                            className="cursor-pointer"
                            animate={{ filter: [
                              'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                              'drop-shadow(0 0 18px rgba(255,255,255,0.75)) drop-shadow(0 8px 20px rgba(0,0,0,0.8))',
                              'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                            ]}}
                            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}>
                            <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-[77px] h-[77px]" animate={shouldAnimate && !(storyMode && revealedRef.current.has(match.id))} rounded="md" />
                          </motion.div>
                        </div>

                        {/* Row 2: home / away label and table position under each crest (no team name: the crest says it) */}
                        <div style={{ gridColumn: 1, gridRow: 2, alignSelf: 'start' }}
                             className="flex flex-col items-center">
                          <span className="leading-none text-center" style={{ ...HOME_AWAY_FONT, color: 'rgba(255,255,255,0.78)', textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>(Home)</span>
                          {teamPositions[match.team_a] && (
                            <RankSheen value={teamPositions[match.team_a].pos} color={teamPositions[match.team_a].color} />
                          )}
                        </div>
                        <div style={{ gridColumn: 3, gridRow: 2, alignSelf: 'start' }}
                             className="flex flex-col items-center">
                          <span className="leading-none text-center" style={{ ...HOME_AWAY_FONT, color: 'rgba(255,255,255,0.78)', textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>(Away)</span>
                          {teamPositions[match.team_b] && (
                            <RankSheen value={teamPositions[match.team_b].pos} color={teamPositions[match.team_b].color} />
                          )}
                        </div>
                      </div>
                    </div>

                    {!isLocked && (
                      <div className="flex justify-center -mt-1 mb-1">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const { h, a } = pickWeightedScore(match.score_odds);
                            handlePredictionChange(match.id, 'predicted_score_a', h);
                            handlePredictionChange(match.id, 'predicted_score_b', a);
                          }}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(16px) saturate(140%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
                            border: '1px solid rgba(74,222,128,0.45)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.20)',
                          }}
                        >
                          <Dices className="w-3.5 h-3.5" style={{ color: '#4ade80', filter: 'drop-shadow(0 0 5px rgba(74,222,128,0.85))' }} />
                          <span style={{
                            backgroundImage: 'linear-gradient(135deg, #bbf7d0 0%, #4ade80 100%)',
                            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 5px rgba(74,222,128,0.6))',
                          }}>בחר עבורי</span>
                        </motion.button>
                      </div>
                    )}

                    {/* Previous Match Score */}
                    {match.previous_match_score_a !== undefined && match.previous_match_score_a !== null &&
                    match.previous_match_score_b !== undefined && match.previous_match_score_b !== null &&
                    <div className="flex justify-center mt-2">
                        <div className="bg-slate-800/80 text-slate-300 px-3 py-1 text-[10px] font-medium rounded-full border border-slate-700/50">
                          משחק ראשון: {match.previous_match_score_b} - {match.previous_match_score_a}
                        </div>
                      </div>
                    }

                    {/* Location (the date and time moved to the tag at the card's top) */}
                    {match.location && (
                      <div className="pt-3 flex items-center justify-center gap-1 text-xs text-slate-400">
                        <span>📍</span>
                        <span>{match.location}</span>
                      </div>
                    )}

                    {/* Separator */}
                    <div className="h-px mt-4" style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)' }} />

                    {/* Arena — bottom sheet (portal) */}
                    <AnimatePresence>
                      {arenaOpen.has(match.id) && (
                        <MatchArenaSection
                          key={`arena-${match.id}`}
                          match={match}
                          isLocked={isLocked}
                          allMatches={allMatchesForForm}
                          loading={arenaMatchesLoading}
                          onClose={() => toggleArena(match.id)}
                          showTable={storyMode}
                        />
                      )}
                    </AnimatePresence>

                    {/* The bottom buttons (1 X 2 / match arena / ניחושים), split like the days bar. Solid
                        gradients only: clip-path together with backdrop-filter broke rendering before. */}
                    <div className={storyMode ? 'mt-5 flex justify-center' : '-mx-3 -mb-3 mt-5'}>
                      <CardActions
                        pill={storyMode}
                        onOdds={() => handleShowScoringRules(match)}
                        onPredictions={() => handleShowPredictions(match)}
                        onArena={() => toggleArena(match.id)} />
                    </div>
                  </CardContent>
                </LiquidGlassCard>
                </div>
              </motion.div>
            );
                        })}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        )}

      </div>
      </div>

      {/* Round over → gold "replay" button in the same bottom bar as "send predictions" */}
      {roundOver && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 py-2 border-t border-white/[0.08] z-20 rounded-t-3xl" style={{ background: 'rgba(10,18,40,0.35)', backdropFilter: 'blur(28px) saturate(1.6)', WebkitBackdropFilter: 'blur(28px) saturate(1.6)' }}>
          <motion.button
            onClick={() => navigate(createPageUrl(`Replay?round_id=${roundId}`))}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            whileTap={{ scale: 0.96 }}
            // double plate, like the round buttons: gold play plate + glass text plate, both slanted
            className="w-full max-w-sm flex items-stretch gap-1 h-[50px]"
            dir="ltr"
          >
            <span className="w-[58px] grid place-items-center rounded" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(135deg,#fde047,#eab308)', color: '#3a2a00' }}>
              <Play className="w-5 h-5" fill="currentColor" style={{ transform: 'skewX(12deg)' }} />
            </span>
            <span className="flex-1 grid place-items-center rounded font-extrabold text-base text-white" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.4)' }}>
              <span style={{ transform: 'skewX(12deg)' }}>הילוך חוזר למחזור</span>
            </span>
          </motion.button>
        </div>
      )}

      {/* An evening of the round is over but nothing is left to predict (the next evening's
          matches are all locked and still running) → the same gold button, for that evening */}
      {!roundOver && lastOverNight && !matches.some((match) => !isMatchLocked(match.match_date)) && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 py-2 border-t border-white/[0.08] z-20 rounded-t-3xl" style={{ background: 'rgba(10,18,40,0.35)', backdropFilter: 'blur(28px) saturate(1.6)', WebkitBackdropFilter: 'blur(28px) saturate(1.6)' }}>
          <motion.button
            onClick={openNightReplay}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            whileTap={{ scale: 0.96 }}
            className="w-full max-w-sm flex items-stretch gap-1 h-[50px]"
            dir="ltr"
          >
            <span className="w-[58px] grid place-items-center rounded" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(135deg,#fde047,#eab308)', color: '#3a2a00' }}>
              <History className="w-5 h-5" strokeWidth={2.4} style={{ transform: 'skewX(12deg)' }} />
            </span>
            <span className="flex-1 grid place-items-center rounded font-extrabold text-base text-white" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.4)' }}>
              <span style={{ transform: 'skewX(12deg)' }} dir="rtl">הילוך חוזר לערב <bdi dir="ltr">{nightLabel(lastOverNight)}</bdi></span>
            </span>
          </motion.button>
        </div>
      )}

      {/* Submit Button — תמיד גלוי, מחוץ לאזור הגלילה */}
      {matches.some((match) => !isMatchLocked(match.match_date)) && (() => {
        const { filled, total } = predictionProgress();
        const allDone = areAllPredictionsComplete();
        const pct = total > 0 ? (filled / total) * 100 : 0;
        return (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 py-2 border-t border-white/[0.08] z-20 rounded-t-3xl" style={{ background: 'rgba(10,18,40,0.35)', backdropFilter: 'blur(28px) saturate(1.6)', WebkitBackdropFilter: 'blur(28px) saturate(1.6)' }}>
          {/* the send/update button, and — once an evening of the round is over — a gold
              replay square for that evening at its end, in the same slanted-plate style */}
          <div className="w-full max-w-sm flex items-stretch gap-1 h-[50px]" dir="ltr">
          <div className="flex-1 min-w-0 flex">
          <AnimatePresence mode="wait">
            {allDone || submitted ? (
              <motion.button
                key="submit-btn"
                onClick={handleSubmit}
                disabled={saving}
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                // double plate, like the replay button: green icon plate + glass text plate, both slanted
                className="w-full max-w-sm flex items-stretch gap-1 h-[50px] disabled:opacity-70"
                dir="ltr"
                whileTap={{ scale: 0.96 }}
              >
                <span className="w-[58px] grid place-items-center rounded" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(135deg,#4ade80,#16a34a)', color: '#052e16' }}>
                  <span className="text-[22px] font-black leading-none" style={{ transform: 'skewX(12deg)' }}>
                    {saving ? <OrbitSpinner size={18} /> : submitted ? '✎' : '✓'}
                  </span>
                </span>
                <span className="flex-1 grid place-items-center rounded font-extrabold text-base text-white" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.4)' }}>
                  <span style={{ transform: 'skewX(12deg)' }}>{saving ? 'שולח...' : submitted ? 'עדכן ניחושים' : 'שלח ניחושים'}</span>
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="progress-bar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                // same double plate as the send button: gold count plate (like the replay button) + glass plate that fills up
                className="w-full max-w-sm flex items-stretch gap-1 h-[50px]"
                dir="ltr"
              >
                <span className="w-[58px] grid place-items-center rounded" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(135deg,#fde047,#eab308)' }}>
                  <span className="tabular-nums" style={{ transform: 'skewX(12deg)', fontFamily: "var(--num-font)", fontWeight: 700, fontSize: 28, lineHeight: 1, color: '#3a2a00', paddingTop: 3 }}>{filled}</span>
                </span>
                <span className="relative flex-1 grid place-items-center rounded overflow-hidden" style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <motion.span
                    className="absolute inset-0"
                    initial={false}
                    animate={{ scaleX: pct / 100 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    style={{ background: 'linear-gradient(90deg, rgba(250,204,21,0.16) 0%, rgba(250,204,21,0.38) 100%)', transformOrigin: 'left' }}
                  />
                  <span className="relative font-bold text-[15px] text-white" style={{ transform: 'skewX(12deg)' }} dir="rtl">
                    <bdi dir="ltr">{filled} / {total}</bdi> ניחושים
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
          {lastOverNight && (
            <motion.button
              onClick={openNightReplay}
              aria-label={`הילוך חוזר לערב ${nightLabel(lastOverNight)}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              whileTap={{ scale: 0.92 }}
              className="w-[58px] flex-shrink-0 grid place-items-center rounded"
              // skew via framer's own value — a CSS transform here would be replaced by its scale animation
              style={{ skewX: -12, background: 'linear-gradient(135deg,#fde047,#eab308)', color: '#3a2a00' }}
            >
              <History className="w-5 h-5" strokeWidth={2.4} style={{ transform: 'skewX(12deg)' }} />
            </motion.button>
          )}
          </div>
        </div>
        );
      })()}

        {/* Summary Modal */}
        <AnimatePresence>
          {showSummary &&
          <PredictionSummary
            predictions={predictions}
            roundId={roundId}
            onConfirm={handleConfirmPredictions}
            onCancel={handleCancelPredictions}
            saving={saving} />

          }
        </AnimatePresence>

        {/* NEW: Scoring Rules Modal */}
        <MatchScoringRulesModal
          isOpen={showScoringRulesModal}
          onClose={handleCloseScoringRules}
          match={selectedMatchForRules}
          originRect={rulesOriginRect} />


        {/* NEW: Predictions Modal */}
        <MatchPredictionsModal
          isOpen={showPredictionsModal}
          onClose={handleClosePredictions}
          match={selectedMatchForPredictions} />

        {showLeagueTable && (
          <LeagueTableModal
            highlightTeams={leagueTableHighlight}
            onClose={() => setShowLeagueTable(false)} />
        )}

        {selectedTeam && (
          <TeamInfoModal
            teamName={selectedTeam.name}
            teamLogo={selectedTeam.logo}
            onClose={() => setSelectedTeam(null)} />
        )}

        {fixturesTeam && (
          <TeamFixturesModal
            team={fixturesTeam}
            allMatches={fixturesLeagueMatches}
            logosByName={fixturesLogosByName}
            onClose={() => setFixturesTeam(null)} />
        )}

        {selectedMatchForBrief && (
          <AiBriefModal
            match={selectedMatchForBrief}
            brief={briefs[selectedMatchForBrief.id] || null}
            onClose={() => setSelectedMatchForBrief(null)} />
        )}

        {/* --- SUCCESS ANIMATION OVERLAY --- */}
        <AnimatePresence>
          {showSubmissionSuccess &&
          <>
              <motion.div
              className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>

                <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{
                  scale: [0.5, 1.2, 1],
                  opacity: 1,
                  rotate: 0
                }}
                exit={{ scale: 0.8, opacity: 0, rotate: 15 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 10,
                  duration: 0.6
                }}
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-800/95 to-green-900/95 rounded-3xl shadow-2xl border-2 border-green-600 text-white backdrop-blur-sm max-w-xs mx-auto">

                  <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>

                    <Check className="w-20 h-20 text-green-300 mb-4" />
                  </motion.div>

                  <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="2xl font-bold text-green-100 mb-2 text-center">

                    נשלח בהצלחה
                  </motion.h2>

                  <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-green-200 text-center text-sm">
                  </motion.p>
                </motion.div>
              </motion.div>
            </>
          }
        </AnimatePresence>

    </motion.div>
    </>);

}