import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Profile, UserRole } from '@/lib/types';

/** All user profiles — RLS only returns them to admins. */
export function useProfiles() {
  return useQuery({
    queryKey: ['profiles-admin'],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')
        .order('created_at');
      if (error) throw new Error(error.message);
      return data as Profile[];
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, full_name, role }: { id: string; full_name: string; role: UserRole }) => {
      const { error } = await supabase.from('profiles').update({ full_name, role }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profiles-admin'] });
      // The edited user may be the signed-in admin (name change).
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
