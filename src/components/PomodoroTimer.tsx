import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, Zap } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { playPointsSound } from '@/lib/celebrations';

interface PomodoroTimerProps {
  userId: string;
}

type TimerMode = 'focus' | 'short-break' | 'long-break';

const DURATIONS: Record<TimerMode, number> = {
  'focus': 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ userId }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(DURATIONS[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { awardPoints } = useGamification(userId);

  const totalTime = DURATIONS[mode];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'focus') {
        setSessionsCompleted(prev => prev + 1);
        playPointsSound();
        // Award points for completing a focus session
        awardPoints('quiz_completed'); // Reuse quiz points for study sessions
        // Auto-switch to break
        if ((sessionsCompleted + 1) % 4 === 0) {
          switchMode('long-break');
        } else {
          switchMode('short-break');
        }
      } else {
        switchMode('focus');
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode, sessionsCompleted, switchMode, awardPoints]);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const modeConfig = {
    'focus': { label: 'Focus Time', icon: Brain, color: 'text-primary' },
    'short-break': { label: 'Short Break', icon: Coffee, color: 'text-green-500' },
    'long-break': { label: 'Long Break', icon: Zap, color: 'text-orange-500' },
  };

  const current = modeConfig[mode];
  const Icon = current.icon;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Pomodoro Study Timer
          </CardTitle>
          <CardDescription>Stay focused with timed study sessions and breaks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selector */}
          <div className="flex gap-2 justify-center">
            {(Object.keys(DURATIONS) as TimerMode[]).map(m => (
              <Button
                key={m}
                variant={mode === m ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchMode(m)}
                className="capitalize"
              >
                {m.replace('-', ' ')}
              </Button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center gap-4">
            <div className={`relative w-48 h-48 rounded-full border-4 border-muted flex items-center justify-center ${isRunning ? 'animate-pulse' : ''}`}>
              <div className="absolute inset-0 rounded-full" style={{
                background: `conic-gradient(hsl(var(--primary)) ${progress}%, transparent ${progress}%)`,
                opacity: 0.15,
              }} />
              <div className="text-center z-10">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${current.color}`} />
                <p className="text-4xl font-mono font-bold">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{current.label}</p>
              </div>
            </div>

            <Progress value={progress} className="w-full max-w-xs h-2" />

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => setIsRunning(!isRunning)}
                className="min-w-[120px]"
              >
                {isRunning ? (
                  <><Pause className="mr-2 h-4 w-4" /> Pause</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Start</>
                )}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Session Stats */}
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="py-2 px-4">
              <Brain className="h-3 w-3 mr-1" />
              {sessionsCompleted} sessions today
            </Badge>
            <Badge variant="outline" className="py-2 px-4">
              <Zap className="h-3 w-3 mr-1" />
              {sessionsCompleted * 25} min focused
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
