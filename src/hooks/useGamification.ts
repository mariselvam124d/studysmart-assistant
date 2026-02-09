import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface GamificationData {
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  last_activity_date: string | null;
  quizzes_completed: number;
  flashcards_created: number;
  study_plans_created: number;
  notes_summarized: number;
  problems_solved: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points_required: number | null;
  count_required: number | null;
  count_type: string | null;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

// Points awarded for different actions
const POINTS = {
  quiz_completed: 50,
  flashcard_created: 30,
  study_plan_created: 40,
  note_summarized: 25,
  problem_solved: 35,
  daily_login: 10,
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000,
  6500, 8000, 10000, 12500, 15000, 18000, 21500, 25000, 30000, 35000,
];

export const useGamification = (userId: string) => {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievements, setEarnedAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const { toast } = useToast();

  const calculateLevel = (points: number): number => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (points >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  const getPointsToNextLevel = (points: number, level: number): number => {
    if (level >= LEVEL_THRESHOLDS.length) return 0;
    return LEVEL_THRESHOLDS[level] - points;
  };

  const getLevelProgress = (points: number, level: number): number => {
    if (level >= LEVEL_THRESHOLDS.length) return 100;
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level];
    const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const loadGamificationData = useCallback(async () => {
    try {
      // Get or create gamification data
      let { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No data found, create initial record
        const { data: newData, error: insertError } = await supabase
          .from('user_gamification')
          .insert({ user_id: userId })
          .select()
          .single();

        if (insertError) throw insertError;
        data = newData;
      } else if (error) {
        throw error;
      }

      // Check and update streak
      if (data) {
        const today = new Date().toISOString().split('T')[0];
        const lastActivity = data.last_activity_date;

        if (lastActivity !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak = data.current_streak;
          if (lastActivity === yesterdayStr) {
            newStreak = data.current_streak + 1;
          } else if (lastActivity !== today) {
            newStreak = 1;
          }

          const { data: updatedData, error: updateError } = await supabase
            .from('user_gamification')
            .update({
              current_streak: newStreak,
              longest_streak: Math.max(newStreak, data.longest_streak),
              last_activity_date: today,
              total_points: data.total_points + POINTS.daily_login,
            })
            .eq('user_id', userId)
            .select()
            .single();

          if (!updateError && updatedData) {
            data = updatedData;
          }
        }

        setGamificationData(data as GamificationData);
      }

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*');

      if (achievementsData) {
        setAchievements(achievementsData as Achievement[]);
      }

      // Load earned achievements
      const { data: earnedData } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', userId);

      if (earnedData) {
        setEarnedAchievements(earnedData as UserAchievement[]);
      }
    } catch (error: any) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const checkAndAwardAchievements = useCallback(async (data: GamificationData) => {
    const earnedIds = earnedAchievements.map(ea => ea.achievement_id);

    for (const achievement of achievements) {
      if (earnedIds.includes(achievement.id)) continue;

      let shouldAward = false;

      if (achievement.points_required && data.total_points >= achievement.points_required) {
        shouldAward = true;
      } else if (achievement.count_type && achievement.count_required) {
        const countValue = data[achievement.count_type as keyof GamificationData] as number;
        if (achievement.count_type === 'streak') {
          if (data.current_streak >= achievement.count_required) {
            shouldAward = true;
          }
        } else if (countValue >= achievement.count_required) {
          shouldAward = true;
        }
      }

      if (shouldAward) {
        try {
          await supabase
            .from('user_achievements')
            .insert({ user_id: userId, achievement_id: achievement.id });

          setNewAchievement(achievement);
          setEarnedAchievements(prev => [...prev, {
            id: crypto.randomUUID(),
            user_id: userId,
            achievement_id: achievement.id,
            earned_at: new Date().toISOString(),
            achievement,
          }]);

          toast({
            title: "🎉 Achievement Unlocked!",
            description: `${achievement.name}: ${achievement.description}`,
          });
        } catch (error) {
          console.error('Error awarding achievement:', error);
        }
      }
    }
  }, [achievements, earnedAchievements, userId, toast]);

  const awardPoints = useCallback(async (
    action: 'quiz_completed' | 'flashcard_created' | 'study_plan_created' | 'note_summarized' | 'problem_solved'
  ) => {
    if (!gamificationData) return;

    const points = POINTS[action];
    const today = new Date().toISOString().split('T')[0];

    const countField = action === 'quiz_completed' ? 'quizzes_completed' :
      action === 'flashcard_created' ? 'flashcards_created' :
      action === 'study_plan_created' ? 'study_plans_created' :
      action === 'note_summarized' ? 'notes_summarized' :
      'problems_solved';

    const newPoints = gamificationData.total_points + points;
    const newLevel = calculateLevel(newPoints);
    const newCount = (gamificationData[countField as keyof GamificationData] as number) + 1;

    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .update({
          total_points: newPoints,
          level: newLevel,
          [countField]: newCount,
          last_activity_date: today,
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setGamificationData(data as GamificationData);
        
        // Check for level up
        if (newLevel > gamificationData.level) {
          toast({
            title: "🎊 Level Up!",
            description: `Congratulations! You've reached Level ${newLevel}!`,
          });
        }

        // Check for new achievements
        await checkAndAwardAchievements(data as GamificationData);
      }

      toast({
        title: `+${points} Points!`,
        description: `You earned points for ${action.replace('_', ' ')}`,
      });
    } catch (error: any) {
      console.error('Error awarding points:', error);
    }
  }, [gamificationData, userId, toast, checkAndAwardAchievements]);

  useEffect(() => {
    if (userId) {
      loadGamificationData();
    }
  }, [userId, loadGamificationData]);

  return {
    gamificationData,
    achievements,
    earnedAchievements,
    loading,
    newAchievement,
    setNewAchievement,
    awardPoints,
    calculateLevel,
    getPointsToNextLevel,
    getLevelProgress,
    refresh: loadGamificationData,
  };
};
