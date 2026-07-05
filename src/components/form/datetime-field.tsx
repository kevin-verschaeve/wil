import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parse, parseISO } from 'date-fns';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { AppText } from '@/components/ui/app-text';
import { Radius, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Mode = 'date' | 'time' | 'datetime';

export interface DateTimeFieldProps {
  label: string;
  mode: Mode;
  /** 'yyyy-MM-dd' for date, 'HH:mm' for time, ISO string for datetime. Empty = unset. */
  value: string;
  onChange: (value: string) => void;
}

const DISPLAY: Record<Mode, string> = {
  date: 'yyyy-MM-dd',
  time: 'HH:mm',
  datetime: "yyyy-MM-dd'T'HH:mm",
};

function toDate(mode: Mode, value: string): Date {
  if (!value) return new Date();
  try {
    if (mode === 'time') return parse(value, 'HH:mm', new Date());
    return parseISO(value);
  } catch {
    return new Date();
  }
}

function fromDate(mode: Mode, date: Date): string {
  return format(date, DISPLAY[mode]);
}

/**
 * Native pickers on iOS/Android, plain text input on web.
 * `datetime` opens a date picker then a time picker on Android.
 */
export function DateTimeField({ label, mode, value, onChange }: DateTimeFieldProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState<null | 'date' | 'time'>(null);
  const [pending, setPending] = useState<Date | null>(null);

  if (Platform.OS === 'web') {
    return (
      <Input
        label={label}
        value={value}
        onChangeText={onChange}
        placeholder={DISPLAY[mode].toUpperCase()}
        autoCapitalize="none"
      />
    );
  }

  const openPicker = () => setVisible(mode === 'time' ? 'time' : 'date');

  const handlePicked = (selected: Date | undefined, pickerMode: 'date' | 'time') => {
    setVisible(null);
    if (!selected) return; // dismissed
    if (mode === 'datetime' && pickerMode === 'date') {
      setPending(selected);
      setVisible('time');
      return;
    }
    if (mode === 'datetime' && pickerMode === 'time' && pending) {
      const merged = new Date(pending);
      merged.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setPending(null);
      onChange(fromDate(mode, merged));
      return;
    }
    onChange(fromDate(mode, selected));
  };

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textSecondary">
        {label.toUpperCase()}
      </AppText>
      <Pressable
        accessibilityRole="button"
        onPress={openPicker}
        style={({ pressed }) => [
          styles.field,
          { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <AppText style={{ color: value ? theme.text : theme.textSecondary }}>
          {value || DISPLAY[mode].toUpperCase()}
        </AppText>
      </Pressable>
      {visible ? (
        <DateTimePicker
          value={pending ?? toDate(mode, value)}
          mode={visible}
          is24Hour
          onChange={(_event, selected) => handlePicked(selected, visible)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  field: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    minHeight: 44 + Type.body.fontSize - 15,
    justifyContent: 'center',
  },
});
