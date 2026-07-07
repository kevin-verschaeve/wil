import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useProfiles } from '@/hooks/use-profiles';
import { useT } from '@/providers/locale-provider';

export default function AdminUsersScreen() {
  const t = useT();
  const profiles = useProfiles();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const all = profiles.data ?? [];
    if (!needle) return all;
    return all.filter((profile) => profile.full_name.toLowerCase().includes(needle));
  }, [profiles.data, search]);

  return (
    <Screen>
      <Input
        value={search}
        onChangeText={setSearch}
        placeholder={t('admin.searchUser')}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {profiles.isLoading ? (
        <LoadingView />
      ) : profiles.isError ? (
        <ErrorView message={profiles.error?.message} onRetry={() => profiles.refetch()} />
      ) : filtered.length === 0 ? (
        <AppText color="textSecondary">{t('admin.noUsers')}</AppText>
      ) : (
        filtered.map((profile) => (
          <ListRow
            key={profile.id}
            icon="person"
            title={profile.full_name || profile.id.slice(0, 8)}
            right={
              profile.role !== 'member' ? (
                <Badge
                  label={t(`profile.roles.${profile.role}`)}
                  tone={profile.role === 'admin' ? 'primary' : 'success'}
                />
              ) : undefined
            }
            onPress={() => router.push({ pathname: '/admin/user-form', params: { id: profile.id } })}
          />
        ))
      )}
    </Screen>
  );
}
