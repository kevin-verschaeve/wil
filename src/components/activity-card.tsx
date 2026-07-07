import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatTimeRange } from '@/lib/format';
import type { ActivityWithRelations } from '@/lib/types';
import { useLocale } from '@/providers/locale-provider';

export interface ActivityCardProps {
  activity: ActivityWithRelations;
  registered: boolean;
  onPress: () => void;
  onToggle: () => void;
  toggling?: boolean;
}

/** A programme entry: time, title, stage and a one-tap "add to my schedule" toggle. */
export function ActivityCard({ activity, registered, onPress, onToggle, toggling }: ActivityCardProps) {
  const theme = useTheme();
  const { locale, t } = useLocale();

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.main}>
        <AppText variant="caption" color="textSecondary" style={styles.time}>
          {formatTimeRange(activity.starts_at, activity.ends_at, locale)}
        </AppText>
        <AppText variant="subtitle" numberOfLines={2}>
          {activity.title}
        </AppText>
        {activity.artist ? (
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {activity.artist.name}
            {activity.artist.style ? ` · ${activity.artist.style}` : ''}
          </AppText>
        ) : null}
        <View style={styles.badges}>
          {activity.stage ? <Badge label={activity.stage.name} color={activity.stage.color} /> : null}
          {activity.category !== 'concert' ? (
            <Badge label={t(`activity.category.${activity.category}`)} tone="neutral" />
          ) : null}
          {activity.target_role !== 'member' ? (
            <Badge label={t(`activity.target.${activity.target_role}`)} tone="warning" />
          ) : null}
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={registered ? t('activity.removeFromSchedule') : t('activity.addToSchedule')}
        onPress={onToggle}
        disabled={toggling}
        hitSlop={8}
        style={({ pressed }) => [
          styles.toggle,
          {
            backgroundColor: registered ? theme.primary : theme.primarySoft,
            opacity: pressed || toggling ? 0.7 : 1,
          },
        ]}
      >
        <Ionicons
          name={registered ? 'checkmark' : 'add'}
          size={20}
          color={registered ? theme.textOnPrimary : theme.primary}
        />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  main: {
    flex: 1,
    gap: 4,
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: 2,
  },
  toggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
