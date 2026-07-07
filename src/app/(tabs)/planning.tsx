import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ActivityCard } from '@/components/activity-card';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import {
  useActivities,
  useCurrentEdition,
  useMyActivityRegistrations,
  useToggleActivityRegistration,
} from '@/hooks/use-festival';
import { dayKey, formatDay } from '@/lib/format';
import { useAuth } from '@/providers/auth-provider';
import { useLocale } from '@/providers/locale-provider';

/** The user's personal festival schedule: everything they registered for, day by day. */
export default function PlanningScreen() {
  const { locale, t } = useLocale();
  const { session } = useAuth();
  const edition = useCurrentEdition();
  const activities = useActivities(edition.data?.id);
  const registrations = useMyActivityRegistrations();
  const toggle = useToggleActivityRegistration();

  const registeredIds = useMemo(
    () => new Set((registrations.data ?? []).map((r) => r.activity_id)),
    [registrations.data],
  );

  const byDay = useMemo(() => {
    const mine = (activities.data ?? []).filter((a) => registeredIds.has(a.id));
    const groups = new Map<string, typeof mine>();
    for (const activity of mine) {
      const key = dayKey(activity.starts_at);
      groups.set(key, [...(groups.get(key) ?? []), activity]);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [activities.data, registeredIds]);

  if (!session) {
    return (
      <Screen safeTop scroll={false} contentStyle={styles.centered}>
        <EmptyState
          icon="heart-outline"
          title={t('schedule.title')}
          body={t('schedule.signInBody')}
          actionLabel={t('auth.signIn')}
          onAction={() => router.push('/(auth)/sign-in')}
        />
      </Screen>
    );
  }

  return (
    <Screen safeTop>
      <AppText variant="display">{t('schedule.title')}</AppText>
      {activities.isLoading || registrations.isLoading ? (
        <LoadingView />
      ) : activities.isError || registrations.isError ? (
        <ErrorView
          message={activities.error?.message ?? registrations.error?.message}
          onRetry={() => {
            activities.refetch();
            registrations.refetch();
          }}
        />
      ) : byDay.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title={t('schedule.empty')}
          body={t('schedule.emptyBody')}
          actionLabel={t('schedule.goToProgramme')}
          onAction={() => router.push('/(tabs)')}
        />
      ) : (
        byDay.map(([day, dayActivities]) => (
          <View key={day} style={styles.daySection}>
            <AppText variant="title" style={styles.dayTitle}>
              {formatDay(day, locale)}
            </AppText>
            {dayActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                registered
                toggling={toggle.isPending}
                onPress={() => router.push({ pathname: '/activity/[id]', params: { id: activity.id } })}
                onToggle={() =>
                  toggle.mutate(
                    { activityId: activity.id, registered: true },
                    { onError: (e) => Alert.alert(t('errors.generic'), e.message) },
                  )
                }
              />
            ))}
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  daySection: {
    gap: Spacing.md,
  },
  dayTitle: {
    textTransform: 'capitalize',
  },
  centered: {
    justifyContent: 'center',
  },
});
