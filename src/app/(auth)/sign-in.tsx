import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useT } from '@/providers/locale-provider';

export default function SignInScreen() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.back();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">{t('auth.signInTitle')}</AppText>
        <AppText color="textSecondary">{t('auth.signInSubtitle')}</AppText>
      </View>
      <Input
        label={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="camille@example.com"
      />
      <Input
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        placeholder="••••••••"
      />
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : null}
      <Button
        label={t('auth.signIn')}
        onPress={submit}
        loading={submitting}
        disabled={!email.trim() || !password}
      />
      <View style={styles.footer}>
        <AppText variant="caption" color="textSecondary">
          {t('auth.noAccount')}
        </AppText>
        <Button
          label={t('auth.signUp')}
          variant="ghost"
          compact
          onPress={() => router.replace('/(auth)/sign-up')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
});
