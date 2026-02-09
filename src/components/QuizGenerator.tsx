import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileQuestion, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface Quiz {
  title: string;
  topic: string;
  difficulty: string;
  totalQuestions: number;
  estimatedTime: string;
  questions: Question[];
}

interface QuizGeneratorProps {
  userId: string;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ userId }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState(['multiple_choice', 'true_false']);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { awardPoints } = useGamification(userId);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast({ title: 'Please enter a topic', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic, difficulty, questionCount, questionTypes }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setQuiz(data.quiz);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
      setSubmitted(false);
      toast({ title: 'Quiz generated!', description: `${data.quiz.totalQuestions} questions ready` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitQuiz = async () => {
    setSubmitted(true);
    setShowResults(true);
    // Award points for completing the quiz
    await awardPoints('quiz_completed');
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
        correct++;
      }
    });
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100)
    };
  };

  const toggleQuestionType = (type: string) => {
    if (questionTypes.includes(type)) {
      setQuestionTypes(questionTypes.filter(t => t !== type));
    } else {
      setQuestionTypes([...questionTypes, type]);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setAnswers({});
    setShowResults(false);
    setSubmitted(false);
    setCurrentQuestion(0);
  };

  const score = calculateScore();

  return (
    <div className="space-y-6">
      {!quiz ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-primary" />
              AI Quiz Generator
            </CardTitle>
            <CardDescription>
              Create practice quizzes on any topic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., American History, Chemistry, Machine Learning"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="count">Number of Questions</Label>
              <Input
                id="count"
                type="number"
                min={5}
                max={20}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
              />
            </div>

            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'multiple_choice', label: 'Multiple Choice' },
                  { id: 'true_false', label: 'True/False' },
                  { id: 'short_answer', label: 'Short Answer' }
                ].map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={questionTypes.includes(type.id)}
                      onCheckedChange={() => toggleQuestionType(type.id)}
                    />
                    <label htmlFor={type.id} className="text-sm">{type.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={generateQuiz} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : showResults ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {score.percentage}%
              </div>
              <p className="text-muted-foreground">
                {score.correct} out of {score.total} correct
              </p>
              <Progress value={score.percentage} className="mt-4" />
            </div>

            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const isCorrect = answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase();
                return (
                  <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}`}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">Q{idx + 1}: {q.question}</p>
                        <p className="text-sm mt-1">
                          Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{answers[q.id] || 'Not answered'}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct: {q.correctAnswer}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={resetQuiz} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Take Another Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{quiz.title}</span>
              <Badge variant="outline">
                {currentQuestion + 1} / {quiz.totalQuestions}
              </Badge>
            </CardTitle>
            <CardDescription>
              {quiz.estimatedTime} • {quiz.difficulty} difficulty
            </CardDescription>
            <Progress value={((currentQuestion + 1) / quiz.totalQuestions) * 100} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <div key={q.id} className={idx === currentQuestion ? 'block' : 'hidden'}>
                <h3 className="text-lg font-medium mb-4">{q.question}</h3>
                
                {q.type === 'multiple_choice' && q.options && (
                  <RadioGroup
                    value={answers[q.id] || ''}
                    onValueChange={(value) => handleAnswer(q.id, value)}
                  >
                    {q.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted">
                        <RadioGroupItem value={option} id={`${q.id}-${optIdx}`} />
                        <Label htmlFor={`${q.id}-${optIdx}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {q.type === 'true_false' && (
                  <RadioGroup
                    value={answers[q.id] || ''}
                    onValueChange={(value) => handleAnswer(q.id, value)}
                  >
                    {['True', 'False'].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted">
                        <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                        <Label htmlFor={`${q.id}-${option}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {q.type === 'short_answer' && (
                  <Input
                    placeholder="Type your answer..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion < quiz.totalQuestions - 1 ? (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                  Next
                </Button>
              ) : (
                <Button onClick={submitQuiz}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizGenerator;
