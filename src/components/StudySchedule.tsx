import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, BookOpen, Plus, Bell, MapPin, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudySession {
  id: string;
  title: string;
  subject: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'individual' | 'group' | 'online' | 'exam';
  location: string;
  completed: boolean;
  reminder: boolean;
}

interface StudyScheduleProps {
  userId: string;
}

const StudySchedule: React.FC<StudyScheduleProps> = ({ userId }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    type: 'individual' as 'individual' | 'group' | 'online' | 'exam',
    location: '',
    reminder: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, [userId]);

  const loadSessions = async () => {
    try {
      // Simulated data - in real app, fetch from database
      setSessions([
        {
          id: '1',
          title: 'JavaScript Advanced Concepts',
          subject: 'Programming',
          description: 'Study closures, async/await, and ES6+ features',
          date: '2024-09-15',
          time: '14:00',
          duration: 90,
          type: 'individual',
          location: 'Home Office',
          completed: false,
          reminder: true,
        },
        {
          id: '2',
          title: 'Math Study Group',
          subject: 'Mathematics',
          description: 'Group study session for calculus problems',
          date: '2024-09-16',
          time: '16:30',
          duration: 120,
          type: 'group',
          location: 'Library Room 204',
          completed: false,
          reminder: true,
        },
        {
          id: '3',
          title: 'React Final Exam',
          subject: 'Web Development',
          description: 'Final examination covering React fundamentals and hooks',
          date: '2024-09-18',
          time: '10:00',
          duration: 180,
          type: 'exam',
          location: 'Online - Zoom',
          completed: false,
          reminder: true,
        },
      ]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load study schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      ...formData,
      completed: false,
    };

    setSessions(prev => [...prev, newSession].sort((a, b) => 
      new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
    ));
    
    setFormData({
      title: '',
      subject: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      type: 'individual',
      location: '',
      reminder: true,
    });
    setCreateDialogOpen(false);
    
    toast({
      title: "Success!",
      description: "Study session scheduled successfully",
    });
  };

  const markAsCompleted = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId ? { ...session, completed: true } : session
    ));
    toast({
      title: "Session completed!",
      description: "Great job on completing your study session",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'group': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'online': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'group': return Users;
      case 'online': return Calendar;
      case 'exam': return BookOpen;
      default: return Clock;
    }
  };

  const getTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(session => session.date === today && !session.completed);
  };

  const getUpcomingSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(session => session.date > today && !session.completed)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const todaySessions = getTodaySessions();
  const upcomingSessions = getUpcomingSessions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Study Schedule
          </h2>
          <p className="text-muted-foreground">
            Plan and track your study sessions
          </p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-scale">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Study Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-title">Title</Label>
                  <Input
                    id="session-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Study session title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-subject">Subject</Label>
                  <Input
                    id="session-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Subject name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-description">Description</Label>
                <Textarea
                  id="session-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will you study?"
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-date">Date</Label>
                  <Input
                    id="session-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-time">Time</Label>
                  <Input
                    id="session-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Duration (min)</Label>
                  <Input
                    id="session-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="15"
                    max="480"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="group">Group Study</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-location">Location</Label>
                  <Input
                    id="session-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Where will you study?"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-accent">
                  Schedule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Sessions */}
      {todaySessions.length > 0 && (
        <Card className="animate-fade-in bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Bell className="h-5 w-5" />
              Today's Sessions
            </CardTitle>
            <CardDescription>Your study sessions for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySessions.map((session, index) => {
              const Icon = getTypeIcon(session.type);
              return (
                <Card key={session.id} className="animate-fade-in hover:shadow-md transition-all" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{session.title}</h4>
                          <p className="text-sm text-muted-foreground">{session.subject}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.time} ({session.duration}min)
                            </span>
                            {session.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {session.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(session.type)}>
                          {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => markAsCompleted(session.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Sessions */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Sessions
          </CardTitle>
          <CardDescription>Your next {upcomingSessions.length} study sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
              <p className="text-muted-foreground mb-4">Schedule your next study session to stay on track</p>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session, index) => {
                const Icon = getTypeIcon(session.type);
                const sessionDate = new Date(session.date);
                const isThisWeek = sessionDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
                
                return (
                  <Card key={session.id} className="animate-fade-in hover:shadow-md transition-all" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{session.title}</h4>
                            <p className="text-sm text-muted-foreground">{session.subject}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>{sessionDate.toLocaleDateString()} at {session.time}</span>
                              <span>({session.duration}min)</span>
                              {session.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {session.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(session.type)}>
                            {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                          </Badge>
                          {isThisWeek && (
                            <Badge variant="outline" className="border-orange-500 text-orange-700">
                              This Week
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudySchedule;