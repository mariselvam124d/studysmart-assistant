import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, ArrowLeft, Search, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow"
          style={{ left: `${20 + mousePos.x * 10}%`, top: `${20 + mousePos.y * 10}%` }}
        />
        <div
          className="absolute w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ right: `${10 + mousePos.x * 5}%`, bottom: `${10 + mousePos.y * 5}%`, animationDelay: '1s' }}
        />
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-primary/10 rounded-2xl rotate-12 animate-rotate-slow" />
        <div className="absolute bottom-32 right-32 w-10 h-10 border-2 border-accent/10 rounded-xl -rotate-12 animate-rotate-slow" style={{ animationDirection: 'reverse' }} />
        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10 px-4 animate-fade-in">
        {/* Animated 404 number */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] lg:text-[14rem] font-extrabold leading-none tracking-tighter bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-card/80 backdrop-blur-md rounded-3xl shadow-2xl border border-border/50 animate-bounce-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Search className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Page not found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Looks like this page went on a study break. Let's get you back to learning!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl hover:shadow-primary/30 hover:scale-105 transform transition-all duration-300 group">
              <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Back to Home
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 hover:scale-105 transform transition-all duration-300">
              <Sparkles className="mr-2 h-4 w-4" />
              Start Learning
            </Button>
          </Link>
        </div>

        {/* Footer logo */}
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="p-1.5 bg-gradient-to-br from-primary to-accent rounded-lg">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">StudySmart</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
