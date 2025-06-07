
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface Player {
  id: string;
  name: string;
  points: number;
  exactPredictions: number;
  correctResults: number;
  position: number;
  isCurrentUser?: boolean;
}

interface RankingTableProps {
  players: Player[];
}

const RankingTable = ({ players }: RankingTableProps) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
            {position}
          </div>
        );
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "from-orange-50 to-orange-100 border-orange-200";
      default:
        return "from-gray-50 to-white border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Ranking do Grupo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r transition-all hover:shadow-md ${
                player.isCurrentUser 
                  ? "from-blue-50 to-blue-100 border-blue-200 ring-2 ring-blue-200" 
                  : getPositionColor(player.position)
              }`}
            >
              <div className="flex items-center gap-4">
                {getPositionIcon(player.position)}
                <div>
                  <div className={`font-semibold ${player.isCurrentUser ? "text-blue-800" : "text-gray-800"}`}>
                    {player.name}
                    {player.isCurrentUser && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Você
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {player.exactPredictions} exatos • {player.correctResults} resultados
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {player.points}
                </div>
                <div className="text-sm text-gray-600">pontos</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Sistema de Pontuação</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• <strong>3 pontos</strong> - Acerto exato do placar</div>
            <div>• <strong>1 ponto</strong> - Acerto do resultado (vitória/empate/derrota)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingTable;
