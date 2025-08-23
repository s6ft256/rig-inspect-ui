-- Create enum for check status
CREATE TYPE public.check_status AS ENUM ('unchecked', 'passed', 'failed');

-- Create enum for equipment type
CREATE TYPE public.equipment_type AS ENUM ('general', 'crane');

-- Create main checklists table
CREATE TABLE public.checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  equipment_number TEXT NOT NULL,
  inspection_date DATE NOT NULL,
  checklist_type equipment_type NOT NULL,
  score INTEGER DEFAULT 0,
  passed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  total_items INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create checklist items table to store individual check results
CREATE TABLE public.checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
  category_title TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_text TEXT NOT NULL,
  status check_status NOT NULL DEFAULT 'unchecked',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is equipment inspection data)
CREATE POLICY "Anyone can view checklists" 
ON public.checklists 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create checklists" 
ON public.checklists 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view checklist items" 
ON public.checklist_items 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create checklist items" 
ON public.checklist_items 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_checklists_updated_at
  BEFORE UPDATE ON public.checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_checklists_created_at ON public.checklists(created_at DESC);
CREATE INDEX idx_checklists_type ON public.checklists(checklist_type);
CREATE INDEX idx_checklist_items_checklist_id ON public.checklist_items(checklist_id);