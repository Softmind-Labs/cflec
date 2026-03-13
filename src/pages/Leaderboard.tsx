import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, TrendingUp, Globe, MapPin } from 'lucide-react';
import type { LeaderboardEntry, LeaderboardScope } from '@/types';
import { ACCOUNT_TYPE_LABELS, GHANA_REGIONS } from '@/lib/constants';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<LeaderboardScope>('ghana');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase.rpc('get_leaderboard', { limit_count: 50 });

      if (data) setLeaderboard(data as LeaderboardEntry[]);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getFilteredLeaderboard = () => {
    let filtered = [...leaderboard];
    
    // Filter by scope (for now, we show all as the DB doesn't have country/region yet)
    // In production, you'd filter by country/region from the actual data
    
    if (regionFilter !== 'all') {
      filtered = filtered.filter(e => e.region === regionFilter);
    }
    
    return filtered;
  };

  const filteredLeaderboard = getFilteredLeaderboard();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-[hsl(var(--cflp-gold))]" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-muted-foreground" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-[hsl(var(--cflp-gold))]" />;
    return <span className="font-bold text-lg">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300';
    return '';
  };

  const userRank = filteredLeaderboard.findIndex(e => e.user_id === user?.id) + 1;

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
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
      <div className="min-h-full bg-background">
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display flex items-center gap-2">
              <Trophy className="h-8 w-8 text-cflp-gold" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Top traders ranked by total portfolio value
            </p>
          </div>

          {/* Scope Tabs & Region Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Tabs value={scope} onValueChange={(v) => setScope(v as LeaderboardScope)} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="ghana" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Ghana
                </TabsTrigger>
                <TabsTrigger value="west_africa" className="gap-2">
                  <Globe className="h-4 w-4" />
                  West Africa
                </TabsTrigger>
                <TabsTrigger value="global" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Global
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {scope === 'ghana' && (
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {GHANA_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* User's Rank Card */}
          {userRank > 0 && (
            <Card className="mb-8">
              <CardHeader className="pb-2">
                <CardDescription>Your Ranking</CardDescription>
                <CardTitle className="text-3xl tabular-nums">#{userRank}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {scope === 'ghana' && regionFilter !== 'all' 
                      ? `in ${regionFilter}` 
                      : scope === 'ghana' 
                        ? 'in Ghana'
                        : scope === 'west_africa'
                          ? 'in West Africa'
                          : 'Globally'}
                  </span>
                  {userRank <= 10 && (
                    <Badge variant="secondary">🎉 Top 10!</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top 3 Podium */}
          {filteredLeaderboard.length >= 3 && (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[1, 0, 2].map((index) => {
                const entry = filteredLeaderboard[index];
                if (!entry) return null;
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
                       <p className="text-2xl font-bold mt-4 text-[hsl(var(--cflp-green))] tabular-nums">
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
              {filteredLeaderboard.length > 0 ? (
                <div className="space-y-2">
                  {filteredLeaderboard.map((entry, index) => {
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
                           <p className="font-bold text-lg text-[hsl(var(--cflp-green))] tabular-nums">
                             ${Number(entry.total_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                             ${Number(entry.holdings_value).toLocaleString()} in positions
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
      </div>
    </MainLayout>
  );
}
