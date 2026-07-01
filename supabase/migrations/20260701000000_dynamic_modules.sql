-- Luxespace Properties Database Migration
-- Version: 1.1 (Dynamic Modules Setup)

---------------------------------------------------------
-- 1. FAQs Table
---------------------------------------------------------
CREATE TABLE public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 2. Awards Table
---------------------------------------------------------
CREATE TABLE public.awards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    issuer TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 3. Partners Table
---------------------------------------------------------
CREATE TABLE public.partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('developer', 'bank', 'legal')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 4. Downloads Table
---------------------------------------------------------
CREATE TABLE public.downloads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('report', 'guide', 'brochure', 'floorplan')),
    file_url TEXT NOT NULL,
    file_size TEXT NOT NULL,
    thumbnail_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 5. Lifestyle Articles Table
---------------------------------------------------------
CREATE TABLE public.lifestyle (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle ENABLE ROW LEVEL SECURITY;

-- Select policies (Public select, Admin write)
CREATE POLICY "Public select faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admin write faqs" ON public.faqs FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select awards" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Admin write awards" ON public.awards FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Admin write partners" ON public.partners FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select downloads" ON public.downloads FOR SELECT USING (true);
CREATE POLICY "Admin write downloads" ON public.downloads FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select lifestyle" ON public.lifestyle FOR SELECT USING (true);
CREATE POLICY "Admin write lifestyle" ON public.lifestyle FOR ALL USING (public.is_admin_or_agent());
