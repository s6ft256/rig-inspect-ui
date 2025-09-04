-- Fix RLS policies to be user-specific
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view checklists" ON public.checklists;
DROP POLICY IF EXISTS "Users can create checklists" ON public.checklists;
DROP POLICY IF EXISTS "Users can update checklists" ON public.checklists;
DROP POLICY IF EXISTS "Users can delete checklists" ON public.checklists;

DROP POLICY IF EXISTS "Users can view checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Users can create checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Users can update checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Users can delete checklist items" ON public.checklist_items;

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
USING (EXISTS (
  SELECT 1 FROM public.checklists 
  WHERE checklists.id = checklist_items.checklist_id 
  AND checklists.user_id = auth.uid()
));

CREATE POLICY "Users can create checklist items for their checklists" 
ON public.checklist_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.checklists 
  WHERE checklists.id = checklist_items.checklist_id 
  AND checklists.user_id = auth.uid()
));

CREATE POLICY "Users can update their own checklist items" 
ON public.checklist_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.checklists 
  WHERE checklists.id = checklist_items.checklist_id 
  AND checklists.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own checklist items" 
ON public.checklist_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.checklists 
  WHERE checklists.id = checklist_items.checklist_id 
  AND checklists.user_id = auth.uid()
));

-- Update storage policies to be user-specific
CREATE POLICY "Users can view their own checklist images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'checklist-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own checklist images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'checklist-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own checklist images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'checklist-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own checklist images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'checklist-images' AND auth.uid()::text = (storage.foldername(name))[1]);