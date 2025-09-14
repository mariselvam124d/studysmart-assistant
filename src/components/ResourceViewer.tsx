import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Brain, HelpCircle, BookOpen, Edit, Trash2, Share2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StudyResource {
  id: string;
  title: string;
  subject: string;
  resource_type: 'note' | 'flashcard' | 'quiz' | 'reference';
  content: any;
  is_public: boolean;
  created_at: string;
}

interface ResourceViewerProps {
  resource: StudyResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (resource: StudyResource) => void;
  onDelete: (resourceId: string) => void;
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({
  resource,
  open,
  onOpenChange,
  onEdit,
  onDelete
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!resource) return null;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'note': return FileText;
      case 'flashcard': return Brain;
      case 'quiz': return HelpCircle;
      case 'reference': return BookOpen;
      default: return FileText;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'flashcard': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'quiz': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'reference': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('study_resources')
        .delete()
        .eq('id', resource.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Resource deleted successfully",
      });

      onDelete(resource.id);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(resource.content?.text || '');
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const Icon = getResourceIcon(resource.resource_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold truncate">{resource.title}</h3>
              <p className="text-sm text-muted-foreground">{resource.subject}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getResourceTypeColor(resource.resource_type)}>
              {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
            </Badge>
            {resource.is_public && (
              <Badge variant="outline" className="border-green-500 text-green-700">
                <Share2 className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}
            <span className="text-sm text-muted-foreground ml-auto">
              Created {new Date(resource.created_at).toLocaleDateString()}
            </span>
          </div>

          <Card className="border-0 bg-secondary/10">
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {resource.content?.text || 'No content available'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0 flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyContent}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(resource)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="ml-auto bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceViewer;