import { format, parseISO } from 'date-fns';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ChipSelect } from '@/components/form/chip-select';
import { DateTimeField } from '@/components/form/datetime-field';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useActivities, useArtists, useDeleteActivity, useEditions, useStages, useUpsertActivity } from '@/hooks/use-festival';
import { dayKey, editionDays, formatDayLong } from '@/lib/format';
import type { ActivityCategory, ActivityWithRelations, Edition, UserRole } from '@/lib/types';
import { useLocale } from '@/providers/locale-provider';

const CATEGORIES: ActivityCategory[] = ['concert', 'workshop', 'dance', 'talk', 'other'];
const TARGETS: UserRole[] = ['member', 'volunteer', 'admin'];

export default function ActivityFormScreen() {
  const { id, editionId } = useLocalSearchParams<{ id?: string; editionId: string }>();
  const { t } = useLocale();
  const activities = useActivities(editionId);
  const editions = useEditions();
  const existing = id ? activities.data?.find((a) => a.id === id) : undefined;
  const edition = editions.data?.find((e) => e.id === editionId);

  if ((id && activities.isLoading) || editions.isLoading || !edition) return <LoadingView />;

  return (
    <>
      <Stack.Screen options={{ title: id ? t('admin.editActivity') : t('admin.newActivity') }} />
      <ActivityForm key={id ?? 'new'} existing={existing} edition={edition} />
    </>
  );
}

function ActivityForm({
  existing,
  edition,
}: {
  existing: ActivityWithRelations | undefined;
  edition: Edition;
}) {
  const { locale, t } = useLocale();
  const stages = useStages(edition.id);
  const artists = useArtists(edition.id);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<ActivityCategory>(existing?.category ?? 'concert');
  const [targetRole, setTargetRole] = useState<UserRole>(existing?.target_role ?? 'member');
  const [stageId, setStageId] = useState<string>(existing?.stage_id ?? 'none');
  const [artistId, setArtistId] = useState<string>(existing?.artist_id ?? 'none');
  const [capacity, setCapacity] = useState(existing?.capacity != null ? String(existing.capacity) : '');

  // The activity lives on one of the edition's days; only times are picked.
  const days = editionDays(edition.starts_on, edition.ends_on);
  const existingDay = existing ? dayKey(existing.starts_at) : undefined;
  if (existingDay && !days.includes(existingDay)) days.unshift(existingDay);
  const [day, setDay] = useState<string>(existingDay ?? days[0]);
  const [startTime, setStartTime] = useState(
    existing ? format(parseISO(existing.starts_at), 'HH:mm') : '',
  );
  const [endTime, setEndTime] = useState(existing ? format(parseISO(existing.ends_at), 'HH:mm') : '');

  const upsert = useUpsertActivity();
  const remove = useDeleteActivity();

  const save = async () => {
    if (!title.trim() || !day || !startTime || !endTime) {
      Alert.alert(t('admin.requiredFields'));
      return;
    }
    const startsAt = new Date(`${day}T${startTime}:00`);
    const endsAt = new Date(`${day}T${endTime}:00`);
    // An end time earlier than the start means the activity runs past
    // midnight (e.g. a party from 21:30 to 04:00).
    if (endsAt <= startsAt) endsAt.setDate(endsAt.getDate() + 1);
    try {
      await upsert.mutateAsync({
        ...(existing ? { id: existing.id } : {}),
        edition_id: edition.id,
        title: title.trim(),
        description,
        category,
        target_role: targetRole,
        stage_id: stageId === 'none' ? null : stageId,
        artist_id: artistId === 'none' ? null : artistId,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
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
        label={t('admin.weekday')}
        options={days.map((d) => ({ value: d, label: formatDayLong(d, locale) }))}
        value={day}
        onChange={setDay}
      />
      <DateTimeField label={t('admin.startTime')} mode="time" value={startTime} onChange={setStartTime} />
      <DateTimeField label={t('admin.endTime')} mode="time" value={endTime} onChange={setEndTime} />
      <AppText variant="caption" color="textSecondary">
        {t('admin.overnightHint')}
      </AppText>
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
