import { router } from 'expo-router';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useArtists, useCurrentEdition } from '@/hooks/use-festival';
import { useT } from '@/providers/locale-provider';

export default function AdminArtistsScreen() {
  const t = useT();
  const edition = useCurrentEdition();
  const artists = useArtists(edition.data?.id);

  if (edition.isLoading) return <LoadingView />;
  if (!edition.data) {
    return (
      <Screen>
        <AppText color="textSecondary">{t('admin.noEditionYet')}</AppText>
        <Button label={t('admin.newEdition')} onPress={() => router.push('/admin/edition-form')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText color="textSecondary">
        {edition.data.name} — {edition.data.year}
      </AppText>
      <Button
        label={t('admin.newArtist')}
        icon="add"
        onPress={() => router.push({ pathname: '/admin/artist-form', params: { editionId: edition.data!.id } })}
      />
      {artists.isLoading ? (
        <LoadingView />
      ) : artists.isError ? (
        <ErrorView onRetry={() => artists.refetch()} />
      ) : (
        (artists.data ?? []).map((artist) => (
          <ListRow
            key={artist.id}
            icon="musical-notes"
            title={artist.name}
            subtitle={artist.style || undefined}
            onPress={() =>
              router.push({
                pathname: '/admin/artist-form',
                params: { id: artist.id, editionId: edition.data!.id },
              })
            }
          />
        ))
      )}
    </Screen>
  );
}
