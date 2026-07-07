import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/providers/auth-provider';
import { useT } from '@/providers/locale-provider';

export default function MoreScreen() {
  const theme = useTheme();
  const t = useT();
  const { session, profile, isAdmin, profileError, refreshProfile } = useAuth();

  return (
    <Screen safeTop>
      <AppText variant="display">{t('more.title')}</AppText>

      {session ? (
        <>
          <ListRow
            icon="person"
            title={profile?.full_name || session.user.email || ''}
            subtitle={t(`profile.roles.${profile?.role ?? 'member'}`)}
            onPress={() => router.push('/profile')}
          />
          {profileError ? <ErrorView message={profileError} onRetry={refreshProfile} /> : null}
        </>
      ) : (
        <Card onPress={() => router.push('/(auth)/sign-in')} style={styles.signInCard}>
          <Ionicons name="person-circle-outline" size={32} color={theme.primary} />
          <View style={styles.signInTexts}>
            <AppText variant="subtitle">{t('auth.signIn')}</AppText>
            <AppText variant="caption" color="textSecondary">
              {t('more.signInHint')}
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </Card>
      )}

      {isAdmin ? (
        <ListRow
          icon="settings"
          title={t('more.admin')}
          subtitle={t('admin.subtitle')}
          onPress={() => router.push('/admin')}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  signInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  signInTexts: {
    flex: 1,
    gap: 2,
  },
});
