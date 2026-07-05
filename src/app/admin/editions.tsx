import { router } from 'expo-router';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useEditions } from '@/hooks/use-festival';
import { formatFullDate } from '@/lib/format';
import { useLocale } from '@/providers/locale-provider';

export default function AdminEditionsScreen() {
  const { locale, t } = useLocale();
  const editions = useEditions();

  return (
    <Screen>
      <Button
        label={t('admin.newEdition')}
        icon="add"
        onPress={() => router.push('/admin/edition-form')}
      />
      {editions.isLoading ? (
        <LoadingView />
      ) : editions.isError ? (
        <ErrorView onRetry={() => editions.refetch()} />
      ) : (editions.data?.length ?? 0) === 0 ? (
        <AppText color="textSecondary">{t('admin.noEditionYet')}</AppText>
      ) : (
        editions.data!.map((edition) => (
          <ListRow
            key={edition.id}
            icon="sparkles"
            title={`${edition.name} — ${edition.year}`}
            subtitle={`${formatFullDate(edition.starts_on, locale)} – ${formatFullDate(edition.ends_on, locale)}`}
            right={edition.is_current ? <Badge label={t('admin.isCurrent')} tone="success" /> : undefined}
            onPress={() => router.push({ pathname: '/admin/edition-form', params: { id: edition.id } })}
          />
        ))
      )}
    </Screen>
  );
}
