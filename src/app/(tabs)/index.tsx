import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { ActivityCard } from '@/components/activity-card';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import {
  useActivities,
  useCurrentEdition,
  useMyActivityRegistrations,
  useStages,
  useToggleActivityRegistration,
} from '@/hooks/use-festival';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { dayKey, editionDays, formatDay, formatFullDate } from '@/lib/format';
import { useLocale } from '@/providers/locale-provider';

export default function ProgrammeScreen() {
  const { locale, t } = useLocale();
  const edition = useCurrentEdition();
  const stages = useStages(edition.data?.id);
  const activities = useActivities(edition.data?.id);
  const registrations = useMyActivityRegistrations();
  const toggle = useToggleActivityRegistration();
  const requireAuth = useRequireAuth();

  const days = useMemo(
    () => (edition.data ? editionDays(edition.data.starts_on, edition.data.ends_on) : []),
    [edition.data],
  );
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
        {
          onError: () => Alert.alert(t('errors.generic'), t('activity.registrationFailed')),
        },
      ),
    );

  if (edition.isLoading) {
    return (
      <Screen safeTop scroll={false}>
        <LoadingView />
      </Screen>
    );
  }
  if (edition.isError) {
    return (
      <Screen safeTop scroll={false}>
        <ErrorView onRetry={() => edition.refetch()} />
      </Screen>
    );
  }
  if (!edition.data) {
    return (
      <Screen safeTop scroll={false} contentStyle={styles.centered}>
        <EmptyState
          icon="sparkles-outline"
          title={t('programme.noEdition')}
          body={t('programme.noEditionBody')}
        />
      </Screen>
    );
  }

  return (
    <Screen safeTop>
      <View style={styles.header}>
        <AppText variant="display">{edition.data.name}</AppText>
        <AppText color="textSecondary">
          {formatFullDate(edition.data.starts_on, locale)} – {formatFullDate(edition.data.ends_on, locale)}
        </AppText>
      </View>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
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
  centered: {
    justifyContent: 'center',
  },
});
