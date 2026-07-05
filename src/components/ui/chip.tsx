import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Small colored dot, e.g. a stage color. */
  dotColor?: string;
}

export function Chip({ label, selected = false, onPress, dotColor }: ChipProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.surfaceAlt,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <AppText
        variant="caption"
        style={{ color: selected ? theme.textOnPrimary : theme.text, fontWeight: '600' }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
