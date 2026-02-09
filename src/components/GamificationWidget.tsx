import React from 'react';
import { Flame, Star, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/hooks/useGamification';

interface GamificationWidgetProps {
  userId: string;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ userId }) => {
  const { gamificationData, loading, getLevelProgress } = useGamification(userId);

  if (loading || !gamificationData) {
    return null;
  }

  const levelProgress = getLevelProgress(gamificationData.total_points, gamificationData.level);

  return (
    <div className="flex items-center gap-4 px-3 py-2 bg-card/50 rounded-lg border">
      {/* Points */}
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 text-yellow-500" />
        <span className="text-sm font-medium">{gamificationData.total_points}</span>
      </div>

      {/* Level */}
      <div className="flex items-center gap-1.5">
        <Trophy className="h-4 w-4 text-purple-500" />
        <div className="flex flex-col">
          <span className="text-xs font-medium">Lvl {gamificationData.level}</span>
          <Progress value={levelProgress} className="h-1 w-12" />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">{gamificationData.current_streak}</span>
      </div>
    </div>
  );
};

export default GamificationWidget;
