import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import MatchCard from "@/components/MatchCard";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { formatDate } from "@/utils/dateUtils";

const AllMatches = () => {
  const { data: matches, isLoading } = useMatches();

  // Agrupa os jogos por data
  const matchesByDate = matches?.reduce((acc, match) => {
    const date = match.match_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, typeof matches>) || {};

  // Ordena as datas
  const sortedDates = Object.keys(matchesByDate).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar showBack />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Todos os Jogos</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando jogos...</div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {formatDate(date)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchesByDate[date].map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMatches;
