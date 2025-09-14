import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Target, Plus, CheckCircle, Clock, Calendar, Trash2, Edit, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  completed: boolean;
  created_at: string;
}

interface StudyGoalsProps {
  userId: string;
}

const StudyGoals: React.FC<StudyGoalsProps> = ({ userId }) => {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, [userId]);

  const loadGoals = async () => {
    try {
      // Since study_goals table doesn't exist, we'll simulate with study_resources
      // In a real app, you'd create a separate study_goals table
      setGoals([
        {
          id: '1',
          title: 'Master JavaScript Fundamentals',
          description: 'Complete all basic JavaScript concepts including ES6+ features',
          target_date: '2024-12-31',
          priority: 'high',
          progress: 65,
          completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Learn React Hooks',
          description: 'Understand and practice useState, useEffect, useContext, and custom hooks',
          target_date: '2024-11-15',
          priority: 'medium',
          progress: 30,
          completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Complete Data Structures Course',
          description: 'Finish the comprehensive data structures and algorithms course',
          target_date: '2024-10-30',
          priority: 'high',
          progress: 100,
          completed: true,
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load study goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: StudyGoal = {
      id: Date.now().toString(),
      ...formData,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString(),
    };

    setGoals(prev => [newGoal, ...prev]);
    setFormData({ title: '', description: '', target_date: '', priority: 'medium' });
    setCreateDialogOpen(false);
    
    toast({
      title: "Success!",
      description: "Study goal created successfully",
    });
  };

  const updateProgress = (goalId: string, newProgress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: newProgress, completed: newProgress === 100 }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal deleted",
      description: "Study goal has been removed",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Study Goals
          </h2>
          <p className="text-muted-foreground">
            Set targets and track your learning progress
          </p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-scale">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Title</Label>
                <Input
                  id="goal-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What do you want to achieve?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your goal in detail..."
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-date">Target Date</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-accent">
                  Create Goal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
                <p className="text-sm text-muted-foreground">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) || 0}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Active Goals</h3>
          <div className="grid gap-4">
            {activeGoals.map((goal, index) => (
              <Card key={goal.id} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{goal.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{goal.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress: {goal.progress}%</span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {getDaysRemaining(goal.target_date) > 0 
                            ? `${getDaysRemaining(goal.target_date)} days left`
                            : 'Overdue'
                          }
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(goal.id, Math.min(goal.progress + 10, 100))}
                      >
                        +10%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(goal.id, Math.min(goal.progress + 25, 100))}
                      >
                        +25%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(goal.id, 100)}
                        className="ml-auto"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Completed Goals
          </h3>
          <div className="grid gap-4">
            {completedGoals.map((goal, index) => (
              <Card key={goal.id} className="animate-fade-in border-green-200 bg-green-50/50 dark:bg-green-900/20" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="text-lg font-semibold">{goal.title}</h4>
                        <p className="text-muted-foreground text-sm">{goal.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      Completed
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGoals;