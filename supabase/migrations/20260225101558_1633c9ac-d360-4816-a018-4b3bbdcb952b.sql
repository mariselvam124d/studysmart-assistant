
-- Allow any authenticated user to look up classrooms (needed for joining by code)
DROP POLICY IF EXISTS "Students can view joined classrooms" ON public.classrooms;

CREATE POLICY "Authenticated users can view classrooms"
ON public.classrooms
FOR SELECT
TO authenticated
USING (true);
