-- This migration creates the `user_has_role` function, which checks if a user
-- has a specific role. This is used in the security policies for the 'Operadores' page.

CREATE OR REPLACE FUNCTION public.user_has_role(
  user_id uuid,
  role_name text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_id AND r.name = role_name
  );
END;
$$;
