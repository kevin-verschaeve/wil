import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  /** True while the initial session is being restored. */
  loading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  // Keep the owning user id next to the profile so a stale profile is never
  // shown for a different session (derived below instead of cleared in an effect).
  const [profileEntry, setProfileEntry] = useState<{ userId: string; profile: Profile | null } | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchProfile(userId).then((profile) => {
      if (!cancelled) setProfileEntry({ userId, profile });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const profile = userId && profileEntry?.userId === userId ? profileEntry.profile : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      isTeacher: profile?.role === 'teacher' || profile?.role === 'admin',
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refreshProfile: async () => {
        if (userId) setProfileEntry({ userId, profile: await fetchProfile(userId) });
      },
    }),
    [session, profile, loading, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return (data as Profile | null) ?? null;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
