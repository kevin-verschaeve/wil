import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useActivities, useCurrentEdition } from '@/hooks/use-festival';
import { dayKey, formatDay, formatTimeRange } from '@/lib/format';
import type { ActivityWithRelations } from '@/lib/types';
import { useLocale } from '@/providers/locale-provider';

/** Admin: manage the current edition's programme. */
export default function AdminActivitiesScreen() {
  const { locale, t } = useLocale();
  const edition = useCurrentEdition();
  const activities = useActivities(edition.data?.id);

  const byDay = useMemo(() => {
    const groups = new Map<string, ActivityWithRelations[]>();
    for (const activity of activities.data ?? []) {
      const key = dayKey(activity.starts_at);
      groups.set(key, [...(groups.get(key) ?? []), activity]);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [activities.data]);

  if (edition.isLoading) return <LoadingView />;
  if (!edition.data) {
    return (
      <Screen>
        <AppText color="textSecondary">{t('admin.noEditionYet')}</AppText>
        <Button label={t('admin.newEdition')} onPress={() => router.push('/admin/edition-form')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText color="textSecondary">
        {edition.data.name} — {edition.data.year}
      </AppText>
      <Button
        label={t('admin.newActivity')}
        icon="add"
        onPress={() =>
          router.push({ pathname: '/admin/activity-form', params: { editionId: edition.data!.id } })
        }
      />
      {activities.isLoading ? (
        <LoadingView />
      ) : activities.isError ? (
        <ErrorView message={activities.error?.message} onRetry={() => activities.refetch()} />
      ) : (
        byDay.map(([day, dayActivities]) => (
          <View key={day} style={styles.section}>
            <AppText variant="title" style={styles.day}>
              {formatDay(day, locale)}
            </AppText>
            {dayActivities.map((activity) => (
              <ListRow
                key={activity.id}
                title={activity.title}
                subtitle={formatTimeRange(activity.starts_at, activity.ends_at, locale)}
                right={
                  activity.stage ? <Badge label={activity.stage.name} color={activity.stage.color} /> : undefined
                }
                onPress={() =>
                  router.push({
                    pathname: '/admin/activity-form',
                    params: { id: activity.id, editionId: edition.data!.id },
                  })
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
  section: {
    gap: Spacing.md,
  },
  day: {
    textTransform: 'capitalize',
  },
});
