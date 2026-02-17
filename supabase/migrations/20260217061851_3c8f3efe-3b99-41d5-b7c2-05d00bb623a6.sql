
-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('teacher', 'student');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 4. RLS for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Classrooms table
CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  name text NOT NULL,
  class_code text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- 6. Classroom students table (created BEFORE policies that reference it)
CREATE TABLE public.classroom_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE CASCADE NOT NULL,
  student_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.classroom_students ENABLE ROW LEVEL SECURITY;

-- 7. Now add ALL policies (both tables exist)
CREATE POLICY "Teachers can manage their classrooms" ON public.classrooms FOR ALL
  USING (auth.uid() = teacher_id) WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Students can view joined classrooms" ON public.classrooms FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.classroom_students cs WHERE cs.classroom_id = id AND cs.student_id = auth.uid()));

CREATE POLICY "Teachers view their students" ON public.classroom_students FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = auth.uid()));

CREATE POLICY "Students view own memberships" ON public.classroom_students FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can join" ON public.classroom_students FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can remove students" ON public.classroom_students FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = auth.uid()));

-- 8. Class code generator
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE code text; found boolean;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.classrooms WHERE class_code = code) INTO found;
    EXIT WHEN NOT found;
  END LOOP;
  RETURN code;
END;
$$;

-- 9. Trigger
CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON public.classrooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
