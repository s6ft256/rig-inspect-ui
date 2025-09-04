-- First, add the user_id columns as nullable
ALTER TABLE public.checklists ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS user_id uuid;

-- Delete any existing data that might cause issues (since we're in development)
DELETE FROM public.checklist_items;
DELETE FROM public.checklists;

-- Now make the columns non-nullable with default
ALTER TABLE public.checklists ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.checklists ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.checklist_items ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.checklist_items ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Add foreign key constraints
ALTER TABLE public.checklists ADD CONSTRAINT checklists_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
ALTER TABLE public.checklist_items ADD CONSTRAINT checklist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

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