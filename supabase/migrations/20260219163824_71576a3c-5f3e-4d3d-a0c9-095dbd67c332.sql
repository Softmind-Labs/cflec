-- Drop the overly broad SELECT policy that exposes all PII to any authenticated user
DROP POLICY IF EXISTS "Authenticated users can view leaderboard profile info" ON public.profiles;

-- The existing "Users can view their own profile" policy (auth.uid() = user_id) 
-- already allows users to read their own full profile.
-- The leaderboard view provides only non-sensitive fields (full_name, avatar_url, account_type).