import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Brain, HelpCircle, BookOpen, Edit } from 'lucide-react';

interface StudyResource {
  id: string;
  title: string;
  subject: string;
  resource_type: 'note' | 'flashcard' | 'quiz' | 'reference';
  content: any;
  is_public: boolean;
  created_at: string;
}

interface EditResourceDialogProps {
  resource: StudyResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceUpdated: () => void;
}

const EditResourceDialog: React.FC<EditResourceDialogProps> = ({
  resource,
  open,
  onOpenChange,
  onResourceUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    resource_type: 'note' as 'note' | 'flashcard' | 'quiz' | 'reference',
    content: '',
    is_public: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        subject: resource.subject,
        resource_type: resource.resource_type,
        content: resource.content?.text || '',
        is_public: resource.is_public,
      });
    }
  }, [resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('study_resources')
        .update({
          title: formData.title,
          subject: formData.subject,
          resource_type: formData.resource_type,
          content: { text: formData.content },
          is_public: formData.is_public,
        })
        .eq('id', resource.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Study resource updated successfully",
      });

      onOpenChange(false);
      onResourceUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update resource",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return FileText;
      case 'flashcard': return Brain;
      case 'quiz': return HelpCircle;
      case 'reference': return BookOpen;
      default: return FileText;
    }
  };

  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Edit Study Resource
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter resource title"
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics, Science"
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resource Type</Label>
            <Select 
              value={formData.resource_type} 
              onValueChange={(value: any) => setFormData({ ...formData, resource_type: value })}
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['note', 'flashcard', 'quiz', 'reference'].map((type) => {
                  const Icon = getTypeIcon(type);
                  return (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter your study content here..."
              className="min-h-[120px] transition-all focus:ring-2 focus:ring-primary/20 resize-none"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
            />
            <Label htmlFor="edit-public" className="text-sm">
              Make this resource public (visible to other users)
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditResourceDialog;