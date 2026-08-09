// Central tournament configuration — Champions League 2026.
// Single source of truth for the tournament code and structural constants,
// so the app never hardcodes 'WC' (World Cup) leftovers from the original fork.

export const TOURNAMENT_CODE = 'CL';

export const TEAMS_COUNT = 36;
export const LEAGUE_PHASE_MATCHDAYS = 8;

// League-phase standings cutoffs (UEFA Champions League format, Article 17).
export const DIRECT_R16_CUTOFF = 8;   // positions 1-8 go straight to the round of 16
export const PLAYOFF_CUTOFF = 24;     // positions 9-24 go to the knockout phase play-offs
// positions 25-36 are eliminated

export const STAGES = {
  LEAGUE_PHASE: 'league_phase',
  PLAYOFF: 'playoff',
  R16: 'r16',
  QF: 'qf',
  SF: 'sf',
  FINAL: 'final',
};

export const STAGE_LABELS = {
  [STAGES.LEAGUE_PHASE]: 'שלב הליגה',
  [STAGES.PLAYOFF]: 'פלייאוף',
  [STAGES.R16]: 'שמינית גמר',
  [STAGES.QF]: 'רבע גמר',
  [STAGES.SF]: 'חצי גמר',
  [STAGES.FINAL]: 'גמר',
};
