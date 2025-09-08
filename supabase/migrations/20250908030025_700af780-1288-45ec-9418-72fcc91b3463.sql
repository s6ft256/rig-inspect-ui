-- Drop existing tables and start fresh
DROP TABLE IF EXISTS public.checklist_items CASCADE;
DROP TABLE IF EXISTS public.checklists CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.check_status CASCADE;
DROP TYPE IF EXISTS public.equipment_type CASCADE;

-- Create enums for equipment inspection
CREATE TYPE public.equipment_type AS ENUM ('general', 'mobile_crane');
CREATE TYPE public.check_status AS ENUM ('unchecked', 'passed', 'failed');

-- Create checklists table
CREATE TABLE public.checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid(),
    inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    checklist_type equipment_type NOT NULL,
    operator_name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    equipment_type TEXT NOT NULL,
    equipment_number TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    passed_items INTEGER DEFAULT 0,
    failed_items INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create checklist_items table
CREATE TABLE public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid(),
    checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_text TEXT NOT NULL,
    category_title TEXT NOT NULL,
    status check_status NOT NULL DEFAULT 'unchecked',
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for checklists
CREATE POLICY "Users can view their own checklists" ON public.checklists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklists" ON public.checklists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklists" ON public.checklists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklists" ON public.checklists
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for checklist_items
CREATE POLICY "Users can view their own checklist items" ON public.checklist_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklist items" ON public.checklist_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist items" ON public.checklist_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist items" ON public.checklist_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for checklists updated_at
CREATE TRIGGER update_checklists_updated_at
    BEFORE UPDATE ON public.checklists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_checklists_user_id ON public.checklists(user_id);
CREATE INDEX idx_checklists_inspection_date ON public.checklists(inspection_date);
CREATE INDEX idx_checklist_items_user_id ON public.checklist_items(user_id);
CREATE INDEX idx_checklist_items_checklist_id ON public.checklist_items(checklist_id);