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

export default function SignUpScreen() {
  const t = useT();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    setSubmitting(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    // When email confirmation is enabled there is no session yet.
    if (!data.session) {
      setNotice(t('auth.checkEmail'));
      return;
    }
    router.back();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">{t('auth.signUpTitle')}</AppText>
        <AppText color="textSecondary">{t('auth.signUpSubtitle')}</AppText>
      </View>
      <Input
        label={t('auth.fullName')}
        value={fullName}
        onChangeText={setFullName}
        autoComplete="name"
        placeholder="Camille Dupont"
      />
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
        autoComplete="new-password"
        placeholder="••••••••"
      />
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : null}
      {notice ? (
        <AppText variant="caption" color="success">
          {notice}
        </AppText>
      ) : null}
      <Button
        label={t('auth.signUp')}
        onPress={submit}
        loading={submitting}
        disabled={!fullName.trim() || !email.trim() || password.length < 6}
      />
      <View style={styles.footer}>
        <AppText variant="caption" color="textSecondary">
          {t('auth.haveAccount')}
        </AppText>
        <Button
          label={t('auth.signIn')}
          variant="ghost"
          compact
          onPress={() => router.replace('/(auth)/sign-in')}
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
