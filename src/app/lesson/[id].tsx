import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
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
  useLesson,
  useLessonCounts,
  useLessonParticipants,
  useMyLessonRegistrations,
  useRegisterLesson,
  useUnregisterLesson,
} from '@/hooks/use-lessons';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useTheme } from '@/hooks/use-theme';
import { formatClock, formatFullDate, weekdayName } from '@/lib/format';
import { useAuth } from '@/providers/auth-provider';
import { useLocale } from '@/providers/locale-provider';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { locale, t } = useLocale();
  const { profile, isAdmin } = useAuth();
  const lesson = useLesson(id);
  const counts = useLessonCounts();
  const myRegistrations = useMyLessonRegistrations();
  const register = useRegisterLesson();
  const unregister = useUnregisterLesson();
  const requireAuth = useRequireAuth();

  const canSeeParticipants = isAdmin || (!!profile && profile.id === lesson.data?.teacher_id);
  const participants = useLessonParticipants(id, canSeeParticipants);

  const myStatus = useMemo(
    () => (myRegistrations.data ?? []).find((r) => r.lesson_id === id)?.status,
    [myRegistrations.data, id],
  );

  if (lesson.isLoading) return <LoadingView />;
  if (lesson.isError || !lesson.data) return <ErrorView message={lesson.error?.message} onRetry={() => lesson.refetch()} />;

  const data = lesson.data;
  const lessonCounts = counts.data?.[data.id];
  const isFull = data.capacity != null && (lessonCounts?.confirmed ?? 0) >= data.capacity;

  const onRegister = () =>
    requireAuth(() =>
      register.mutate(data.id, { onError: (e) => Alert.alert(t('errors.generic'), e.message) }),
    );

  const onUnregister = () =>
    Alert.alert(t('lessons.unregister'), t('lessons.unregisterConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('lessons.unregister'),
        style: 'destructive',
        onPress: () => unregister.mutate(data.id, { onError: (e) => Alert.alert(t('errors.generic'), e.message) }),
      },
    ]);

  const metaRows: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
    {
      icon: 'time-outline',
      text: `${weekdayName(data.weekday, locale)} · ${formatClock(data.start_time)} – ${formatClock(data.end_time)}`,
    },
    ...(data.location ? [{ icon: 'location-outline' as const, text: data.location }] : []),
    ...(data.teacher_name ? [{ icon: 'person-outline' as const, text: data.teacher_name }] : []),
    ...(data.starts_on && data.ends_on
      ? [
          {
            icon: 'calendar-outline' as const,
            text: `${formatFullDate(data.starts_on, locale)} – ${formatFullDate(data.ends_on, locale)}`,
          },
        ]
      : []),
  ];

  return (
    <>
      <Stack.Screen options={{ title: data.season }} />
      <Screen>
        <View style={styles.header}>
          <AppText variant="display">{data.title}</AppText>
          <View style={styles.badges}>
            <Badge label={t(`lessons.level.${data.level}`)} tone="primary" />
            {myStatus === 'confirmed' ? <Badge label={t('lessons.registered')} tone="success" /> : null}
            {myStatus === 'waitlisted' ? <Badge label={t('lessons.waitlisted')} tone="warning" /> : null}
            {!data.is_open ? <Badge label={t('lessons.closed')} tone="neutral" /> : null}
          </View>
        </View>

        <Card style={styles.metaCard}>
          {metaRows.map((row) => (
            <View key={row.icon + row.text} style={styles.metaRow}>
              <Ionicons name={row.icon} size={18} color={theme.primary} />
              <AppText style={[styles.metaText, styles.capitalize]}>{row.text}</AppText>
            </View>
          ))}
          {data.capacity != null ? (
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={18} color={theme.primary} />
              <AppText style={styles.metaText}>
                {t('lessons.spots', { taken: lessonCounts?.confirmed ?? 0, total: data.capacity })}
                {lessonCounts?.waitlisted
                  ? ` · ${t('lessons.waitlistCount', { count: lessonCounts.waitlisted })}`
                  : ''}
              </AppText>
            </View>
          ) : null}
        </Card>

        {data.description ? (
          <AppText color="textSecondary" style={styles.body}>
            {data.description}
          </AppText>
        ) : null}

        {myStatus ? (
          <Button
            label={t('lessons.unregister')}
            variant="danger"
            loading={unregister.isPending}
            onPress={onUnregister}
          />
        ) : data.is_open ? (
          <Button
            label={isFull ? t('lessons.joinWaitlist') : t('lessons.register')}
            variant={isFull ? 'secondary' : 'primary'}
            loading={register.isPending}
            onPress={onRegister}
          />
        ) : null}

        {canSeeParticipants ? (
          <View style={styles.section}>
            <AppText variant="title">{t('lessons.participants')}</AppText>
            {participants.isLoading ? (
              <LoadingView />
            ) : (participants.data?.length ?? 0) === 0 ? (
              <AppText color="textSecondary">{t('lessons.noParticipants')}</AppText>
            ) : (
              <Card style={styles.participants}>
                {participants.data!.map((registration) => (
                  <View key={registration.id} style={styles.participantRow}>
                    <AppText style={styles.metaText}>
                      {registration.profile?.full_name || registration.user_id.slice(0, 8)}
                    </AppText>
                    {registration.status === 'waitlisted' ? (
                      <Badge label={t('lessons.waitlisted')} tone="warning" />
                    ) : null}
                  </View>
                ))}
              </Card>
            )}
          </View>
        ) : null}
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
  metaText: {
    flex: 1,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  body: {
    lineHeight: 22,
  },
  section: {
    gap: Spacing.md,
  },
  participants: {
    gap: Spacing.md,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
