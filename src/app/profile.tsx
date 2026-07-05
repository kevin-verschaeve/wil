import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ChipSelect } from '@/components/form/chip-select';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/providers/auth-provider';
import { useLocale } from '@/providers/locale-provider';

export default function ProfileScreen() {
  const { locale, setLocale, t } = useLocale();
  const { session, profile, signOut } = useAuth();

  const onSignOut = async () => {
    await signOut();
    router.back();
  };

  return (
    <Screen>
      <Card style={styles.card}>
        <View style={styles.row}>
          <AppText variant="label" color="textSecondary">
            {t('profile.name').toUpperCase()}
          </AppText>
          <AppText variant="subtitle">{profile?.full_name || '—'}</AppText>
        </View>
        <View style={styles.row}>
          <AppText variant="label" color="textSecondary">
            {t('profile.email').toUpperCase()}
          </AppText>
          <AppText variant="subtitle">{session?.user.email ?? '—'}</AppText>
        </View>
        <View style={styles.row}>
          <AppText variant="label" color="textSecondary">
            {t('profile.role').toUpperCase()}
          </AppText>
          <Badge
            label={t(`profile.roles.${profile?.role ?? 'member'}`)}
            tone={profile?.role === 'admin' ? 'primary' : 'neutral'}
          />
        </View>
      </Card>

      <ChipSelect
        label={t('profile.language')}
        options={[
          { value: 'fr', label: t('profile.languages.fr') },
          { value: 'en', label: t('profile.languages.en') },
        ]}
        value={locale}
        onChange={setLocale}
      />

      <Button label={t('auth.signOut')} variant="danger" onPress={onSignOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.lg,
  },
  row: {
    gap: 4,
  },
});
