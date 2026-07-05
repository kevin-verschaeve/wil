import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Lesson, LessonCounts, LessonRegistration, LessonRegistrationWithProfile } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';

export function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('weekday')
        .order('start_time');
      if (error) throw new Error(error.message);
      return data as Lesson[];
    },
  });
}

export function useLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: ['lessons', 'detail', lessonId],
    enabled: !!lessonId,
    queryFn: async (): Promise<Lesson | null> => {
      const { data, error } = await supabase.from('lessons').select('*').eq('id', lessonId!).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Lesson | null;
    },
  });
}

/** Confirmed / waitlisted counts per lesson, visible to everyone. */
export function useLessonCounts() {
  return useQuery({
    queryKey: ['lesson-counts'],
    queryFn: async (): Promise<Record<string, { confirmed: number; waitlisted: number }>> => {
      const { data, error } = await supabase.rpc('lesson_registration_counts');
      if (error) throw new Error(error.message);
      return Object.fromEntries(
        (data as LessonCounts[]).map((r) => [
          r.lesson_id,
          { confirmed: Number(r.confirmed), waitlisted: Number(r.waitlisted) },
        ]),
      );
    },
  });
}

export function useMyLessonRegistrations() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['lesson-registrations', userId],
    enabled: !!userId,
    queryFn: async (): Promise<LessonRegistration[]> => {
      const { data, error } = await supabase
        .from('lesson_registrations')
        .select('*')
        .eq('user_id', userId!);
      if (error) throw new Error(error.message);
      return data as LessonRegistration[];
    },
  });
}

/** Participants of a lesson — only returns data for teachers/admins (RLS). */
export function useLessonParticipants(lessonId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['lesson-participants', lessonId],
    enabled: !!lessonId && enabled,
    queryFn: async (): Promise<LessonRegistrationWithProfile[]> => {
      const { data, error } = await supabase
        .from('lesson_registrations')
        .select('*, profile:profiles(id, full_name)')
        .eq('lesson_id', lessonId!)
        .order('created_at');
      if (error) throw new Error(error.message);
      return data as unknown as LessonRegistrationWithProfile[];
    },
  });
}

function useInvalidateLessonRegistrations() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['lesson-registrations'] });
    qc.invalidateQueries({ queryKey: ['lesson-counts'] });
    qc.invalidateQueries({ queryKey: ['lesson-participants'] });
  };
}

export function useRegisterLesson() {
  const { session } = useAuth();
  const invalidate = useInvalidateLessonRegistrations();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('signed-out');
      const { error } = await supabase
        .from('lesson_registrations')
        .insert({ lesson_id: lessonId, user_id: userId });
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });
}

export function useUnregisterLesson() {
  const { session } = useAuth();
  const invalidate = useInvalidateLessonRegistrations();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('signed-out');
      const { error } = await supabase
        .from('lesson_registrations')
        .delete()
        .eq('lesson_id', lessonId)
        .eq('user_id', userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });
}

export function useUpsertLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      lesson: Partial<Lesson> & Pick<Lesson, 'season' | 'title' | 'weekday' | 'start_time' | 'end_time'>,
    ) => {
      const { error } = await supabase.from('lessons').upsert(lesson);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons'] }),
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons'] }),
  });
}
