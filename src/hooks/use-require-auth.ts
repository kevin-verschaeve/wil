import { router } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';

/**
 * Returns a guard that runs `action` when signed in,
 * and opens the sign-in modal otherwise.
 */
export function useRequireAuth() {
  const { session } = useAuth();
  return (action: () => void) => {
    if (session) {
      action();
    } else {
      router.push('/(auth)/sign-in');
    }
  };
}
