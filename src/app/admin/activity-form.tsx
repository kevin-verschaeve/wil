import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ChipSelect } from '@/components/form/chip-select';
import { DateTimeField } from '@/components/form/datetime-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useActivities, useArtists, useDeleteActivity, useStages, useUpsertActivity } from '@/hooks/use-festival';
import type { ActivityCategory, ActivityWithRelations, UserRole } from '@/lib/types';
import { useT } from '@/providers/locale-provider';

const CATEGORIES: ActivityCategory[] = ['concert', 'workshop', 'dance', 'talk', 'other'];
const TARGETS: UserRole[] = ['member', 'volunteer', 'admin'];

export default function ActivityFormScreen() {
  const { id, editionId } = useLocalSearchParams<{ id?: string; editionId: string }>();
  const t = useT();
  const activities = useActivities(editionId);
  const existing = id ? activities.data?.find((a) => a.id === id) : undefined;

  if (id && activities.isLoading) return <LoadingView />;

  return (
    <>
      <Stack.Screen options={{ title: id ? t('admin.editActivity') : t('admin.newActivity') }} />
      <ActivityForm key={id ?? 'new'} existing={existing} editionId={editionId} />
    </>
  );
}

function ActivityForm({
  existing,
  editionId,
}: {
  existing: ActivityWithRelations | undefined;
  editionId: string;
}) {
  const t = useT();
  const stages = useStages(editionId);
  const artists = useArtists(editionId);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<ActivityCategory>(existing?.category ?? 'concert');
  const [targetRole, setTargetRole] = useState<UserRole>(existing?.target_role ?? 'member');
  const [stageId, setStageId] = useState<string>(existing?.stage_id ?? 'none');
  const [artistId, setArtistId] = useState<string>(existing?.artist_id ?? 'none');
  const [startsAt, setStartsAt] = useState(existing ? existing.starts_at.slice(0, 16) : '');
  const [endsAt, setEndsAt] = useState(existing ? existing.ends_at.slice(0, 16) : '');
  const [capacity, setCapacity] = useState(existing?.capacity != null ? String(existing.capacity) : '');

  const upsert = useUpsertActivity();
  const remove = useDeleteActivity();

  const save = async () => {
    if (!title.trim() || !startsAt || !endsAt) {
      Alert.alert(t('admin.requiredFields'));
      return;
    }
    try {
      await upsert.mutateAsync({
        ...(existing ? { id: existing.id } : {}),
        edition_id: editionId,
        title: title.trim(),
        description,
        category,
        target_role: targetRole,
        stage_id: stageId === 'none' ? null : stageId,
        artist_id: artistId === 'none' ? null : artistId,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
        capacity: capacity.trim() ? Number(capacity) : null,
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
      <Input label={t('admin.titleField')} value={title} onChangeText={setTitle} />
      <ChipSelect
        label={t('admin.category')}
        options={CATEGORIES.map((c) => ({ value: c, label: t(`activity.category.${c}`) }))}
        value={category}
        onChange={setCategory}
      />
      <ChipSelect
        label={t('admin.targetRole')}
        options={TARGETS.map((r) => ({ value: r, label: t(`activity.target.${r}`) }))}
        value={targetRole}
        onChange={setTargetRole}
      />
      <ChipSelect
        label={t('admin.stage')}
        options={[
          { value: 'none', label: t('admin.none') },
          ...(stages.data ?? []).map((s) => ({ value: s.id, label: s.name, dotColor: s.color })),
        ]}
        value={stageId}
        onChange={setStageId}
      />
      <ChipSelect
        label={t('admin.artist')}
        options={[
          { value: 'none', label: t('admin.none') },
          ...(artists.data ?? []).map((a) => ({ value: a.id, label: a.name })),
        ]}
        value={artistId}
        onChange={setArtistId}
      />
      <DateTimeField label={t('admin.startsAt')} mode="datetime" value={startsAt} onChange={setStartsAt} />
      <DateTimeField label={t('admin.endsAt')} mode="datetime" value={endsAt} onChange={setEndsAt} />
      <Input
        label={t('admin.capacity')}
        hint={t('admin.capacityHint')}
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="number-pad"
      />
      <Input label={t('admin.description')} value={description} onChangeText={setDescription} multiline />
      <Button label={t('common.save')} onPress={save} loading={upsert.isPending} />
      {existing ? (
        <Button label={t('common.delete')} variant="danger" onPress={confirmDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
