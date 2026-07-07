import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { MaxContentWidth, Radius, Spacing, StagePalette } from '@/constants/theme';
import { useCurrentEdition, useFloorplan } from '@/hooks/use-festival';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/providers/locale-provider';

/**
 * Site map: an image with positioned markers when one is uploaded,
 * otherwise a schematic map drawn from the POIs' relative coordinates.
 */
export default function FloorplanScreen() {
  const theme = useTheme();
  const t = useT();
  const { width } = useWindowDimensions();
  const edition = useCurrentEdition();
  const floorplan = useFloorplan(edition.data?.id);

  if (edition.isLoading || floorplan.isLoading) return <LoadingView />;
  if (floorplan.isError) return <ErrorView message={floorplan.error?.message} onRetry={() => floorplan.refetch()} />;
  if (!floorplan.data) {
    return (
      <Screen scroll={false} contentStyle={styles.centered}>
        <EmptyState icon="map-outline" title={t('floorplan.empty')} />
      </Screen>
    );
  }

  const { floorplan: plan, pois } = floorplan.data;
  const mapWidth = Math.min(width, MaxContentWidth) - Spacing.lg * 2;
  const mapHeight = mapWidth * 1.1;

  return (
    <Screen>
      <AppText variant="display">{plan.name}</AppText>

      <View
        style={[
          styles.map,
          { width: mapWidth, height: mapHeight, backgroundColor: theme.surfaceAlt, borderColor: theme.border },
        ]}
      >
        {plan.image_url ? (
          <Image source={{ uri: plan.image_url }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : null}
        {pois.map((poi, index) => {
          const color = StagePalette[index % StagePalette.length];
          return (
            <View
              key={poi.id}
              style={[
                styles.marker,
                { left: poi.x * mapWidth - 16, top: poi.y * mapHeight - 16, backgroundColor: color },
              ]}
            >
              <Ionicons name={(poi.icon || 'location') as never} size={16} color="#FFFFFF" />
            </View>
          );
        })}
      </View>

      <AppText variant="title">{t('floorplan.legend')}</AppText>
      <Card style={styles.legend}>
        {pois.map((poi, index) => (
          <View key={poi.id} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: StagePalette[index % StagePalette.length] }]}>
              <Ionicons name={(poi.icon || 'location') as never} size={12} color="#FFFFFF" />
            </View>
            <View style={styles.legendTexts}>
              <AppText variant="subtitle">{poi.name}</AppText>
              {poi.description ? (
                <AppText variant="caption" color="textSecondary">
                  {poi.description}
                </AppText>
              ) : null}
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
  map: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  legend: {
    gap: Spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  legendDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendTexts: {
    flex: 1,
    gap: 2,
  },
});
