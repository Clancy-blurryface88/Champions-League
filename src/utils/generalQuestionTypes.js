// Multi-team general-question types, keyed by how many teams the participant
// must pick. New pick counts are added as new `type` values (like
// multi_team's existing correct_answer JSON-array encoding) so no schema
// change is needed on general_questions to support them.
export const MULTI_PICK_COUNTS = {
  multi_team_2: 2,
  multi_team: 8,
};

export const QUESTION_TYPE_OPTIONS = [
  { value: "single_team", label: "בחירת קבוצה אחת" },
  { value: "multi_team_2", label: "בחירת 2 קבוצות" },
  { value: "multi_team", label: "בחירת 8 קבוצות" },
];

export function isMultiType(type) {
  return Object.prototype.hasOwnProperty.call(MULTI_PICK_COUNTS, type);
}

export function getPickCount(type) {
  return MULTI_PICK_COUNTS[type] || 1;
}
