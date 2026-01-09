-- This migration enables managers and administrators to read user and role information,
-- which is necessary for the 'Operadores' (Operators) page functionality.

-- 1. Create a view in the 'public' schema that points to the 'auth.users' table.
-- This simplifies querying user data from the client-side by avoiding the need
-- to specify the 'auth' schema. It also ensures that any future policies
-- can be applied to 'public.users' directly.

CREATE OR REPLACE VIEW public.users AS
  SELECT * FROM auth.users;


-- 2. Create a SELECT policy on the 'auth.users' table.
-- This allows users with 'gerente' (manager) or 'administrador' (administrator) roles
-- to view all user profiles. Existing policies that allow users to see their own
-- data remain unaffected.

DROP POLICY IF EXISTS "Allow manager and admin to read users" ON auth.users;
CREATE POLICY "Allow manager and admin to read users"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (
    (public.user_has_role(auth.uid(), 'gerente')) OR
    (public.user_has_role(auth.uid(), 'administrador'))
  );


-- 3. Create a SELECT policy on the 'user_roles' table.
-- The existing policy "Allow admin to manage user roles" already grants SELECT
-- permissions to administrators. This new policy adds SELECT permission for managers,
-- allowing them to see which roles are assigned to which users.

DROP POLICY IF EXISTS "Allow manager to read user roles" ON public.user_roles;
CREATE POLICY "Allow manager to read user roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    (public.user_has_role(auth.uid(), 'gerente'))
  );
