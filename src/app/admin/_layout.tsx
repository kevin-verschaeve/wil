import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';
import { useT } from '@/providers/locale-provider';

/** Admin area — only reachable with the admin role. */
export default function AdminLayout() {
  const { isAdmin, loading, profileLoading } = useAuth();
  const t = useT();

  // Wait for both the session and the profile: the role isn't known until
  // the profile has loaded (e.g. cold start directly on an admin screen).
  if (loading || profileLoading) return null;
  if (!isAdmin) return <Redirect href="/(tabs)" />;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('admin.title') }} />
      <Stack.Screen name="editions" options={{ title: t('admin.editions') }} />
      <Stack.Screen name="edition-form" options={{ title: t('admin.editEdition') }} />
      <Stack.Screen name="activities" options={{ title: t('admin.activities') }} />
      <Stack.Screen name="activity-form" options={{ title: t('admin.editActivity') }} />
      <Stack.Screen name="artists" options={{ title: t('admin.artists') }} />
      <Stack.Screen name="artist-form" options={{ title: t('admin.editArtist') }} />
      <Stack.Screen name="lessons" options={{ title: t('admin.lessons') }} />
      <Stack.Screen name="lesson-form" options={{ title: t('admin.editLesson') }} />
      <Stack.Screen name="infos" options={{ title: t('admin.infoPages') }} />
      <Stack.Screen name="info-form" options={{ title: t('admin.editInfoPage') }} />
      <Stack.Screen name="users" options={{ title: t('admin.users') }} />
      <Stack.Screen name="user-form" options={{ title: t('admin.editUser') }} />
    </Stack>
  );
}
