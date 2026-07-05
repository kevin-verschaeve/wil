import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useArtists, useDeleteArtist, useUpsertArtist } from '@/hooks/use-festival';
import type { Artist } from '@/lib/types';
import { useT } from '@/providers/locale-provider';

export default function ArtistFormScreen() {
  const { id, editionId } = useLocalSearchParams<{ id?: string; editionId: string }>();
  const t = useT();
  const artists = useArtists(editionId);
  const existing = id ? artists.data?.find((a) => a.id === id) : undefined;

  if (id && artists.isLoading) return <LoadingView />;

  return (
    <>
      <Stack.Screen options={{ title: id ? t('admin.editArtist') : t('admin.newArtist') }} />
      <ArtistForm key={id ?? 'new'} existing={existing} editionId={editionId} />
    </>
  );
}

function ArtistForm({ existing, editionId }: { existing: Artist | undefined; editionId: string }) {
  const t = useT();
  const [name, setName] = useState(existing?.name ?? '');
  const [style, setStyle] = useState(existing?.style ?? '');
  const [bio, setBio] = useState(existing?.bio ?? '');
  const [photoUrl, setPhotoUrl] = useState(existing?.photo_url ?? '');

  const upsert = useUpsertArtist();
  const remove = useDeleteArtist();

  const save = async () => {
    if (!name.trim()) {
      Alert.alert(t('admin.requiredFields'));
      return;
    }
    try {
      await upsert.mutateAsync({
        ...(existing ? { id: existing.id } : {}),
        edition_id: editionId,
        name: name.trim(),
        style,
        bio,
        photo_url: photoUrl.trim() || null,
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
      <Input label={t('admin.artistName')} value={name} onChangeText={setName} />
      <Input label={t('admin.style')} value={style} onChangeText={setStyle} placeholder="Électro swing" />
      <Input
        label={`${t('admin.photoUrl')} (${t('common.optional')})`}
        value={photoUrl}
        onChangeText={setPhotoUrl}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="https://…"
      />
      <Input label={t('admin.bio')} value={bio} onChangeText={setBio} multiline />
      <Button label={t('common.save')} onPress={save} loading={upsert.isPending} />
      {existing ? (
        <Button label={t('common.delete')} variant="danger" onPress={confirmDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
