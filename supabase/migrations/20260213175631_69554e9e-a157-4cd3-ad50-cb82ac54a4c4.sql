
-- Allow all authenticated users to view gamification data for leaderboard
CREATE POLICY "Users can view all gamification data for leaderboard"
ON public.user_gamification
FOR SELECT
USING (true);

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Users can view their own gamification data" ON public.user_gamification;

-- Allow viewing all profiles for leaderboard display names
CREATE POLICY "Users can view all profiles for leaderboard"
ON public.profiles
FOR SELECT
USING (true);

-- Drop old restrictive select policy on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
