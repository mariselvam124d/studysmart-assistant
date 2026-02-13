import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Crown, Medal, Flame, Star, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  level: number;
  current_streak: number;
  quizzes_completed: number;
  flashcards_created: number;
  problems_solved: number;
  full_name: string | null;
}

interface LeaderboardProps {
  userId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userId }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data: gamData, error: gamError } = await supabase
          .from('user_gamification')
          .select('user_id, total_points, level, current_streak, quizzes_completed, flashcards_created, problems_solved')
          .order('total_points', { ascending: false })
          .limit(50);

        if (gamError) throw gamError;

        if (gamData && gamData.length > 0) {
          const userIds = gamData.map(g => g.user_id);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, full_name')
            .in('user_id', userIds);

          const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

          setEntries(gamData.map(g => ({
            ...g,
            full_name: profileMap.get(g.user_id) || null,
          })));
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30';
    if (index === 1) return 'bg-gradient-to-r from-gray-300/10 to-gray-400/10 border-gray-400/30';
    if (index === 2) return 'bg-gradient-to-r from-amber-600/10 to-orange-500/10 border-amber-600/30';
    return '';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  const myRank = entries.findIndex(e => e.user_id === userId);
  const topPoints = entries[0]?.total_points || 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground animate-fade-in">Global Leaderboard</h2>
        <p className="text-muted-foreground">See how you stack up against other students</p>
      </div>

      {/* Your Rank Card */}
      {myRank >= 0 && (
        <Card className="border-primary/30 bg-primary/5 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  #{myRank + 1}
                </div>
                <div>
                  <p className="font-semibold">Your Ranking</p>
                  <p className="text-sm text-muted-foreground">
                    {entries[myRank].total_points} points • Level {entries[myRank].level}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">{entries[myRank].current_streak} day streak</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          {[1, 0, 2].map(rank => {
            const entry = entries[rank];
            const isFirst = rank === 0;
            return (
              <Card key={rank} className={`text-center transition-all duration-500 hover:scale-105 ${isFirst ? 'md:-mt-4 shadow-lg border-yellow-500/30' : ''} ${getRankBg(rank)}`}>
                <CardContent className="p-4 pt-6">
                  <div className="mb-2">{getRankIcon(rank)}</div>
                  <Avatar className={`mx-auto mb-2 ${isFirst ? 'h-14 w-14 ring-2 ring-yellow-500' : 'h-10 w-10'}`}>
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {(entry.full_name || 'S').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm truncate">
                    {entry.full_name || 'Student'}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm font-bold">{entry.total_points}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Lvl {entry.level}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rankings
          </CardTitle>
          <CardDescription>{entries.length} students competing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {entries.map((entry, index) => {
            const isMe = entry.user_id === userId;
            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-muted/50 ${
                  isMe ? 'bg-primary/5 border border-primary/20 ring-1 ring-primary/10' : ''
                } ${getRankBg(index)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-8 flex justify-center shrink-0">
                  {getRankIcon(index)}
                </div>

                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={`text-xs font-bold ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {(entry.full_name || 'S').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">
                      {entry.full_name || 'Student'}
                      {isMe && <Badge variant="default" className="ml-2 text-xs">You</Badge>}
                    </p>
                  </div>
                  <Progress value={(entry.total_points / topPoints) * 100} className="h-1.5 mt-1" />
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-sm">{entry.total_points}</p>
                  <p className="text-xs text-muted-foreground">Lvl {entry.level}</p>
                </div>

                <div className="hidden md:flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                  <span title="Streak" className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />{entry.current_streak}
                  </span>
                  <span title="Quizzes">{entry.quizzes_completed} quizzes</span>
                </div>
              </div>
            );
          })}

          {entries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No students on the leaderboard yet. Be the first!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
