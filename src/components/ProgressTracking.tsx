import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Target, 
  Calendar,
  Award,
  Clock,
  Brain
} from 'lucide-react';

interface ProgressData {
  totalChats: number;
  totalResources: number;
  subjectsStudied: string[];
  studyStreak: number;
  weeklyProgress: number;
}

interface ProgressTrackingProps {
  userId: string;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({ userId }) => {
  const [progressData, setProgressData] = useState<ProgressData>({
    totalChats: 0,
    totalResources: 0,
    subjectsStudied: [],
    studyStreak: 0,
    weeklyProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProgressData();
  }, [userId]);

  const loadProgressData = async () => {
    try {
      // Get chat sessions count
      const { count: chatsCount } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get study resources count
      const { count: resourcesCount } = await supabase
        .from('study_resources')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get unique subjects from resources
      const { data: resourceSubjects } = await supabase
        .from('study_resources')
        .select('subject')
        .eq('user_id', userId);

      // Get unique subjects from chat sessions
      const { data: chatSubjects } = await supabase
        .from('chat_sessions')
        .select('subject')
        .eq('user_id', userId)
        .not('subject', 'is', null);

      const allSubjects = [
        ...(resourceSubjects?.map(r => r.subject) || []),
        ...(chatSubjects?.map(c => c.subject) || [])
      ];
      const uniqueSubjects = Array.from(new Set(allSubjects.filter(Boolean)));

      // Calculate study streak (simplified - days with activity)
      const { data: recentActivity } = await supabase
        .from('chat_sessions')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const studyDays = new Set(
        recentActivity?.map(activity => 
          new Date(activity.created_at).toDateString()
        ) || []
      );

      setProgressData({
        totalChats: chatsCount || 0,
        totalResources: resourcesCount || 0,
        subjectsStudied: uniqueSubjects,
        studyStreak: studyDays.size,
        weeklyProgress: Math.min((studyDays.size / 7) * 100, 100),
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load progress data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    {
      title: "First Chat",
      description: "Started your first conversation",
      earned: progressData.totalChats > 0,
      icon: MessageSquare,
    },
    {
      title: "Resource Creator",
      description: "Created your first study resource",
      earned: progressData.totalResources > 0,
      icon: BookOpen,
    },
    {
      title: "Subject Explorer",
      description: "Studied 3 different subjects",
      earned: progressData.subjectsStudied.length >= 3,
      icon: Brain,
    },
    {
      title: "Study Streak",
      description: "Studied for 7 consecutive days",
      earned: progressData.studyStreak >= 7,
      icon: Target,
    },
  ];

  const stats = [
    {
      label: "Total Conversations",
      value: progressData.totalChats,
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      label: "Study Resources",
      value: progressData.totalResources,
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      label: "Subjects Studied",
      value: progressData.subjectsStudied.length,
      icon: Brain,
      color: "text-purple-600",
    },
    {
      label: "Study Days (7d)",
      value: progressData.studyStreak,
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Progress Tracking</h2>
        <p className="text-muted-foreground">
          Monitor your learning journey and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-primary/10`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Study Progress
          </CardTitle>
          <CardDescription>
            Your learning activity over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Study days this week
              </span>
              <span className="text-sm font-medium">
                {progressData.studyStreak}/7 days
              </span>
            </div>
            <Progress value={progressData.weeklyProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Keep up the great work! Try to study a little bit each day.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Studied */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Subjects Studied
          </CardTitle>
          <CardDescription>
            Areas of knowledge you've explored
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progressData.subjectsStudied.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {progressData.subjectsStudied.map((subject, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {subject}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Start chatting or creating resources to see your subjects here
            </p>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>
            Milestones you've reached in your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-colors ${
                    achievement.earned
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-muted/30 border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <Badge variant="secondary" className="text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Study Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm">
                <strong>Consistency is key:</strong> Try to study a little bit every day rather than cramming.
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm">
                <strong>Use active recall:</strong> Test yourself regularly using flashcards and quizzes.
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-sm">
                <strong>Take breaks:</strong> Use the Pomodoro technique - 25 minutes study, 5 minutes break.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracking;