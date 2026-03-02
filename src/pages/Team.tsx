import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  ArrowRight,
  Heart,
  Target,
  Users,
  Lightbulb,
  Code,
  Palette,
  TrendingUp,
  Linkedin,
  Twitter,
  Globe,
  ArrowLeft,
  Sparkles,
  Star,
  Award,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import sibirajan from '@/assets/sibirajan.jpg';
import mariselvam from '@/assets/mariselvam.png';
import chinnadurai from '@/assets/chinnadurai.png';

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
const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = Math.ceil(end / 120);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Team = () => {
  const heroRef = useInView(0.1);
  const teamRef = useInView();
  const visionRef = useInView();
  const statsRef = useInView();

  const team = [
    {
      name: 'Sibirajan',
      role: 'CEO & Co-Founder',
      description: 'Visionary leader driving the future of AI-powered education. Passionate about making quality learning accessible to every student worldwide.',
      image: sibirajan,
      stats: [
        { label: 'Projects Led', value: 50, suffix: '+' },
        { label: 'Students Impacted', value: 10000, suffix: '+' },
        { label: 'Awards Won', value: 15, suffix: '+' },
      ],
      vision: '"To revolutionize education through AI and empower every learner to achieve their full potential."',
      skills: ['Leadership', 'AI Strategy', 'Product Vision', 'Education Tech'],
      icon: Target,
      gradient: 'from-primary to-accent',
    },
    {
      name: 'Mariselvam',
      role: 'CTO & Co-Founder',
      description: 'Technical genius behind StudySmart\'s AI engine. Expert in machine learning and building scalable platforms that transform learning experiences.',
      image: mariselvam,
      stats: [
        { label: 'Features Built', value: 200, suffix: '+' },
        { label: 'Lines of Code', value: 500000, suffix: '+' },
        { label: 'Uptime', value: 99, suffix: '%' },
      ],
      vision: '"Technology should remove barriers to learning, not create them. We build tools that feel magical."',
      skills: ['AI/ML', 'Full-Stack Dev', 'System Design', 'Cloud Architecture'],
      icon: Code,
      gradient: 'from-accent to-primary',
    },
    {
      name: 'Chinna Durai',
      role: 'COO & Co-Founder',
      description: 'Operations mastermind ensuring StudySmart delivers excellence at every touchpoint. Focused on building strong communities and partnerships.',
      image: chinnadurai,
      stats: [
        { label: 'Partners', value: 100, suffix: '+' },
        { label: 'Communities', value: 50, suffix: '+' },
        { label: 'Events Organized', value: 200, suffix: '+' },
      ],
      vision: '"Great education happens when passionate people work together. We\'re building that community."',
      skills: ['Operations', 'Community Building', 'Partnerships', 'Growth Strategy'],
      icon: Users,
      gradient: 'from-primary-glow to-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ═══════ HEADER ═══════ */}
      <header className="border-b border-border/50 bg-card/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300 group-hover:scale-105 transform">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">StudySmart</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block font-medium tracking-wider uppercase">Our Team</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-primary/30 hover:scale-105 transform transition-all duration-200">
                Get Started <Sparkles className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div ref={heroRef.ref} className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium animate-bounce-in mb-6">
            <Award className="mr-1.5 h-3.5 w-3.5" /> Meet Our Leadership
          </Badge>
          <h2 className="text-4xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
            The Minds Behind
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
              StudySmart
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Passionate leaders dedicated to transforming education through AI innovation and building a brighter future for learners everywhere.
          </p>
        </div>
      </section>

      {/* ═══════ TEAM MEMBERS ═══════ */}
      <section className="py-12 lg:py-24">
        <div ref={teamRef.ref} className="container mx-auto px-4 space-y-32">
          {team.map((member, index) => {
            const Icon = member.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={member.name}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-700 ${teamRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Image */}
                <div className={`relative group ${isEven ? '' : 'lg:order-2'}`}>
                  {/* Glow behind image */}
                  <div className={`absolute -inset-4 bg-gradient-to-tr ${member.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                  {/* Teal accent bar */}
                  <div className={`absolute ${isEven ? '-left-3' : '-right-3'} top-8 bottom-8 w-1.5 bg-gradient-to-b ${member.gradient} rounded-full`} />
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-[500px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Overlay gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    {/* Name overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-primary-foreground font-bold text-xl">{member.name}</p>
                      <p className="text-primary-foreground/80 text-sm">{member.role}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${isEven ? '' : 'lg:order-1'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 bg-gradient-to-br ${member.gradient} rounded-xl shadow-lg`}>
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <Badge variant="secondary" className="text-primary font-medium">{member.role}</Badge>
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                      {member.name}
                    </h3>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {member.stats.map((stat, i) => (
                      <div key={i} className="text-center p-4 rounded-2xl bg-muted/50 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 group/stat">
                        <p className="text-2xl lg:text-3xl font-extrabold text-foreground group-hover/stat:text-primary transition-colors">
                          <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                        </p>
                        <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Vision quote */}
                  <div className={`relative p-5 rounded-2xl bg-gradient-to-r ${member.gradient} bg-opacity-10 border-l-4 border-primary`} style={{ background: 'hsl(var(--muted) / 0.5)' }}>
                    <Lightbulb className="h-5 w-5 text-primary mb-2" />
                    <p className="text-foreground italic font-medium leading-relaxed">
                      <span className="font-bold text-primary">Vision: </span>
                      {member.vision}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="py-1.5 px-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 cursor-default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ COMPANY STATS ═══════ */}
      <section className="py-20 border-y border-border/50 bg-gradient-to-r from-primary/5 via-background to-accent/5">
        <div ref={statsRef.ref} className={`container mx-auto px-4 transition-all duration-700 ${statsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Impact</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 10000, suffix: '+', label: 'Students Empowered', icon: Users },
              { value: 50000, suffix: '+', label: 'Problems Solved', icon: Target },
              { value: 98, suffix: '%', label: 'Success Rate', icon: TrendingUp },
              { value: 500, suffix: '+', label: 'Subjects Covered', icon: Globe },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
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

      {/* ═══════ VISION ═══════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-foreground/5 rounded-full blur-2xl animate-float-slow" />

        <div ref={visionRef.ref} className={`container mx-auto px-4 text-center relative z-10 transition-all duration-700 ${visionRef.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center animate-float">
              <Heart className="h-10 w-10 text-primary-foreground" />
            </div>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-primary-foreground tracking-tight">
              Join our mission to transform education
            </h3>
            <p className="text-xl text-primary-foreground/90 max-w-lg mx-auto">
              Together, we're building a world where every student has access to world-class AI-powered learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 shadow-2xl hover:scale-105 transform transition-all duration-300">
                  Start Learning Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 StudySmart. All rights reserved. Built with ❤️ for learners everywhere.</p>
        </div>
      </footer>
    </div>
  );
};

export default Team;
