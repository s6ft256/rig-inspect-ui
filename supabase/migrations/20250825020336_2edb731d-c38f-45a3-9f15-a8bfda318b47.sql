-- Fix security vulnerability: Restrict access to operator personal information
-- Update RLS policies to require authentication

-- Drop existing overly permissive policies for checklists table
DROP POLICY IF EXISTS "Anyone can view checklists" ON public.checklists;
DROP POLICY IF EXISTS "Anyone can create checklists" ON public.checklists;

-- Drop existing overly permissive policies for checklist_items table  
DROP POLICY IF EXISTS "Anyone can view checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can create checklist items" ON public.checklist_items;

-- Create secure policies that require authentication for checklists table
CREATE POLICY "Authenticated users can view checklists" 
ON public.checklists 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create checklists" 
ON public.checklists 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create secure policies that require authentication for checklist_items table
CREATE POLICY "Authenticated users can view checklist items" 
ON public.checklist_items 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create checklist items" 
ON public.checklist_items 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');