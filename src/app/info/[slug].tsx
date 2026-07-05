import { Stack, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/ui/app-text';
import { ErrorView, LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { infoBody, infoTitle, useInfoPages } from '@/hooks/use-info';
import { useLocale } from '@/providers/locale-provider';

export default function InfoPageScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { locale } = useLocale();
  const pages = useInfoPages();

  if (pages.isLoading) return <LoadingView />;
  const page = (pages.data ?? []).find((p) => p.slug === slug);
  if (!page) return <ErrorView onRetry={() => pages.refetch()} />;

  return (
    <>
      <Stack.Screen options={{ title: infoTitle(page, locale) }} />
      <Screen>
        <AppText variant="display">{infoTitle(page, locale)}</AppText>
        {infoBody(page, locale)
          .split('\n\n')
          .map((paragraph, index) => (
            <AppText key={index} color="textSecondary" style={{ lineHeight: 22 }}>
              {paragraph}
            </AppText>
          ))}
      </Screen>
    </>
  );
}
