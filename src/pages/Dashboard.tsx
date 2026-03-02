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
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow top-20 left-20 pointer-events-none" />
        <div className="absolute w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-float bottom-20 right-20 pointer-events-none" />
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm font-medium animate-pulse-glow">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/70 backdrop-blur-xl sticky top-0 z-40 shadow-sm animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105 transform">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">StudySmart</h1>
              <p className="text-[11px] text-muted-foreground font-medium tracking-wider uppercase">AI Learning Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <GamificationWidget userId={user.id} />
            </div>
            
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
            <Avatar className="ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                {(user.user_metadata?.full_name || user.email || '').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-card/70 backdrop-blur-sm p-2 border border-border/50 shadow-sm rounded-xl">
            {[
              { value: 'chat', icon: Brain, label: 'AI Chat' },
              { value: 'solver', icon: Lightbulb, label: 'Solver' },
              { value: 'flashcards', icon: Layers, label: 'Flashcards' },
              { value: 'quiz', icon: FileQuestion, label: 'Quiz' },
              { value: 'summarizer', icon: FileText, label: 'Summarizer' },
              { value: 'planner', icon: Calendar, label: 'Planner' },
              { value: 'timer', icon: Timer, label: 'Timer' },
              { value: 'resources', icon: BookOpen, label: 'Resources' },
              { value: 'progress', icon: TrendingUp, label: 'Progress' },
              { value: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
              { value: 'classroom', icon: BookOpen, label: 'Classroom' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {[
            { value: 'chat', component: <ChatInterface userId={user.id} /> },
            { value: 'solver', component: <ProblemSolver userId={user.id} /> },
            { value: 'flashcards', component: <FlashcardGenerator userId={user.id} /> },
            { value: 'quiz', component: <QuizGenerator userId={user.id} /> },
            { value: 'summarizer', component: <NoteSummarizer userId={user.id} /> },
            { value: 'planner', component: <StudyPlanGenerator userId={user.id} /> },
            { value: 'timer', component: <PomodoroTimer userId={user.id} /> },
            { value: 'resources', component: <StudyResources userId={user.id} /> },
            { value: 'progress', component: <GamificationDisplay userId={user.id} /> },
            { value: 'leaderboard', component: <Leaderboard userId={user.id} /> },
            { value: 'classroom', component: <JoinClassroom userId={user.id} /> },
            { value: 'profile', component: <ProfileSettings user={user} /> },
          ].map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="animate-fade-in-up">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
