import { router } from 'expo-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useLessonCounts, useLessons } from '@/hooks/use-lessons';
import { formatClock, weekdayName } from '@/lib/format';
import { useLocale } from '@/providers/locale-provider';

export default function AdminLessonsScreen() {
  const { locale, t } = useLocale();
  const lessons = useLessons();
  const counts = useLessonCounts();

  return (
    <Screen>
      <Button label={t('admin.newLesson')} icon="add" onPress={() => router.push('/admin/lesson-form')} />
      {lessons.isLoading ? (
        <LoadingView />
      ) : lessons.isError ? (
        <ErrorView message={lessons.error?.message} onRetry={() => lessons.refetch()} />
      ) : (
        (lessons.data ?? []).map((lesson) => {
          const lessonCounts = counts.data?.[lesson.id];
          return (
            <ListRow
              key={lesson.id}
              icon="body"
              title={lesson.title}
              subtitle={`${weekdayName(lesson.weekday, locale)} ${formatClock(lesson.start_time)} · ${lesson.season}`}
              right={
                lesson.capacity != null ? (
                  <Badge
                    label={t('lessons.spots', {
                      taken: lessonCounts?.confirmed ?? 0,
                      total: lesson.capacity,
                    })}
                    tone={
                      (lessonCounts?.confirmed ?? 0) >= lesson.capacity ? 'danger' : 'neutral'
                    }
                  />
                ) : undefined
              }
              onPress={() => router.push({ pathname: '/admin/lesson-form', params: { id: lesson.id } })}
            />
          );
        })
      )}
    </Screen>
  );
}
