-- Fix the recursive RLS policy on classrooms
DROP POLICY IF EXISTS "Students can view joined classrooms" ON public.classrooms;

CREATE POLICY "Students can view joined classrooms"
ON public.classrooms
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.classroom_students cs
    WHERE cs.classroom_id = classrooms.id
      AND cs.student_id = auth.uid()
  )
);