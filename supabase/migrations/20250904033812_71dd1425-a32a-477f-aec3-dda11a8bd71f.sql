-- Add user_id column to both tables first
ALTER TABLE public.checklists ADD COLUMN user_id uuid REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.checklist_items ADD COLUMN user_id uuid REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view checklists" ON public.checklists;
DROP POLICY IF EXISTS "Authenticated users can create checklists" ON public.checklists;

DROP POLICY IF EXISTS "Authenticated users can view checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Authenticated users can create checklist items" ON public.checklist_items;

-- Create user-specific RLS policies for checklists
CREATE POLICY "Users can view their own checklists" 
ON public.checklists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklists" 
ON public.checklists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklists" 
ON public.checklists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklists" 
ON public.checklists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create user-specific RLS policies for checklist_items
CREATE POLICY "Users can view their own checklist items" 
ON public.checklist_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklist items" 
ON public.checklist_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist items" 
ON public.checklist_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist items" 
ON public.checklist_items 
FOR DELETE 
USING (auth.uid() = user_id);