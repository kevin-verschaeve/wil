import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type {
  Activity,
  ActivityCounts,
  ActivityRegistration,
  ActivityWithRelations,
  Artist,
  Edition,
  Floorplan,
  FloorplanPoi,
  Stage,
} from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';

function throwing<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ---------- Editions ----------

export function useCurrentEdition() {
  return useQuery({
    queryKey: ['editions', 'current'],
    queryFn: async (): Promise<Edition | null> => {
      const { data, error } = await supabase
        .from('editions')
        .select('*')
        .eq('is_current', true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Edition | null;
    },
  });
}

export function useEditions() {
  return useQuery({
    queryKey: ['editions'],
    queryFn: async (): Promise<Edition[]> => {
      const { data, error } = await supabase
        .from('editions')
        .select('*')
        .order('year', { ascending: false });
      return throwing(data as Edition[], error);
    },
  });
}

export function useUpsertEdition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (edition: Partial<Edition> & Pick<Edition, 'name' | 'year' | 'starts_on' | 'ends_on'>) => {
      const { error } = await supabase.from('editions').upsert(edition);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['editions'] }),
  });
}

export function useSetCurrentEdition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (editionId: string) => {
      const unset = await supabase.from('editions').update({ is_current: false }).eq('is_current', true);
      if (unset.error) throw new Error(unset.error.message);
      const set = await supabase.from('editions').update({ is_current: true }).eq('id', editionId);
      if (set.error) throw new Error(set.error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['editions'] }),
  });
}

export function useDeleteEdition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (editionId: string) => {
      const { error } = await supabase.from('editions').delete().eq('id', editionId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries(),
  });
}

// ---------- Stages ----------

export function useStages(editionId: string | undefined) {
  return useQuery({
    queryKey: ['stages', editionId],
    enabled: !!editionId,
    queryFn: async (): Promise<Stage[]> => {
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .eq('edition_id', editionId!)
        .order('sort_order');
      return throwing(data as Stage[], error);
    },
  });
}

export function useUpsertStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (stage: Partial<Stage> & Pick<Stage, 'edition_id' | 'name'>) => {
      const { error } = await supabase.from('stages').upsert(stage);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stages'] }),
  });
}

export function useDeleteStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (stageId: string) => {
      const { error } = await supabase.from('stages').delete().eq('id', stageId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stages'] }),
  });
}

// ---------- Artists ----------

export function useArtists(editionId: string | undefined) {
  return useQuery({
    queryKey: ['artists', editionId],
    enabled: !!editionId,
    queryFn: async (): Promise<Artist[]> => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('edition_id', editionId!)
        .order('name');
      return throwing(data as Artist[], error);
    },
  });
}

export function useArtist(artistId: string | undefined) {
  return useQuery({
    queryKey: ['artists', 'detail', artistId],
    enabled: !!artistId,
    queryFn: async (): Promise<Artist | null> => {
      const { data, error } = await supabase.from('artists').select('*').eq('id', artistId!).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Artist | null;
    },
  });
}

export function useUpsertArtist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (artist: Partial<Artist> & Pick<Artist, 'edition_id' | 'name'>) => {
      const { error } = await supabase.from('artists').upsert(artist);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['artists'] }),
  });
}

export function useDeleteArtist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (artistId: string) => {
      const { error } = await supabase.from('artists').delete().eq('id', artistId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['artists'] }),
  });
}

// ---------- Activities ----------

const ACTIVITY_SELECT = '*, stage:stages(*), artist:artists(*)';

export function useActivities(editionId: string | undefined) {
  return useQuery({
    queryKey: ['activities', editionId],
    enabled: !!editionId,
    queryFn: async (): Promise<ActivityWithRelations[]> => {
      const { data, error } = await supabase
        .from('activities')
        .select(ACTIVITY_SELECT)
        .eq('edition_id', editionId!)
        .order('starts_at');
      return throwing(data as unknown as ActivityWithRelations[], error);
    },
  });
}

export function useActivity(activityId: string | undefined) {
  return useQuery({
    queryKey: ['activities', 'detail', activityId],
    enabled: !!activityId,
    queryFn: async (): Promise<ActivityWithRelations | null> => {
      const { data, error } = await supabase
        .from('activities')
        .select(ACTIVITY_SELECT)
        .eq('id', activityId!)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as unknown as ActivityWithRelations | null;
    },
  });
}

export function useActivityCounts() {
  return useQuery({
    queryKey: ['activity-counts'],
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await supabase.rpc('activity_registration_counts');
      const rows = throwing(data as ActivityCounts[], error);
      return Object.fromEntries(rows.map((r) => [r.activity_id, Number(r.registered)]));
    },
  });
}

export function useUpsertActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      activity: Partial<Activity> & Pick<Activity, 'edition_id' | 'title' | 'starts_at' | 'ends_at'>,
    ) => {
      const { error } = await supabase.from('activities').upsert(activity);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (activityId: string) => {
      const { error } = await supabase.from('activities').delete().eq('id', activityId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}

// ---------- My schedule (activity registrations) ----------

export function useMyActivityRegistrations() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['activity-registrations', userId],
    enabled: !!userId,
    queryFn: async (): Promise<ActivityRegistration[]> => {
      const { data, error } = await supabase
        .from('activity_registrations')
        .select('*')
        .eq('user_id', userId!);
      return throwing(data as ActivityRegistration[], error);
    },
  });
}

export function useToggleActivityRegistration() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ activityId, registered }: { activityId: string; registered: boolean }) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('signed-out');
      if (registered) {
        const { error } = await supabase
          .from('activity_registrations')
          .delete()
          .eq('activity_id', activityId)
          .eq('user_id', userId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('activity_registrations')
          .insert({ activity_id: activityId, user_id: userId });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['activity-registrations'] });
      qc.invalidateQueries({ queryKey: ['activity-counts'] });
    },
  });
}

// ---------- Floorplan ----------

export function useFloorplan(editionId: string | undefined) {
  return useQuery({
    queryKey: ['floorplan', editionId],
    enabled: !!editionId,
    queryFn: async (): Promise<{ floorplan: Floorplan; pois: FloorplanPoi[] } | null> => {
      const { data: floorplan, error } = await supabase
        .from('floorplans')
        .select('*')
        .eq('edition_id', editionId!)
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!floorplan) return null;
      const { data: pois, error: poisError } = await supabase
        .from('floorplan_pois')
        .select('*')
        .eq('floorplan_id', floorplan.id)
        .order('name');
      if (poisError) throw new Error(poisError.message);
      return { floorplan: floorplan as Floorplan, pois: (pois ?? []) as FloorplanPoi[] };
    },
  });
}
