-- Luxespace Properties Database Migration
-- Version: 1.3 (Projects & Off-Plan Launches Module)

---------------------------------------------------------
-- 1. Projects Table
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    headline TEXT,
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    developer_name TEXT,
    community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
    community_name TEXT,
    location TEXT NOT NULL DEFAULT '',
    property_type TEXT NOT NULL DEFAULT 'Townhouses & Villas',
    starting_price NUMERIC NOT NULL DEFAULT 0,
    payment_plan_summary TEXT,
    handover_date TEXT,
    status TEXT NOT NULL DEFAULT 'pre-launch' CHECK (status IN ('pre-launch', 'launching-soon', 'active', 'under-construction', 'handover-soon', 'sold-out')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    cover_image TEXT NOT NULL DEFAULT '/assets/apartment_render.webp',
    gallery TEXT[] NOT NULL DEFAULT '{}',
    pdf_brochure_url TEXT,
    pdf_brochure_size TEXT,
    pdf_brochure_name TEXT,
    units JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_plan JSONB NOT NULL DEFAULT '[]'::jsonb,
    drive_times JSONB NOT NULL DEFAULT '[]'::jsonb,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
    assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_developer ON public.projects(developer_id);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Select policies (Public select all projects, Admin write)
CREATE POLICY "Public select projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin write projects" ON public.projects FOR ALL USING (public.is_admin_or_agent());
