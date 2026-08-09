import { supabase } from './supabase';
import { TOURNAMENT_CODE } from '@/config/tournament';

// ============================================
// UPLOAD FILE — העלאת קובץ ל-Supabase Storage
// ============================================
export const UploadFile = async ({ file }) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return { file_url: data.publicUrl };
};

// ============================================
// UPDATE USER NAME — עדכון שם משתמש
// ============================================
export const updateUserName = async ({ userId, newName }) => {
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ display_name: newName, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (profileError) return { data: { success: false, error: profileError.message } };

  await supabase
    .from('public_profiles')
    .update({ display_name: newName, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  return { data: { success: true } };
};

// ============================================
// DELETE USER AND DATA — מחיקת משתמש וכל הנתונים שלו
// ============================================
export const deleteUserAndData = async ({ userId }) => {
  const { error: e1 } = await supabase.from('predictions').delete().eq('user_id', userId);
  if (e1) return { data: { success: false, error: e1.message } };

  const { error: e2 } = await supabase.from('user_stats').delete().eq('user_id', userId);
  if (e2) return { data: { success: false, error: e2.message } };

  const { error: e3 } = await supabase.from('public_profiles').delete().eq('user_id', userId);
  if (e3) return { data: { success: false, error: e3.message } };

  const { error: e4 } = await supabase.from('profiles').delete().eq('id', userId);
  if (e4) return { data: { success: false, error: e4.message } };

  return { data: { success: true } };
};

// ============================================
// INVOKE LLM — קריאה ל-AI (מוכן לחיבור עתידי)
// ============================================
export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  // TODO: חבר ל-Claude API או OpenAI
  return { result: 'AI לא מחובר עדיין' };
};

// ============================================
// FOOTBALL API FUNCTIONS — פונקציות API כדורגל
// אלה יהיו Supabase Edge Functions בשלב הבא
// ============================================
const notImplemented = (name) => async () => {
  console.warn(`${name} - טרם הוטמע. יחובר ב-Supabase Edge Functions.`);
  return { error: 'פונקציה זו תהיה זמינה בקרוב' };
};

export const fetchLiveMatchData = async ({ competition = TOURNAMENT_CODE, filter = 'LIVE' } = {}) => {
  const response = await fetch(`/api/football?competition=${competition}&filter=${filter}`);
  if (!response.ok) throw new Error('Failed to fetch live data');
  return response.json();
};
export const getMatchStats = notImplemented('getMatchStats');
export const sofascoreApi = notImplemented('sofascoreApi');
export const flashscoresApi = notImplemented('flashscoresApi');
export const freeFootballApi = notImplemented('freeFootballApi');
export const liveSportRealTimeApi = notImplemented('liveSportRealTimeApi');
export const liveEventsApi = notImplemented('liveEventsApi');
export const soccerAnalysisApi = notImplemented('soccerAnalysisApi');
export const footballPredictionApi = notImplemented('footballPredictionApi');
export const liveFootballDataApi = notImplemented('liveFootballDataApi');
export const searchGptApi = notImplemented('searchGptApi');
export const footballChatbot = notImplemented('footballChatbot');
