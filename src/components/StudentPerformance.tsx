import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Trophy, Flame, Brain, Layers, FileQuestion, FileText, Calendar, TrendingUp, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Student {
  student_id: string;
  joined_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    grade_level: string | null;
    subjects_of_interest: string[] | null;
  };
  gamification?: {
    total_points: number;
    level: number;
    current_streak: number;
    longest_streak: number;
    problems_solved: number;
    quizzes_completed: number;
    flashcards_created: number;
    notes_summarized: number;
    study_plans_created: number;
  };
}

interface ClassInfo {
  id: string;
  name: string;
  class_code: string;
  description: string | null;
}

interface Props {
  classroomId: string;
  onBack: () => void;
}

const StudentPerformance = ({ classroomId, onBack }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch class info
      const { data: cls } = await supabase
        .from('classrooms')
        .select('*')
        .eq('id', classroomId)
        .single();
      setClassInfo(cls);

      // Fetch students in class
      const { data: enrolled } = await supabase
        .from('classroom_students')
        .select('student_id, joined_at')
        .eq('classroom_id', classroomId);

      if (!enrolled || enrolled.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const studentIds = enrolled.map((e) => e.student_id);

      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, grade_level, subjects_of_interest')
        .in('user_id', studentIds);

      // Fetch gamification
      const { data: gamifications } = await supabase
        .from('user_gamification')
        .select('*')
        .in('user_id', studentIds);

      const enriched: Student[] = enrolled.map((e) => ({
        ...e,
        profile: profiles?.find((p) => p.user_id === e.student_id) || undefined,
        gamification: gamifications?.find((g) => g.user_id === e.student_id) || undefined,
      }));

      // Sort by total points descending
      enriched.sort((a, b) => (b.gamification?.total_points || 0) - (a.gamification?.total_points || 0));
      setStudents(enriched);
      setLoading(false);
    };

    fetchData();
  }, [classroomId]);

  const maxPoints = Math.max(...students.map((s) => s.gamification?.total_points || 0), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (selectedStudent) {
    const g = selectedStudent.gamification;
    const stats = [
      { label: 'Problems Solved', value: g?.problems_solved || 0, icon: Brain, color: 'text-primary' },
      { label: 'Quizzes Completed', value: g?.quizzes_completed || 0, icon: FileQuestion, color: 'text-accent' },
      { label: 'Flashcards Created', value: g?.flashcards_created || 0, icon: Layers, color: 'text-primary' },
      { label: 'Notes Summarized', value: g?.notes_summarized || 0, icon: FileText, color: 'text-accent' },
      { label: 'Study Plans', value: g?.study_plans_created || 0, icon: Calendar, color: 'text-primary' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => setSelectedStudent(null)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to class
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold">
            {(selectedStudent.profile?.full_name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedStudent.profile?.full_name || 'Unknown Student'}
            </h2>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">Level {g?.level || 1}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" /> {g?.total_points || 0} pts
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Flame className="h-3 w-3" /> {g?.current_streak || 0} day streak
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <Card key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <CardContent className="pt-6 text-center">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress towards next level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Progress to Next Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Level {g?.level || 1}</span>
                <span className="text-muted-foreground">Level {(g?.level || 1) + 1}</span>
              </div>
              <Progress value={((g?.total_points || 0) % 100)} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                {100 - ((g?.total_points || 0) % 100)} points to next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subjects of interest */}
        {selectedStudent.profile?.subjects_of_interest && selectedStudent.profile.subjects_of_interest.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subjects of Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.profile.subjects_of_interest.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{classInfo?.name}</h2>
          <p className="text-muted-foreground">
            {students.length} student{students.length !== 1 ? 's' : ''} enrolled • Code: <span className="font-mono font-bold">{classInfo?.class_code}</span>
          </p>
        </div>
      </div>

      {students.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No students yet</p>
            <p className="text-muted-foreground text-sm">
              Share the class code <span className="font-mono font-bold">{classInfo?.class_code}</span> with your students
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Level</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Streak</TableHead>
                  <TableHead className="hidden md:table-cell">Progress</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Quizzes</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Problems</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s, i) => (
                  <TableRow
                    key={s.student_id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                    onClick={() => setSelectedStudent(s)}
                  >
                    <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {(s.profile?.full_name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{s.profile?.full_name || 'Unknown'}</p>
                          {s.profile?.grade_level && (
                            <p className="text-xs text-muted-foreground">{s.profile.grade_level}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{s.gamification?.level || 1}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold">{s.gamification?.total_points || 0}</TableCell>
                    <TableCell className="text-center">
                      <span className="flex items-center justify-center gap-1">
                        <Flame className="h-3 w-3 text-destructive" />
                        {s.gamification?.current_streak || 0}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Progress value={((s.gamification?.total_points || 0) / maxPoints) * 100} className="h-2" />
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell">{s.gamification?.quizzes_completed || 0}</TableCell>
                    <TableCell className="text-center hidden lg:table-cell">{s.gamification?.problems_solved || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentPerformance;
