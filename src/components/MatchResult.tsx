
import { CheckCircle, XCircle, Calendar, Clock } from "lucide-react";
import { Match } from "@/hooks/useMatches";
import TeamLogo from "./TeamLogo";
import { Badge } from "@/components/ui/badge";

interface MatchResultProps {
  match: Match;
  userPrediction?: {
    home_score: number;
    away_score: number;
  };
}

const MatchResult = ({ match, userPrediction }: MatchResultProps) => {
  const hasUserPrediction = userPrediction !== undefined;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const weekday = weekdays[date.getDay()];
    return `${weekday}, ${date.toLocaleDateString('pt-BR')}`;
  };

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <div className="text-center">
        {/* Informações do jogo */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(match.match_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{match.match_time}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Grupo {match.group.name}
          </Badge>
        </div>

        {/* Resultado */}
        <div className="flex items-end justify-center gap-6 mb-4">
          <div className="flex flex-col items-center gap-2">
            <TeamLogo 
              logoUrl={match.home_team.logo_url} 
              teamName={match.home_team.name}
              size="lg"
            />
            <span className="font-bold text-lg">{match.home_team.name}</span>
          </div>
          <div className="text-3xl font-bold">
            {match.home_score} x {match.away_score}
          </div>
          <div className="flex flex-col items-center gap-2">
            <TeamLogo 
              logoUrl={match.away_team.logo_url} 
              teamName={match.away_team.name}
              size="lg"
            />
            <span className="font-bold text-lg">{match.away_team.name}</span>
          </div>
        </div>

        {/* Palpite do usuário */}
        {hasUserPrediction && (
          <div className="flex items-center justify-center gap-2">
            {userPrediction?.home_score === match.home_score && 
             userPrediction?.away_score === match.away_score ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm">
              Seu palpite: {userPrediction?.home_score} x {userPrediction?.away_score}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchResult;
