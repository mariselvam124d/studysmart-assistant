import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { User as UserIcon, Settings, Book, Target, Save } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  grade_level: string | null;
  subjects_of_interest: string[] | null;
  study_goals: string | null;
}

interface ProfileSettingsProps {
  user: User;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    grade_level: '',
    subjects_of_interest: '',
    study_goals: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [user.id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          grade_level: data.grade_level || '',
          subjects_of_interest: data.subjects_of_interest?.join(', ') || '',
          study_goals: data.study_goals || '',
        });
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || '',
          })
          .select()
          .single();

        if (createError) throw createError;

        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || '',
          grade_level: '',
          subjects_of_interest: '',
          study_goals: '',
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const subjects = formData.subjects_of_interest
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: formData.full_name,
          grade_level: formData.grade_level,
          subjects_of_interest: subjects,
          study_goals: formData.study_goals,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      loadProfile(); // Reload to get updated data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const gradeOptions = [
    'Elementary School',
    'Middle School (6-8)',
    'High School (9-12)',
    'Undergraduate',
    'Graduate',
    'Professional',
    'Lifelong Learner'
  ];

  const popularSubjects = [
    'Mathematics', 'Science', 'History', 'Literature', 'Physics', 
    'Chemistry', 'Biology', 'Computer Science', 'Psychology', 
    'Philosophy', 'Economics', 'Art', 'Music', 'Languages'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-muted-foreground">
          Customize your learning experience and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your profile details and learning preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed from here
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade_level">Education Level</Label>
                    <select
                      id="grade_level"
                      value={formData.grade_level}
                      onChange={(e) => handleInputChange('grade_level', e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="">Select your education level</option>
                      {gradeOptions.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Learning Preferences */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects of Interest</Label>
                    <Input
                      id="subjects"
                      type="text"
                      value={formData.subjects_of_interest}
                      onChange={(e) => handleInputChange('subjects_of_interest', e.target.value)}
                      placeholder="e.g., Mathematics, Physics, History (comma-separated)"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {popularSubjects.slice(0, 8).map(subject => (
                        <Badge
                          key={subject}
                          variant="outline"
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            const current = formData.subjects_of_interest;
                            const subjects = current ? current.split(',').map(s => s.trim()) : [];
                            if (!subjects.includes(subject)) {
                              const newSubjects = [...subjects, subject].filter(s => s);
                              handleInputChange('subjects_of_interest', newSubjects.join(', '));
                            }
                          }}
                        >
                          + {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="study_goals">Study Goals</Label>
                    <Textarea
                      id="study_goals"
                      value={formData.study_goals}
                      onChange={(e) => handleInputChange('study_goals', e.target.value)}
                      placeholder="What do you want to achieve with your studies? (e.g., Prepare for exams, learn new skills, etc.)"
                      rows={4}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Learning Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="font-medium">
                  {formData.grade_level || 'Not specified'}
                </p>
              </div>
              
              {profile?.subjects_of_interest && profile.subjects_of_interest.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.subjects_of_interest.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.study_goals && (
                <div>
                  <p className="text-sm text-muted-foreground">Goals</p>
                  <p className="text-sm">{profile.study_goals}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p><strong>Personalized AI:</strong> The more details you provide, the better your AI tutor can assist you.</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p><strong>Study Goals:</strong> Clear goals help track your progress and stay motivated.</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <p><strong>Subjects:</strong> Add your interests to get tailored study recommendations.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;