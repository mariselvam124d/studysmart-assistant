import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Brain, 
  BookOpen, 
  TrendingUp, 
  MessageSquare, 
  Users,
  Zap,
  Target,
  Star,
  ArrowRight
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tutoring",
      description: "Get personalized help from our advanced AI tutor across all subjects",
      color: "text-blue-600",
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Create and organize notes, flashcards, quizzes, and references",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achievements",
      color: "text-purple-600",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and track personalized learning goals to stay motivated",
      color: "text-orange-600",
    },
  ];

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", 
    "Computer Science", "Psychology", "Economics", "Philosophy", "Art", "Music"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      grade: "High School Senior",
      text: "StudySmart helped me improve my calculus grade from C to A! The AI tutor explains complex concepts so clearly.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      grade: "College Sophomore",
      text: "The study resources feature is amazing. I can create flashcards and track my progress all in one place.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      grade: "Graduate Student",
      text: "As a research student, having an AI assistant that understands academic concepts is invaluable.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">StudySmart</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">AI Learning Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                🚀 AI-Powered Learning
              </Badge>
              <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Master Any Subject with
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> AI Tutoring</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get personalized study assistance, track your progress, and achieve your academic goals with our intelligent learning platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 group">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Try AI Tutor
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Free to Start</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
            <img 
              src={heroImage} 
              alt="Students learning with AI technology"
              className="relative rounded-3xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="text-primary">
              Features
            </Badge>
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
              Everything you need to excel
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and support you need for academic success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4 mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
              Get help with any subject
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI tutor is trained across hundreds of subjects and can adapt to your learning style.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="text-primary">
              Success Stories
            </Badge>
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
              Loved by students worldwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.grade}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to transform your learning?
            </h3>
            <p className="text-xl text-white/90">
              Join thousands of students who are already achieving their academic goals with StudySmart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-foreground">StudySmart</span>
              </div>
              <p className="text-muted-foreground">
                Empowering students with AI-powered learning tools.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>AI Tutoring</li>
                <li>Study Resources</li>
                <li>Progress Tracking</li>
                <li>Goal Setting</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Community</li>
                <li>Blog</li>
                <li>Newsletter</li>
                <li>Social Media</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 StudySmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
