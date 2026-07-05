import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useActivities, useArtist } from '@/hooks/use-festival';
import { useTheme } from '@/hooks/use-theme';
import { formatDay, formatTimeRange } from '@/lib/format';
import { useLocale } from '@/providers/locale-provider';

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { locale, t } = useLocale();
  const artist = useArtist(id);
  const activities = useActivities(artist.data?.edition_id);

  const performances = useMemo(
    () => (activities.data ?? []).filter((a) => a.artist_id === id),
    [activities.data, id],
  );

  if (artist.isLoading) return <LoadingView />;
  if (artist.isError || !artist.data) return <ErrorView onRetry={() => artist.refetch()} />;

  const data = artist.data;

  return (
    <>
      <Stack.Screen options={{ title: data.name }} />
      <Screen>
        <View style={styles.header}>
          {data.photo_url ? (
            <Image source={{ uri: data.photo_url }} style={styles.photo} contentFit="cover" />
          ) : (
            <View style={[styles.photo, styles.placeholder, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="musical-notes" size={48} color={theme.primary} />
            </View>
          )}
          <AppText variant="display">{data.name}</AppText>
          {data.style ? <Badge label={data.style} tone="primary" /> : null}
        </View>

        {data.bio ? (
          <AppText color="textSecondary" style={styles.bio}>
            {data.bio}
          </AppText>
        ) : null}

        {performances.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="title">{t('lineup.onStage')}</AppText>
            {performances.map((activity) => (
              <Card
                key={activity.id}
                onPress={() => router.push({ pathname: '/activity/[id]', params: { id: activity.id } })}
                style={styles.performance}
              >
                <View style={styles.performanceTexts}>
                  <AppText variant="subtitle">{activity.title}</AppText>
                  <AppText variant="caption" color="textSecondary" style={styles.capitalize}>
                    {formatDay(activity.starts_at, locale)} ·{' '}
                    {formatTimeRange(activity.starts_at, activity.ends_at, locale)}
                  </AppText>
                </View>
                {activity.stage ? <Badge label={activity.stage.name} color={activity.stage.color} /> : null}
              </Card>
            ))}
          </View>
        ) : null}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  photo: {
    width: 128,
    height: 128,
    borderRadius: Radius.xl,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bio: {
    lineHeight: 22,
  },
  section: {
    gap: Spacing.md,
  },
  performance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  performanceTexts: {
    flex: 1,
    gap: 2,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
});
