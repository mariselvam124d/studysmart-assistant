
-- Create security definer function to check classroom ownership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_classroom_teacher(_classroom_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = _classroom_id AND teacher_id = _user_id
  );
$$;

-- Fix classroom_students policies to use security definer function instead of direct classrooms query
DROP POLICY IF EXISTS "Teachers view their students" ON public.classroom_students;
CREATE POLICY "Teachers view their students"
ON public.classroom_students
FOR SELECT
TO authenticated
USING (public.is_classroom_teacher(classroom_id, auth.uid()));

DROP POLICY IF EXISTS "Teachers can remove students" ON public.classroom_students;
CREATE POLICY "Teachers can remove students"
ON public.classroom_students
FOR DELETE
TO authenticated
USING (public.is_classroom_teacher(classroom_id, auth.uid()));
