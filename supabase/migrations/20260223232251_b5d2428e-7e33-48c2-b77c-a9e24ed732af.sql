
-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash existing plaintext values
UPDATE public.profiles 
SET mothers_first_name = encode(digest(lower(trim(mothers_first_name)), 'sha256'), 'hex')
WHERE mothers_first_name IS NOT NULL 
  AND length(mothers_first_name) != 64; -- skip already-hashed values

-- Create trigger to auto-hash on insert/update
CREATE OR REPLACE FUNCTION public.hash_mothers_first_name()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.mothers_first_name IS NOT NULL AND length(NEW.mothers_first_name) != 64 THEN
    NEW.mothers_first_name := encode(digest(lower(trim(NEW.mothers_first_name)), 'sha256'), 'hex');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER hash_mothers_name_trigger
  BEFORE INSERT OR UPDATE OF mothers_first_name
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_mothers_first_name();
