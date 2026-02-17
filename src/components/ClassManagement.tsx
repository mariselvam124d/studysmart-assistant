import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Copy, Users, Trash2, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Classroom {
  id: string;
  name: string;
  class_code: string;
  description: string | null;
  created_at: string;
  student_count?: number;
}

interface Props {
  teacherId: string;
  onSelectClass: (classId: string) => void;
}

const ClassManagement = ({ teacherId, onSelectClass }: Props) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchClassrooms = async () => {
    const { data: classes, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    // Get student counts
    const classesWithCounts = await Promise.all(
      (classes || []).map(async (c) => {
        const { count } = await supabase
          .from('classroom_students')
          .select('*', { count: 'exact', head: true })
          .eq('classroom_id', c.id);
        return { ...c, student_count: count || 0 };
      })
    );

    setClassrooms(classesWithCounts);
  };

  useEffect(() => {
    fetchClassrooms();
  }, [teacherId]);

  const generateCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_class_code');
    if (error) throw error;
    return data;
  };

  const createClass = async () => {
    if (!newClassName.trim()) return;
    setLoading(true);
    try {
      const code = await generateCode();
      const { error } = await supabase.from('classrooms').insert({
        teacher_id: teacherId,
        name: newClassName.trim(),
        description: newClassDesc.trim() || null,
        class_code: code,
      });
      if (error) throw error;
      toast({ title: "Class created!", description: `Class code: ${code}` });
      setNewClassName('');
      setNewClassDesc('');
      setDialogOpen(false);
      fetchClassrooms();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: string) => {
    const { error } = await supabase.from('classrooms').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Class deleted" });
      fetchClassrooms();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `Class code ${code} copied to clipboard` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Classes</h2>
          <p className="text-muted-foreground">Create and manage your classrooms</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" /> New Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Class Name</Label>
                <Input placeholder="e.g. Physics 101" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input placeholder="e.g. Introduction to Physics" value={newClassDesc} onChange={(e) => setNewClassDesc(e.target.value)} />
              </div>
              <Button onClick={createClass} disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {classrooms.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No classes yet</p>
            <p className="text-muted-foreground text-sm">Create your first class to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((c, i) => (
            <Card
              key={c.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => onSelectClass(c.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); deleteClass(c.id); }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {c.description && <CardDescription>{c.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); copyCode(c.class_code); }}>
                      <Copy className="h-3 w-3 mr-1" />
                      {c.class_code}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{c.student_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
