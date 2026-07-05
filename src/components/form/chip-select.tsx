import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Spacing } from '@/constants/theme';

export interface ChipSelectOption<T extends string> {
  value: T;
  label: string;
  dotColor?: string;
}

export interface ChipSelectProps<T extends string> {
  label?: string;
  options: ChipSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Single-choice picker rendered as a wrapping row of chips. */
export function ChipSelect<T extends string>({ label, options, value, onChange }: ChipSelectProps<T>) {
  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="label" color="textSecondary">
          {label.toUpperCase()}
        </AppText>
      ) : null}
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            dotColor={option.dotColor}
            selected={option.value === value}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
