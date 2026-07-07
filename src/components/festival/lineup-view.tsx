import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ArtistCard } from '@/components/artist-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Spacing } from '@/constants/theme';
import { useArtists } from '@/hooks/use-festival';
import { useT } from '@/providers/locale-provider';

/** The edition's artists / guest pros. */
export function LineupView({ editionId }: { editionId: string }) {
  const t = useT();
  const artists = useArtists(editionId);

  if (artists.isLoading) return <LoadingView />;
  if (artists.isError) {
    return <ErrorView message={artists.error?.message} onRetry={() => artists.refetch()} />;
  }
  if ((artists.data?.length ?? 0) === 0) {
    return <EmptyState icon="musical-notes-outline" title={t('lineup.empty')} />;
  }

  return (
    <View style={styles.list}>
      {artists.data!.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          onPress={() => router.push({ pathname: '/artist/[id]', params: { id: artist.id } })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
});
