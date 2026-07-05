import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { DateTimeField } from '@/components/form/datetime-field';
import { SwitchRow } from '@/components/form/switch-row';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingView } from '@/components/ui/loading';
import { Screen } from '@/components/ui/screen';
import { Spacing, StagePalette } from '@/constants/theme';
import {
  useDeleteEdition,
  useDeleteStage,
  useEditions,
  useSetCurrentEdition,
  useStages,
  useUpsertEdition,
  useUpsertStage,
} from '@/hooks/use-festival';
import { useTheme } from '@/hooks/use-theme';
import type { Edition } from '@/lib/types';
import { useT } from '@/providers/locale-provider';

export default function EditionFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const t = useT();
  const editions = useEditions();
  const existing = id ? editions.data?.find((e) => e.id === id) : undefined;

  if (id && editions.isLoading) return <LoadingView />;

  return (
    <>
      <Stack.Screen options={{ title: id ? t('admin.editEdition') : t('admin.newEdition') }} />
      <EditionForm key={id ?? 'new'} existing={existing} />
    </>
  );
}

function EditionForm({ existing }: { existing: Edition | undefined }) {
  const theme = useTheme();
  const t = useT();

  const [name, setName] = useState(existing?.name ?? '');
  const [year, setYear] = useState(String(existing?.year ?? new Date().getFullYear()));
  const [startsOn, setStartsOn] = useState(existing?.starts_on ?? '');
  const [endsOn, setEndsOn] = useState(existing?.ends_on ?? '');
  const [isCurrent, setIsCurrent] = useState(existing?.is_current ?? false);
  const [newStage, setNewStage] = useState('');

  const stages = useStages(existing?.id);
  const upsert = useUpsertEdition();
  const setCurrent = useSetCurrentEdition();
  const remove = useDeleteEdition();
  const upsertStage = useUpsertStage();
  const deleteStage = useDeleteStage();

  const valid = name.trim() && /^\d{4}$/.test(year) && startsOn && endsOn;

  const save = async () => {
    if (!valid) {
      Alert.alert(t('admin.requiredFields'));
      return;
    }
    try {
      await upsert.mutateAsync({
        ...(existing ? { id: existing.id } : {}),
        name: name.trim(),
        year: Number(year),
        starts_on: startsOn,
        ends_on: endsOn,
      });
      // is_current goes through a dedicated mutation so only one edition stays current.
      if (existing && isCurrent && !existing.is_current) {
        await setCurrent.mutateAsync(existing.id);
      }
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

  const addStage = () => {
    if (!newStage.trim() || !existing) return;
    upsertStage.mutate({
      edition_id: existing.id,
      name: newStage.trim(),
      color: StagePalette[(stages.data?.length ?? 0) % StagePalette.length],
      sort_order: stages.data?.length ?? 0,
    });
    setNewStage('');
  };

  return (
    <Screen>
      <Input label={t('admin.editionName')} value={name} onChangeText={setName} placeholder="Festival WIL" />
      <Input label={t('admin.year')} value={year} onChangeText={setYear} keyboardType="number-pad" />
      <DateTimeField label={t('admin.startDate')} mode="date" value={startsOn} onChange={setStartsOn} />
      <DateTimeField label={t('admin.endDate')} mode="date" value={endsOn} onChange={setEndsOn} />
      {existing ? (
        <SwitchRow
          label={t('admin.isCurrent')}
          hint={t('admin.isCurrentHint')}
          value={isCurrent}
          onChange={setIsCurrent}
        />
      ) : null}

      {existing ? (
        <View style={styles.section}>
          <AppText variant="title">{t('admin.stages')}</AppText>
          {(stages.data ?? []).map((stage) => (
            <Card key={stage.id} style={styles.stageRow}>
              <View style={[styles.stageDot, { backgroundColor: stage.color }]} />
              <AppText style={styles.stageName}>{stage.name}</AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('common.delete')}
                hitSlop={8}
                onPress={() => deleteStage.mutate(stage.id)}
              >
                <Ionicons name="trash-outline" size={18} color={theme.danger} />
              </Pressable>
            </Card>
          ))}
          <View style={styles.addStageRow}>
            <View style={styles.addStageInput}>
              <Input
                value={newStage}
                onChangeText={setNewStage}
                placeholder={t('admin.stageName')}
                onSubmitEditing={addStage}
              />
            </View>
            <Button label={t('common.add')} variant="secondary" compact onPress={addStage} />
          </View>
        </View>
      ) : null}

      <Button label={t('common.save')} onPress={save} loading={upsert.isPending || setCurrent.isPending} />
      {existing ? (
        <Button label={t('common.delete')} variant="danger" onPress={confirmDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stageName: {
    flex: 1,
  },
  addStageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  addStageInput: {
    flex: 1,
  },
});
