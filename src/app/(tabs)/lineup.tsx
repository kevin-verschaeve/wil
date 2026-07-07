import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ArtistCard } from '@/components/artist-card';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useArtists, useCurrentEdition } from '@/hooks/use-festival';
import { useT } from '@/providers/locale-provider';

export default function LineupScreen() {
  const t = useT();
  const edition = useCurrentEdition();
  const artists = useArtists(edition.data?.id);

  return (
    <Screen safeTop>
      <View style={styles.header}>
        <AppText variant="display">{t('lineup.title')}</AppText>
        {edition.data ? <AppText color="textSecondary">{edition.data.name}</AppText> : null}
      </View>
      {edition.isLoading || artists.isLoading ? (
        <LoadingView />
      ) : artists.isError ? (
        <ErrorView message={artists.error?.message} onRetry={() => artists.refetch()} />
      ) : (artists.data?.length ?? 0) === 0 ? (
        <EmptyState icon="musical-notes-outline" title={t('lineup.empty')} />
      ) : (
        <View style={styles.list}>
          {artists.data!.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onPress={() => router.push({ pathname: '/artist/[id]', params: { id: artist.id } })}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  list: {
    gap: Spacing.md,
  },
});
