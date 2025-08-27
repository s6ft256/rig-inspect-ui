-- Create storage bucket for checklist images
INSERT INTO storage.buckets (id, name, public) VALUES ('checklist-images', 'checklist-images', true);

-- Create storage policies for checklist images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'checklist-images');

CREATE POLICY "Authenticated users can upload checklist images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'checklist-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update checklist images" ON storage.objects FOR UPDATE 
USING (bucket_id = 'checklist-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete checklist images" ON storage.objects FOR DELETE 
USING (bucket_id = 'checklist-images' AND auth.role() = 'authenticated');

-- Add image_url column to checklist_items table
ALTER TABLE public.checklist_items ADD COLUMN image_url TEXT;