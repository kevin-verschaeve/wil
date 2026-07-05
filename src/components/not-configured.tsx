import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { useT } from '@/providers/locale-provider';

/** Shown when the Supabase environment variables are missing (see README). */
export function NotConfiguredScreen() {
  const t = useT();
  return (
    <Screen scroll={false} safeTop contentStyle={{ justifyContent: 'center' }}>
      <EmptyState
        icon="construct-outline"
        title={t('errors.notConfiguredTitle')}
        body={t('errors.notConfiguredBody')}
      />
    </Screen>
  );
}
