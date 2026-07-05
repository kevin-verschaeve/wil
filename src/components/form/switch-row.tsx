import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SwitchRowProps {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SwitchRow({ label, hint, value, onChange }: SwitchRowProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <AppText variant="subtitle">{label}</AppText>
        {hint ? (
          <AppText variant="caption" color="textSecondary">
            {hint}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
