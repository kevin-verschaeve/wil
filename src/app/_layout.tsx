import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { NotConfiguredScreen } from '@/components/not-configured';
import { Colors } from '@/constants/theme';
import { isSupabaseConfigured } from '@/lib/supabase';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { LocaleProvider, useT } from '@/providers/locale-provider';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <LocaleProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppStack />
          </AuthProvider>
        </QueryClientProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

function AppStack() {
  const { loading } = useAuth();
  const t = useT();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (!isSupabaseConfigured) {
    return <NotConfiguredScreen />;
  }
  if (loading) return null;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/sign-in" options={{ presentation: 'modal', title: t('auth.signIn') }} />
      <Stack.Screen name="(auth)/sign-up" options={{ presentation: 'modal', title: t('auth.signUp') }} />
      <Stack.Screen name="activity/[id]" options={{ title: '' }} />
      <Stack.Screen name="artist/[id]" options={{ title: '' }} />
      <Stack.Screen name="lesson/[id]" options={{ title: '' }} />
      <Stack.Screen name="info/[slug]" options={{ title: '' }} />
      <Stack.Screen name="floorplan" options={{ title: t('floorplan.title') }} />
      <Stack.Screen name="profile" options={{ title: t('profile.title') }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}
