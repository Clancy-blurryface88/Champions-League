import { supabase } from './supabase';

// ============================================
// HELPER - פענוח orderBy של Base44
// '-field_name' = יורד, 'field_name' = עולה
// גם ממפה שמות עמודות Base44 -> Supabase
// ============================================
const COLUMN_MAP = {
  'created_date': 'created_at',
  'updated_date': 'updated_at',
  'match_date': 'match_date',
};

const parseOrder = (orderBy = 'created_at') => {
  const descending = orderBy.startsWith('-');
  const rawColumn = descending ? orderBy.slice(1) : orderBy;
  const column = COLUMN_MAP[rawColumn] || rawColumn;
  return { column, ascending: !descending };
};

// ============================================
// HELPER - מחזיר את המשתמש המחובר כרגע
// ============================================
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// ============================================
// HELPER - מסנכרן public_profiles מ-profiles
// ============================================
const syncPublicProfile = async (userId, displayName, avatarUrl) => {
  try {
    const { data: existing } = await supabase
      .from('public_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('public_profiles')
        .update({ display_name: displayName, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('public_profiles')
        .insert({ user_id: userId, display_name: displayName, avatar_url: avatarUrl });
    }
  } catch (err) {
    console.warn('syncPublicProfile failed (non-critical):', err?.message);
  }
};

// ============================================
// USER ENTITY
// ============================================
export const User = {
  me: async () => {
    const authUser = await getCurrentUser();
    if (!authUser) throw { status: 401, message: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) throw error;

    // אם הפרופיל לא נוצר עדיין — ניצור אותו
    if (!data) {
      const display_name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0];
      const avatar_url = authUser.user_metadata?.avatar_url;

      // ניקוי localStorage כדי לאפס את זרימת האונבורדינג
      try {
        localStorage.removeItem('welcome_completed_' + authUser.id);
      } catch {}

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: authUser.id, email: authUser.email, display_name, avatar_url })
        .select()
        .single();

      if (insertError) {
        return {
          id: authUser.id,
          email: authUser.email,
          display_name,
          avatar_url,
          is_admin: false,
          has_seen_intro_video: false,
        };
      }
      await syncPublicProfile(authUser.id, display_name, avatar_url);
      return newProfile;
    }

    return data;
  },

  list: async (orderBy = '-total_points') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (updates.display_name !== undefined || updates.avatar_url !== undefined) {
      await syncPublicProfile(id, data.display_name, data.avatar_url);
    }
    return data;
  },

  updateMyUserData: async (updates) => {
    const authUser = await getCurrentUser();
    if (!authUser) throw { status: 401, message: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', authUser.id)
      .select()
      .single();
    if (error) throw error;
    if (updates.display_name !== undefined || updates.avatar_url !== undefined) {
      await syncPublicProfile(authUser.id, data.display_name, data.avatar_url);
    }
    return data;
  },

  loginWithRedirect: async (redirectUrl) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl || window.location.origin,
        queryParams: { prompt: 'select_account' }
      }
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },
};

// ============================================
// ROUND ENTITY
// ============================================
export const Round = {
  list: async (orderBy = 'order') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('rounds')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('rounds').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  create: async (roundData) => {
    const { data, error } = await supabase
      .from('rounds')
      .insert(roundData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('rounds')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('rounds').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// MATCH ENTITY
// ============================================
export const Match = {
  list: async (orderBy = 'order') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('matches').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query.order('match_date', { ascending: true });
    if (error) throw error;
    return data;
  },

  create: async (matchData) => {
    const { data, error } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('matches')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// PREDICTION ENTITY
// ============================================
export const Prediction = {
  list: async (orderBy = '-created_at') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('predictions').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (predictionData) => {
    const { data, error } = await supabase
      .from('predictions')
      .insert(predictionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('predictions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('predictions').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// USER STATS ENTITY
// ============================================
export const UserStats = {
  list: async (orderBy = '-total_points') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('user_stats').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  create: async (statsData) => {
    const { data, error } = await supabase
      .from('user_stats')
      .insert(statsData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('user_stats')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// PUBLIC PROFILE ENTITY
// ============================================
export const PublicProfile = {
  list: async () => {
    const { data, error } = await supabase
      .from('public_profiles')
      .select('*');
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('public_profiles').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  create: async (profileData) => {
    const { data, error } = await supabase
      .from('public_profiles')
      .insert(profileData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('public_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// TEAM LOGO ENTITY
// ============================================
export const TeamLogo = {
  list: async (orderBy = 'name') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('team_logos')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('team_logos').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  create: async (logoData) => {
    const { data, error } = await supabase
      .from('team_logos')
      .insert(logoData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('team_logos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('team_logos').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// APP SETTINGS ENTITY
// ============================================
export const AppSettings = {
  list: async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*');
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  create: async (settingsData) => {
    const { data, error } = await supabase
      .from('app_settings')
      .insert(settingsData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// AI BRIEF ENTITY
// ============================================
export const AiBrief = {
  forMatches: async (matchIds) => {
    if (!matchIds || matchIds.length === 0) return [];
    const { data, error } = await supabase
      .from('ai_briefs')
      .select('match_id, brief_he, generated_at')
      .in('match_id', matchIds);
    if (error) throw error;
    return data;
  },

  forMatch: async (matchId) => {
    const { data, error } = await supabase
      .from('ai_briefs')
      .select('match_id, brief_he, generated_at')
      .eq('match_id', matchId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

// ============================================
// GENERAL QUESTIONS ENTITY (pre-tournament onboarding predictions)
// ============================================
export const GeneralQuestion = {
  list: async (orderBy = 'order') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('general_questions')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('general_questions').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query.order('order', { ascending: true });
    if (error) throw error;
    return data;
  },

  create: async (questionData) => {
    const { data, error } = await supabase
      .from('general_questions')
      .insert(questionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('general_questions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('general_questions').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// GENERAL PREDICTIONS ENTITY (one answer per user per general question)
// ============================================
export const GeneralPrediction = {
  list: async (orderBy = '-created_at') => {
    const { column, ascending } = parseOrder(orderBy);
    const { data, error } = await supabase
      .from('general_predictions')
      .select('*')
      .order(column, { ascending });
    if (error) throw error;
    return data;
  },

  filter: async (filters) => {
    let query = supabase.from('general_predictions').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (predictionData) => {
    const { data, error } = await supabase
      .from('general_predictions')
      .insert(predictionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('general_predictions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
