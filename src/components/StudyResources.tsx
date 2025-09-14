import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, FileText, Brain, HelpCircle, Plus, Search, Eye, Edit, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CreateResourceDialog from './CreateResourceDialog';
import ResourceViewer from './ResourceViewer';
import EditResourceDialog from './EditResourceDialog';
import studyIllustration from '@/assets/study-illustration.jpg';
import learningBackground from '@/assets/learning-background.jpg';

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
  const [viewingResource, setViewingResource] = useState<StudyResource | null>(null);
  const [editingResource, setEditingResource] = useState<StudyResource | null>(null);
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
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'flashcard':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'quiz':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'reference':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleResourceDeleted = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
    setViewingResource(null);
    setEditingResource(null);
  };

  const handleEditResource = (resource: StudyResource) => {
    setViewingResource(null);
    setEditingResource(resource);
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
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${learningBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 animate-fade-in">
              Study Resources
            </h2>
            <p className="text-white/90 text-lg mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Organize, create, and access your learning materials with AI-powered assistance
            </p>
            <CreateResourceDialog userId={userId} onResourceCreated={loadResources}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-scale animate-fade-in shadow-lg"
                style={{ animationDelay: '0.4s' }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Resource
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </CreateResourceDialog>
          </div>
          <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <img 
              src={studyIllustration} 
              alt="Students studying" 
              className="w-full max-w-md rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-sm bg-card/80 shadow-lg animate-fade-in">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all focus:ring-2 focus:ring-primary/20 hover:border-primary/30"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background transition-all hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background transition-all hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
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
        <Card className="animate-fade-in backdrop-blur-sm bg-card/80">
          <CardContent className="text-center py-16">
            <div className="animate-pulse">
              <BookOpen className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No study resources found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {resources.length === 0
                ? "Start your learning journey by creating your first study resource"
                : "Try adjusting your search criteria or explore different filters"}
            </p>
            {resources.length === 0 && (
              <CreateResourceDialog userId={userId} onResourceCreated={loadResources}>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-scale shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resource
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </CreateResourceDialog>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => {
            const Icon = getResourceIcon(resource.resource_type);
            return (
              <Card 
                key={resource.id} 
                className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm bg-card/90 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                        <CardDescription className="truncate">{resource.subject}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={`${getResourceTypeColor(resource.resource_type)} transition-all`}
                      >
                        {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
                      </Badge>
                      {resource.is_public && (
                        <Badge variant="outline" className="border-green-500 text-green-700">Public</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(resource.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all"
                        onClick={() => setViewingResource(resource)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:bg-accent hover:text-accent-foreground transition-all"
                        onClick={() => handleEditResource(resource)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
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
      <Card className="backdrop-blur-sm bg-card/90 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Create
          </CardTitle>
          <CardDescription>
            Choose a resource type to start creating immediately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { type: 'note', icon: FileText, color: 'hover:bg-blue-50 hover:border-blue-200' },
              { type: 'flashcard', icon: Brain, color: 'hover:bg-green-50 hover:border-green-200' },
              { type: 'quiz', icon: HelpCircle, color: 'hover:bg-purple-50 hover:border-purple-200' },
              { type: 'reference', icon: BookOpen, color: 'hover:bg-orange-50 hover:border-orange-200' }
            ].map(({ type, icon: Icon, color }) => (
              <CreateResourceDialog key={type} userId={userId} onResourceCreated={loadResources}>
                <Button 
                  variant="outline" 
                  className={`h-24 flex-col gap-3 ${color} hover-scale transition-all duration-300 group`}
                >
                  <Icon className="h-7 w-7 group-hover:scale-110 transition-transform text-primary" />
                  <span className="text-sm font-medium">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </Button>
              </CreateResourceDialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ResourceViewer
        resource={viewingResource}
        open={!!viewingResource}
        onOpenChange={(open) => !open && setViewingResource(null)}
        onEdit={handleEditResource}
        onDelete={handleResourceDeleted}
      />

      <EditResourceDialog
        resource={editingResource}
        open={!!editingResource}
        onOpenChange={(open) => !open && setEditingResource(null)}
        onResourceUpdated={loadResources}
      />
    </div>
  );
};

export default StudyResources;