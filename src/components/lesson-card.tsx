import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatClock, weekdayName } from '@/lib/format';
import type { Lesson, RegistrationStatus } from '@/lib/types';
import { useLocale } from '@/providers/locale-provider';

export interface LessonCardProps {
  lesson: Lesson;
  counts?: { confirmed: number; waitlisted: number };
  /** The current user's registration status, if any. */
  myStatus?: RegistrationStatus;
  onPress: () => void;
}

export function LessonCard({ lesson, counts, myStatus, onPress }: LessonCardProps) {
  const theme = useTheme();
  const { locale, t } = useLocale();

  const isFull = lesson.capacity != null && (counts?.confirmed ?? 0) >= lesson.capacity;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <AppText variant="subtitle" style={styles.title} numberOfLines={2}>
          {lesson.title}
        </AppText>
        {myStatus === 'confirmed' ? <Badge label={t('lessons.registered')} tone="success" /> : null}
        {myStatus === 'waitlisted' ? <Badge label={t('lessons.waitlisted')} tone="warning" /> : null}
      </View>
      <View style={styles.meta}>
        <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
        <AppText variant="caption" color="textSecondary">
          {weekdayName(lesson.weekday, locale)} · {formatClock(lesson.start_time)} –{' '}
          {formatClock(lesson.end_time)}
        </AppText>
      </View>
      {lesson.location ? (
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {lesson.location}
          </AppText>
        </View>
      ) : null}
      <View style={styles.badges}>
        <Badge label={t(`lessons.level.${lesson.level}`)} tone="primary" />
        {!lesson.is_open ? (
          <Badge label={t('lessons.closed')} tone="neutral" />
        ) : isFull ? (
          <Badge label={t('lessons.full')} tone="danger" />
        ) : lesson.capacity != null ? (
          <Badge
            label={t('lessons.spots', { taken: counts?.confirmed ?? 0, total: lesson.capacity })}
            tone="neutral"
          />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: 4,
  },
});
