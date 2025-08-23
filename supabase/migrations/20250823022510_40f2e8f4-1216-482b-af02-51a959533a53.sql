-- Drop the trigger first, then the function, then recreate both with proper security settings
DROP TRIGGER IF EXISTS update_checklists_updated_at ON public.checklists;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create the function with proper search_path setting
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_checklists_updated_at
  BEFORE UPDATE ON public.checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();