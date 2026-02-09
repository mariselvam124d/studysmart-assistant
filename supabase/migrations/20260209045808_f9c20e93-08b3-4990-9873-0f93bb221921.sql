-- Create user_gamification table to track points, streaks, and levels
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  last_activity_date DATE,
  quizzes_completed INTEGER NOT NULL DEFAULT 0,
  flashcards_created INTEGER NOT NULL DEFAULT 0,
  study_plans_created INTEGER NOT NULL DEFAULT 0,
  notes_summarized INTEGER NOT NULL DEFAULT 0,
  problems_solved INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table to define available achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  points_required INTEGER,
  count_required INTEGER,
  count_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table to track earned achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_gamification
CREATE POLICY "Users can view their own gamification data" 
ON public.user_gamification 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gamification data" 
ON public.user_gamification 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification data" 
ON public.user_gamification 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

-- RLS policies for user_achievements
CREATE POLICY "Users can view their own earned achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own earned achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_gamification_updated_at
BEFORE UPDATE ON public.user_gamification
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, category, points_required, count_required, count_type) VALUES
-- Points-based achievements
('First Steps', 'Earn your first 100 points', 'Star', 'points', 100, NULL, NULL),
('Rising Scholar', 'Earn 500 points', 'TrendingUp', 'points', 500, NULL, NULL),
('Knowledge Seeker', 'Earn 1,000 points', 'BookOpen', 'points', 1000, NULL, NULL),
('Academic Pro', 'Earn 5,000 points', 'Award', 'points', 5000, NULL, NULL),
('Master Scholar', 'Earn 10,000 points', 'Crown', 'points', 10000, NULL, NULL),

-- Streak achievements
('Getting Started', 'Study for 3 days in a row', 'Flame', 'streak', NULL, 3, 'streak'),
('Week Warrior', 'Study for 7 days in a row', 'Flame', 'streak', NULL, 7, 'streak'),
('Fortnight Fighter', 'Study for 14 days in a row', 'Flame', 'streak', NULL, 14, 'streak'),
('Monthly Master', 'Study for 30 days in a row', 'Flame', 'streak', NULL, 30, 'streak'),

-- Quiz achievements
('Quiz Starter', 'Complete your first quiz', 'FileQuestion', 'quiz', NULL, 1, 'quizzes_completed'),
('Quiz Enthusiast', 'Complete 10 quizzes', 'FileQuestion', 'quiz', NULL, 10, 'quizzes_completed'),
('Quiz Champion', 'Complete 50 quizzes', 'Trophy', 'quiz', NULL, 50, 'quizzes_completed'),

-- Flashcard achievements
('Card Creator', 'Create your first flashcard set', 'Layers', 'flashcard', NULL, 1, 'flashcards_created'),
('Flash Master', 'Create 10 flashcard sets', 'Layers', 'flashcard', NULL, 10, 'flashcards_created'),
('Memory King', 'Create 50 flashcard sets', 'Crown', 'flashcard', NULL, 50, 'flashcards_created'),

-- Study plan achievements
('Planner', 'Create your first study plan', 'Calendar', 'plan', NULL, 1, 'study_plans_created'),
('Strategic Mind', 'Create 10 study plans', 'Target', 'plan', NULL, 10, 'study_plans_created'),

-- Problem solving achievements
('Problem Solver', 'Solve your first problem', 'Lightbulb', 'problem', NULL, 1, 'problems_solved'),
('Critical Thinker', 'Solve 25 problems', 'Brain', 'problem', NULL, 25, 'problems_solved'),
('Genius', 'Solve 100 problems', 'Sparkles', 'problem', NULL, 100, 'problems_solved');