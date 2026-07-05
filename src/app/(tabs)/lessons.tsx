import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { LessonCard } from '@/components/lesson-card';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useLessonCounts, useLessons, useMyLessonRegistrations } from '@/hooks/use-lessons';
import { weekdayName } from '@/lib/format';
import type { Lesson } from '@/lib/types';
import { useLocale } from '@/providers/locale-provider';

export default function LessonsScreen() {
  const { locale, t } = useLocale();
  const lessons = useLessons();
  const counts = useLessonCounts();
  const myRegistrations = useMyLessonRegistrations();

  const myStatusByLesson = useMemo(
    () => new Map((myRegistrations.data ?? []).map((r) => [r.lesson_id, r.status])),
    [myRegistrations.data],
  );

  const byWeekday = useMemo(() => {
    const groups = new Map<number, Lesson[]>();
    for (const lesson of lessons.data ?? []) {
      groups.set(lesson.weekday, [...(groups.get(lesson.weekday) ?? []), lesson]);
    }
    return [...groups.entries()].sort(([a], [b]) => a - b);
  }, [lessons.data]);

  return (
    <Screen safeTop>
      <View style={styles.header}>
        <AppText variant="display">{t('lessons.title')}</AppText>
        <AppText color="textSecondary">{t('lessons.subtitle')}</AppText>
      </View>
      {lessons.isLoading ? (
        <LoadingView />
      ) : lessons.isError ? (
        <ErrorView onRetry={() => lessons.refetch()} />
      ) : byWeekday.length === 0 ? (
        <EmptyState icon="body-outline" title={t('lessons.empty')} />
      ) : (
        byWeekday.map(([weekday, weekdayLessons]) => (
          <View key={weekday} style={styles.section}>
            <AppText variant="title" style={styles.weekday}>
              {weekdayName(weekday, locale)}
            </AppText>
            {weekdayLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                counts={counts.data?.[lesson.id]}
                myStatus={myStatusByLesson.get(lesson.id)}
                onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })}
              />
            ))}
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  section: {
    gap: Spacing.md,
  },
  weekday: {
    textTransform: 'capitalize',
  },
});
