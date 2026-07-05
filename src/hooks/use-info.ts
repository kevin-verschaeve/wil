import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { InfoPage } from '@/lib/types';

export function useInfoPages() {
  return useQuery({
    queryKey: ['info-pages'],
    queryFn: async (): Promise<InfoPage[]> => {
      const { data, error } = await supabase.from('info_pages').select('*').order('sort_order');
      if (error) throw new Error(error.message);
      return data as InfoPage[];
    },
  });
}

export function useUpsertInfoPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (page: Partial<InfoPage> & Pick<InfoPage, 'slug' | 'title_fr'>) => {
      const { error } = await supabase.from('info_pages').upsert(page);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['info-pages'] }),
  });
}

export function useDeleteInfoPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pageId: string) => {
      const { error } = await supabase.from('info_pages').delete().eq('id', pageId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['info-pages'] }),
  });
}

/** Locale-aware accessors for bilingual info pages. */
export function infoTitle(page: InfoPage, locale: 'fr' | 'en'): string {
  return locale === 'en' && page.title_en ? page.title_en : page.title_fr;
}

export function infoBody(page: InfoPage, locale: 'fr' | 'en'): string {
  return locale === 'en' && page.body_en ? page.body_en : page.body_fr;
}
