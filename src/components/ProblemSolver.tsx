import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Upload, Sparkles, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';

interface ProblemSolverProps {
  userId: string;
}

interface Step {
  step: number;
  description: string;
  explanation: string;
  formula?: string;
}

interface Solution {
  title: string;
  steps: Step[];
  finalAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concepts: string[];
}

interface ProblemSession {
  id: string;
  title: string;
  subject: string;
  problem_text: string;
  problem_image_url: string;
  solution: string;
  steps: any;
  difficulty: string;
  created_at: string;
}

const ProblemSolver: React.FC<ProblemSolverProps> = ({ userId }) => {
  const [problemText, setProblemText] = useState('');
  const [subject, setSubject] = useState('mathematics');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [sessions, setSessions] = useState<ProblemSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, [userId]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('problem_solving_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error: any) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const solveProblem = async () => {
    if (!problemText && !imageFile) {
      toast({
        title: "Input required",
        description: "Please provide a problem text or upload an image.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSolution(null);

    try {
      let imageData = null;
      if (imageFile) {
        const reader = new FileReader();
        imageData = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const { data, error } = await supabase.functions.invoke('solve-problem', {
        body: {
          problemText,
          imageData,
          subject
        }
      });

      if (error) throw error;

      const solvedSolution = data.solution;
      setSolution(solvedSolution);

      // Save to database
      const { error: dbError } = await supabase
        .from('problem_solving_sessions')
        .insert({
          user_id: userId,
          title: solvedSolution.title,
          subject,
          problem_text: problemText,
          problem_image_url: imagePreview,
          solution: solvedSolution.finalAnswer,
          steps: solvedSolution.steps,
          difficulty: solvedSolution.difficulty
        });

      if (dbError) throw dbError;

      await loadSessions();

      toast({
        title: "Problem solved!",
        description: "AI has analyzed and solved your problem.",
      });
    } catch (error: any) {
      console.error('Error solving problem:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to solve problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('problem_solving_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(sessions.filter(s => s.id !== sessionId));
      toast({
        title: "Deleted",
        description: "Problem session deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadSession = (session: ProblemSession) => {
    setProblemText(session.problem_text);
    setSubject(session.subject);
    setImagePreview(session.problem_image_url);
    
    const parsedSolution: Solution = {
      title: session.title,
      steps: session.steps || [],
      finalAnswer: session.solution,
      difficulty: session.difficulty as 'easy' | 'medium' | 'hard',
      concepts: []
    };
    setSolution(parsedSolution);
  };

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-8 w-8" />
          <h2 className="text-3xl font-bold">AI Problem Solver</h2>
        </div>
        <p className="text-muted-foreground">Upload a problem image or type it in, and AI will solve it step-by-step</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Problem Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="computer_science">Computer Science</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem">Problem Description (Optional if uploading image)</Label>
              <Textarea
                id="problem"
                placeholder="Describe your problem here..."
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Problem Image</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                {imagePreview && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2 rounded-lg border-2 border-dashed p-2 animate-fade-in">
                  <img
                    src={imagePreview}
                    alt="Problem preview"
                    className="max-h-48 mx-auto rounded"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={solveProblem}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Solving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Solve Problem
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Solution Section */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {solution ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{solution.title}</h3>
                  <Badge className={difficultyColors[solution.difficulty]}>
                    {solution.difficulty}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {solution.steps.map((step, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-muted/50 space-y-2 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                          {step.step}
                        </div>
                        {step.description}
                      </div>
                      <p className="text-sm text-muted-foreground pl-8">
                        {step.explanation}
                      </p>
                      {step.formula && (
                        <div className="pl-8 font-mono text-sm bg-background p-2 rounded border">
                          {step.formula}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Final Answer:</span>
                  </div>
                  <p className="text-lg font-bold text-primary">{solution.finalAnswer}</p>
                </div>

                {solution.concepts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {solution.concepts.map((concept, i) => (
                      <Badge key={i} variant="outline">{concept}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter a problem and click "Solve Problem" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Previous Sessions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Previous Problems</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSessions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No previous problems yet. Solve your first problem above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                  onClick={() => loadSession(session)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm line-clamp-2">{session.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{session.subject}</Badge>
                      {session.difficulty && (
                        <Badge className={`text-xs ${difficultyColors[session.difficulty as keyof typeof difficultyColors]}`}>
                          {session.difficulty}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemSolver;
