
-- This file exists for documentation purposes. We'll create this function via RPC below
CREATE OR REPLACE FUNCTION public.regenerate_link_code(user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete existing link code if any
  DELETE FROM user_links WHERE user_id = $1;
  
  -- The create_user_link_code trigger will automatically create a new link code
  -- We just need to manually trigger it by inserting a dummy row to the cache table
  INSERT INTO public.profiles (id, role)
  VALUES ($1, (SELECT role FROM profiles WHERE id = $1))
  ON CONFLICT (id) 
  DO UPDATE SET updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
