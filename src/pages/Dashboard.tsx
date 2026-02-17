import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  LogOut,
  Brain,
  Layers,
  FileQuestion,
  FileText,
  Calendar,
  Lightbulb,
  Timer,
  Trophy
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import ChatInterface from '@/components/ChatInterface';
import StudyResources from '@/components/StudyResources';
import GamificationDisplay from '@/components/GamificationDisplay';
import GamificationWidget from '@/components/GamificationWidget';
import ProfileSettings from '@/components/ProfileSettings';
import StudyGoals from '@/components/StudyGoals';
import StudySchedule from '@/components/StudySchedule';
import ProblemSolver from '@/components/ProblemSolver';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import QuizGenerator from '@/components/QuizGenerator';
import NoteSummarizer from '@/components/NoteSummarizer';
import StudyPlanGenerator from '@/components/StudyPlanGenerator';
import PomodoroTimer from '@/components/PomodoroTimer';
import Leaderboard from '@/components/Leaderboard';
import JoinClassroom from '@/components/JoinClassroom';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">StudySmart</h1>
              <p className="text-sm text-muted-foreground">AI Learning Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Gamification Widget */}
            <div className="hidden md:block">
              <GamificationWidget userId={user.id} />
            </div>
            
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
            <Avatar>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(user.user_metadata?.full_name || user.email || '').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-card/50 backdrop-blur-sm p-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden md:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="solver" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden md:inline">Solver</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden md:inline">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              <span className="hidden md:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="summarizer" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Summarizer</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span className="hidden md:inline">Timer</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden md:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="classroom" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Classroom</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterface userId={user.id} />
          </TabsContent>

          <TabsContent value="solver" className="space-y-6">
            <ProblemSolver userId={user.id} />
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-6">
            <FlashcardGenerator userId={user.id} />
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <QuizGenerator userId={user.id} />
          </TabsContent>

          <TabsContent value="summarizer" className="space-y-6">
            <NoteSummarizer userId={user.id} />
          </TabsContent>

          <TabsContent value="planner" className="space-y-6">
            <StudyPlanGenerator userId={user.id} />
          </TabsContent>

          <TabsContent value="timer" className="space-y-6">
            <PomodoroTimer userId={user.id} />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <StudyResources userId={user.id} />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <GamificationDisplay userId={user.id} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard userId={user.id} />
          </TabsContent>

          <TabsContent value="classroom" className="space-y-6">
            <JoinClassroom userId={user.id} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings user={user} />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
