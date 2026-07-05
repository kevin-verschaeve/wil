import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { SwitchRow } from '@/components/form/switch-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useDeleteInfoPage, useInfoPages, useUpsertInfoPage } from '@/hooks/use-info';
import type { InfoPage } from '@/lib/types';
import { useT } from '@/providers/locale-provider';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function InfoPageFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const t = useT();
  const pages = useInfoPages();
  const existing = id ? pages.data?.find((p) => p.id === id) : undefined;

  if (id && pages.isLoading) return <LoadingView />;

  return (
    <>
      <Stack.Screen options={{ title: id ? t('admin.editInfoPage') : t('admin.newInfoPage') }} />
      <InfoPageForm key={id ?? 'new'} existing={existing} pageCount={pages.data?.length ?? 0} />
    </>
  );
}

function InfoPageForm({ existing, pageCount }: { existing: InfoPage | undefined; pageCount: number }) {
  const t = useT();

  const [slug, setSlug] = useState(existing?.slug ?? '');
  const [icon, setIcon] = useState(existing?.icon ?? 'information-circle');
  const [titleFr, setTitleFr] = useState(existing?.title_fr ?? '');
  const [titleEn, setTitleEn] = useState(existing?.title_en ?? '');
  const [bodyFr, setBodyFr] = useState(existing?.body_fr ?? '');
  const [bodyEn, setBodyEn] = useState(existing?.body_en ?? '');
  const [published, setPublished] = useState(existing?.published ?? true);

  const upsert = useUpsertInfoPage();
  const remove = useDeleteInfoPage();

  const save = async () => {
    if (!titleFr.trim()) {
      Alert.alert(t('admin.requiredFields'));
      return;
    }
    try {
      await upsert.mutateAsync({
        ...(existing ? { id: existing.id } : {}),
        slug: slug.trim() || slugify(titleFr),
        icon: icon.trim() || 'information-circle',
        title_fr: titleFr.trim(),
        title_en: titleEn.trim(),
        body_fr: bodyFr,
        body_en: bodyEn,
        published,
        sort_order: existing?.sort_order ?? pageCount,
      });
      router.back();
    } catch (error) {
      Alert.alert(t('errors.generic'), String(error));
    }
  };

  const confirmDelete = () =>
    Alert.alert(t('common.deleteConfirmTitle'), t('common.deleteConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => remove.mutate(existing!.id, { onSuccess: () => router.back() }),
      },
    ]);

  return (
    <Screen>
      <Input label={t('admin.titleFr')} value={titleFr} onChangeText={setTitleFr} />
      <Input label={t('admin.titleEn')} value={titleEn} onChangeText={setTitleEn} />
      <Input label={t('admin.bodyFr')} value={bodyFr} onChangeText={setBodyFr} multiline />
      <Input label={t('admin.bodyEn')} value={bodyEn} onChangeText={setBodyEn} multiline />
      <Input
        label={`${t('admin.slug')} (${t('common.optional')})`}
        value={slug}
        onChangeText={setSlug}
        autoCapitalize="none"
      />
      <Input label={t('admin.icon')} value={icon} onChangeText={setIcon} autoCapitalize="none" />
      <SwitchRow label={t('admin.published')} value={published} onChange={setPublished} />
      <Button label={t('common.save')} onPress={save} loading={upsert.isPending} />
      {existing ? (
        <Button label={t('common.delete')} variant="danger" onPress={confirmDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
