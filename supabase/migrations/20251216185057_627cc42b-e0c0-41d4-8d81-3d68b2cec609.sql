-- Fix 1: Restrict profiles RLS policy to only allow users to view their own profile
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Create a view for public profile data (limited fields) for features like leaderboards
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, username, avatar_url, bio FROM public.profiles;