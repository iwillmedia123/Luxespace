-- Migration 1.2: Fix blogs table author_id constraint to reference agents instead of profiles

-- Drop old foreign key constraint
ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;

-- Update any existing blog records to Farah Al-Sayed (default agent id) if their author_id is invalid
UPDATE public.blogs
SET author_id = '00000000-0000-0000-0002-000000000001'
WHERE author_id NOT IN (SELECT id FROM public.agents);

-- Add new constraint pointing to agents table
ALTER TABLE public.blogs
ADD CONSTRAINT blogs_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.agents(id) ON DELETE SET NULL;
