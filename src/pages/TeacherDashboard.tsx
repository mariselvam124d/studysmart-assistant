import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { BookOpen, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import ClassManagement from '@/components/ClassManagement';
import StudentPerformance from '@/components/StudentPerformance';

const TeacherDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate('/teacher-auth');
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate('/teacher-auth');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed out successfully" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float-slow top-20 left-20 pointer-events-none" />
        <div className="absolute w-56 h-56 bg-primary/10 rounded-full blur-3xl animate-float bottom-20 right-20 pointer-events-none" />
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-accent/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm font-medium animate-pulse-glow">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <header className="border-b border-border/50 bg-card/70 backdrop-blur-xl sticky top-0 z-40 shadow-sm animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-xl shadow-lg group-hover:shadow-accent/30 transition-all duration-300 group-hover:scale-105 transform">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">StudySmart Teacher</h1>
              <p className="text-[11px] text-muted-foreground font-medium tracking-wider uppercase">Class Management & Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-muted-foreground">Teacher</p>
            </div>
            <Avatar className="ring-2 ring-accent/20 hover:ring-accent/50 transition-all duration-300">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-primary-foreground font-bold">
                {(user.user_metadata?.full_name || user.email || '').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-all duration-300">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
        {selectedClassId ? (
          <StudentPerformance classroomId={selectedClassId} onBack={() => setSelectedClassId(null)} />
        ) : (
          <ClassManagement teacherId={user.id} onSelectClass={setSelectedClassId} />
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
