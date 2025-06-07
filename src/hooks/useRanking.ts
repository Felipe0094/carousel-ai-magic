
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface RankingPlayer {
  id: string;
  name: string;
  points: number;
  exactPredictions: number;
  correctResults: number;
  position: number;
  isCurrentUser?: boolean;
}

export const useRanking = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      console.log('Fetching ranking...');

      // Primeiro vamos buscar todos os usuários dos profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles fetched:', profilesData);

      // Agora buscar as predições de cada usuário
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('predictions')
        .select('user_id, points');

      if (predictionsError) {
        console.error('Error fetching predictions:', predictionsError);
        throw predictionsError;
      }

      console.log('Predictions fetched:', predictionsData);

      // Agrupar por usuário e calcular estatísticas
      const userStats = profilesData.map((profile) => {
        const userPredictions = predictionsData.filter(p => p.user_id === profile.id);
        const totalPoints = userPredictions.reduce((sum, pred) => sum + (pred.points || 0), 0);
        
        // Calcular estatísticas de acertos
        const exactPredictions = userPredictions.filter(p => p.points === 3).length;
        const correctResults = userPredictions.filter(p => p.points === 1).length;

        return {
          id: profile.id,
          name: profile.name,
          totalPoints,
          exactPredictions,
          correctResults,
        };
      });

      // Ordenar por pontos e criar ranking
      const ranking = userStats
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((player, index) => ({
          id: player.id,
          name: player.name,
          points: player.totalPoints,
          exactPredictions: player.exactPredictions,
          correctResults: player.correctResults,
          position: index + 1,
          isCurrentUser: player.id === user?.id,
        }));

      console.log('Processed ranking:', ranking);
      return ranking as RankingPlayer[];
    },
  });
};
