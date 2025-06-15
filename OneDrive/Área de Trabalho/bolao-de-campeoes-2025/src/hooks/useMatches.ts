import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface Match {
  id: string;
  home_team: {
    name: string;
    country: string;
    logo_url?: string;
  };
  away_team: {
    name: string;
    country: string;
    logo_url?: string;
  };
  match_date: string;
  match_time: string;
  status: 'upcoming' | 'live' | 'finished';
  home_score?: number;
  away_score?: number;
  group: {
    name: string;
  };
}

// Canal global para mudanças nos jogos
export const matchesChannel = supabase.channel('matches-changes');
let isSubscribed = false;

export const useMatches = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      console.log('Fetching matches from Supabase...');
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          match_date,
          match_time,
          status,
          home_score,
          away_score,
          home_team:teams!matches_home_team_id_fkey (
            name,
            country,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            name,
            country,
            logo_url
          ),
          group:groups (
            name
          )
        `)
        .order('match_date', { ascending: true })
        .order('match_time', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }

      console.log('Matches fetched successfully:', data);
      return data as Match[];
    },
  });

  // Inscreve-se para mudanças na tabela de jogos
  useEffect(() => {
    // Configura o canal apenas uma vez
    if (!isSubscribed) {
      matchesChannel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'matches'
          },
          (payload) => {
            console.log('Match changed:', payload);
            // Invalida a query de jogos para forçar uma nova busca
            queryClient.invalidateQueries({ queryKey: ['matches'] });
          }
        )
        .subscribe();
      isSubscribed = true;
    }

    return () => {
      // Não desinscreve o canal aqui, pois ele é compartilhado
    };
  }, [queryClient]);

  return query;
};
