import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Layers, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: string;
}

interface FlashcardGeneratorProps {
  userId: string;
}

const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({ userId }) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inputMode, setInputMode] = useState<'topic' | 'content'>('topic');
  const { toast } = useToast();

  const generateFlashcards = async () => {
    if (inputMode === 'topic' && !topic.trim()) {
      toast({ title: 'Please enter a topic', variant: 'destructive' });
      return;
    }
    if (inputMode === 'content' && !content.trim()) {
      toast({ title: 'Please enter content', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: {
          topic: inputMode === 'topic' ? topic : undefined,
          content: inputMode === 'content' ? content : undefined,
          count: cardCount
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      toast({ title: 'Flashcards generated!', description: `Created ${data.flashcards.length} cards` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'hard': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            AI Flashcard Generator
          </CardTitle>
          <CardDescription>
            Generate study flashcards from any topic or your notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'topic' | 'content')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="topic">By Topic</TabsTrigger>
              <TabsTrigger value="content">From Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="topic" className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Photosynthesis, World War II, Calculus"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="content">Your Notes</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your notes here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <Label htmlFor="count">Number of Cards</Label>
            <Input
              id="count"
              type="number"
              min={5}
              max={30}
              value={cardCount}
              onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
            />
          </div>

          <Button onClick={generateFlashcards} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Flashcards
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {flashcards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Study Cards
              </span>
              <Badge variant="outline">
                {currentIndex + 1} / {flashcards.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[200px] p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:border-primary bg-card flex flex-col items-center justify-center text-center"
            >
              <Badge className={`mb-4 ${getDifficultyColor(flashcards[currentIndex]?.difficulty)}`}>
                {flashcards[currentIndex]?.difficulty}
              </Badge>
              <p className="text-lg font-medium">
                {isFlipped ? flashcards[currentIndex]?.back : flashcards[currentIndex]?.front}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                {isFlipped ? 'Answer' : 'Click to reveal answer'}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Restart
              </Button>
              <Button
                variant="outline"
                onClick={nextCard}
                disabled={currentIndex === flashcards.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlashcardGenerator;
