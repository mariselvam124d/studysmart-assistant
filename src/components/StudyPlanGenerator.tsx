import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGamification } from '@/hooks/useGamification';
import { 
  Calendar, 
  Loader2, 
  Sparkles,
  Clock,
  Target,
  BookOpen,
  Coffee,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';

interface Phase {
  name: string;
  duration: string;
  focus: string;
  goals: string[];
}

interface Session {
  subject: string;
  duration: string;
  activity: string;
  resources: string[];
}

interface DaySchedule {
  day: string;
  sessions: Session[];
}

interface Milestone {
  week: number;
  goals: string[];
  assessment: string;
}

interface StudyPlan {
  title: string;
  overview: string;
  totalDays: number;
  hoursPerDay: number;
  subjects: string[];
  phases: Phase[];
  weeklySchedule: DaySchedule[];
  milestones: Milestone[];
  tips: string[];
  breakSchedule: {
    shortBreak: string;
    longBreak: string;
  };
}

interface StudyPlanGeneratorProps {
  userId: string;
}

const StudyPlanGenerator: React.FC<StudyPlanGeneratorProps> = ({ userId }) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('2');
  const [learningStyle, setLearningStyle] = useState('balanced');
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const { toast } = useToast();
  const { awardPoints } = useGamification(userId);

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const generatePlan = async () => {
    if (subjects.length === 0) {
      toast({ title: 'Please add at least one subject', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-study-plan', {
        body: { 
          subjects, 
          deadline: deadline || undefined, 
          hoursPerDay: parseInt(hoursPerDay), 
          learningStyle,
          currentLevel
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setStudyPlan(data.studyPlan);
      toast({ title: 'Study plan generated!', description: 'Your personalized plan is ready' });
      // Award points for creating a study plan
      await awardPoints('study_plan_created');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!studyPlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              AI Study Plan Generator
            </CardTitle>
            <CardDescription>
              Create a personalized study schedule tailored to your goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subjects to Study</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a subject..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                />
                <Button onClick={addSubject} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                    {subject}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeSubject(subject)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Target Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div>
              <Label>Hours Per Day</Label>
              <Select value={hoursPerDay} onValueChange={setHoursPerDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="5">5+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Learning Style</Label>
              <Select value={learningStyle} onValueChange={setLearningStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual (diagrams, videos)</SelectItem>
                  <SelectItem value="auditory">Auditory (lectures, discussions)</SelectItem>
                  <SelectItem value="reading">Reading/Writing</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic (hands-on)</SelectItem>
                  <SelectItem value="balanced">Balanced Mix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Current Level</Label>
              <Select value={currentLevel} onValueChange={setCurrentLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generatePlan} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {studyPlan.title}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setStudyPlan(null)}>
                  Create New Plan
                </Button>
              </div>
              <CardDescription>{studyPlan.overview}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{studyPlan.totalDays}</p>
                  <p className="text-sm text-muted-foreground">Total Days</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{studyPlan.hoursPerDay}h</p>
                  <p className="text-sm text-muted-foreground">Per Day</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{studyPlan.subjects.length}</p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{studyPlan.phases.length}</p>
                  <p className="text-sm text-muted-foreground">Phases</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Study Phases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyPlan.phases.map((phase, idx) => (
                  <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                    <h4 className="font-medium">{phase.name}</h4>
                    <p className="text-sm text-muted-foreground">{phase.duration}</p>
                    <p className="text-sm mt-1">{phase.focus}</p>
                    <div className="mt-2">
                      {phase.goals.map((goal, gIdx) => (
                        <div key={gIdx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {studyPlan.weeklySchedule.map((day, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{day.day}</h4>
                    <div className="space-y-2">
                      {day.sessions.map((session, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3 text-sm">
                          <Badge variant="outline">{session.duration}</Badge>
                          <div>
                            <p className="font-medium">{session.subject}</p>
                            <p className="text-muted-foreground">{session.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Coffee className="h-5 w-5" />
                Break Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">Short Breaks</p>
                  <p className="text-sm text-muted-foreground">{studyPlan.breakSchedule.shortBreak}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">Long Breaks</p>
                  <p className="text-sm text-muted-foreground">{studyPlan.breakSchedule.longBreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {studyPlan.tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Study Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {studyPlan.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyPlanGenerator;
