import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, TrendingUp } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { ACCOUNT_TYPE_LABELS } from '@/lib/constants';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_value', { ascending: false })
        .limit(50);

      if (data) setLeaderboard(data as LeaderboardEntry[]);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="font-bold text-lg">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300';
    return '';
  };

  const userRank = leaderboard.findIndex(e => e.user_id === user?.id) + 1;

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-cflp-gold" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Top traders ranked by total portfolio value
          </p>
        </div>

        {/* User's Rank Card */}
        {userRank > 0 && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardDescription>Your Ranking</CardDescription>
              <CardTitle className="text-3xl">#{userRank}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {userRank <= 10 
                  ? "🎉 You're in the top 10! Keep it up!"
                  : userRank <= 25
                    ? "You're doing great! Keep trading to climb higher."
                    : "Keep learning and trading to improve your rank!"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[1, 0, 2].map((index) => {
              const entry = leaderboard[index];
              if (!entry) return null;
              const rank = index + 1;
              const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;

              return (
                <Card 
                  key={entry.user_id} 
                  className={`text-center ${index === 1 ? 'md:-mt-4' : ''} ${getRankBg(actualRank)}`}
                >
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      {getRankIcon(actualRank)}
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-4">
                      <AvatarImage src={entry.avatar_url || undefined} />
                      <AvatarFallback className="text-lg">
                        {getInitials(entry.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{entry.full_name}</h3>
                    <Badge variant="secondary" className="mt-2">
                      {ACCOUNT_TYPE_LABELS[entry.account_type]}
                    </Badge>
                    <p className="text-2xl font-bold mt-4 text-cflp-green">
                      ${Number(entry.total_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = entry.user_id === user?.id;

                  return (
                    <div 
                      key={entry.user_id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        isCurrentUser 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/30 hover:bg-muted/50'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          rank === 1 ? 'bg-yellow-100' :
                          rank === 2 ? 'bg-gray-100' :
                          rank === 3 ? 'bg-amber-100' :
                          'bg-muted'
                        }`}>
                          {getRankIcon(rank)}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatar_url || undefined} />
                          <AvatarFallback>
                            {getInitials(entry.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {entry.full_name}
                            {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ACCOUNT_TYPE_LABELS[entry.account_type]}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-cflp-green">
                          ${Number(entry.total_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          ${Number(entry.holdings_value).toLocaleString()} in stocks
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No rankings yet</h3>
                <p className="text-muted-foreground">
                  Start trading to appear on the leaderboard!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
