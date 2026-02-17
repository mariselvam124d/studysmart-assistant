import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, LogIn } from 'lucide-react';

interface Props {
  userId: string;
}

interface JoinedClass {
  classroom_id: string;
  classroom_name: string;
  class_code: string;
}

const JoinClassroom = ({ userId }: Props) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinedClasses, setJoinedClasses] = useState<JoinedClass[]>([]);
  const { toast } = useToast();

  const fetchJoinedClasses = async () => {
    const { data: memberships } = await supabase
      .from('classroom_students')
      .select('classroom_id')
      .eq('student_id', userId);

    if (!memberships || memberships.length === 0) {
      setJoinedClasses([]);
      return;
    }

    const classIds = memberships.map((m) => m.classroom_id);
    const { data: classes } = await supabase
      .from('classrooms')
      .select('id, name, class_code')
      .in('id', classIds);

    setJoinedClasses(
      (classes || []).map((c) => ({
        classroom_id: c.id,
        classroom_name: c.name,
        class_code: c.class_code,
      }))
    );
  };

  useEffect(() => {
    fetchJoinedClasses();
  }, [userId]);

  const joinClass = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      // Find classroom by code
      const { data: classroom, error: findError } = await supabase
        .from('classrooms')
        .select('id, name')
        .eq('class_code', code.trim().toUpperCase())
        .single();

      if (findError || !classroom) {
        toast({ title: "Invalid code", description: "No classroom found with that code.", variant: "destructive" });
        return;
      }

      // Check if already joined
      const { data: existing } = await supabase
        .from('classroom_students')
        .select('id')
        .eq('classroom_id', classroom.id)
        .eq('student_id', userId)
        .maybeSingle();

      if (existing) {
        toast({ title: "Already joined", description: `You're already in ${classroom.name}` });
        return;
      }

      // Join
      const { error } = await supabase.from('classroom_students').insert({
        classroom_id: classroom.id,
        student_id: userId,
      });

      if (error) throw error;

      toast({ title: "Joined!", description: `You've joined ${classroom.name}` });
      setCode('');
      fetchJoinedClasses();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" />
            Join a Classroom
          </CardTitle>
          <CardDescription>Enter the class code provided by your teacher</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter class code (e.g. AB12CD)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono text-lg tracking-widest"
              maxLength={6}
            />
            <Button onClick={joinClass} disabled={loading || !code.trim()}>
              {loading ? 'Joining...' : 'Join'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {joinedClasses.length > 0 && (
        <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              My Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {joinedClasses.map((c) => (
                <div key={c.classroom_id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{c.classroom_name}</p>
                    <Badge variant="outline" className="font-mono text-xs">{c.class_code}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JoinClassroom;
