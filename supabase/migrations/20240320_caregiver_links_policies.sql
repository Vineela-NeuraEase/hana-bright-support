
-- Enable Row Level Security on caregiver_links table if not already enabled
ALTER TABLE IF EXISTS public.caregiver_links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow caregivers to view their links
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'caregiver_links' 
    AND policyname = 'Caregivers can view their links'
  ) THEN
    CREATE POLICY "Caregivers can view their links" 
    ON public.caregiver_links 
    FOR SELECT 
    USING (auth.uid() = caregiver_id);
  END IF;
END
$$;

-- Create policy to allow caregivers to create links
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'caregiver_links' 
    AND policyname = 'Caregivers can create links'
  ) THEN
    CREATE POLICY "Caregivers can create links" 
    ON public.caregiver_links 
    FOR INSERT 
    WITH CHECK (auth.uid() = caregiver_id);
  END IF;
END
$$;

-- Create policy to allow caregivers to delete their links
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'caregiver_links' 
    AND policyname = 'Caregivers can delete their links'
  ) THEN
    CREATE POLICY "Caregivers can delete their links" 
    ON public.caregiver_links 
    FOR DELETE 
    USING (auth.uid() = caregiver_id);
  END IF;
END
$$;
