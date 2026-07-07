import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { ActivityCard } from '@/components/activity-card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Spacing } from '@/constants/theme';
import {
  useActivities,
  useMyActivityRegistrations,
  useStages,
  useToggleActivityRegistration,
} from '@/hooks/use-festival';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { dayKey, editionDays, formatDay } from '@/lib/format';
import type { Edition } from '@/lib/types';
import { useLocale } from '@/providers/locale-provider';

/** The edition's timetable, filterable by day and stage. */
export function ProgrammeView({ edition }: { edition: Edition }) {
  const { locale, t } = useLocale();
  const stages = useStages(edition.id);
  const activities = useActivities(edition.id);
  const registrations = useMyActivityRegistrations();
  const toggle = useToggleActivityRegistration();
  const requireAuth = useRequireAuth();

  const days = useMemo(() => editionDays(edition.starts_on, edition.ends_on), [edition]);
  const today = dayKey(new Date().toISOString());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const day = selectedDay ?? (days.includes(today) ? today : days[0]);

  const registeredIds = useMemo(
    () => new Set((registrations.data ?? []).map((r) => r.activity_id)),
    [registrations.data],
  );

  const dayActivities = useMemo(
    () =>
      (activities.data ?? []).filter(
        (a) => dayKey(a.starts_at) === day && (selectedStage === 'all' || a.stage_id === selectedStage),
      ),
    [activities.data, day, selectedStage],
  );

  const onToggle = (activityId: string, registered: boolean) =>
    requireAuth(() =>
      toggle.mutate(
        { activityId, registered },
        { onError: (e) => Alert.alert(t('activity.registrationFailed'), e.message) },
      ),
    );

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {days.map((d) => (
          <Chip key={d} label={formatDay(d, locale)} selected={d === day} onPress={() => setSelectedDay(d)} />
        ))}
      </ScrollView>

      {(stages.data?.length ?? 0) > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          <Chip
            label={t('programme.allStages')}
            selected={selectedStage === 'all'}
            onPress={() => setSelectedStage('all')}
          />
          {stages.data!.map((stage) => (
            <Chip
              key={stage.id}
              label={stage.name}
              dotColor={stage.color}
              selected={selectedStage === stage.id}
              onPress={() => setSelectedStage(stage.id)}
            />
          ))}
        </ScrollView>
      ) : null}

      {activities.isLoading ? (
        <LoadingView />
      ) : activities.isError ? (
        <ErrorView message={activities.error?.message} onRetry={() => activities.refetch()} />
      ) : dayActivities.length === 0 ? (
        <EmptyState icon="calendar-outline" title={t('programme.noActivities')} />
      ) : (
        <View style={styles.list}>
          {dayActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              registered={registeredIds.has(activity.id)}
              toggling={toggle.isPending}
              onPress={() => router.push({ pathname: '/activity/[id]', params: { id: activity.id } })}
              onToggle={() => onToggle(activity.id, registeredIds.has(activity.id))}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.lg,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  list: {
    gap: Spacing.md,
  },
});
