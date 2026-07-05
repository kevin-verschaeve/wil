import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface BadgeProps {
  label: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Custom color overrides the tone (used e.g. for stage colors). */
  color?: string;
}

export function Badge({ label, tone = 'neutral', color }: BadgeProps) {
  const theme = useTheme();
  const tones = {
    primary: { bg: theme.primarySoft, fg: theme.primary },
    success: { bg: theme.successSoft, fg: theme.success },
    warning: { bg: theme.warningSoft, fg: theme.warning },
    danger: { bg: theme.dangerSoft, fg: theme.danger },
    neutral: { bg: theme.surfaceAlt, fg: theme.textSecondary },
  };
  const resolved = color ? { bg: `${color}22`, fg: color } : tones[tone];

  return (
    <View style={[styles.badge, { backgroundColor: resolved.bg }]}>
      <AppText variant="label" style={{ color: resolved.fg }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
  },
});
