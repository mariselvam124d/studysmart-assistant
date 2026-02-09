import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useGamification } from '@/hooks/useGamification';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Loader2, 
  Sparkles,
  Copy,
  BookOpen,
  Lightbulb,
  Tag
} from 'lucide-react';

interface Summary {
  title: string;
  type: string;
  content: string;
  keyPoints: string[];
  concepts: string[];
  vocabulary: Array<{ term: string; definition: string }>;
  wordCount: {
    original: number;
    summary: number;
  };
}

interface NoteSummarizerProps {
  userId: string;
}

const NoteSummarizer: React.FC<NoteSummarizerProps> = ({ userId }) => {
  const [content, setContent] = useState('');
  const [summaryType, setSummaryType] = useState('comprehensive');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const { toast } = useToast();
  const { awardPoints } = useGamification(userId);

  const summarizeNotes = async () => {
    if (!content.trim()) {
      toast({ title: 'Please enter some notes to summarize', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-notes', {
        body: { content, summaryType }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setSummary(data.summary);
      toast({ title: 'Notes summarized!', description: 'Your summary is ready' });
      // Award points for summarizing notes
      await awardPoints('note_summarized');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            AI Note Summarizer
          </CardTitle>
          <CardDescription>
            Transform your long notes into concise summaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Your Notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste your notes, articles, or study material here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <div>
            <Label>Summary Type</Label>
            <Select value={summaryType} onValueChange={setSummaryType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief (2-3 sentences)</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="bullet_points">Bullet Points</SelectItem>
                <SelectItem value="study_guide">Study Guide</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={summarizeNotes} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize Notes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {summary.title}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(summary.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Reduced from {summary.wordCount.original} to {summary.wordCount.summary} words 
                ({Math.round((1 - summary.wordCount.summary / summary.wordCount.original) * 100)}% compression)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{summary.content}</p>
              </div>
            </CardContent>
          </Card>

          {summary.keyPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {summary.concepts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5 text-blue-500" />
                  Main Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {summary.concepts.map((concept, idx) => (
                    <Badge key={idx} variant="secondary">{concept}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {summary.vocabulary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vocabulary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {summary.vocabulary.map((item, idx) => (
                    <div key={idx} className="border-b pb-2 last:border-0">
                      <p className="font-medium">{item.term}</p>
                      <p className="text-sm text-muted-foreground">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteSummarizer;
