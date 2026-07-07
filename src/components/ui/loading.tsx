import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/providers/locale-provider';

export function LoadingView() {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message?: string | null; onRetry?: () => void }) {
  const t = useT();
  return (
    <View style={styles.wrap}>
      <AppText color="textSecondary" style={styles.center}>
        {t('errors.generic')}
      </AppText>
      {message ? (
        <AppText variant="caption" color="danger" style={styles.center} selectable>
          {message}
        </AppText>
      ) : null}
      {onRetry ? <Button label={t('common.retry')} variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  center: {
    textAlign: 'center',
  },
});
