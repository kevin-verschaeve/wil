import type { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  /** True while the initial session is being restored. */
  loading: boolean;
  /** Non-null when the signed-in user's profile could not be loaded. */
  profileError: string | null;
  isAdmin: boolean;
  isTeacher: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const queryClient = useQueryClient();

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

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId && isSupabaseConfigured,
    retry: 2,
    staleTime: 30 * 1000,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId!).maybeSingle();
      if (error) throw new Error(error.message);
      return (data as Profile | null) ?? null;
    },
  });

  // Drop cached user-specific data when the account changes (sign-out / switch).
  useEffect(() => {
    if (!userId) {
      queryClient.removeQueries({ queryKey: ['profile'] });
      queryClient.removeQueries({ queryKey: ['activity-registrations'] });
      queryClient.removeQueries({ queryKey: ['lesson-registrations'] });
    }
  }, [userId, queryClient]);

  const profile = (userId ? profileQuery.data : null) ?? null;
  const { isError: profileIsError, error: profileQueryError, refetch: refetchProfile } = profileQuery;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      profileError: userId && profileIsError ? String(profileQueryError?.message ?? '') : null,
      isAdmin: profile?.role === 'admin',
      isTeacher: profile?.role === 'teacher' || profile?.role === 'admin',
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refreshProfile: () => {
        refetchProfile();
      },
    }),
    [session, profile, loading, userId, profileIsError, profileQueryError, refetchProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
