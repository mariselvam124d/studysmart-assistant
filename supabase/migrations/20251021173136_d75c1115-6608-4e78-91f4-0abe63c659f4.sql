-- Create problem_solving_sessions table for AI-powered problem solving
CREATE TABLE public.problem_solving_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  problem_text TEXT,
  problem_image_url TEXT,
  solution TEXT,
  steps JSONB,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.problem_solving_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for problem_solving_sessions
CREATE POLICY "Users can view their own problem sessions" 
ON public.problem_solving_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own problem sessions" 
ON public.problem_solving_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problem sessions" 
ON public.problem_solving_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problem sessions" 
ON public.problem_solving_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_problem_solving_sessions_updated_at
  BEFORE UPDATE ON public.problem_solving_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();