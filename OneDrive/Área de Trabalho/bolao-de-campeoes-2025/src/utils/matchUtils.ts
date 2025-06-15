export const canMakePrediction = (matchDate: string, matchTime: string): boolean => {
  try {
    // Criar a data com o horário no fuso horário local
    const [year, month, day] = matchDate.split('-').map(Number);
    const [hours, minutes] = matchTime.split(':').map(Number);
    
    const matchDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000)); // 1 hora antes
    const now = new Date();
    
    return now < cutoffTime;
  } catch (error) {
    console.error('Erro ao calcular tempo para palpites:', error);
    return false;
  }
};

export const getTimeUntilCutoff = (matchDate: string, matchTime: string): number => {
  try {
    // Criar a data com o horário no fuso horário local
    const [year, month, day] = matchDate.split('-').map(Number);
    const [hours, minutes] = matchTime.split(':').map(Number);
    
    const matchDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const cutoffTime = new Date(matchDateTime.getTime() - (60 * 60 * 1000)); // 1 hora antes
    const now = new Date();
    
    return Math.max(0, cutoffTime.getTime() - now.getTime());
  } catch (error) {
    console.error('Erro ao calcular tempo restante:', error);
    return 0;
  }
};

export const calculatePoints = (prediction: { home_score: number; away_score: number }, match: { home_score: number; away_score: number }): number => {
  // Se o placar for exatamente igual
  if (prediction.home_score === match.home_score && prediction.away_score === match.away_score) {
    return 5;
  }

  // Determina o resultado real do jogo
  const realResult = match.home_score > match.away_score ? 'home' : match.home_score < match.away_score ? 'away' : 'draw';
  
  // Determina o resultado previsto
  const predictedResult = prediction.home_score > prediction.away_score ? 'home' : prediction.home_score < prediction.away_score ? 'away' : 'draw';

  // Se acertou o vencedor
  if (realResult === predictedResult) {
    // Se acertou o placar parcial (um dos times)
    if (prediction.home_score === match.home_score || prediction.away_score === match.away_score) {
      return 3;
    }
    // Se acertou apenas o resultado
    return 2;
  }

  return 0;
};
