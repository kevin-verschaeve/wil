import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ChipSelect } from '@/components/form/chip-select';
import { DateTimeField } from '@/components/form/datetime-field';
import { SwitchRow } from '@/components/form/switch-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { useDeleteLesson, useLessons, useUpsertLesson } from '@/hooks/use-lessons';
import { formatClock, weekdayName } from '@/lib/format';
import type { Lesson, LessonLevel } from '@/lib/types';
import { useLocale, useT } from '@/providers/locale-provider';

const LEVELS: LessonLevel[] = ['all', 'beginner', 'intermediate', 'advanced'];
const WEEKDAYS = ['1', '2', '3', '4', '5', '6', '7'] as const;
type Weekday = (typeof WEEKDAYS)[number];

function defaultSeason(): string {
  const now = new Date();
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-${year + 1}`;
}

export default function LessonFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const t = useT();
  const lessons = useLessons();
  const existing = id ? lessons.data?.find((l) => l.id === id) : undefined;

  if (id && lessons.isLoading) return <LoadingView />;

  return (
    <>
      <Stack.Screen options={{ title: id ? t('admin.editLesson') : t('admin.newLesson') }} />
      <LessonForm key={id ?? 'new'} existing={existing} />
    </>
  );
}

function LessonForm({ existing }: { existing: Lesson | undefined }) {
  const { locale, t } = useLocale();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [season, setSeason] = useState(existing?.season ?? defaultSeason());
  const [level, setLevel] = useState<LessonLevel>(existing?.level ?? 'all');
  const [weekday, setWeekday] = useState<Weekday>((existing ? String(existing.weekday) : '1') as Weekday);
  const [startTime, setStartTime] = useState(existing ? formatClock(existing.start_time) : '');
  const [endTime, setEndTime] = useState(existing ? formatClock(existing.end_time) : '');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [teacherName, setTeacherName] = useState(existing?.teacher_name ?? '');
  const [capacity, setCapacity] = useState(existing?.capacity != null ? String(existing.capacity) : '');
  const [startsOn, setStartsOn] = useState(existing?.starts_on ?? '');
  const [endsOn, setEndsOn] = useState(existing?.ends_on ?? '');
  const [isOpen, setIsOpen] = useState(existing?.is_open ?? true);

  const upsert = useUpsertLesson();
  const remove = useDeleteLesson();

  const save = async () => {
    if (!title.trim() || !season.trim() || !startTime || !endTime) {
      Alert.alert(t('admin.requiredFields'));
      return;
    }
    try {
      await upsert.mutateAsync({
        ...(existing ? { id: existing.id } : {}),
        title: title.trim(),
        description,
        season: season.trim(),
        level,
        weekday: Number(weekday),
        start_time: startTime,
        end_time: endTime,
        location,
        teacher_name: teacherName,
        capacity: capacity.trim() ? Number(capacity) : null,
        starts_on: startsOn || null,
        ends_on: endsOn || null,
        is_open: isOpen,
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
      <Input label={t('admin.season')} value={season} onChangeText={setSeason} placeholder="2026-2027" />
      <ChipSelect
        label={t('admin.level')}
        options={LEVELS.map((l) => ({ value: l, label: t(`lessons.level.${l}`) }))}
        value={level}
        onChange={setLevel}
      />
      <ChipSelect
        label={t('admin.weekday')}
        options={WEEKDAYS.map((d) => ({ value: d, label: weekdayName(Number(d), locale) }))}
        value={weekday}
        onChange={setWeekday}
      />
      <DateTimeField label={t('admin.startTime')} mode="time" value={startTime} onChange={setStartTime} />
      <DateTimeField label={t('admin.endTime')} mode="time" value={endTime} onChange={setEndTime} />
      <Input label={t('admin.location')} value={location} onChangeText={setLocation} />
      <Input label={t('admin.teacherName')} value={teacherName} onChangeText={setTeacherName} />
      <Input
        label={t('admin.capacity')}
        hint={t('admin.capacityHint')}
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="number-pad"
      />
      <DateTimeField label={t('admin.startDate')} mode="date" value={startsOn} onChange={setStartsOn} />
      <DateTimeField label={t('admin.endDate')} mode="date" value={endsOn} onChange={setEndsOn} />
      <SwitchRow label={t('admin.isOpen')} value={isOpen} onChange={setIsOpen} />
      <Input label={t('admin.description')} value={description} onChangeText={setDescription} multiline />
      <Button label={t('common.save')} onPress={save} loading={upsert.isPending} />
      {existing ? (
        <Button label={t('common.delete')} variant="danger" onPress={confirmDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
