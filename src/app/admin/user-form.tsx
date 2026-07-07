import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ChipSelect } from '@/components/form/chip-select';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useProfiles, useUpdateProfile } from '@/hooks/use-profiles';
import type { Profile, UserRole } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';
import { useT } from '@/providers/locale-provider';

const ROLES: UserRole[] = ['member', 'teacher', 'admin'];

export default function UserFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const profiles = useProfiles();
  const existing = profiles.data?.find((p) => p.id === id);

  if (profiles.isLoading) return <LoadingView />;
  if (!existing) {
    return <ErrorView message={profiles.error?.message} onRetry={() => profiles.refetch()} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: t('admin.editUser') }} />
      <UserForm key={id} existing={existing} />
    </>
  );
}

function UserForm({ existing }: { existing: Profile }) {
  const t = useT();
  const { profile: myProfile } = useAuth();
  const isSelf = myProfile?.id === existing.id;

  const [fullName, setFullName] = useState(existing.full_name);
  const [role, setRole] = useState<UserRole>(existing.role);

  const update = useUpdateProfile();

  const save = async () => {
    if (!fullName.trim()) {
      Alert.alert(t('admin.requiredFields'));
      return;
    }
    try {
      await update.mutateAsync({ id: existing.id, full_name: fullName.trim(), role });
      router.back();
    } catch (error) {
      Alert.alert(t('errors.generic'), String(error));
    }
  };

  return (
    <Screen>
      <Input label={t('auth.fullName')} value={fullName} onChangeText={setFullName} />
      {isSelf ? (
        <View style={styles.ownRole}>
          <AppText variant="label" color="textSecondary">
            {t('profile.role').toUpperCase()}
          </AppText>
          <Badge label={t(`profile.roles.${existing.role}`)} tone="primary" />
          <AppText variant="caption" color="textSecondary">
            {t('admin.ownRoleHint')}
          </AppText>
        </View>
      ) : (
        <ChipSelect
          label={t('profile.role')}
          options={ROLES.map((r) => ({ value: r, label: t(`profile.roles.${r}`) }))}
          value={role}
          onChange={setRole}
        />
      )}
      <Button label={t('common.save')} onPress={save} loading={update.isPending} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  ownRole: {
    gap: 6,
  },
});
