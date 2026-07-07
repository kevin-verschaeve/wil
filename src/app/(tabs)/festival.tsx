import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { LineupView } from '@/components/festival/lineup-view';
import { PlanningView } from '@/components/festival/planning-view';
import { ProgrammeView } from '@/components/festival/programme-view';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useCurrentEdition } from '@/hooks/use-festival';
import { infoTitle, useInfoPages } from '@/hooks/use-info';
import { formatFullDate } from '@/lib/format';
import { useLocale } from '@/providers/locale-provider';

type Segment = 'programme' | 'lineup' | 'planning' | 'infos';

/** The festival side: programme, lineup, personal schedule and festival info. */
export default function FestivalScreen() {
  const { locale, t } = useLocale();
  const edition = useCurrentEdition();
  const infoPages = useInfoPages();
  const [segment, setSegment] = useState<Segment>('programme');

  if (edition.isLoading) {
    return (
      <Screen safeTop scroll={false}>
        <LoadingView />
      </Screen>
    );
  }
  if (edition.isError) {
    return (
      <Screen safeTop scroll={false}>
        <ErrorView message={edition.error?.message} onRetry={() => edition.refetch()} />
      </Screen>
    );
  }
  if (!edition.data) {
    return (
      <Screen safeTop scroll={false} contentStyle={styles.centered}>
        <EmptyState
          icon="sparkles-outline"
          title={t('festival.noEditionTitle')}
          body={t('festival.noEditionBody')}
        />
      </Screen>
    );
  }

  const data = edition.data;
  const festivalPages = (infoPages.data ?? []).filter(
    (page) => page.published && page.edition_id === data.id,
  );

  const segments: { key: Segment; label: string }[] = [
    { key: 'programme', label: t('programme.title') },
    { key: 'lineup', label: t('lineup.title') },
    { key: 'planning', label: t('schedule.title') },
    { key: 'infos', label: t('festival.infos') },
  ];

  return (
    <Screen safeTop>
      <View style={styles.header}>
        <AppText variant="display">{data.name}</AppText>
        <AppText color="textSecondary">
          {formatFullDate(data.starts_on, locale)} – {formatFullDate(data.ends_on, locale)}
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.segmentScroll}
        contentContainerStyle={styles.segmentRow}
      >
        {segments.map((s) => (
          <Chip key={s.key} label={s.label} selected={segment === s.key} onPress={() => setSegment(s.key)} />
        ))}
      </ScrollView>

      {segment === 'programme' ? <ProgrammeView edition={data} /> : null}
      {segment === 'lineup' ? <LineupView editionId={data.id} /> : null}
      {segment === 'planning' ? (
        <PlanningView editionId={data.id} onGoToProgramme={() => setSegment('programme')} />
      ) : null}
      {segment === 'infos' ? (
        <View style={styles.infosList}>
          <ListRow icon="map" title={t('floorplan.title')} onPress={() => router.push('/floorplan')} />
          {infoPages.isError ? (
            <ErrorView message={infoPages.error?.message} onRetry={() => infoPages.refetch()} />
          ) : null}
          {festivalPages.map((page) => (
            <ListRow
              key={page.id}
              icon={(page.icon || 'information-circle') as never}
              title={infoTitle(page, locale)}
              onPress={() => router.push({ pathname: '/info/[slug]', params: { slug: page.slug } })}
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  segmentScroll: {
    flexGrow: 0,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infosList: {
    gap: Spacing.md,
  },
  centered: {
    justifyContent: 'center',
  },
});
