import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, FileText, Brain, HelpCircle, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StudyResource {
  id: string;
  title: string;
  subject: string;
  resource_type: 'note' | 'flashcard' | 'quiz' | 'reference';
  content: any;
  is_public: boolean;
  created_at: string;
}

interface StudyResourcesProps {
  userId: string;
}

const StudyResources: React.FC<StudyResourcesProps> = ({ userId }) => {
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
  }, [userId]);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedSubject, selectedType]);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('study_resources')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResources((data || []) as StudyResource[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load study resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource =>
        resource.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource =>
        resource.resource_type === selectedType
      );
    }

    setFilteredResources(filtered);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'note':
        return FileText;
      case 'flashcard':
        return Brain;
      case 'quiz':
        return HelpCircle;
      case 'reference':
        return BookOpen;
      default:
        return FileText;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'note':
        return 'bg-blue-100 text-blue-800';
      case 'flashcard':
        return 'bg-green-100 text-green-800';
      case 'quiz':
        return 'bg-purple-100 text-purple-800';
      case 'reference':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const subjects = Array.from(new Set(resources.map(r => r.subject)));
  const types = ['note', 'flashcard', 'quiz', 'reference'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Study Resources</h2>
          <p className="text-muted-foreground">
            Organize and access your learning materials
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Resource
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No study resources found</h3>
            <p className="text-muted-foreground mb-4">
              {resources.length === 0
                ? "Create your first study resource to get started"
                : "Try adjusting your search or filters"}
            </p>
            {resources.length === 0 && (
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.resource_type);
            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
                        <CardDescription className="truncate">{resource.subject}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={getResourceTypeColor(resource.resource_type)}
                      >
                        {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
                      </Badge>
                      {resource.is_public && (
                        <Badge variant="outline">Public</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(resource.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Create</CardTitle>
          <CardDescription>
            Start creating new study materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Note</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Brain className="h-6 w-6" />
              <span className="text-sm">Flashcard</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <HelpCircle className="h-6 w-6" />
              <span className="text-sm">Quiz</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Reference</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyResources;