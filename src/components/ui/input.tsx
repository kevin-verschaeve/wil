import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, style, multiline, ...rest }: InputProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="label" color="textSecondary" style={styles.label}>
          {label.toUpperCase()}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          },
          multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />
      {hint ? (
        <AppText variant="caption" color="textSecondary">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    fontSize: Type.body.fontSize,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
});
