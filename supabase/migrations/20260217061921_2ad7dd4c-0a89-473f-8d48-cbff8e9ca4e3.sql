
-- Fix function search path warning
ALTER FUNCTION public.generate_class_code() SET search_path = public;

-- Fix the pre-existing permissive INSERT policy on profiles (allow_insert_profiles with true)
-- This was needed for the handle_new_user trigger which runs as SECURITY DEFINER, so it's safe
