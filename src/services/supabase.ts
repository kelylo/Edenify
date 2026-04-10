import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export const isSupabaseEnabled = Boolean(supabase);

export async function loadUserState(userId: string): Promise<any | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('edenify_user_state')
    .select('state_json')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Supabase load state failed, falling back to local state:', error.message);
    return null;
  }

  return data?.state_json || null;
}

export async function saveUserState(userId: string, state: any): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from('edenify_user_state').upsert(
    {
      user_id: userId,
      state_json: state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.warn('Supabase save state failed, continuing with local state:', error.message);
    return false;
  }

  return true;
}

export async function loadBackendUserState(userId: string): Promise<any | null> {
  try {
    const response = await fetch(`/api/data/${encodeURIComponent(userId)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn('Backend load state failed:', error);
    return null;
  }
}

export async function saveBackendUserState(userId: string, state: any): Promise<boolean> {
  try {
    const response = await fetch(`/api/data/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    return response.ok;
  } catch (error) {
    console.warn('Backend save state failed:', error);
    return false;
  }
}
