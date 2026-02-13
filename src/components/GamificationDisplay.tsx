import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Star, 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Crown,
  FileQuestion,
  Layers,
  Calendar,
  Target,
  Lightbulb,
  Brain,
  Sparkles
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

interface GamificationDisplayProps {
  userId: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Star,
  TrendingUp,
  BookOpen,
  Award,
  Crown,
  Flame,
  FileQuestion,
  Layers,
  Calendar,
  Target,
  Lightbulb,
  Brain,
  Sparkles,
  Trophy,
};

const GamificationDisplay: React.FC<GamificationDisplayProps> = ({ userId }) => {
  const {
    gamificationData,
    achievements,
    earnedAchievements,
    loading,
    getLevelProgress,
    getPointsToNextLevel,
  } = useGamification(userId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!gamificationData) return null;

  const levelProgress = getLevelProgress(gamificationData.total_points, gamificationData.level);
  const pointsToNext = getPointsToNextLevel(gamificationData.total_points, gamificationData.level);
  const earnedIds = earnedAchievements.map(ea => ea.achievement_id);

  const stats = [
    { label: 'Total Points', value: gamificationData.total_points, icon: Star, color: 'text-yellow-500' },
    { label: 'Current Level', value: gamificationData.level, icon: Trophy, color: 'text-purple-500' },
    { label: 'Day Streak', value: gamificationData.current_streak, icon: Flame, color: 'text-orange-500' },
    { label: 'Best Streak', value: gamificationData.longest_streak, icon: Crown, color: 'text-amber-500' },
  ];

  const activityStats = [
    { label: 'Quizzes Completed', value: gamificationData.quizzes_completed, icon: FileQuestion },
    { label: 'Flashcards Created', value: gamificationData.flashcards_created, icon: Layers },
    { label: 'Study Plans', value: gamificationData.study_plans_created, icon: Calendar },
    { label: 'Problems Solved', value: gamificationData.problems_solved, icon: Lightbulb },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Your Progress</h2>
        <p className="text-muted-foreground">
          Track your learning journey and earn achievements
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-primary/10`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-500" />
            Level {gamificationData.level}
          </CardTitle>
          <CardDescription>
            {pointsToNext > 0 
              ? `${pointsToNext} points to Level ${gamificationData.level + 1}`
              : 'Max level reached!'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={levelProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {gamificationData.total_points} total points earned
          </p>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-6 w-6 text-orange-500" />
                <span className="text-lg font-semibold">Study Streak</span>
              </div>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {gamificationData.current_streak} days
              </p>
              <p className="text-sm text-muted-foreground">
                Personal best: {gamificationData.longest_streak} days
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Keep it going!</p>
              <p className="text-sm">
                Study today to maintain your streak
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
            <Badge variant="secondary" className="ml-2">
              {earnedAchievements.length}/{achievements.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete activities to unlock achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((achievement) => {
              const isEarned = earnedIds.includes(achievement.id);
              const Icon = iconMap[achievement.icon] || Star;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                    isEarned
                      ? 'bg-primary/5 border-primary/20 animate-fade-in-scale'
                      : 'bg-muted/20 border-border opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isEarned 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate">{achievement.name}</h4>
                        {isEarned && (
                          <Badge variant="default" className="text-xs shrink-0">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationDisplay;
