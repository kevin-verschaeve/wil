import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import {
  useActivity,
  useActivityCounts,
  useMyActivityRegistrations,
  useToggleActivityRegistration,
} from '@/hooks/use-festival';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useTheme } from '@/hooks/use-theme';
import { formatDay, formatTimeRange } from '@/lib/format';
import { useLocale } from '@/providers/locale-provider';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { locale, t } = useLocale();
  const activity = useActivity(id);
  const counts = useActivityCounts();
  const registrations = useMyActivityRegistrations();
  const toggle = useToggleActivityRegistration();
  const requireAuth = useRequireAuth();

  const registered = useMemo(
    () => (registrations.data ?? []).some((r) => r.activity_id === id),
    [registrations.data, id],
  );

  if (activity.isLoading) return <LoadingView />;
  if (activity.isError || !activity.data) return <ErrorView message={activity.error?.message} onRetry={() => activity.refetch()} />;

  const data = activity.data;
  const registeredCount = counts.data?.[data.id] ?? 0;
  const spotsLeft = data.capacity != null ? Math.max(0, data.capacity - registeredCount) : null;
  const isFull = spotsLeft === 0 && !registered;

  const onToggle = () =>
    requireAuth(() =>
      toggle.mutate(
        { activityId: data.id, registered },
        { onError: (e) => Alert.alert(t('activity.registrationFailed'), e.message) },
      ),
    );

  return (
    <>
      <Stack.Screen options={{ title: t(`activity.category.${data.category}`) }} />
      <Screen>
        <View style={styles.header}>
          <AppText variant="display">{data.title}</AppText>
          <View style={styles.badges}>
            {data.stage ? <Badge label={data.stage.name} color={data.stage.color} /> : null}
            <Badge label={t(`activity.category.${data.category}`)} tone="primary" />
          </View>
        </View>

        <Card style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={18} color={theme.primary} />
            <AppText style={styles.capitalize}>{formatDay(data.starts_at, locale)}</AppText>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={18} color={theme.primary} />
            <AppText>{formatTimeRange(data.starts_at, data.ends_at, locale)}</AppText>
          </View>
          {data.capacity != null ? (
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={18} color={theme.primary} />
              <AppText>
                {isFull
                  ? t('activity.full')
                  : t('activity.spotsLeft', { count: spotsLeft ?? 0 })}
              </AppText>
            </View>
          ) : null}
        </Card>

        {data.artist ? (
          <Card
            onPress={() => router.push({ pathname: '/artist/[id]', params: { id: data.artist!.id } })}
            style={styles.artistCard}
          >
            <View style={styles.artistTexts}>
              <AppText variant="subtitle">{data.artist.name}</AppText>
              {data.artist.style ? (
                <AppText variant="caption" color="textSecondary">
                  {data.artist.style}
                </AppText>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </Card>
        ) : null}

        {data.description ? (
          <View style={styles.description}>
            <AppText variant="title">{t('activity.description')}</AppText>
            <AppText color="textSecondary" style={styles.body}>
              {data.description}
            </AppText>
          </View>
        ) : null}

        <Button
          label={registered ? t('activity.removeFromSchedule') : t('activity.addToSchedule')}
          icon={registered ? 'checkmark' : 'add'}
          variant={registered ? 'secondary' : 'primary'}
          loading={toggle.isPending}
          disabled={isFull}
          onPress={onToggle}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metaCard: {
    gap: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  artistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  artistTexts: {
    flex: 1,
    gap: 2,
  },
  description: {
    gap: Spacing.sm,
  },
  body: {
    lineHeight: 22,
  },
});
