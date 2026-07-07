import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { LessonCard } from '@/components/lesson-card';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing } from '@/constants/theme';
import { infoTitle, useInfoPages } from '@/hooks/use-info';
import { useLessonCounts, useLessons, useMyLessonRegistrations } from '@/hooks/use-lessons';
import { weekdayName } from '@/lib/format';
import type { Lesson } from '@/lib/types';
import { useLocale } from '@/providers/locale-provider';

/** The association side: year-round lessons plus the association's info pages. */
export default function LessonsScreen() {
  const { locale, t } = useLocale();
  const lessons = useLessons();
  const counts = useLessonCounts();
  const myRegistrations = useMyLessonRegistrations();
  const infoPages = useInfoPages();

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

  // Association pages only — festival pages live in the Festival tab.
  const associationPages = (infoPages.data ?? []).filter((page) => page.published && !page.edition_id);

  return (
    <Screen safeTop>
      <View style={styles.header}>
        <AppText variant="display">{t('lessons.title')}</AppText>
        <AppText color="textSecondary">{t('lessons.subtitle')}</AppText>
      </View>
      {lessons.isLoading ? (
        <LoadingView />
      ) : lessons.isError ? (
        <ErrorView message={lessons.error?.message} onRetry={() => lessons.refetch()} />
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

      {associationPages.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader title={t('lessons.association')} />
          {associationPages.map((page) => (
            <ListRow
              key={page.id}
              icon={(page.icon || 'information-circle') as never}
              title={infoTitle(page, locale)}
              onPress={() => router.push({ pathname: '/info/[slug]', params: { slug: page.slug } })}
            />
          ))}
        </View>
      ) : null}
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
