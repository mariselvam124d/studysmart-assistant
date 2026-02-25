import React, { useEffect, useRef, useState } from 'react';
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
  ArrowRight,
  Timer,
  Layers,
  CheckCircle2,
  Sparkles,
  Award,
  BarChart3,
  Globe,
  Shield
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import heroImage from '@/assets/hero-image.jpg';
import studentsCollab from '@/assets/students-collaborating.jpg';
import studentLaptop from '@/assets/student-laptop.jpg';
import studentsGroup from '@/assets/students-group.jpg';
import studyDesk from '@/assets/study-desk.jpg';
import booksCoffee from '@/assets/books-coffee.jpg';

/* ── Scroll-reveal hook ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

/* ── Animated counter ── */
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Index = () => {
  const features = [
    { icon: Brain, title: "AI-Powered Tutoring", description: "Get personalized help from our advanced AI tutor across all subjects", gradient: "from-primary to-accent" },
    { icon: BookOpen, title: "Study Resources", description: "Create and organize notes, flashcards, quizzes, and references", gradient: "from-accent to-primary" },
    { icon: TrendingUp, title: "Progress Tracking", description: "Monitor your learning journey with detailed analytics and achievements", gradient: "from-primary to-primary-glow" },
    { icon: Target, title: "Goal Setting", description: "Set and track personalized learning goals to stay motivated", gradient: "from-accent to-primary-glow" },
    { icon: Timer, title: "Pomodoro Timer", description: "Stay focused with timed study sessions and smart break reminders", gradient: "from-primary-glow to-primary" },
    { icon: Layers, title: "AI Flashcards", description: "Generate smart flashcards and quizzes from any topic or your notes", gradient: "from-primary to-accent" },
  ];

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature",
    "Computer Science", "Psychology", "Economics", "Philosophy", "Art", "Music"
  ];

  const testimonials = [
    { name: "Sarah Chen", grade: "High School Senior", text: "StudySmart helped me improve my calculus grade from C to A! The AI tutor explains complex concepts so clearly.", rating: 5, avatar: studentsCollab },
    { name: "Marcus Johnson", grade: "College Sophomore", text: "The study resources feature is amazing. I can create flashcards and track my progress all in one place.", rating: 5, avatar: studentLaptop },
    { name: "Emma Rodriguez", grade: "Graduate Student", text: "As a research student, having an AI assistant that understands academic concepts is invaluable.", rating: 5, avatar: studentsGroup },
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'Active Students', icon: Users },
    { value: 50000, suffix: '+', label: 'Problems Solved', icon: CheckCircle2 },
    { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
    { value: 500, suffix: '+', label: 'Subjects Covered', icon: Globe },
  ];

  const heroRef = useInView(0.1);
  const featuresRef = useInView();
  const aboutRef = useInView();
  const aboutBlock2Ref = useInView();
  const aboutBlock3Ref = useInView();
  const statsRef = useInView();
  const subjectsRef = useInView();
  const testimonialsRef = useInView();
  const ctaRef = useInView();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ═══════ HEADER ═══════ */}
      <header className="border-b border-border/50 bg-card/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300 group-hover:scale-105 transform">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">StudySmart</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block font-medium tracking-wider uppercase">AI Learning Assistant</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'About', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors story-link">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30 hover:scale-105 transform duration-200">
                Get Started
                <Sparkles className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Decorative blurred orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div ref={heroRef.ref} className={`container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium animate-bounce-in">
                🚀 AI-Powered Learning Platform
              </Badge>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Master Any Subject with
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"> AI Tutoring</span>
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Get personalized study assistance, track your progress, and achieve your academic goals with our intelligent learning platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 group text-base px-8 shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 transform">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/teacher-auth">
                <Button size="lg" variant="outline" className="text-base px-8 hover:bg-primary/5 border-2 hover:scale-105 transform transition-all duration-300">
                  <Users className="mr-2 h-4 w-4" />
                  I'm a Teacher
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: Users, text: '10,000+ Students' },
                { icon: Star, text: '4.9/5 Rating', fill: true },
                { icon: Zap, text: 'Free to Start' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: `${0.3 + i * 0.15}s`, animationFillMode: 'both' }}>
                  <item.icon className={`h-4 w-4 ${item.fill ? 'fill-yellow-400 text-yellow-400' : 'text-primary'}`} />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image with floating elements */}
          <div className="relative lg:pl-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl transform rotate-3 scale-105 blur-sm" />
            <div className="relative">
              <img
                src={heroImage}
                alt="Students learning with AI technology"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover animate-fade-in-scale"
                loading="lazy"
              />
              {/* Floating badge cards */}
              <div className="absolute -left-4 top-1/4 bg-card/90 backdrop-blur-md rounded-2xl shadow-xl p-3 animate-float border border-border/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg"><Brain className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">AI Tutor</p>
                    <p className="text-[10px] text-muted-foreground">Always online</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-1/4 bg-card/90 backdrop-blur-md rounded-2xl shadow-xl p-3 animate-float border border-border/50" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-accent/10 rounded-lg"><Award className="h-4 w-4 text-accent" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Level Up!</p>
                    <p className="text-[10px] text-muted-foreground">+50 XP earned</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-8 -top-3 bg-card/90 backdrop-blur-md rounded-2xl shadow-xl p-3 animate-float border border-border/50" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-success/10 rounded-lg"><BarChart3 className="h-4 w-4 text-success" /></div>
                  <div>
                    <p className="text-xs font-bold text-foreground">A+ Grade</p>
                    <p className="text-[10px] text-muted-foreground">Keep it up!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-16 border-y border-border/50 bg-gradient-to-r from-primary/5 via-background to-accent/5">
        <div ref={statsRef.ref} className={`container mx-auto px-4 transition-all duration-700 ${statsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-24">
        <div ref={featuresRef.ref} className={`container mx-auto px-4 transition-all duration-700 ${featuresRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="text-primary px-4 py-1">
              <Sparkles className="mr-1.5 h-3 w-3" /> Features
            </Badge>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Everything you need to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">excel</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and support you need for academic success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT / SHOWCASE ═══════ */}
      <section id="about" className="py-24 bg-gradient-to-b from-background via-primary/[0.02] to-background">
        <div className="container mx-auto px-4 space-y-32">
          {/* Block 1 */}
          <div ref={aboutRef.ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${aboutRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <img src={studentsCollab} alt="Students collaborating on projects" className="relative rounded-3xl shadow-2xl w-full h-80 object-cover" loading="lazy" />
            </div>
            <div className="space-y-6">
              <Badge variant="secondary" className="text-primary"><BookOpen className="mr-1.5 h-3 w-3" /> Collaborative Learning</Badge>
              <h3 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Learn together, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">grow together</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join classrooms, share resources, and collaborate with peers. Our platform connects students and teachers for a richer learning experience.
              </p>
              <ul className="space-y-3">
                {['Join virtual classrooms with a simple code', 'Share flashcards and study materials', 'Track progress with your peers'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Block 2 */}
          <div ref={aboutBlock2Ref.ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${aboutBlock2Ref.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-6 lg:order-1 order-2">
              <Badge variant="secondary" className="text-primary"><Brain className="mr-1.5 h-3 w-3" /> AI-Powered</Badge>
              <h3 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Your personal <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">AI tutor</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Get instant, detailed explanations for any concept. Our AI understands context and adapts to your learning level — like having a personal tutor available 24/7.
              </p>
              <ul className="space-y-3">
                {['Step-by-step problem solving', 'Concept explanations in plain language', 'Practice questions tailored to your level'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <Sparkles className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group lg:order-2 order-1">
              <div className="absolute -inset-4 bg-gradient-to-bl from-accent/20 to-primary/20 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <img src={studentLaptop} alt="Student studying with laptop" className="relative rounded-3xl shadow-2xl w-full h-80 object-cover" loading="lazy" />
            </div>
          </div>

          {/* Block 3 — wide image banner */}
          <div ref={aboutBlock3Ref.ref} className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${aboutBlock3Ref.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <img src={studyDesk} alt="Organized study desk with books" className="w-full h-72 lg:h-96 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 flex items-center justify-center">
              <div className="text-center space-y-4 px-4 max-w-2xl">
                <h3 className="text-3xl lg:text-4xl font-extrabold text-primary-foreground tracking-tight">
                  Study smarter, not harder
                </h3>
                <p className="text-lg text-primary-foreground/90">
                  Our AI-powered tools help you optimize your study time and retain more information with proven techniques.
                </p>
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:scale-105 transform transition-all duration-300">
                    Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SUBJECTS ═══════ */}
      <section className="py-24 border-y border-border/50 bg-gradient-to-r from-primary/[0.03] to-accent/[0.03]">
        <div ref={subjectsRef.ref} className={`container mx-auto px-4 text-center transition-all duration-700 ${subjectsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-4 mb-12">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Get help with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">any subject</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI tutor is trained across hundreds of subjects and can adapt to your learning style.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {subjects.map((subject, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm py-2.5 px-5 hover:bg-primary hover:text-primary-foreground cursor-default transition-all duration-300 hover:scale-110 hover:shadow-lg border border-border/50"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section id="testimonials" className="py-24">
        <div ref={testimonialsRef.ref} className={`container mx-auto px-4 transition-all duration-700 ${testimonialsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="text-primary px-4 py-1">
              <Star className="mr-1.5 h-3 w-3 fill-yellow-400 text-yellow-400" /> Success Stories
            </Badge>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Loved by students <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">worldwide</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" loading="lazy" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.grade}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ IMAGE GALLERY STRIP ═══════ */}
      <section className="py-12 overflow-hidden">
        <div className="flex gap-6 w-[200%] animate-marquee">
          {[heroImage, studentsCollab, studentLaptop, studentsGroup, studyDesk, booksCoffee, heroImage, studentsCollab, studentLaptop, studentsGroup, studyDesk, booksCoffee].map((img, i) => (
            <img key={i} src={img} alt="Learning moments" className="h-48 w-72 object-cover rounded-2xl shadow-lg flex-shrink-0 hover:scale-105 transition-transform duration-300" loading="lazy" />
          ))}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <div ref={ctaRef.ref} className={`container mx-auto px-4 text-center relative z-10 transition-all duration-700 ${ctaRef.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 animate-float">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-primary-foreground tracking-tight">
              Ready to transform your learning?
            </h3>
            <p className="text-xl text-primary-foreground/90 max-w-lg mx-auto">
              Join thousands of students who are already achieving their academic goals with StudySmart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 shadow-2xl hover:scale-105 transform transition-all duration-300">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/teacher-auth">
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 hover:scale-105 transform transition-all duration-300">
                  <Shield className="mr-2 h-4 w-4" />
                  Teacher Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-foreground">StudySmart</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering students with AI-powered learning tools for a brighter academic future.
              </p>
              <img src={booksCoffee} alt="Study atmosphere" className="rounded-xl w-full h-28 object-cover shadow-md" loading="lazy" />
            </div>

            {[
              { title: 'Features', items: ['AI Tutoring', 'Study Resources', 'Progress Tracking', 'Goal Setting', 'Flashcards'] },
              { title: 'Support', items: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'] },
              { title: 'Connect', items: ['Community', 'Blog', 'Newsletter', 'Social Media'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item} className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer story-link">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2025 StudySmart. All rights reserved. Built with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
