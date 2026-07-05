import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Artist } from '@/lib/types';

export interface ArtistCardProps {
  artist: Artist;
  onPress: () => void;
}

export function ArtistCard({ artist, onPress }: ArtistCardProps) {
  const theme = useTheme();
  return (
    <Card onPress={onPress} style={styles.card}>
      {artist.photo_url ? (
        <Image source={{ uri: artist.photo_url }} style={styles.photo} contentFit="cover" />
      ) : (
        <View style={[styles.photo, styles.placeholder, { backgroundColor: theme.primarySoft }]}>
          <Ionicons name="musical-notes" size={28} color={theme.primary} />
        </View>
      )}
      <View style={styles.texts}>
        <AppText variant="subtitle" numberOfLines={1}>
          {artist.name}
        </AppText>
        {artist.style ? (
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {artist.style}
          </AppText>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
