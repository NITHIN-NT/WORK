-- rls_policies.sql
-- Run this in your Supabase SQL Editor to FIX the column name error.

-- 1. Create security helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid()::text 
    AND role = 'Administrator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is a member of the project array
CREATE OR REPLACE FUNCTION public.is_project_member(project_member_ids TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid()::text = ANY(project_member_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RESET POLICIES
DROP POLICY IF EXISTS "Users can see their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can see all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can see their projects" ON public.projects;
DROP POLICY IF EXISTS "Users can see projects" ON public.projects;
DROP POLICY IF EXISTS "Users can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;

-- 3. APPLY CORRECTED POLICIES

-- USERS Table
CREATE POLICY "Users can see their own profile" ON public.users 
  FOR SELECT USING (id = auth.uid()::text OR public.is_admin());

-- PROJECTS Table (Using member_ids array check)
CREATE POLICY "Users can see projects" ON public.projects
  FOR SELECT USING (public.is_project_member(member_ids) OR public.is_admin());

-- TASKS Table (Join on projects to check membership)
CREATE POLICY "Users can manage tasks" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id 
      AND public.is_project_member(member_ids)
    ) OR public.is_admin()
  );

-- CLIENTS Table
CREATE POLICY "Admins can manage clients" ON public.clients
  FOR ALL USING (public.is_admin());

-- SETTINGS Table
CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (public.is_admin());
