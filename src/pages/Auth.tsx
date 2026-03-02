import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Brain, Users, BookOpen, Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import loginIllustration from '@/assets/login-illustration.png';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: fullName },
        }
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'student' as any,
        });
      }
      toast({ title: "Success!", description: "Please check your email to confirm your account." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background">
      {/* Left Side — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float-slow pointer-events-none" style={{ animationDelay: '3s' }} />

        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110 transform">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">StudySmart</h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Education Platform</p>
            </div>
          </div>

          {/* Welcome text */}
          <div className="mt-8 mb-8 space-y-2 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-muted-foreground text-base">
              The all in one ultimate platform to help you manage your learning journey.
            </p>
          </div>

          {/* Tabs */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="animate-fade-in">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-12 border-border/60 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10 h-12 border-border/60 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base font-semibold shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transform transition-all duration-300 group" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Signing In...</span>
                    ) : (
                      <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="pl-10 h-12 border-border/60 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-sm font-medium">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input id="signupEmail" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-12 border-border/60 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-sm font-medium">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input id="signupPassword" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10 pr-10 h-12 border-border/60 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base font-semibold shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transform transition-all duration-300 group" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Creating...</span>
                    ) : (
                      <span className="flex items-center gap-2">Create Account <Sparkles className="h-4 w-4" /></span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Teacher link */}
          <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.45s', animationFillMode: 'both' }}>
            <Button variant="link" onClick={() => navigate('/teacher-auth')} className="text-muted-foreground hover:text-primary transition-colors">
              <BookOpen className="h-4 w-4 mr-2" />
              I'm a teacher →
            </Button>
          </div>

          {/* Feature badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            {[
              { icon: Brain, text: 'AI Tutoring' },
              { icon: GraduationCap, text: 'Study Tools' },
              { icon: Users, text: 'Progress' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 hover:text-primary transition-colors duration-300">
                <item.icon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-primary via-accent to-primary overflow-hidden items-center justify-center">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-primary-foreground/5 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
          {/* Geometric shapes */}
          <div className="absolute top-20 right-20 w-24 h-24 border-2 border-primary-foreground/10 rounded-2xl rotate-12 animate-rotate-slow" />
          <div className="absolute bottom-32 left-20 w-16 h-16 border-2 border-primary-foreground/10 rounded-xl -rotate-12 animate-rotate-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary-foreground/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-primary-foreground/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-primary-foreground/15 rounded-full animate-float-slow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Main illustration */}
        <div className="relative z-10 flex flex-col items-center text-center px-12 animate-fade-in-scale">
          <img
            src={loginIllustration}
            alt="Student learning illustration"
            className="w-80 h-auto drop-shadow-2xl animate-float-slow rounded-2xl"
          />
          <div className="mt-8 space-y-3">
            <h3 className="text-2xl font-extrabold text-primary-foreground tracking-tight">
              Your Learning Journey Starts Here
            </h3>
            <p className="text-primary-foreground/80 text-sm max-w-sm">
              Join thousands of students mastering subjects with AI-powered tutoring and smart study tools.
            </p>
          </div>

          {/* Floating stat badges */}
          <div className="absolute -left-2 top-1/4 bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-3 animate-float border border-primary-foreground/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-foreground/10 rounded-lg"><Brain className="h-4 w-4 text-primary-foreground" /></div>
              <div className="text-left">
                <p className="text-xs font-bold text-primary-foreground">AI Tutor</p>
                <p className="text-[10px] text-primary-foreground/70">Always online</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-2 bottom-1/3 bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-3 animate-float border border-primary-foreground/10" style={{ animationDelay: '1.5s' }}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-foreground/10 rounded-lg"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
              <div className="text-left">
                <p className="text-xs font-bold text-primary-foreground">10K+</p>
                <p className="text-[10px] text-primary-foreground/70">Students</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
