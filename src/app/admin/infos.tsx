import { router } from 'expo-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { infoTitle, useInfoPages } from '@/hooks/use-info';
import { useLocale } from '@/providers/locale-provider';

export default function AdminInfoPagesScreen() {
  const { locale, t } = useLocale();
  const pages = useInfoPages();

  return (
    <Screen>
      <Button label={t('admin.newInfoPage')} icon="add" onPress={() => router.push('/admin/info-form')} />
      {pages.isLoading ? (
        <LoadingView />
      ) : pages.isError ? (
        <ErrorView onRetry={() => pages.refetch()} />
      ) : (
        (pages.data ?? []).map((page) => (
          <ListRow
            key={page.id}
            icon={(page.icon || 'information-circle') as never}
            title={infoTitle(page, locale)}
            subtitle={page.slug}
            right={!page.published ? <Badge label={t('admin.published')} tone="neutral" /> : undefined}
            onPress={() => router.push({ pathname: '/admin/info-form', params: { id: page.id } })}
          />
        ))
      )}
    </Screen>
  );
}
