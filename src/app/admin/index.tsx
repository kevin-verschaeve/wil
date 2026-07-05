import { router } from 'expo-router';

import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { useT } from '@/providers/locale-provider';

export default function AdminHomeScreen() {
  const t = useT();

  return (
    <Screen>
      <ListRow
        icon="sparkles"
        title={t('admin.editions')}
        subtitle={t('admin.editionsHint')}
        onPress={() => router.push('/admin/editions')}
      />
      <ListRow
        icon="calendar"
        title={t('admin.activities')}
        subtitle={t('admin.activitiesHint')}
        onPress={() => router.push('/admin/activities')}
      />
      <ListRow
        icon="musical-notes"
        title={t('admin.artists')}
        subtitle={t('admin.artistsHint')}
        onPress={() => router.push('/admin/artists')}
      />
      <ListRow
        icon="body"
        title={t('admin.lessons')}
        subtitle={t('admin.lessonsHint')}
        onPress={() => router.push('/admin/lessons')}
      />
      <ListRow
        icon="information-circle"
        title={t('admin.infoPages')}
        subtitle={t('admin.infoPagesHint')}
        onPress={() => router.push('/admin/infos')}
      />
    </Screen>
  );
}
